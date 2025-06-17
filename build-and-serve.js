#!/usr/bin/env node

// build-and-serve.js
// Build the project and serve it in production mode (uses much less memory)

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️  Production Build & Serve - Memory Efficient Solution\n');

function cleanProject() {
  console.log('🧹 Cleaning project...');
  
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

function runCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 ${description}...`);
    console.log(`Command: ${command} ${args.join(' ')}\n`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=1024',
        NEXT_TELEMETRY_DISABLED: '1'
      }
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${description} completed successfully!`);
        resolve();
      } else {
        console.log(`\n❌ ${description} failed with exit code ${code}`);
        reject(new Error(`${description} failed`));
      }
    });
    
    child.on('error', (error) => {
      console.log(`❌ Error during ${description}: ${error.message}`);
      reject(error);
    });
  });
}

async function buildProject() {
  try {
    await runCommand('node', [
      '--max-old-space-size=1024',
      'node_modules/next/dist/bin/next',
      'build'
    ], 'Building project');
    
    return true;
  } catch (error) {
    console.log('\n💥 Build failed! Trying with even lower memory...');
    
    try {
      await runCommand('node', [
        '--max-old-space-size=512',
        'node_modules/next/dist/bin/next',
        'build'
      ], 'Building project (low memory mode)');
      
      return true;
    } catch (error2) {
      console.log('\n💥 Build failed even with low memory settings!');
      return false;
    }
  }
}

function serveProject() {
  return new Promise((resolve, reject) => {
    console.log('\n🚀 Starting production server...');
    console.log('📍 This uses much less memory than development mode\n');
    
    const child = spawn('node', [
      'node_modules/next/dist/bin/next',
      'start'
    ], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1'
      }
    });
    
    console.log('✅ Production server started!');
    console.log('📍 Local: http://localhost:3000');
    console.log('\n💡 Features available:');
    console.log('- Search functionality: /use-pages/search');
    console.log('- Pharmacy search with Cameroon data');
    console.log('- OpenStreetMap integration');
    console.log('- All features work in production mode');
    console.log('\n⚡ Benefits of production mode:');
    console.log('- Much lower memory usage');
    console.log('- Faster page loads');
    console.log('- Optimized bundles');
    console.log('- No hot reload (restart server for changes)');
    
    // Handle shutdown
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down production server...');
      child.kill();
      process.exit(0);
    });
    
    child.on('error', (error) => {
      console.log(`❌ Server error: ${error.message}`);
      reject(error);
    });
    
    child.on('exit', (code) => {
      if (code !== 0) {
        console.log(`❌ Server exited with code ${code}`);
        reject(new Error(`Server exit code ${code}`));
      }
    });
    
    resolve(child);
  });
}

async function main() {
  try {
    console.log('🏗️  Production Build & Serve Solution');
    console.log('💡 This approach uses much less memory than development mode\n');
    
    // Step 1: Clean project
    cleanProject();
    
    // Step 2: Build project
    console.log('\n📦 Building project for production...');
    console.log('⏳ This may take a few minutes but uses less memory than dev mode');
    
    const buildSuccess = await buildProject();
    
    if (!buildSuccess) {
      console.log('\n💥 Build failed! Alternative solutions:');
      console.log('1. Restart your computer to free up memory');
      console.log('2. Close all other applications');
      console.log('3. Try on a machine with more RAM');
      console.log('4. Use a cloud development environment like:');
      console.log('   - GitHub Codespaces');
      console.log('   - GitPod');
      console.log('   - CodeSandbox');
      console.log('   - Replit');
      process.exit(1);
    }
    
    // Step 3: Serve in production mode
    await serveProject();
    
  } catch (error) {
    console.error('\n💥 Unexpected error:', error.message);
    console.log('\n🆘 Final recommendations:');
    console.log('1. Your system may not have enough available memory');
    console.log('2. Try restarting your computer');
    console.log('3. Close all other applications');
    console.log('4. Consider using a cloud development environment');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('🏗️  Production Build & Serve');
  console.log('\nBuilds the project and serves it in production mode.');
  console.log('Uses much less memory than development mode.');
  console.log('\nUsage: node build-and-serve.js');
  console.log('\nNote: You need to rebuild after making changes.');
  process.exit(0);
}

// Run the build and serve process
main();
