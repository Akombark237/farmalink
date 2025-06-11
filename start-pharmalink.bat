@echo off
echo ========================================
echo Starting PharmaLink with Qala-Lwazi AI
echo ========================================

echo.
echo [1/3] Checking for existing processes...

REM Kill any existing Node.js processes on our ports
taskkill /f /im node.exe >nul 2>&1

echo [2/3] Starting Qala-Lwazi Medical Assistant API...

REM Start Gemini proxy server in background
cd /d "%~dp0phamarlink\gemini-proxy"
if exist "server.js" (
    start /b "Gemini-Proxy" cmd /c "npm start"
    echo [SUCCESS] Chatbot API starting on port 3003...
) else (
    echo [WARNING] Gemini proxy not found. Chatbot will be offline.
)

REM Wait a moment for the API to start
timeout /t 3 /nobreak >nul

echo [3/3] Starting PharmaLink Web Application...

REM Go back to main directory and start Next.js
cd /d "%~dp0"
echo [SUCCESS] Starting web application...
echo.
echo ========================================
echo PharmaLink is starting up!
echo ========================================
echo Web App: http://localhost:3001 (or next available port)
echo Chatbot API: http://localhost:3003
echo ========================================
echo.

npm run dev

echo.
echo PharmaLink stopped.
pause
