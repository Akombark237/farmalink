# PharmaLink API Testing Script (PowerShell)
# Comprehensive test suite for all API endpoints

param(
    [string]$BaseUrl = "http://localhost:3001"
)

Write-Host "🧪 PharmaLink API Testing Suite" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

$TestResults = @{
    Passed = 0
    Failed = 0
    Tests = @()
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params
        
        if ($response.success -eq $true -or $response.status -eq "healthy") {
            Write-Host "✅ $Name" -ForegroundColor Green
            $TestResults.Passed++
            return $response
        } else {
            Write-Host "❌ $Name - Response not successful" -ForegroundColor Red
            $TestResults.Failed++
            return $null
        }
    }
    catch {
        Write-Host "❌ $Name - $($_.Exception.Message)" -ForegroundColor Red
        $TestResults.Failed++
        return $null
    }
}

# Test 1: Health Check
Write-Host "🏥 Testing Health Check..." -ForegroundColor Blue
$healthResponse = Test-Endpoint -Name "Health Check" -Url "$BaseUrl/api/health"

# Test 2: Authentication
Write-Host "`n🔐 Testing Authentication..." -ForegroundColor Blue

$loginBody = @{
    email = "patient@pharmalink.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Test-Endpoint -Name "Patient Login" -Url "$BaseUrl/api/auth/login" -Method "POST" -Body $loginBody

$authToken = $null
if ($loginResponse) {
    $authToken = $loginResponse.data.token
    Write-Host "   Token received: $($authToken.Substring(0, 20))..." -ForegroundColor Gray
}

# Pharmacy login
$pharmacyLoginBody = @{
    email = "pharmacy@pharmalink.com"
    password = "password123"
} | ConvertTo-Json

$pharmacyLoginResponse = Test-Endpoint -Name "Pharmacy Login" -Url "$BaseUrl/api/auth/login" -Method "POST" -Body $pharmacyLoginBody

$pharmacyToken = $null
if ($pharmacyLoginResponse) {
    $pharmacyToken = $pharmacyLoginResponse.data.token
}

# Token verification
if ($authToken) {
    $authHeaders = @{ Authorization = "Bearer $authToken" }
    Test-Endpoint -Name "Token Verification" -Url "$BaseUrl/api/auth/verify" -Headers $authHeaders
}

# Test 3: Pharmacies API
Write-Host "`n🏪 Testing Pharmacies API..." -ForegroundColor Blue

$pharmaciesResponse = Test-Endpoint -Name "Pharmacies List" -Url "$BaseUrl/api/pharmacies"
if ($pharmaciesResponse) {
    Write-Host "   Found $($pharmaciesResponse.data.Count) pharmacies" -ForegroundColor Gray
}

Test-Endpoint -Name "Pharmacy Search" -Url "$BaseUrl/api/pharmacies?search=francaise"
Test-Endpoint -Name "Pharmacy with Inventory" -Url "$BaseUrl/api/pharmacies?includeInventory=true&limit=1"

# Test 4: Medications API
Write-Host "`n💊 Testing Medications API..." -ForegroundColor Blue

$medicationsResponse = Test-Endpoint -Name "Medications List" -Url "$BaseUrl/api/medications"
if ($medicationsResponse) {
    Write-Host "   Found $($medicationsResponse.data.Count) medications" -ForegroundColor Gray
}

Test-Endpoint -Name "Medication Search" -Url "$BaseUrl/api/medications?search=paracetamol"
Test-Endpoint -Name "Category Filter" -Url "$BaseUrl/api/medications?category=Pain Relief"

# Test 5: Search API
Write-Host "`n🔍 Testing Search API..." -ForegroundColor Blue

Test-Endpoint -Name "Drug Search" -Url "$BaseUrl/api/search?query=paracetamol&type=drugs"
Test-Endpoint -Name "Pharmacy Search" -Url "$BaseUrl/api/search?query=pharmacie&type=pharmacies"

# Test 6: Orders API (Protected)
Write-Host "`n📦 Testing Orders API..." -ForegroundColor Blue

if ($authToken) {
    $authHeaders = @{ Authorization = "Bearer $authToken" }
    
    $ordersResponse = Test-Endpoint -Name "Orders List" -Url "$BaseUrl/api/orders" -Headers $authHeaders
    if ($ordersResponse) {
        Write-Host "   Found $($ordersResponse.data.Count) orders" -ForegroundColor Gray
    }
    
    Test-Endpoint -Name "Pending Orders Filter" -Url "$BaseUrl/api/orders?status=pending" -Headers $authHeaders
} else {
    Write-Host "❌ Orders API - No auth token available" -ForegroundColor Red
    $TestResults.Failed += 2
}

# Test 7: Vendor Dashboard (Protected)
Write-Host "`n📊 Testing Vendor Dashboard..." -ForegroundColor Blue

if ($pharmacyToken) {
    $pharmacyHeaders = @{ Authorization = "Bearer $pharmacyToken" }
    
    $dashboardResponse = Test-Endpoint -Name "Vendor Dashboard" -Url "$BaseUrl/api/vendor/dashboard" -Headers $pharmacyHeaders
    if ($dashboardResponse) {
        Write-Host "   Dashboard data loaded successfully" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Vendor Dashboard - No pharmacy token available" -ForegroundColor Red
    $TestResults.Failed++
}

# Test 8: Error Handling
Write-Host "`n⚠️  Testing Error Handling..." -ForegroundColor Blue

try {
    Invoke-RestMethod -Uri "$BaseUrl/api/nonexistent" -ErrorAction Stop
    Write-Host "❌ 404 Error Handling - Should have failed" -ForegroundColor Red
    $TestResults.Failed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ 404 Error Handling" -ForegroundColor Green
        $TestResults.Passed++
    } else {
        Write-Host "❌ 404 Error Handling - Wrong status code" -ForegroundColor Red
        $TestResults.Failed++
    }
}

try {
    Invoke-RestMethod -Uri "$BaseUrl/api/orders" -ErrorAction Stop
    Write-Host "❌ 401 Error Handling - Should have failed" -ForegroundColor Red
    $TestResults.Failed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ 401 Error Handling" -ForegroundColor Green
        $TestResults.Passed++
    } else {
        Write-Host "❌ 401 Error Handling - Wrong status code" -ForegroundColor Red
        $TestResults.Failed++
    }
}

# Test Summary
Write-Host "`n📊 Test Summary" -ForegroundColor Cyan
Write-Host "================" -ForegroundColor Cyan
Write-Host "✅ Passed: $($TestResults.Passed)" -ForegroundColor Green
Write-Host "❌ Failed: $($TestResults.Failed)" -ForegroundColor Red
Write-Host "📊 Total: $($TestResults.Passed + $TestResults.Failed)" -ForegroundColor Yellow

$successRate = [math]::Round(($TestResults.Passed / ($TestResults.Passed + $TestResults.Failed)) * 100, 1)
Write-Host "📈 Success Rate: $successRate%" -ForegroundColor Yellow

if ($TestResults.Failed -eq 0) {
    Write-Host "`n🎉 All tests passed! Your PharmaLink API is working perfectly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Please check the issues above." -ForegroundColor Yellow
}

Write-Host "`n🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "- API Documentation: $BaseUrl/api/docs" -ForegroundColor Gray
Write-Host "- Health Check: $BaseUrl/api/health" -ForegroundColor Gray
Write-Host "- Pharmacies: $BaseUrl/api/pharmacies" -ForegroundColor Gray
Write-Host "- Search: $BaseUrl/api/search?query=paracetamol" -ForegroundColor Gray
