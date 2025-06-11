#!/usr/bin/env node

// Production setup script for PharmaLink
// This script prepares the application for production deployment

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 PharmaLink Production Setup');
console.log('================================');

// Environment configuration
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NOTCHPAY_PUBLIC_KEY',
  'NOTCHPAY_SECRET_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const OPTIONAL_ENV_VARS = [
  'REDIS_URL',
  'SENTRY_DSN',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS'
];

// Check environment variables
function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const missing = [];
  const warnings = [];
  
  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    } else {
      console.log(`  ✅ ${envVar}: Set`);
    }
  }
  
  // Check optional variables
  for (const envVar of OPTIONAL_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    } else {
      console.log(`  ✅ ${envVar}: Set`);
    }
  }
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please set these variables before running in production.');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.warn(`⚠️  Optional environment variables not set: ${warnings.join(', ')}`);
    console.warn('Some features may not work without these variables.');
  }
  
  console.log('✅ Environment variables check passed');
}

// Test database connection
async function testDatabaseConnection() {
  console.log('🗄️  Testing database connection...');
  
  try {
    const Database = await import('../lib/database.js');
    const result = await Database.default.query('SELECT NOW() as current_time');
    console.log(`✅ Database connected successfully at ${result.rows[0].current_time}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Run database migrations
async function runMigrations() {
  console.log('📋 Running database migrations...');
  
  try {
    const migrateScript = await import('./migrate-pharmacy-data.js');
    await migrateScript.default();
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Test API endpoints
async function testApiEndpoints() {
  console.log('🔌 Testing API endpoints...');
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
  const endpoints = [
    '/api/health',
    '/api/pharmacies',
    '/api/medications'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (response.ok) {
        console.log(`  ✅ ${endpoint}: OK`);
      } else {
        console.warn(`  ⚠️  ${endpoint}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`  ❌ ${endpoint}: ${error.message}`);
    }
  }
}

// Create production configuration files
function createProductionConfig() {
  console.log('⚙️  Creating production configuration...');
  
  // Create next.config.js for production
  const nextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin_panel/admin_dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
`;
  
  fs.writeFileSync('next.config.js', nextConfig);
  console.log('  ✅ next.config.js created');
  
  // Create Docker configuration
  const dockerfile = `
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
`;
  
  fs.writeFileSync('Dockerfile', dockerfile);
  console.log('  ✅ Dockerfile created');
  
  // Create docker-compose.yml
  const dockerCompose = `
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
      - NOTCHPAY_PUBLIC_KEY=\${NOTCHPAY_PUBLIC_KEY}
      - NOTCHPAY_SECRET_KEY=\${NOTCHPAY_SECRET_KEY}
      - NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=\${NEXTAUTH_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=pharmalink
      - POSTGRES_USER=pharmalink
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
`;
  
  fs.writeFileSync('docker-compose.yml', dockerCompose);
  console.log('  ✅ docker-compose.yml created');
}

// Create health check endpoint
function createHealthCheck() {
  console.log('🏥 Creating health check endpoint...');
  
  const healthCheckCode = `
// Health check API endpoint
import { NextResponse } from 'next/server';
import Database from '../../../lib/database.js';

export async function GET() {
  try {
    // Check database connection
    const dbResult = await Database.query('SELECT NOW() as current_time');
    
    // Check environment
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NOTCHPAY_PUBLIC_KEY'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        timestamp: dbResult.rows[0].current_time
      },
      environment_variables: {
        missing: missingEnvVars,
        status: missingEnvVars.length === 0 ? 'ok' : 'warning'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
    
    return NextResponse.json(healthStatus);
    
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      { status: 500 }
    );
  }
}
`;
  
  // Ensure the directory exists
  const healthDir = 'src/app/api/health';
  if (!fs.existsSync(healthDir)) {
    fs.mkdirSync(healthDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(healthDir, 'route.js'), healthCheckCode);
  console.log('  ✅ Health check endpoint created');
}

// Main setup function
async function setupProduction() {
  try {
    console.log('Starting production setup...\n');
    
    // Step 1: Check environment variables
    checkEnvironmentVariables();
    console.log('');
    
    // Step 2: Test database connection
    await testDatabaseConnection();
    console.log('');
    
    // Step 3: Run migrations
    await runMigrations();
    console.log('');
    
    // Step 4: Create production configuration
    createProductionConfig();
    console.log('');
    
    // Step 5: Create health check
    createHealthCheck();
    console.log('');
    
    // Step 6: Test API endpoints (if server is running)
    if (process.env.NEXTAUTH_URL) {
      await testApiEndpoints();
      console.log('');
    }
    
    console.log('🎉 Production setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Review the generated configuration files');
    console.log('2. Set up SSL certificates for HTTPS');
    console.log('3. Configure your reverse proxy (nginx)');
    console.log('4. Set up monitoring and logging');
    console.log('5. Run: npm run build && npm start');
    console.log('');
    console.log('For Docker deployment:');
    console.log('1. docker-compose up -d');
    console.log('2. Monitor logs: docker-compose logs -f');
    
  } catch (error) {
    console.error('❌ Production setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  setupProduction();
}

export default setupProduction;
