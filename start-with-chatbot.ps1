# PowerShell script to start PharmaLink with integrated chatbot
# Run this script to start both the Gemini backend and Next.js frontend

param(
    [switch]$SkipChecks = $false,
    [switch]$Verbose = $false
)

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Magenta = "Magenta"
    Cyan = "Cyan"
    White = "White"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($processId in $processes) {
            if ($processId -and $processId -ne 0) {
                Write-ColorOutput "🔄 Stopping process $processId on port $Port..." "Yellow"
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {
        # Port might not be in use
    }
}

function Test-Prerequisites {
    Write-ColorOutput "🔍 Checking prerequisites..." "Cyan"
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-ColorOutput "✅ Node.js: $nodeVersion" "Green"
    } catch {
        Write-ColorOutput "❌ Node.js not found! Please install Node.js" "Red"
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-ColorOutput "✅ npm: $npmVersion" "Green"
    } catch {
        Write-ColorOutput "❌ npm not found!" "Red"
        exit 1
    }
    
    # Check if .env.local exists
    if (-not (Test-Path ".env.local")) {
        Write-ColorOutput "❌ .env.local file not found!" "Red"
        Write-ColorOutput "Please create .env.local with your configuration" "Yellow"
        exit 1
    }
    
    # Check if gemini-proxy directory exists
    if (-not (Test-Path "gemini-proxy")) {
        Write-ColorOutput "❌ gemini-proxy directory not found!" "Red"
        exit 1
    }
    
    Write-ColorOutput "✅ Prerequisites check passed!" "Green"
}

function Start-GeminiBackend {
    Write-ColorOutput "🤖 Starting Gemini chatbot backend..." "Magenta"
    
    # Create .env file for gemini-proxy if it doesn't exist
    $geminiEnvPath = "gemini-proxy\.env"
    if (-not (Test-Path $geminiEnvPath)) {
        Write-ColorOutput "⚠️  Creating gemini-proxy/.env file..." "Yellow"
        $envContent = @"
# Gemini API Configuration
GEMINI_API_KEY=AIzaSyBIXbgZ3EE043v9RLa0Z_h93-BArAF-Hr4
PORT=3001

# Pinecone Configuration (for RAG - optional)
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=medical-handbook

# Supabase Configuration (for conversation history - optional)
SUPABASE_URL=https://lfcbxeqfbvvvfqxnwrxr.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmY2J4ZXFmYnZ2dmZxeG53cnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0MzA0NzcsImV4cCI6MjAzMTAwNjQ3N30.Nh83ebqzf1iGHTaGzK0LUEbxcwFb8HWAL9ZqAZKLvQE

# Development Settings
NODE_ENV=development
"@
        Set-Content -Path $geminiEnvPath -Value $envContent
        Write-ColorOutput "✅ Created gemini-proxy/.env" "Green"
    }
    
    # Start the backend in a new PowerShell window
    $backendScript = @"
Set-Location '$PWD\gemini-proxy'
Write-Host '🤖 Starting Gemini Backend...' -ForegroundColor Magenta
npm start
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript
    
    # Wait for backend to start
    Write-ColorOutput "⏳ Waiting for chatbot backend to start..." "Yellow"
    $timeout = 30
    $elapsed = 0
    
    do {
        Start-Sleep -Seconds 2
        $elapsed += 2
        if (Test-Port -Port 3001) {
            Write-ColorOutput "✅ Chatbot backend is ready!" "Green"
            return $true
        }
    } while ($elapsed -lt $timeout)
    
    Write-ColorOutput "⚠️  Chatbot backend taking longer than expected, continuing..." "Yellow"
    return $false
}

function Start-NextJSFrontend {
    Write-ColorOutput "🌐 Starting Next.js frontend..." "Blue"
    
    # Start the frontend in the current window
    Write-ColorOutput "⏳ Starting development server..." "Yellow"
    
    # Use Start-Process to run in background but keep output visible
    $frontendProcess = Start-Process npm -ArgumentList "run", "dev" -PassThru -NoNewWindow
    
    # Wait for frontend to start
    $timeout = 60
    $elapsed = 0
    
    do {
        Start-Sleep -Seconds 3
        $elapsed += 3
        if (Test-Port -Port 3000) {
            Write-ColorOutput "✅ Frontend is ready!" "Green"
            return $frontendProcess
        }
    } while ($elapsed -lt $timeout)
    
    Write-ColorOutput "⚠️  Frontend taking longer than expected..." "Yellow"
    return $frontendProcess
}

function Test-ChatbotConnection {
    Write-ColorOutput "🔍 Testing chatbot connection..." "Cyan"
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput "✅ Chatbot is online and responding!" "Green"
            return $true
        }
    } catch {
        Write-ColorOutput "⚠️  Chatbot connection test failed, but continuing..." "Yellow"
    }
    return $false
}

function Show-StartupInfo {
    Write-ColorOutput "`n🎉 PharmaLink with Chatbot is now running!" "White"
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Cyan"
    Write-ColorOutput "📱 Frontend:           http://localhost:3000" "Blue"
    Write-ColorOutput "🤖 Chatbot Backend:    http://localhost:3001" "Magenta"
    Write-ColorOutput "🏥 Medical Assistant:  http://localhost:3000/use-pages/medical-assistant" "Green"
    Write-ColorOutput "🗄️  Database Viewer:    http://localhost:3000/database-viewer" "Cyan"
    Write-ColorOutput "⚙️  Admin Dashboard:    http://localhost:3000/admin_panel/admin_dashboard" "Yellow"
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Cyan"
    Write-ColorOutput "`n💡 Tips:" "White"
    Write-ColorOutput "• The chatbot widget is available on all pages" "White"
    Write-ColorOutput "• Use Ctrl+C to stop the frontend" "White"
    Write-ColorOutput "• Close the backend window to stop the chatbot" "White"
    Write-ColorOutput "• Check both windows for any issues" "White"
    Write-ColorOutput "`n🚀 Happy coding!" "Green"
}

# Main execution
try {
    Write-ColorOutput "🚀 Starting PharmaLink with Integrated Chatbot...`n" "White"
    
    # Step 1: Prerequisites check
    if (-not $SkipChecks) {
        Test-Prerequisites
    }
    
    # Step 2: Stop existing processes
    Write-ColorOutput "🔄 Checking for existing processes..." "Yellow"
    Stop-ProcessOnPort -Port 3000
    Stop-ProcessOnPort -Port 3001
    Start-Sleep -Seconds 2
    
    # Step 3: Start Gemini backend
    $backendStarted = Start-GeminiBackend
    
    # Step 4: Wait a bit for backend to fully initialize
    Start-Sleep -Seconds 5
    
    # Step 5: Test chatbot connection
    Test-ChatbotConnection
    
    # Step 6: Start Next.js frontend
    $frontendProcess = Start-NextJSFrontend
    
    # Step 7: Show startup info
    Start-Sleep -Seconds 3
    Show-StartupInfo
    
    # Step 8: Open browser
    Write-ColorOutput "`n🌐 Opening browser..." "Cyan"
    Start-Process "http://localhost:3000"
    
    # Keep the script running
    Write-ColorOutput "`nPress Ctrl+C to stop the frontend server..." "Yellow"
    
    # Wait for the frontend process to exit
    if ($frontendProcess) {
        $frontendProcess.WaitForExit()
    }
    
} catch {
    Write-ColorOutput "❌ Error: $($_.Exception.Message)" "Red"
    exit 1
}

Write-ColorOutput "`n👋 PharmaLink stopped. Have a great day!" "Green"
