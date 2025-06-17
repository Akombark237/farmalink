// database-setup-helper.js
// Comprehensive database connection and setup helper

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Test different connection configurations
const connectionConfigs = [
  {
    name: 'Current Config (Joshua)',
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'pharmacy_platform',
      password: 'Joshua',
      port: 5432,
    }
  },
  {
    name: 'Default postgres database',
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'Joshua',
      port: 5432,
    }
  },
  {
    name: 'Alternative password (postgres)',
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'pharmacy_platform',
      password: 'postgres',
      port: 5432,
    }
  },
  {
    name: 'Alternative password (empty)',
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'pharmacy_platform',
      password: '',
      port: 5432,
    }
  }
];

async function testConnection(config) {
  const pool = new Pool(config);
  try {
    const result = await pool.query('SELECT version(), current_database()');
    await pool.end();
    return {
      success: true,
      data: result.rows[0]
    };
  } catch (error) {
    await pool.end();
    return {
      success: false,
      error: error.message
    };
  }
}

async function checkDatabaseExists(config, dbName) {
  const pool = new Pool({...config, database: 'postgres'});
  try {
    const result = await pool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    await pool.end();
    return result.rows.length > 0;
  } catch (error) {
    await pool.end();
    return false;
  }
}

async function createDatabase(config, dbName) {
  const pool = new Pool({...config, database: 'postgres'});
  try {
    await pool.query(`CREATE DATABASE "${dbName}"`);
    await pool.end();
    return true;
  } catch (error) {
    await pool.end();
    console.log(`Error creating database: ${error.message}`);
    return false;
  }
}

async function runSQLFile(config, filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ SQL file not found: ${filePath}`);
    return false;
  }

  const pool = new Pool(config);
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    await pool.end();
    console.log(`✅ Successfully executed: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    await pool.end();
    console.log(`❌ Error executing ${path.basename(filePath)}: ${error.message}`);
    return false;
  }
}

async function setupDatabase() {
  console.log('🔍 Testing database connections...\n');

  let workingConfig = null;

  // Test each configuration
  for (const {name, config} of connectionConfigs) {
    console.log(`Testing: ${name}`);
    const result = await testConnection(config);
    
    if (result.success) {
      console.log(`✅ SUCCESS!`);
      console.log(`   Database: ${result.data.current_database}`);
      console.log(`   Version: ${result.data.version.split(' ').slice(0, 2).join(' ')}`);
      workingConfig = {name, config};
      break;
    } else {
      console.log(`❌ Failed: ${result.error}`);
    }
    console.log('');
  }

  if (!workingConfig) {
    console.log('❌ No working database connection found!');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure PostgreSQL is installed and running');
    console.log('2. Check PostgreSQL service status');
    console.log('3. Verify the postgres user password');
    console.log('4. Try connecting with pgAdmin to confirm credentials');
    return;
  }

  console.log(`\n🎉 Found working connection: ${workingConfig.name}`);

  // Check if pharmacy_platform database exists
  const dbExists = await checkDatabaseExists(workingConfig.config, 'pharmacy_platform');
  
  if (!dbExists) {
    console.log('\n📦 Creating pharmacy_platform database...');
    const created = await createDatabase(workingConfig.config, 'pharmacy_platform');
    if (!created) {
      console.log('❌ Failed to create database');
      return;
    }
    console.log('✅ Database created successfully');
  } else {
    console.log('\n✅ pharmacy_platform database already exists');
  }

  // Update config to use pharmacy_platform database
  const finalConfig = {...workingConfig.config, database: 'pharmacy_platform'};

  // Test connection to pharmacy_platform
  console.log('\n🔍 Testing connection to pharmacy_platform...');
  const finalTest = await testConnection(finalConfig);
  
  if (!finalTest.success) {
    console.log('❌ Cannot connect to pharmacy_platform database');
    return;
  }

  console.log('✅ Connected to pharmacy_platform successfully');

  // Check if tables exist
  const pool = new Pool(finalConfig);
  try {
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 0) {
      console.log('\n📋 No tables found. Setting up database schema...');
      
      // Run schema files in order
      const schemaFiles = [
        'database/01_schema_users.sql',
        'database/02_schema_pharmacy.sql',
        'database/03_schema_medications.sql',
        'database/04_schema_orders.sql',
        'database/05_schema_prescriptions_reviews.sql',
        'database/06_sample_data.sql'
      ];

      for (const file of schemaFiles) {
        await runSQLFile(finalConfig, file);
      }
    } else {
      console.log('\n📋 Found existing tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    await pool.end();
  } catch (error) {
    await pool.end();
    console.log('❌ Error checking tables:', error.message);
  }

  // Update .env.local with working configuration
  console.log('\n🔧 Updating .env.local with working configuration...');
  const envContent = `# Database Configuration for Pharmacy Platform
# Updated automatically by database-setup-helper.js

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_platform
DB_USER=${finalConfig.user}
DB_PASSWORD=${finalConfig.password}

# JWT Configuration
JWT_SECRET=pharmacy-platform-jwt-secret-key-2024-super-secure-random-string
NEXTAUTH_SECRET=pharmacy-platform-nextauth-secret-2024-another-secure-string

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000

# Application Settings
NODE_ENV=development

# Gemini Backend Configuration
GEMINI_BACKEND_URL=http://localhost:3001
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ .env.local updated successfully');

  console.log('\n🎉 Database setup complete!');
  console.log('You can now run your Next.js application with: npm run dev');
}

// Run the setup
setupDatabase().catch(console.error);
