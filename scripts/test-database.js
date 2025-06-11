#!/usr/bin/env node

// Simple database test and setup script
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), 'phamarlink', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  for (const line of envLines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  }
  console.log('✅ Loaded environment variables from .env.local');
} else {
  console.log('⚠️  .env.local not found, using default values');
}

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pharmacy_platform',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: false
};

console.log('🔍 Testing Database Connection...');
console.log('Configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: '***' // Hide password in logs
});

async function testDatabase() {
  const pool = new Pool(dbConfig);
  
  try {
    // Test basic connection
    console.log('📡 Testing connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    console.log('🔍 Testing query...');
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Query successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0]);
    
    // Check if tables exist
    console.log('📋 Checking existing tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    console.log('Existing tables:', existingTables.length > 0 ? existingTables : 'None');
    
    // Create basic tables if they don't exist
    if (existingTables.length === 0) {
      console.log('🔧 Creating basic tables...');
      
      // Create users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          user_type VARCHAR(50) DEFAULT 'patient',
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create pharmacies table
      await client.query(`
        CREATE TABLE IF NOT EXISTS pharmacies (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          phone VARCHAR(50),
          rating DECIMAL(3,2) DEFAULT 0.00,
          latitude DECIMAL(10,8),
          longitude DECIMAL(11,8),
          is_open_now BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create medications table
      await client.query(`
        CREATE TABLE IF NOT EXISTS medications (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          price DECIMAL(10,2),
          in_stock BOOLEAN DEFAULT true,
          quantity INTEGER DEFAULT 0,
          pharmacy_id INTEGER REFERENCES pharmacies(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('✅ Basic tables created successfully!');
      
      // Insert sample data
      console.log('📝 Inserting sample data...');
      
      // Insert sample pharmacy
      const pharmacyResult = await client.query(`
        INSERT INTO pharmacies (name, address, phone, rating, latitude, longitude, is_open_now)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'PHARMACIE FRANCAISE',
        '178, avenue Ahmadou AHIDJO, Yaoundé Centre ville',
        '+237 2 22 22 14 76',
        4.7,
        3.8480,
        11.5021,
        true
      ]);
      
      const pharmacyId = pharmacyResult.rows[0].id;
      
      // Insert sample medications
      const medications = [
        ['Paracetamol', 'Pain Relief', 500, true, 50],
        ['Amoxicillin', 'Antibiotics', 2500, true, 30],
        ['Ibuprofen', 'Pain Relief', 750, true, 25],
        ['Omeprazole', 'Gastrointestinal', 2200, true, 20]
      ];
      
      for (const [name, category, price, inStock, quantity] of medications) {
        await client.query(`
          INSERT INTO medications (name, category, price, in_stock, quantity, pharmacy_id)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [name, category, price, inStock, quantity, pharmacyId]);
      }
      
      console.log('✅ Sample data inserted successfully!');
    }
    
    // Test final query
    console.log('🧪 Testing final query...');
    const finalTest = await client.query(`
      SELECT 
        p.name as pharmacy_name,
        COUNT(m.id) as medication_count
      FROM pharmacies p
      LEFT JOIN medications m ON p.id = m.pharmacy_id
      GROUP BY p.id, p.name
      LIMIT 5
    `);
    
    console.log('✅ Final test successful!');
    console.log('Sample data:', finalTest.rows);
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('Your database is ready for the PharmaLink application.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the test
testDatabase().catch(console.error);
