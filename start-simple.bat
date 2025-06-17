@echo off
title PharmaLink with Chatbot Startup
color 0A

echo.
echo ========================================
echo   PharmaLink with Integrated Chatbot
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js is installed

REM Check if we're in the right directory
echo [2/5] Checking project directory...
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the phamarlink directory.
    pause
    exit /b 1
)
echo OK: Project directory found

REM Create gemini-proxy .env if it doesn't exist
echo [3/5] Setting up chatbot configuration...
if not exist "gemini-proxy\.env" (
    echo Creating gemini-proxy/.env file...
    (
        echo # Gemini API Configuration
        echo GEMINI_API_KEY=AIzaSyBIXbgZ3EE043v9RLa0Z_h93-BArAF-Hr4
        echo PORT=3001
        echo.
        echo # Development Settings
        echo NODE_ENV=development
    ) > "gemini-proxy\.env"
    echo OK: Created gemini-proxy/.env
) else (
    echo OK: gemini-proxy/.env already exists
)

REM Kill any existing processes on our ports
echo [4/5] Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1
timeout /t 2 /nobreak >nul
echo OK: Ports cleaned up

echo [5/5] Starting services...
echo.

REM Start the chatbot backend in a new window
echo Starting Gemini chatbot backend...
start "Gemini Chatbot Backend" cmd /k "cd gemini-proxy && echo Starting Gemini Backend on port 3001... && npm start"

REM Wait a bit for the backend to start
echo Waiting for backend to initialize...
timeout /t 8 /nobreak >nul

REM Start the frontend
echo Starting Next.js frontend...
echo.
echo ========================================
echo   Services Starting...
echo ========================================
echo   Frontend: http://localhost:3000
echo   Chatbot:  http://localhost:3001
echo ========================================
echo.
echo The chatbot backend is running in a separate window.
echo Close that window to stop the chatbot.
echo Press Ctrl+C here to stop the frontend.
echo.

REM Start the frontend in this window
npm run dev

echo.
echo ========================================
echo   PharmaLink Stopped
echo ========================================
echo Frontend has been stopped.
echo Don't forget to close the chatbot backend window if needed.
echo.
pause
