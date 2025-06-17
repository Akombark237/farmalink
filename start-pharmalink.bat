@echo off
echo 🚀 Starting PharmaLink with Integrated Chatbot...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "start-with-chatbot.ps1"

pause
