# PowerShell script to start PharmaLink with Qala-Lwazi Medical Assistant
Write-Host "[STARTING] PharmaLink with Qala-Lwazi Medical Assistant..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $connection -ne $null
    }
    catch {
        return $false
    }
}

# Function to kill processes on a specific port
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                    Select-Object -ExpandProperty OwningProcess | 
                    Sort-Object -Unique
        
        foreach ($processId in $processes) {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Stopping process $($process.ProcessName) (PID: $processId) on port $Port" -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
        Start-Sleep -Seconds 2
    }
    catch {
        Write-Host "Could not stop processes on port $Port" -ForegroundColor Red
    }
}

# Check and clean up ports
Write-Host "[CHECKING] Ports..." -ForegroundColor Blue

# Check port 3001 (Next.js)
if (Test-Port -Port 3001) {
    Write-Host "Port 3001 is in use. Cleaning up..." -ForegroundColor Yellow
    Stop-ProcessOnPort -Port 3001
}

# Check port 3003 (Gemini Proxy)
if (Test-Port -Port 3003) {
    Write-Host "Port 3003 is in use. Cleaning up..." -ForegroundColor Yellow
    Stop-ProcessOnPort -Port 3003
}

# Start Gemini Proxy Server (Chatbot Backend)
Write-Host "[CHATBOT] Starting Qala-Lwazi Medical Assistant API (Port 3003)..." -ForegroundColor Green

# Check if gemini-proxy directory exists
$geminiProxyPath = Join-Path $PSScriptRoot "phamarlink\gemini-proxy"
if (-not (Test-Path $geminiProxyPath)) {
    Write-Host "[ERROR] Gemini proxy directory not found at $geminiProxyPath" -ForegroundColor Red
    Write-Host "Please ensure the gemini-proxy folder exists in the phamarlink directory." -ForegroundColor Red
    Read-Host "Press Enter to continue without chatbot functionality"
    $skipChatbot = $true
} else {
    $skipChatbot = $false
    
    # Start Gemini proxy in background
    $geminiJob = Start-Job -ScriptBlock {
        param($ProxyPath)
        Set-Location $ProxyPath
        $env:PORT = 3003
        npm start
    } -ArgumentList $geminiProxyPath
    
    Write-Host "[SUCCESS] Gemini proxy server starting in background (Job ID: $($geminiJob.Id))" -ForegroundColor Green
    
    # Wait a moment for the server to start
    Start-Sleep -Seconds 3
    
    # Test if the server is responding
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3003/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "[SUCCESS] Qala-Lwazi Medical Assistant API is online!" -ForegroundColor Green
        } else {
            Write-Host "[WARNING] Chatbot API may not be fully ready yet (will retry automatically)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "[WARNING] Chatbot API starting up (will be available shortly)" -ForegroundColor Yellow
    }
}

# Start Next.js Development Server
Write-Host "[WEBAPP] Starting PharmaLink Web Application (Port 3001)..." -ForegroundColor Green

# Start Next.js in the foreground
try {
    npm run dev
}
catch {
    Write-Host "[ERROR] Error starting Next.js application" -ForegroundColor Red
}
finally {
    # Cleanup: Stop the Gemini proxy job when Next.js stops
    if (-not $skipChatbot -and $geminiJob) {
        Write-Host "[CLEANUP] Cleaning up background processes..." -ForegroundColor Yellow
        Stop-Job -Job $geminiJob -ErrorAction SilentlyContinue
        Remove-Job -Job $geminiJob -ErrorAction SilentlyContinue
    }
    
    Write-Host "PharmaLink application stopped." -ForegroundColor Cyan
}
