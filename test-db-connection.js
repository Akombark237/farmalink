// test-db-connection.js
// Quick script to test database connection with different passwords

import { Pool } from 'pg';

const passwords = ['Joshua', 'postgres', 'password', 'admin', '123456', '', 'root'];

async function testConnection(password) {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Connect to default database first
    password: password,
    port: 5432,
  });

  try {
    const result = await pool.query('SELECT version()');
    console.log(`✅ SUCCESS with password: "${password}"`);
    console.log('PostgreSQL Version:', result.rows[0].version);
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ FAILED with password: "${password}" - ${error.message}`);
    await pool.end();
    return false;
  }
}

async function findPassword() {
  console.log('Testing common PostgreSQL passwords...\n');
  
  for (const password of passwords) {
    const success = await testConnection(password);
    if (success) {
      console.log(`\n🎉 Found working password: "${password}"`);
      console.log(`Update your .env.local file with: DB_PASSWORD=${password}`);
      break;
    }
  }
}

findPassword().catch(console.error);
