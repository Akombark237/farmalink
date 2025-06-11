#!/bin/bash

# PharmaLink Deployment Script for Node.js
# This is the equivalent of using gunicorn for Python projects

echo "🚀 Starting PharmaLink deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm $(npm --version) detected"

# Install dependencies
print_status "Installing dependencies..."
npm ci --only=production
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed successfully"

# Build the application
print_status "Building Next.js application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
print_success "Application built successfully"

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 not found. Installing PM2 globally..."
    npm install -g pm2
    if [ $? -ne 0 ]; then
        print_error "Failed to install PM2"
        exit 1
    fi
    print_success "PM2 installed successfully"
fi

# Create logs directory
mkdir -p logs

# Stop existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 stop pharmalink 2>/dev/null || true
pm2 delete pharmalink 2>/dev/null || true

# Start the application with PM2
print_status "Starting PharmaLink with PM2..."
pm2 start ecosystem.config.js --env production
if [ $? -ne 0 ]; then
    print_error "Failed to start application with PM2"
    exit 1
fi

# Save PM2 configuration
pm2 save
pm2 startup

print_success "PharmaLink deployed successfully!"

# Display application status
print_status "Application Status:"
pm2 status

# Display application URL
print_status "Application is running at:"
echo -e "${GREEN}http://localhost:3000${NC}"

# Display logs command
print_status "To view logs, run:"
echo -e "${YELLOW}pm2 logs pharmalink${NC}"

# Display monitoring command
print_status "To monitor the application, run:"
echo -e "${YELLOW}pm2 monit${NC}"

echo ""
print_success "🎉 PharmaLink is now live and serving customers!"
echo -e "${BLUE}📊 Health Check:${NC} http://localhost:3000/api/health"
echo -e "${BLUE}📚 API Docs:${NC} http://localhost:3000/api/docs"
echo -e "${BLUE}🏥 Pharmacies:${NC} http://localhost:3000/api/pharmacies"
