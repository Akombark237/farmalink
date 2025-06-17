// final-db-setup.js
// Final comprehensive database setup for PharmaLink

const { Pool } = require('pg');
const fs = require('fs');

async function setupPharmaLinkDatabase() {
  console.log('🚀 Setting up PharmaLink Database...\n');

  // Step 1: Connect to default postgres database
  console.log('Step 1: Connecting to PostgreSQL...');
  const defaultPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Joshua',
    port: 5432,
  });

  try {
    // Test connection
    const versionResult = await defaultPool.query('SELECT version()');
    console.log('✅ PostgreSQL connected successfully');
    console.log('Version:', versionResult.rows[0].version.split(' ').slice(0, 2).join(' '));

    // Step 2: Check/Create pharmacy_platform database
    console.log('\nStep 2: Setting up pharmacy_platform database...');
    const dbExists = await defaultPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'pharmacy_platform'"
    );

    if (dbExists.rows.length === 0) {
      console.log('Creating pharmacy_platform database...');
      await defaultPool.query('CREATE DATABASE pharmacy_platform');
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database already exists');
    }

    await defaultPool.end();

    // Step 3: Connect to pharmacy_platform and setup schema
    console.log('\nStep 3: Setting up database schema...');
    const pharmacyPool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'pharmacy_platform',
      password: 'Joshua',
      port: 5432,
    });

    // Check existing tables
    const existingTables = await pharmacyPool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);

    console.log(`Found ${existingTables.rows.length} existing tables`);

    if (existingTables.rows.length === 0) {
      console.log('Setting up database schema...');
      
      // Execute schema files in order
      const schemaFiles = [
        'database/01_schema_users.sql',
        'database/02_schema_pharmacy.sql',
        'database/03_schema_medications.sql',
        'database/04_schema_orders.sql',
        'database/05_schema_prescriptions_reviews.sql'
      ];

      for (const file of schemaFiles) {
        if (fs.existsSync(file)) {
          console.log(`Executing ${file}...`);
          const sql = fs.readFileSync(file, 'utf8');
          await pharmacyPool.query(sql);
          console.log(`✅ ${file} completed`);
        } else {
          console.log(`⚠️  ${file} not found, skipping`);
        }
      }

      // Load sample data
      if (fs.existsSync('database/06_sample_data.sql')) {
        console.log('Loading sample data...');
        const sampleData = fs.readFileSync('database/06_sample_data.sql', 'utf8');
        await pharmacyPool.query(sampleData);
        console.log('✅ Sample data loaded');
      }
    } else {
      console.log('Schema already exists, skipping setup');
    }

    // Step 4: Verify setup
    console.log('\nStep 4: Verifying database setup...');
    const finalTables = await pharmacyPool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);

    console.log('Database tables:');
    finalTables.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    // Test some basic queries
    try {
      const userCount = await pharmacyPool.query('SELECT COUNT(*) as count FROM users');
      console.log(`\nData verification:`);
      console.log(`  Users: ${userCount.rows[0].count} records`);
    } catch (e) {
      console.log('  Users table: Not accessible or empty');
    }

    try {
      const pharmacyCount = await pharmacyPool.query('SELECT COUNT(*) as count FROM pharmacy_profiles');
      console.log(`  Pharmacies: ${pharmacyCount.rows[0].count} records`);
    } catch (e) {
      console.log('  Pharmacy profiles: Not accessible or empty');
    }

    try {
      const medicationCount = await pharmacyPool.query('SELECT COUNT(*) as count FROM medications');
      console.log(`  Medications: ${medicationCount.rows[0].count} records`);
    } catch (e) {
      console.log('  Medications: Not accessible or empty');
    }

    await pharmacyPool.end();

    // Step 5: Update environment configuration
    console.log('\nStep 5: Updating environment configuration...');
    const envContent = `# Database Configuration for Pharmacy Platform
# Updated by final-db-setup.js

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_platform
DB_USER=postgres
DB_PASSWORD=Joshua

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
    console.log('✅ Environment configuration updated');

    console.log('\n🎉 PharmaLink Database Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:3000');
    console.log('3. Your database is ready with the following credentials:');
    console.log('   - Host: localhost');
    console.log('   - Port: 5432');
    console.log('   - Database: pharmacy_platform');
    console.log('   - User: postgres');
    console.log('   - Password: Joshua');

  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Verify the password "Joshua" is correct');
    console.log('3. Check if port 5432 is available');
  }
}

// Run the setup
setupPharmaLinkDatabase();
