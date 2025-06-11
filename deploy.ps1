# PharmaLink Deployment Script for Windows (PowerShell)
# This is the equivalent of using gunicorn for Python projects

Write-Host "🚀 Starting PharmaLink deployment..." -ForegroundColor Cyan

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion detected"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 18+ first."
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Success "npm $npmVersion detected"
} catch {
    Write-Error "npm is not installed. Please install npm first."
    exit 1
}

# Install dependencies
Write-Status "Installing dependencies..."
try {
    npm ci --only=production
    Write-Success "Dependencies installed successfully"
} catch {
    Write-Error "Failed to install dependencies"
    exit 1
}

# Build the application
Write-Status "Building Next.js application..."
try {
    npm run build
    Write-Success "Application built successfully"
} catch {
    Write-Error "Build failed"
    exit 1
}

# Check if PM2 is installed globally
try {
    pm2 --version | Out-Null
    Write-Success "PM2 detected"
} catch {
    Write-Warning "PM2 not found. Installing PM2 globally..."
    try {
        npm install -g pm2
        Write-Success "PM2 installed successfully"
    } catch {
        Write-Error "Failed to install PM2"
        exit 1
    }
}

# Create logs directory
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
    Write-Status "Created logs directory"
}

# Stop existing PM2 processes
Write-Status "Stopping existing PM2 processes..."
try {
    pm2 stop pharmalink 2>$null
    pm2 delete pharmalink 2>$null
} catch {
    # Ignore errors if no existing processes
}

# Start the application with PM2
Write-Status "Starting PharmaLink with PM2..."
try {
    pm2 start ecosystem.config.js --env production
    Write-Success "Application started with PM2"
} catch {
    Write-Error "Failed to start application with PM2"
    exit 1
}

# Save PM2 configuration
pm2 save
pm2 startup

Write-Success "PharmaLink deployed successfully!"

# Display application status
Write-Status "Application Status:"
pm2 status

# Display application URLs
Write-Status "Application is running at:"
Write-Host "http://localhost:3000" -ForegroundColor Green

Write-Status "API Endpoints:"
Write-Host "📊 Health Check: http://localhost:3000/api/health" -ForegroundColor Blue
Write-Host "📚 API Docs: http://localhost:3000/api/docs" -ForegroundColor Blue
Write-Host "🏥 Pharmacies: http://localhost:3000/api/pharmacies" -ForegroundColor Blue
Write-Host "💊 Medications: http://localhost:3000/api/medications" -ForegroundColor Blue
Write-Host "🔍 Search: http://localhost:3000/api/search?query=paracetamol" -ForegroundColor Blue

# Display useful commands
Write-Status "Useful PM2 Commands:"
Write-Host "View logs: pm2 logs pharmalink" -ForegroundColor Yellow
Write-Host "Monitor app: pm2 monit" -ForegroundColor Yellow
Write-Host "Restart app: pm2 restart pharmalink" -ForegroundColor Yellow
Write-Host "Stop app: pm2 stop pharmalink" -ForegroundColor Yellow

Write-Host ""
Write-Success "🎉 PharmaLink is now live and serving customers!"
Write-Host "🇨🇲 Ready to serve pharmacies in Yaoundé and beyond!" -ForegroundColor Magenta
