# PowerShell script to check PharmaLink services status
Write-Host "🔍 PharmaLink Services Health Check" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Function to test if a URL is responding
function Test-Url {
    param([string]$Url, [string]$ServiceName)
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $ServiceName is ONLINE" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  $ServiceName responded with status: $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        Write-Host "❌ $ServiceName is OFFLINE" -ForegroundColor Red
        return $false
    }
}

# Function to check if port is in use
function Test-Port {
    param([int]$Port, [string]$ServiceName)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connection) {
            Write-Host "✅ Port $Port ($ServiceName) is in use" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Port $Port ($ServiceName) is not in use" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Could not check port $Port ($ServiceName)" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "📊 Checking Ports..." -ForegroundColor Blue
$port3001 = Test-Port -Port 3001 -ServiceName "Next.js Web App"
$port3003 = Test-Port -Port 3003 -ServiceName "Chatbot API"

Write-Host ""
Write-Host "🌐 Checking Web Services..." -ForegroundColor Blue
$webApp = Test-Url -Url "http://localhost:3001" -ServiceName "PharmaLink Web App"
$chatbotApi = Test-Url -Url "http://localhost:3003/health" -ServiceName "Qala-Lwazi Chatbot API"

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan

if ($webApp -and $chatbotApi) {
    Write-Host "🎉 ALL SERVICES ARE RUNNING PERFECTLY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Access your application:" -ForegroundColor White
    Write-Host "   Web App: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "   Chatbot API: http://localhost:3003" -ForegroundColor Cyan
    Write-Host "   Health Check: http://localhost:3003/health" -ForegroundColor Cyan
}
elseif ($webApp -and (-not $chatbotApi)) {
    Write-Host "⚠️  WEB APP IS RUNNING, BUT CHATBOT IS OFFLINE" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 To fix chatbot:" -ForegroundColor White
    Write-Host "   Run: npm run dev:chatbot" -ForegroundColor Cyan
    Write-Host "   Or: npm run dev:full" -ForegroundColor Cyan
}
elseif ((-not $webApp) -and $chatbotApi) {
    Write-Host "⚠️  CHATBOT IS RUNNING, BUT WEB APP IS OFFLINE" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 To fix web app:" -ForegroundColor White
    Write-Host "   Run: npm run dev" -ForegroundColor Cyan
}
else {
    Write-Host "❌ BOTH SERVICES ARE OFFLINE" -ForegroundColor Red
    Write-Host ""
    Write-Host "🚀 To start everything:" -ForegroundColor White
    Write-Host "   Run: npm run dev:full" -ForegroundColor Cyan
    Write-Host "   Or: start-pharmalink.bat" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "💡 Quick Commands:" -ForegroundColor Blue
Write-Host "   npm run dev:full     - Start everything" -ForegroundColor Gray
Write-Host "   npm run dev          - Start web app only" -ForegroundColor Gray
Write-Host "   npm run dev:chatbot  - Start chatbot only" -ForegroundColor Gray
Write-Host ""

# Check if environment files exist
Write-Host "📁 Checking Configuration..." -ForegroundColor Blue
$envPath = Join-Path $PSScriptRoot "phamarlink\gemini-proxy\.env"
if (Test-Path $envPath) {
    Write-Host "✅ Environment file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Environment file missing: $envPath" -ForegroundColor Yellow
    Write-Host "   Create .env file with your API keys" -ForegroundColor Gray
}

Write-Host ""
Read-Host "Press Enter to exit"
