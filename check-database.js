// check-database.js
// Script to check if pharmacy_platform database exists and create it if needed

import { Pool } from 'pg';

async function checkAndCreateDatabase() {
  // First connect to default postgres database
  const defaultPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Joshua',
    port: 5432,
  });

  try {
    // Check if pharmacy_platform database exists
    const result = await defaultPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'pharmacy_platform'"
    );

    if (result.rows.length === 0) {
      console.log('Creating pharmacy_platform database...');
      await defaultPool.query('CREATE DATABASE pharmacy_platform');
      console.log('✅ Database pharmacy_platform created successfully');
    } else {
      console.log('✅ Database pharmacy_platform already exists');
    }

    await defaultPool.end();

    // Now connect to pharmacy_platform database to check tables
    const pharmacyPool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'pharmacy_platform',
      password: 'Joshua',
      port: 5432,
    });

    const tablesResult = await pharmacyPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log(`\n📊 Found ${tablesResult.rows.length} tables in pharmacy_platform:`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    if (tablesResult.rows.length === 0) {
      console.log('\n⚠️  No tables found. You may need to run database migrations.');
      console.log('Run: npm run db:migrate or node scripts/setup-db.js');
    }

    await pharmacyPool.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    await defaultPool.end();
  }
}

checkAndCreateDatabase().catch(console.error);
