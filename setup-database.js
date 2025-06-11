// Database setup script
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pharmacy_platform',
    password: 'Joshua',
    port: 5432,
  });

  try {
    console.log('Setting up database schema...');

    // Execute schema files in order
    const schemaFiles = [
      'database/01_schema_users.sql',
      'database/02_schema_pharmacy.sql',
      'database/03_schema_medications.sql',
      'database/04_schema_orders.sql',
      'database/05_schema_prescriptions_reviews.sql',
      'database/06_sample_data.sql'
    ];

    for (const file of schemaFiles) {
      if (fs.existsSync(file)) {
        console.log(`Executing ${file}...`);
        const sql = fs.readFileSync(file, 'utf8');
        await pool.query(sql);
        console.log(`✅ ${file} completed`);
      } else {
        console.log(`⚠️  ${file} not found, skipping`);
      }
    }

    console.log('\n🎉 Database setup completed successfully!');

    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log(`\n📊 Created ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase().catch(console.error);
