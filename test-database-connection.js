// Database Connection Test Script
// Tests PostgreSQL connection with different configurations

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Common PostgreSQL passwords to test
const commonPasswords = [
  'Joshua',      // Current configured password
  'postgres',    // Default PostgreSQL password
  'password',    // Common password
  'admin',       // Common admin password
  '123456',      // Simple password
  '',            // Empty password
  'root',        // Root password
  'pgadmin',     // PgAdmin password
];

// Database configurations to test
const dbConfigs = [
  {
    host: 'localhost',
    port: 5432,
    database: 'pharmacy_platform',
    user: 'postgres'
  },
  {
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Default database
    user: 'postgres'
  },
  {
    host: '127.0.0.1',
    port: 5432,
    database: 'pharmacy_platform',
    user: 'postgres'
  }
];

async function testConnection(config, password) {
  const pool = new Pool({
    ...config,
    password: password,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 1000,
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version(), current_database(), current_user');
    client.release();
    await pool.end();
    
    return {
      success: true,
      data: result.rows[0],
      config: { ...config, password }
    };
  } catch (error) {
    await pool.end();
    return {
      success: false,
      error: error.message,
      config: { ...config, password }
    };
  }
}

async function checkPostgreSQLService() {
  console.log('🔍 Checking PostgreSQL service status...\n');
  
  try {
    // Try to connect to any PostgreSQL instance
    for (const config of dbConfigs) {
      console.log(`Testing connection to ${config.host}:${config.port}/${config.database}...`);
      
      for (const password of commonPasswords) {
        const result = await testConnection(config, password);
        
        if (result.success) {
          console.log(`✅ SUCCESS! Connected with password: "${password}"`);
          console.log(`   Database: ${result.data.current_database}`);
          console.log(`   User: ${result.data.current_user}`);
          console.log(`   Version: ${result.data.version.split(' ').slice(0, 2).join(' ')}\n`);
          
          return {
            success: true,
            workingConfig: result.config,
            dbInfo: result.data
          };
        } else {
          console.log(`❌ Failed with password "${password}": ${result.error}`);
        }
      }
      console.log('');
    }
    
    return {
      success: false,
      error: 'No working configuration found'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function updateEnvironmentFile(workingConfig) {
  const envContent = `# Database Configuration for Pharmacy Platform
# Updated automatically by test-database-connection.js

# Database Configuration
DB_HOST=${workingConfig.host}
DB_PORT=${workingConfig.port}
DB_NAME=${workingConfig.database}
DB_USER=${workingConfig.user}
DB_PASSWORD=${workingConfig.password}

# JWT Configuration
JWT_SECRET=pharmacy-platform-jwt-secret-key-2024-super-secure-random-string
NEXTAUTH_SECRET=pharmacy-platform-nextauth-secret-2024-another-secure-string

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000

# Application Settings
NODE_ENV=development

# Gemini Backend Configuration
GEMINI_BACKEND_URL=http://localhost:3001

# OpenStreetMap Configuration
NEXT_PUBLIC_MAP_PROVIDER=openstreetmap

# Memory Optimization Settings
NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=128"
NEXT_TELEMETRY_DISABLED=1
DISABLE_ESLINT_PLUGIN=true

# Development optimizations
FAST_REFRESH=true
NEXT_PRIVATE_STANDALONE=true

# NotchPay Configuration
NOTCHPAY_PUBLIC_KEY=your_notchpay_public_key_here
NOTCHPAY_SECRET_KEY=your_notchpay_secret_key_here
NOTCHPAY_WEBHOOK_SECRET=your_notchpay_webhook_secret_here
NOTCHPAY_ENVIRONMENT=sandbox
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`;

  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Updated .env.local with working database configuration');
    return true;
  } catch (error) {
    console.error('❌ Failed to update .env.local:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 PharmaLink Database Connection Test\n');
  console.log('This script will test various PostgreSQL configurations to find a working connection.\n');
  
  const result = await checkPostgreSQLService();
  
  if (result.success) {
    console.log('🎉 Database connection successful!');
    console.log('\n📋 Working Configuration:');
    console.log(`   Host: ${result.workingConfig.host}`);
    console.log(`   Port: ${result.workingConfig.port}`);
    console.log(`   Database: ${result.workingConfig.database}`);
    console.log(`   User: ${result.workingConfig.user}`);
    console.log(`   Password: ${result.workingConfig.password}`);
    
    // Update environment file
    await updateEnvironmentFile(result.workingConfig);
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Test API: http://localhost:3000/api/database/test');
    console.log('3. Open PgAdmin 4 to manage your database');
    
  } else {
    console.log('❌ No working database configuration found.');
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Install PostgreSQL: https://www.postgresql.org/download/');
    console.log('2. Start PostgreSQL service');
    console.log('3. Create database: createdb pharmacy_platform');
    console.log('4. Set password: ALTER USER postgres PASSWORD \'your_password\';');
    console.log('5. Install PgAdmin 4 for database management');
  }
}

// Run the test
main().catch(console.error);
