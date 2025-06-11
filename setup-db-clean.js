// Clean database setup script
const { Pool } = require('pg');

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

    // First, enable UUID extension
    console.log('Enabling UUID extension...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('✅ UUID extension enabled');

    // Create user types
    console.log('Creating user types...');
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_type AS ENUM ('patient', 'pharmacy', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ User types created');

    // Create users table
    console.log('Creating users table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        user_type user_type NOT NULL,
        status user_status DEFAULT 'pending',
        email_verified BOOLEAN DEFAULT FALSE,
        email_verification_token VARCHAR(255),
        phone VARCHAR(20),
        phone_verified BOOLEAN DEFAULT FALSE,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_secret VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP WITH TIME ZONE,
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP WITH TIME ZONE
      );
    `);
    console.log('✅ Users table created');

    // Create basic tables for testing
    console.log('Creating basic tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patient_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE,
        gender VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS medications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        generic_name VARCHAR(255),
        brand_name VARCHAR(255),
        description TEXT,
        dosage_form VARCHAR(100),
        strength VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pharmacy_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        license_number VARCHAR(100),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        phone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Basic tables created');

    // Create indexes
    console.log('Creating indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);');
    console.log('✅ Indexes created');

    // Insert sample data
    console.log('Inserting sample data...');
    
    // Check if sample data already exists
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO users (email, password_hash, user_type, status, email_verified)
        VALUES 
        ('admin@pharmacy.com', '$2b$10$example_hash', 'admin', 'active', true),
        ('patient@example.com', '$2b$10$example_hash', 'patient', 'active', true),
        ('pharmacy@example.com', '$2b$10$example_hash', 'pharmacy', 'active', true)
      `);
      console.log('✅ Sample users created');
    } else {
      console.log('✅ Sample data already exists');
    }

    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`\n📊 Created ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase().catch(console.error);
