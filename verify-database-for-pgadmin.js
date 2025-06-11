// Verify database is ready for pgAdmin4 connection
const { Pool } = require('pg');

async function verifyDatabase() {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pharmacy_platform',
    password: 'Joshua',
    port: 5432,
  });

  try {
    console.log('🔍 Verifying database for pgAdmin4 connection...\n');

    // Test basic connection
    console.log('1. Testing connection...');
    const versionResult = await pool.query('SELECT version()');
    console.log('✅ PostgreSQL Version:', versionResult.rows[0].version.split(',')[0]);

    // Check database exists
    console.log('\n2. Checking database...');
    const dbResult = await pool.query("SELECT datname FROM pg_database WHERE datname = 'pharmacy_platform'");
    if (dbResult.rows.length > 0) {
      console.log('✅ Database "pharmacy_platform" exists');
    } else {
      console.log('❌ Database "pharmacy_platform" not found');
      return;
    }

    // List all tables
    console.log('\n3. Checking tables...');
    const tablesResult = await pool.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`✅ Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name} (${row.column_count} columns)`);
    });

    // Check sample data
    console.log('\n4. Checking sample data...');
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const medicationCount = await pool.query('SELECT COUNT(*) FROM medications');
    const pharmacyCount = await pool.query('SELECT COUNT(*) FROM pharmacy_profiles');
    const patientCount = await pool.query('SELECT COUNT(*) FROM patient_profiles');

    console.log('✅ Data counts:');
    console.log(`   - Users: ${userCount.rows[0].count}`);
    console.log(`   - Medications: ${medicationCount.rows[0].count}`);
    console.log(`   - Pharmacies: ${pharmacyCount.rows[0].count}`);
    console.log(`   - Patients: ${patientCount.rows[0].count}`);

    // Check indexes
    console.log('\n5. Checking indexes...');
    const indexResult = await pool.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);

    console.log(`✅ Found ${indexResult.rows.length} indexes:`);
    indexResult.rows.forEach(row => {
      console.log(`   - ${row.indexname} on ${row.tablename}`);
    });

    // Test a sample query
    console.log('\n6. Testing sample query...');
    const sampleResult = await pool.query(`
      SELECT u.email, u.user_type, u.status, u.created_at
      FROM users u
      ORDER BY u.created_at DESC
      LIMIT 3
    `);

    console.log('✅ Sample users:');
    sampleResult.rows.forEach(row => {
      console.log(`   - ${row.email} (${row.user_type}) - ${row.status}`);
    });

    console.log('\n🎉 Database verification complete!');
    console.log('\n📋 pgAdmin4 Connection Details:');
    console.log('   Host: localhost');
    console.log('   Port: 5432');
    console.log('   Database: pharmacy_platform');
    console.log('   Username: postgres');
    console.log('   Password: Joshua');
    console.log('\n✅ Ready for pgAdmin4 connection!');

  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check if PostgreSQL is running: Get-Service -Name "*postgresql*"');
    console.error('2. Verify password is correct');
    console.error('3. Ensure database was created properly');
  } finally {
    await pool.end();
  }
}

verifyDatabase();
