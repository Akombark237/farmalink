// scripts/memory-fix.js
// Script to help diagnose and fix memory issues

const fs = require('fs');
const path = require('path');

function checkMemoryUsage() {
  const used = process.memoryUsage();
  console.log('📊 Current Memory Usage:');
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

function optimizeProject() {
  console.log('🔧 Optimizing project for memory usage...\n');

  // Check if .next directory exists and is large
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    console.log('🗑️  Cleaning .next directory...');
    try {
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ .next directory cleaned');
    } catch (error) {
      console.log('❌ Error cleaning .next directory:', error.message);
    }
  }

  // Check node_modules size
  const nodeModulesDir = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesDir)) {
    console.log('📦 node_modules directory exists');
    // Could add size checking logic here
  }

  // Create .env.local with memory optimizations if it doesn't exist
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Add memory optimization environment variables
  const memoryOptimizations = `
# Memory Optimization Settings
NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=128"
NEXT_TELEMETRY_DISABLED=1
DISABLE_ESLINT_PLUGIN=true

# Development optimizations
FAST_REFRESH=true
NEXT_PRIVATE_STANDALONE=true
`;

  if (!envContent.includes('NODE_OPTIONS')) {
    fs.writeFileSync(envPath, envContent + memoryOptimizations);
    console.log('✅ Added memory optimization settings to .env.local');
  }

  console.log('\n🎯 Memory Optimization Tips:');
  console.log('1. Use npm run dev-safe for safer development');
  console.log('2. Close other applications to free up memory');
  console.log('3. Restart your terminal/IDE if issues persist');
  console.log('4. Consider using WSL2 if on Windows for better memory management');
  console.log('5. Clear browser cache and close unnecessary tabs');
}

function createMemoryFriendlyScripts() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add memory-friendly scripts if they don't exist
    if (!packageJson.scripts['dev-memory-safe']) {
      packageJson.scripts['dev-memory-safe'] = 'node --max-old-space-size=2048 --max-semi-space-size=64 node_modules/next/dist/bin/next dev';
      packageJson.scripts['build-memory-safe'] = 'node --max-old-space-size=2048 --max-semi-space-size=64 node_modules/next/dist/bin/next build';
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Added memory-safe scripts to package.json');
    }
  }
}

function main() {
  console.log('🚀 Memory Optimization Tool for Next.js\n');
  
  checkMemoryUsage();
  console.log('');
  
  optimizeProject();
  createMemoryFriendlyScripts();
  
  console.log('\n✅ Memory optimization complete!');
  console.log('\n🔄 Next steps:');
  console.log('1. Run: npm run dev-safe');
  console.log('2. Or try: npm run dev-memory-safe');
  console.log('3. If still having issues, restart your computer');
}

if (require.main === module) {
  main();
}

module.exports = { checkMemoryUsage, optimizeProject };
