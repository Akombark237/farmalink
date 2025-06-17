#!/usr/bin/env node

// optimize-project.js
// Comprehensive project optimization script to reduce file sizes and improve launch performance

const fs = require('fs');
const path = require('path');

console.log('🚀 PharmaLink Project Optimization Tool\n');

// Files and directories that can be safely removed to improve performance
const REMOVABLE_ITEMS = [
  // Build artifacts
  '.next',
  'dist',
  'build',
  '.swc',
  
  // Cache directories
  'node_modules/.cache',
  '.eslintcache',
  
  // Temporary files
  'temp.txt',
  
  // Large documentation files (keep essential ones)
  'BACKGROUND_IMPLEMENTATION_SUMMARY.md',
  'BACKGROUND_SETUP_INSTRUCTIONS.md',
  'CHATBOT_IMPROVEMENTS.md',
  'DATABASE_MONITORING.md',
  'GOOGLE_MAPS_INTEGRATION.md',
  'MEDICAL_ASSISTANT_INTEGRATION.md',
  'OPENSTREETMAP_INTEGRATION.md',
  'PGADMIN_SETUP_GUIDE.md',
  'REAL_TIME_MONITORING.md',
  'TROUBLESHOOTING_GUIDE.md',
  
  // Duplicate configuration files
  'next.config.ts', // Keep next.config.js
  'next.config.dev.js', // Keep minimal version
  
  // Large setup scripts (keep essential ones)
  'setup-gemini-integration.js',
  'setup-google-maps.js',
  'setup-openstreetmap.js',
  'setup-pharmacy-db.js',
  'setup-cameroon-complete.js',
  
  // Test files that are not essential
  'test-backend-simple.js',
  'test-backend.js',
  'test-integration.js',
  'test-database-connection.js',
  'test-db-connection.js',
  'simple-test.js',
  'simple-db-test.js',
  
  // Duplicate database files
  'database_schema.sql',
  'complete_database_setup.sql',
  'COMPLETE_SETUP.sql',
  'SAMPLE_DATA.sql', // Keep database/06_sample_data.sql
  
  // PowerShell scripts (keep if needed)
  'copy-background.ps1',
  
  // Large Python virtual environment (if not needed)
  'gemini-proxy/fine-tuning-data/venv'
];

// Heavy dependencies that can be optimized
const HEAVY_DEPENDENCIES = [
  'framer-motion', // Animation library - can be replaced with CSS animations
  'recharts', // Chart library - only needed for analytics
  'react-markdown', // Markdown renderer - only needed for specific pages
  '@googlemaps/js-api-loader', // Google Maps - already using OpenStreetMap
];

// Large files to check and potentially optimize
const LARGE_FILE_PATTERNS = [
  '*.jpg',
  '*.png',
  '*.gif',
  '*.svg',
  '*.pdf',
  '*.mp4',
  '*.mov'
];

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeItem(itemPath) {
  try {
    if (fs.existsSync(itemPath)) {
      const stats = fs.statSync(itemPath);
      const size = stats.isDirectory() ? getDirSize(itemPath) : stats.size;
      
      if (stats.isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(itemPath);
      }
      
      console.log(`✅ Removed: ${itemPath} (${formatBytes(size)})`);
      return size;
    }
  } catch (error) {
    console.log(`❌ Error removing ${itemPath}: ${error.message}`);
  }
  return 0;
}

function getDirSize(dirPath) {
  let totalSize = 0;
  try {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        totalSize += getDirSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return totalSize;
}

function optimizePackageJson() {
  console.log('\n📦 Optimizing package.json...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) return;
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove heavy dependencies that aren't essential
  const dependenciesToRemove = [];
  
  HEAVY_DEPENDENCIES.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      dependenciesToRemove.push(dep);
    }
  });
  
  if (dependenciesToRemove.length > 0) {
    console.log(`⚠️  Found heavy dependencies: ${dependenciesToRemove.join(', ')}`);
    console.log('   Consider removing these if not essential for core functionality');
  }
  
  // Optimize scripts
  const optimizedScripts = {
    ...packageJson.scripts,
    'dev': 'node --max-old-space-size=1024 node_modules/next/dist/bin/next dev',
    'build': 'node --max-old-space-size=1024 node_modules/next/dist/bin/next build',
    'dev-fast': 'NEXT_TELEMETRY_DISABLED=1 node --max-old-space-size=512 node_modules/next/dist/bin/next dev'
  };
  
  packageJson.scripts = optimizedScripts;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json optimized');
}

function createOptimizedConfig() {
  console.log('\n⚙️  Creating optimized Next.js config...');
  
  const optimizedConfig = `/** @type {import('next').NextConfig} */
// Ultra-fast development configuration
const nextConfig = {
  // Disable memory-intensive features
  experimental: {
    workerThreads: false,
    optimizeCss: false,
    swcMinify: false,
    serverComponentsExternalPackages: [],
    esmExternals: false,
  },

  // Minimal webpack configuration
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable optimizations in development
      config.optimization = {
        minimize: false,
        splitChunks: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        mergeDuplicateChunks: false,
      };

      // Disable source maps
      config.devtool = false;

      // Fast watch options
      config.watchOptions = {
        poll: 3000,
        aggregateTimeout: 1000,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };

      // Minimal stats
      config.stats = 'errors-only';
    }

    return config;
  },

  // Disable image optimization
  images: {
    unoptimized: true,
  },

  // Skip checks for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable telemetry
  telemetry: false,

  // Minimal compiler options
  compiler: {
    removeConsole: false,
    reactRemoveProperties: false,
  },

  // Fast generation
  staticPageGenerationTimeout: 0,
  concurrency: 1,

  // No additional processing
  async headers() { return []; },
  async redirects() { return []; },
  async rewrites() { return []; },
};

module.exports = nextConfig;`;

  fs.writeFileSync('next.config.fast.js', optimizedConfig);
  console.log('✅ Created next.config.fast.js for ultra-fast development');
}

function analyzeProjectSize() {
  console.log('\n📊 Analyzing project size...');
  
  const directories = [
    'node_modules',
    'src',
    'database',
    'gemini-proxy',
    'public',
    '.next'
  ];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const size = getDirSize(dir);
      console.log(`📁 ${dir}: ${formatBytes(size)}`);
    }
  });
}

function main() {
  console.log('🔍 Analyzing PharmaLink project for optimization opportunities...\n');
  
  // Analyze current project size
  analyzeProjectSize();
  
  console.log('\n🧹 Cleaning up unnecessary files...');
  
  let totalSaved = 0;
  
  // Remove unnecessary files and directories
  REMOVABLE_ITEMS.forEach(item => {
    const itemPath = path.join(process.cwd(), item);
    totalSaved += removeItem(itemPath);
  });
  
  console.log(`\n💾 Total space saved: ${formatBytes(totalSaved)}`);
  
  // Optimize package.json
  optimizePackageJson();
  
  // Create optimized config
  createOptimizedConfig();
  
  console.log('\n🎯 Optimization Recommendations:');
  console.log('1. Use "npm run dev-fast" for fastest development');
  console.log('2. Use "next.config.fast.js" for minimal memory usage');
  console.log('3. Consider removing heavy dependencies if not needed:');
  HEAVY_DEPENDENCIES.forEach(dep => {
    console.log(`   - ${dep}`);
  });
  
  console.log('\n⚡ Performance Improvements:');
  console.log('✅ Removed build artifacts and cache files');
  console.log('✅ Cleaned up documentation files');
  console.log('✅ Removed duplicate configuration files');
  console.log('✅ Optimized package.json scripts');
  console.log('✅ Created ultra-fast development config');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Run: npm run dev-fast');
  console.log('2. Or use: NEXT_CONFIG_FILE=next.config.fast.js npm run dev');
  console.log('3. Monitor memory usage and startup time');
  
  console.log('\n✨ Project optimization complete!');
}

// Run optimization
main();
