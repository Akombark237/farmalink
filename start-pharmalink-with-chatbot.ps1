# PharmaLink with Qala-Lwazi Chatbot Startup Script
# PowerShell version for better compatibility

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " PharmaLink with Qala-Lwazi Chatbot" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if gemini-proxy directory exists
if (-not (Test-Path "gemini-proxy")) {
    Write-Host "ERROR: gemini-proxy directory not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path "gemini-proxy\package.json")) {
    Write-Host "ERROR: Gemini backend not properly set up!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/5] Checking environment..." -ForegroundColor Yellow
Write-Host "✅ Gemini proxy directory found" -ForegroundColor Green

Write-Host "[2/5] Stopping existing Node.js processes..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Existing processes stopped" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No existing processes to stop" -ForegroundColor Yellow
}

Write-Host "[3/5] Starting Gemini backend..." -ForegroundColor Yellow
$geminiJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location "gemini-proxy"
    Write-Host "Starting Qala-Lwazi Medical Assistant Backend..." -ForegroundColor Magenta
    node server.js
}

Write-Host "[4/5] Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "[5/5] Starting Next.js frontend..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Write-Host "Starting PharmaLink Frontend..." -ForegroundColor Blue
    npm run dev
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Services Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🤖 Gemini Backend:    http://localhost:3001" -ForegroundColor Magenta
Write-Host "📱 Next.js Frontend:  http://localhost:3000" -ForegroundColor Blue
Write-Host "🏥 Medical Assistant: http://localhost:3000/use-pages/medical-assistant" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Wait 10-15 seconds for both services to fully start..." -ForegroundColor Yellow
Write-Host ""

# Wait for services to start
Start-Sleep -Seconds 10

# Test if services are running
Write-Host "🧪 Testing services..." -ForegroundColor Yellow

try {
    $backendTest = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($backendTest.StatusCode -eq 200) {
        Write-Host "✅ Gemini backend is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Gemini backend may still be starting..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Gemini backend may still be starting..." -ForegroundColor Yellow
}

try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($frontendTest.StatusCode -eq 200) {
        Write-Host "✅ Next.js frontend is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Next.js frontend may still be starting..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Next.js frontend may still be starting..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Opening application in browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Services are now running!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Job Status:" -ForegroundColor Yellow
Write-Host "- Gemini Backend Job ID: $($geminiJob.Id)" -ForegroundColor Magenta
Write-Host "- Frontend Job ID: $($frontendJob.Id)" -ForegroundColor Blue
Write-Host ""
Write-Host "To stop services, run:" -ForegroundColor Yellow
Write-Host "Stop-Job $($geminiJob.Id), $($frontendJob.Id); Remove-Job $($geminiJob.Id), $($frontendJob.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Or simply close this PowerShell window and run:" -ForegroundColor Yellow
Write-Host "taskkill /f /im node.exe" -ForegroundColor Gray
Write-Host ""

# Keep script running to monitor jobs
Write-Host "Press Ctrl+C to stop all services and exit..." -ForegroundColor Yellow
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check job status
        if ($geminiJob.State -eq "Failed") {
            Write-Host "❌ Gemini backend job failed!" -ForegroundColor Red
            break
        }
        if ($frontendJob.State -eq "Failed") {
            Write-Host "❌ Frontend job failed!" -ForegroundColor Red
            break
        }
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
    Stop-Job $geminiJob.Id, $frontendJob.Id -ErrorAction SilentlyContinue
    Remove-Job $geminiJob.Id, $frontendJob.Id -ErrorAction SilentlyContinue
    Write-Host "✅ Services stopped" -ForegroundColor Green
}
