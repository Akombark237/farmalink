#!/usr/bin/env node

// emergency-dev.js
// Emergency development server with absolute minimal memory usage

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🆘 Emergency Development Server - Minimal Memory Mode\n');

function cleanEverything() {
  console.log('🧹 Deep cleaning project...');
  
  const itemsToClean = [
    '.next',
    'dist', 
    'build',
    '.swc',
    'node_modules/.cache',
    '.eslintcache'
  ];
  
  itemsToClean.forEach(item => {
    const itemPath = path.join(process.cwd(), item);
    if (fs.existsSync(itemPath)) {
      try {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`✅ Cleaned ${item}`);
      } catch (error) {
        console.log(`⚠️  Could not clean ${item}: ${error.message}`);
      }
    }
  });
}

function createMinimalConfig() {
  console.log('⚙️  Creating minimal configuration...');
  
  // Backup original config
  const originalConfig = path.join(process.cwd(), 'next.config.js');
  const minimalConfig = path.join(process.cwd(), 'next.config.minimal.js');
  
  if (fs.existsSync(originalConfig)) {
    fs.copyFileSync(originalConfig, 'next.config.js.backup');
  }
  
  if (fs.existsSync(minimalConfig)) {
    fs.copyFileSync(minimalConfig, originalConfig);
    console.log('✅ Applied minimal configuration');
  }
}

function restoreConfig() {
  console.log('🔄 Restoring original configuration...');
  
  const originalConfig = path.join(process.cwd(), 'next.config.js');
  const backupConfig = path.join(process.cwd(), 'next.config.js.backup');
  
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, originalConfig);
    fs.unlinkSync(backupConfig);
    console.log('✅ Original configuration restored');
  }
}

function startMinimalServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting emergency development server...');
    console.log('⚡ Using absolute minimal memory settings\n');
    
    // Ultra-minimal memory settings
    const args = [
      '--max-old-space-size=256',  // Very low memory
      '--max-semi-space-size=8',   // Minimal semi-space
      '--max-executable-size=128', // Limit executable size
      '--optimize-for-size',       // Optimize for size over speed
      '--no-compilation-cache',    // Disable compilation cache
      path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next'),
      'dev',
      '--port', '3000'
    ];
    
    console.log(`Command: node ${args.join(' ')}\n`);
    
    const child = spawn('node', args, {
      stdio: 'pipe',
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'development',
        NEXT_TELEMETRY_DISABLED: '1',
        DISABLE_ESLINT_PLUGIN: 'true',
        FAST_REFRESH: 'false',
        NODE_OPTIONS: '--max-old-space-size=256 --max-semi-space-size=8'
      }
    });
    
    let output = '';
    let hasStarted = false;
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
      
      if (text.includes('Ready in') || text.includes('Local:')) {
        hasStarted = true;
        resolve(child);
      }
    });
    
    child.stderr.on('data', (data) => {
      const text = data.toString();
      process.stderr.write(text);
      
      if (text.includes('memory allocation') || text.includes('out of memory')) {
        console.log('\n💥 Memory allocation failed even with minimal settings!');
        reject(new Error('Memory allocation failed'));
      }
    });
    
    child.on('error', (error) => {
      console.log(`❌ Process error: ${error.message}`);
      reject(error);
    });
    
    child.on('exit', (code) => {
      if (code !== 0 && !hasStarted) {
        console.log(`❌ Process exited with code ${code}`);
        reject(new Error(`Exit code ${code}`));
      }
    });
    
    // Timeout after 60 seconds
    setTimeout(() => {
      if (!hasStarted) {
        console.log('\n⏰ Startup timeout after 60 seconds');
        child.kill();
        reject(new Error('Timeout'));
      }
    }, 60000);
  });
}

async function main() {
  try {
    console.log('🆘 EMERGENCY MODE: Minimal Memory Development Server');
    console.log('⚠️  This mode disables many features to save memory\n');
    
    // Step 1: Clean everything
    cleanEverything();
    
    // Step 2: Apply minimal configuration
    createMinimalConfig();
    
    // Step 3: Try to start server
    try {
      const server = await startMinimalServer();
      
      console.log('\n🎉 Emergency server started successfully!');
      console.log('📍 Local: http://localhost:3000');
      console.log('\n⚠️  LIMITATIONS IN EMERGENCY MODE:');
      console.log('- Hot reload is disabled');
      console.log('- TypeScript checking is disabled');
      console.log('- ESLint is disabled');
      console.log('- Image optimization is disabled');
      console.log('- Source maps are disabled');
      console.log('- Very slow compilation');
      console.log('\n💡 To test your app:');
      console.log('- Visit: http://localhost:3000/use-pages/search');
      console.log('- Search functionality should work');
      console.log('- Map view should work (may be slow)');
      
      // Handle shutdown
      process.on('SIGINT', () => {
        console.log('\n👋 Shutting down emergency server...');
        restoreConfig();
        server.kill();
        process.exit(0);
      });
      
      process.on('exit', () => {
        restoreConfig();
      });
      
    } catch (error) {
      console.log('\n💥 Emergency server failed to start!');
      console.log('Error:', error.message);
      
      restoreConfig();
      
      console.log('\n🆘 LAST RESORT OPTIONS:');
      console.log('1. Restart your computer');
      console.log('2. Close ALL other applications');
      console.log('3. Try building and running production:');
      console.log('   npm run build');
      console.log('   npm start');
      console.log('4. Use a cloud development environment');
      console.log('5. Develop on a machine with more RAM');
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    restoreConfig();
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('🆘 Emergency Development Server');
  console.log('\nThis script uses absolute minimal memory settings.');
  console.log('Use only when normal development server fails due to memory issues.');
  console.log('\nUsage: node emergency-dev.js');
  process.exit(0);
}

// Run the emergency server
main();
