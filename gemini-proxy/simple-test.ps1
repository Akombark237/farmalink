# Simple PowerShell test for the medical chatbot
Write-Host "Testing Qala-Lwazi Medical Assistant..." -ForegroundColor Green

# Test health endpoint first
try {
    Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
    $health = Invoke-RestMethod -Uri 'http://localhost:3003/health'
    Write-Host "   Health Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Message: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "   Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test medical question
try {
    Write-Host "`n2. Testing medical question about leukemia..." -ForegroundColor Yellow
    
    $body = @{
        message = "What are the symptoms of leukemia?"
        userPreferences = @{
            useRAG = $true
            detailLevel = "detailed"
        }
    } | ConvertTo-Json -Depth 3
    
    Write-Host "   Sending request..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri 'http://localhost:3003/api/medical-chat' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 60
    
    Write-Host "   SUCCESS! Response received:" -ForegroundColor Green
    Write-Host "   Session ID: $($response.sessionId)" -ForegroundColor White
    Write-Host "   Using RAG: $($response.usingRAG)" -ForegroundColor White
    Write-Host "   Response Length: $($response.responseLength) characters" -ForegroundColor White
    
    if ($response.fallbackMode) {
        Write-Host "   Mode: Fallback (due to API issues)" -ForegroundColor Yellow
    } else {
        Write-Host "   Mode: Normal AI Response" -ForegroundColor Green
    }
    
    Write-Host "`n   Qala-Lwazi Response:" -ForegroundColor Cyan
    Write-Host "   " + "="*60 -ForegroundColor Gray
    Write-Host $response.response -ForegroundColor White
    Write-Host "   " + "="*60 -ForegroundColor Gray
    
} catch {
    Write-Host "   Medical question failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This might be due to API connectivity issues" -ForegroundColor Yellow
}

Write-Host "`nTest completed!" -ForegroundColor Green
