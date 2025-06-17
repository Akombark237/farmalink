#!/usr/bin/env node

// Unified startup script for PharmaLink with integrated chatbot
// This script starts both the Gemini backend and Next.js frontend together

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting PharmaLink with Integrated Chatbot...\n');

// Configuration
const GEMINI_PORT = 3001;
const NEXTJS_PORT = 3000;
const GEMINI_DIR = path.join(__dirname, 'gemini-proxy');
const PROJECT_ROOT = __dirname;

// Check if we're on Windows for process management
const isWindows = process.platform === 'win32';

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

function checkEnvironment() {
  log('🔍 Checking environment...', 'cyan');
  
  // Check if .env.local exists
  const envPath = path.join(PROJECT_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local file not found!', 'red');
    log('Please create .env.local with your database and API configurations.', 'yellow');
    process.exit(1);
  }
  
  // Check if gemini-proxy directory exists
  if (!fs.existsSync(GEMINI_DIR)) {
    log('❌ gemini-proxy directory not found!', 'red');
    process.exit(1);
  }
  
  // Check if gemini-proxy has .env file
  const geminiEnvPath = path.join(GEMINI_DIR, '.env');
  if (!fs.existsSync(geminiEnvPath)) {
    log('⚠️  gemini-proxy/.env not found, creating default...', 'yellow');
    createGeminiEnv();
  }
  
  log('✅ Environment check passed!', 'green');
}

function createGeminiEnv() {
  const geminiEnvContent = `# Gemini API Configuration
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
`;
  
  fs.writeFileSync(path.join(GEMINI_DIR, '.env'), geminiEnvContent);
  log('✅ Created gemini-proxy/.env with default configuration', 'green');
}

function killExistingProcesses() {
  return new Promise((resolve) => {
    log('🔄 Checking for existing processes...', 'yellow');
    
    // Kill processes on both ports
    const killCommands = [
      `netstat -ano | findstr :${GEMINI_PORT}`,
      `netstat -ano | findstr :${NEXTJS_PORT}`
    ];
    
    let completed = 0;
    
    killCommands.forEach((cmd, index) => {
      exec(cmd, (error, stdout) => {
        if (stdout) {
          const lines = stdout.split('\n');
          lines.forEach(line => {
            const match = line.match(/\s+(\d+)$/);
            if (match) {
              const pid = match[1];
              exec(`taskkill /f /pid ${pid}`, () => {});
            }
          });
        }
        completed++;
        if (completed === killCommands.length) {
          setTimeout(resolve, 1000); // Wait a bit for processes to die
        }
      });
    });
    
    // Fallback timeout
    setTimeout(resolve, 3000);
  });
}

function startGeminiBackend() {
  return new Promise((resolve, reject) => {
    log('🤖 Starting Gemini chatbot backend...', 'magenta');
    
    const geminiProcess = spawn('npm', ['start'], {
      cwd: GEMINI_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    let backendReady = false;
    
    geminiProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`${colors.magenta}[Chatbot]${colors.reset} ${output.trim()}`);
      
      // Check if backend is ready
      if (output.includes('running on port') || output.includes('Server started') || output.includes('3001')) {
        if (!backendReady) {
          backendReady = true;
          log('✅ Chatbot backend is ready!', 'green');
          resolve(geminiProcess);
        }
      }
    });
    
    geminiProcess.stderr.on('data', (data) => {
      const output = data.toString();
      console.log(`${colors.red}[Chatbot Error]${colors.reset} ${output.trim()}`);
    });
    
    geminiProcess.on('error', (error) => {
      log(`❌ Failed to start chatbot backend: ${error.message}`, 'red');
      reject(error);
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!backendReady) {
        log('⚠️  Chatbot backend taking longer than expected, continuing...', 'yellow');
        resolve(geminiProcess);
      }
    }, 30000);
  });
}

function startNextJS() {
  return new Promise((resolve, reject) => {
    log('🌐 Starting Next.js frontend...', 'blue');
    
    const nextProcess = spawn('npm', ['run', 'dev:frontend-only'], {
      cwd: PROJECT_ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    let frontendReady = false;
    
    nextProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`${colors.blue}[Frontend]${colors.reset} ${output.trim()}`);
      
      // Check if frontend is ready
      if (output.includes('Ready in') || output.includes('Local:') || output.includes('3000')) {
        if (!frontendReady) {
          frontendReady = true;
          log('✅ Frontend is ready!', 'green');
          resolve(nextProcess);
        }
      }
    });
    
    nextProcess.stderr.on('data', (data) => {
      const output = data.toString();
      console.log(`${colors.yellow}[Frontend Warning]${colors.reset} ${output.trim()}`);
    });
    
    nextProcess.on('error', (error) => {
      log(`❌ Failed to start frontend: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function testChatbotConnection() {
  log('🔍 Testing chatbot connection...', 'cyan');
  
  try {
    const response = await fetch(`http://localhost:${GEMINI_PORT}/health`);
    if (response.ok) {
      log('✅ Chatbot is online and responding!', 'green');
      return true;
    }
  } catch (error) {
    log('⚠️  Chatbot connection test failed, but continuing...', 'yellow');
  }
  return false;
}

function displayStartupInfo() {
  log('\n🎉 PharmaLink with Chatbot is now running!', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`📱 Frontend:           http://localhost:${NEXTJS_PORT}`, 'blue');
  log(`🤖 Chatbot Backend:    http://localhost:${GEMINI_PORT}`, 'magenta');
  log(`🏥 Medical Assistant:  http://localhost:${NEXTJS_PORT}/use-pages/medical-assistant`, 'green');
  log(`🗄️  Database Viewer:    http://localhost:${NEXTJS_PORT}/database-viewer`, 'cyan');
  log(`⚙️  Admin Dashboard:    http://localhost:${NEXTJS_PORT}/admin_panel/admin_dashboard`, 'yellow');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('\n💡 Tips:', 'bright');
  log('• The chatbot widget is available on all pages', 'reset');
  log('• Use Ctrl+C to stop both services', 'reset');
  log('• Check the logs above for any issues', 'reset');
  log('\n🚀 Happy coding!', 'green');
}

async function main() {
  try {
    log('🚀 Starting PharmaLink with Chatbot...', 'bright');

    // Step 1: Environment check
    log('📋 Step 1: Environment check', 'cyan');
    checkEnvironment();

    // Step 2: Kill existing processes
    log('🔄 Step 2: Cleaning up existing processes', 'cyan');
    await killExistingProcesses();

    // Step 3: Start Gemini backend
    log('🤖 Step 3: Starting chatbot backend', 'cyan');
    const geminiProcess = await startGeminiBackend();

    // Step 4: Wait a bit for backend to fully initialize
    log('⏳ Step 4: Waiting for backend initialization', 'cyan');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 5: Start Next.js frontend
    log('🌐 Step 5: Starting frontend', 'cyan');
    const nextProcess = await startNextJS();

    // Step 6: Test chatbot connection
    log('🔍 Step 6: Testing connections', 'cyan');
    setTimeout(testChatbotConnection, 5000);

    // Step 7: Display startup info
    setTimeout(displayStartupInfo, 8000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      log('\n🛑 Shutting down services...', 'yellow');
      try {
        geminiProcess.kill();
        nextProcess.kill();
      } catch (e) {
        log('⚠️  Error during shutdown, forcing exit', 'yellow');
      }
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      try {
        geminiProcess.kill();
        nextProcess.kill();
      } catch (e) {
        // Ignore errors during shutdown
      }
      process.exit(0);
    });

  } catch (error) {
    log(`❌ Startup failed: ${error.message}`, 'red');
    log(`Stack trace: ${error.stack}`, 'red');
    process.exit(1);
  }
}

// Start the application
main();
