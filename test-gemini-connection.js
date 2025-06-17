#!/usr/bin/env node

// Test script to verify Gemini proxy backend connection
const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing Gemini Proxy Backend Connection...\n');

// Configuration
const GEMINI_PORT = 3001;
const NEXTJS_PORT = 3000;
const GEMINI_DIR = path.join(__dirname, 'gemini-proxy');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test if port is available
function testPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    
    server.on('error', () => resolve(false));
  });
}

// Test HTTP endpoint
async function testEndpoint(url, description) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      log(`✅ ${description}: OK`, 'green');
      return true;
    } else {
      log(`❌ ${description}: ${response.status} ${response.statusText}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description}: ${error.message}`, 'red');
    return false;
  }
}

// Start Gemini backend
function startGeminiBackend() {
  return new Promise((resolve, reject) => {
    log('🚀 Starting Gemini backend...', 'blue');
    
    const geminiProcess = spawn('node', ['server.js'], {
      cwd: GEMINI_DIR,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    
    geminiProcess.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });

    geminiProcess.stderr.on('data', (data) => {
      output += data.toString();
      process.stderr.write(data);
    });

    // Wait for server to start
    setTimeout(() => {
      if (output.includes('running on port') || output.includes('listening')) {
        log('✅ Gemini backend started successfully', 'green');
        resolve(geminiProcess);
      } else {
        log('⚠️  Gemini backend may have issues, but continuing...', 'yellow');
        resolve(geminiProcess);
      }
    }, 5000);

    geminiProcess.on('error', (error) => {
      log(`❌ Failed to start Gemini backend: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function main() {
  try {
    log('🔍 Step 1: Checking environment...', 'cyan');
    
    // Check if Gemini directory exists
    const fs = require('fs');
    if (!fs.existsSync(GEMINI_DIR)) {
      log('❌ Gemini proxy directory not found!', 'red');
      return;
    }
    log('✅ Gemini proxy directory found', 'green');

    // Check if package.json exists
    const packagePath = path.join(GEMINI_DIR, 'package.json');
    if (!fs.existsSync(packagePath)) {
      log('❌ Gemini package.json not found!', 'red');
      return;
    }
    log('✅ Gemini package.json found', 'green');

    // Check if .env file exists
    const envPath = path.join(GEMINI_DIR, '.env');
    if (!fs.existsSync(envPath)) {
      log('⚠️  Gemini .env file not found - using defaults', 'yellow');
    } else {
      log('✅ Gemini .env file found', 'green');
    }

    log('\n🔍 Step 2: Checking ports...', 'cyan');
    
    const geminiPortAvailable = await testPort(GEMINI_PORT);
    if (!geminiPortAvailable) {
      log(`⚠️  Port ${GEMINI_PORT} is in use - will try to connect to existing service`, 'yellow');
    } else {
      log(`✅ Port ${GEMINI_PORT} is available`, 'green');
    }

    log('\n🔍 Step 3: Testing Gemini backend...', 'cyan');
    
    // Try to connect to existing backend first
    const backendHealthy = await testEndpoint(`http://localhost:${GEMINI_PORT}/health`, 'Gemini Backend Health');
    
    if (!backendHealthy) {
      log('\n🚀 Step 4: Starting Gemini backend...', 'cyan');
      try {
        const geminiProcess = await startGeminiBackend();
        
        // Wait a bit for startup
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Test again
        await testEndpoint(`http://localhost:${GEMINI_PORT}/health`, 'Gemini Backend Health (after start)');
        
        // Keep process running for testing
        log('\n⏳ Keeping backend running for testing...', 'yellow');
        log('Press Ctrl+C to stop', 'yellow');
        
        process.on('SIGINT', () => {
          log('\n🛑 Stopping Gemini backend...', 'yellow');
          geminiProcess.kill();
          process.exit(0);
        });
        
      } catch (error) {
        log(`❌ Failed to start backend: ${error.message}`, 'red');
      }
    }

    log('\n🔍 Step 5: Testing Next.js proxy...', 'cyan');
    await testEndpoint(`http://localhost:${NEXTJS_PORT}/api/medical-chat`, 'Next.js Medical Chat Proxy');

    log('\n🎉 Connection test completed!', 'bright');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log(`🤖 Gemini Backend:     http://localhost:${GEMINI_PORT}`, 'magenta');
    log(`📱 Next.js Frontend:   http://localhost:${NEXTJS_PORT}`, 'blue');
    log(`🏥 Medical Assistant:  http://localhost:${NEXTJS_PORT}/use-pages/medical-assistant`, 'green');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the test
main().catch(console.error);
