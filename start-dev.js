#!/usr/bin/env node

// start-dev.js
// Smart development server starter with memory optimization

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 PharmaLink Development Server Starter\n');

// Memory configurations to try (in order of preference)
const memoryConfigs = [
  {
    name: 'High Memory (4GB)',
    args: ['--max-old-space-size=4096', '--max-semi-space-size=128'],
    description: 'Best performance, requires 8GB+ system RAM'
  },
  {
    name: 'Medium Memory (2GB)',
    args: ['--max-old-space-size=2048', '--max-semi-space-size=64'],
    description: 'Good performance, requires 4GB+ system RAM'
  },
  {
    name: 'Low Memory (1GB)',
    args: ['--max-old-space-size=1024', '--max-semi-space-size=32'],
    description: 'Slower but stable, requires 2GB+ system RAM'
  },
  {
    name: 'Minimal Memory (512MB)',
    args: ['--max-old-space-size=512', '--max-semi-space-size=16'],
    description: 'Very slow but works on low-end systems'
  }
];

function checkSystemMemory() {
  try {
    const os = require('os');
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const totalGB = Math.round(totalMemory / 1024 / 1024 / 1024);
    const freeGB = Math.round(freeMemory / 1024 / 1024 / 1024);
    
    console.log(`💻 System Memory: ${totalGB}GB total, ${freeGB}GB free`);
    
    if (totalGB < 4) {
      console.log('⚠️  Low system memory detected. Using minimal configuration.');
      return 'minimal';
    } else if (totalGB < 8) {
      console.log('📊 Medium system memory. Using balanced configuration.');
      return 'medium';
    } else {
      console.log('🎯 High system memory. Using optimal configuration.');
      return 'high';
    }
  } catch (error) {
    console.log('❓ Could not detect system memory. Using safe defaults.');
    return 'medium';
  }
}

function cleanProject() {
  console.log('\n🧹 Cleaning project...');
  
  const dirsToClean = ['.next', 'dist', 'build'];
  
  dirsToClean.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      try {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`✅ Cleaned ${dir}/`);
      } catch (error) {
        console.log(`❌ Could not clean ${dir}/: ${error.message}`);
      }
    }
  });
}

function startServer(config) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 Trying ${config.name}...`);
    console.log(`📝 ${config.description}`);
    
    const args = [
      ...config.args,
      path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next'),
      'dev'
    ];
    
    console.log(`🚀 Command: node ${args.join(' ')}\n`);
    
    const child = spawn('node', args, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    let hasStarted = false;
    
    // Give it 30 seconds to start
    const timeout = setTimeout(() => {
      if (!hasStarted) {
        console.log('\n⏰ Startup timeout. Trying next configuration...\n');
        child.kill();
        reject(new Error('Timeout'));
      }
    }, 30000);
    
    child.on('spawn', () => {
      console.log('✅ Server process started successfully!');
      hasStarted = true;
      clearTimeout(timeout);
      resolve(child);
    });
    
    child.on('error', (error) => {
      console.log(`❌ Failed to start: ${error.message}\n`);
      clearTimeout(timeout);
      reject(error);
    });
    
    child.on('exit', (code) => {
      if (code !== 0 && !hasStarted) {
        console.log(`❌ Process exited with code ${code}\n`);
        clearTimeout(timeout);
        reject(new Error(`Exit code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    // Clean project first
    cleanProject();
    
    // Check system memory
    const memoryLevel = checkSystemMemory();
    
    // Determine starting configuration based on system memory
    let startIndex = 0;
    switch (memoryLevel) {
      case 'high':
        startIndex = 0;
        break;
      case 'medium':
        startIndex = 1;
        break;
      case 'minimal':
        startIndex = 3;
        break;
      default:
        startIndex = 1;
    }
    
    // Try configurations starting from the appropriate level
    for (let i = startIndex; i < memoryConfigs.length; i++) {
      try {
        const server = await startServer(memoryConfigs[i]);
        
        console.log('\n🎉 Development server started successfully!');
        console.log('📍 Local: http://localhost:3000');
        console.log('🌐 Network: Check terminal for network URL');
        console.log('\n💡 Tips:');
        console.log('- Press Ctrl+C to stop the server');
        console.log('- Visit /use-pages/search to test the pharmacy search');
        console.log('- Click "Map View" to test OpenStreetMap integration');
        console.log('- Search for "Chloroquine" or "CODEX" to test Cameroon data');
        
        // Keep the process running
        process.on('SIGINT', () => {
          console.log('\n👋 Shutting down development server...');
          server.kill();
          process.exit(0);
        });
        
        return; // Success!
        
      } catch (error) {
        if (i === memoryConfigs.length - 1) {
          // Last configuration failed
          console.log('\n💥 All memory configurations failed!');
          console.log('\n🆘 Emergency solutions:');
          console.log('1. Restart your computer to free up memory');
          console.log('2. Close all other applications');
          console.log('3. Try: npm run build && npm start (production mode)');
          console.log('4. Use a cloud development environment');
          console.log('\n📖 See MEMORY_FIX_GUIDE.md for detailed troubleshooting');
          process.exit(1);
        }
        // Try next configuration
        continue;
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('🚀 PharmaLink Development Server Starter');
  console.log('\nUsage: node start-dev.js [options]');
  console.log('\nOptions:');
  console.log('  --help, -h     Show this help message');
  console.log('  --clean        Clean project before starting');
  console.log('  --minimal      Force minimal memory configuration');
  console.log('\nExamples:');
  console.log('  node start-dev.js');
  console.log('  node start-dev.js --clean');
  console.log('  node start-dev.js --minimal');
  process.exit(0);
}

if (process.argv.includes('--clean')) {
  cleanProject();
  console.log('\n✅ Project cleaned. Run again without --clean to start server.');
  process.exit(0);
}

// Run the main function
main();
