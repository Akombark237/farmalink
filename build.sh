#!/bin/bash

# Render Build Script for PharmaLink
echo "🚀 Starting PharmaLink build for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Create logs directory
mkdir -p logs

echo "✅ Build completed successfully!"
echo "🏥 PharmaLink is ready for deployment!"
