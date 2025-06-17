@echo off
title PharmaLink with Qala-Lwazi Chatbot

echo.
echo ========================================
echo  PharmaLink with Qala-Lwazi Chatbot
echo ========================================
echo.

echo [1/4] Checking environment...
if not exist "gemini-proxy" (
    echo ERROR: gemini-proxy directory not found!
    pause
    exit /b 1
)

if not exist "gemini-proxy\package.json" (
    echo ERROR: Gemini backend not properly set up!
    pause
    exit /b 1
)

echo [2/4] Stopping existing processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo [3/4] Starting Gemini backend...
start "Gemini Backend" cmd /k "cd gemini-proxy && echo Starting Qala-Lwazi Medical Assistant Backend... && node server.js"

echo [4/4] Waiting for backend to start...
timeout /t 5 >nul

echo [5/5] Starting Next.js frontend...
start "Next.js Frontend" cmd /k "echo Starting PharmaLink Frontend... && npm run dev"

echo.
echo ========================================
echo  Services Starting...
echo ========================================
echo.
echo Gemini Backend:    http://localhost:3001
echo Next.js Frontend:  http://localhost:3000
echo Medical Assistant: http://localhost:3000/use-pages/medical-assistant
echo.
echo Wait 10-15 seconds for both services to fully start,
echo then open http://localhost:3000 in your browser.
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000

echo.
echo Both services are now running in separate windows.
echo Close those windows to stop the services.
echo.
pause
