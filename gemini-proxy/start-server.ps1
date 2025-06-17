# PowerShell script to safely start the Gemini proxy server
Write-Host "Starting Qala-Lwazi Medical Assistant API..." -ForegroundColor Green

# Check if port 3003 is in use
$portInUse = Get-NetTCPConnection -LocalPort 3003 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Port 3003 is already in use. Attempting to free it..." -ForegroundColor Yellow

    # Find and kill Node.js processes using port 3003
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "Found Node.js processes. Terminating..." -ForegroundColor Yellow
        $nodeProcesses | Stop-Process -Force
        Start-Sleep -Seconds 2
    }
}

# Navigate to gemini-proxy directory
Set-Location -Path $PSScriptRoot

# Start the server
Write-Host "Starting server on port 3003..." -ForegroundColor Green
npm start
