// password-tester.js
// Test different PostgreSQL passwords automatically

import { Pool } from 'pg';
import fs from 'fs';

const passwords = ['postgres', 'password', 'admin', '123456', '', 'password123', 'root'];

async function testPassword(password) {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: password,
    port: 5432,
    connectionTimeoutMillis: 3000,
  });

  try {
    const result = await pool.query('SELECT version()');
    console.log(`✅ SUCCESS with password: "${password}"`);
    await pool.end();
    return password;
  } catch (error) {
    console.log(`❌ FAILED with password: "${password}"`);
    await pool.end();
    return null;
  }
}

async function findWorkingPassword() {
  console.log('🔍 Testing PostgreSQL passwords...\n');
  
  for (const password of passwords) {
    const workingPassword = await testPassword(password);
    if (workingPassword !== null) {
      console.log(`\n🎉 Found working password: "${workingPassword}"`);
      
      // Update .env.local file
      const envContent = `# Database Configuration for Pharmacy Platform
# Copy this to .env.local and update with your actual values

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_platform
DB_USER=postgres
DB_PASSWORD=${workingPassword}

# JWT Configuration
JWT_SECRET=pharmacy-platform-jwt-secret-key-2024-super-secure-random-string
NEXTAUTH_SECRET=pharmacy-platform-nextauth-secret-2024-another-secure-string

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000

# Application Settings
NODE_ENV=development
`;
      
      fs.writeFileSync('.env.local', envContent);
      console.log('✅ Updated .env.local file');
      console.log('�� Now test: http://localhost:3001/api/test');
      return;
    }
  }
  
  console.log('\n❌ No working password found. You may need to reset PostgreSQL password.');
}

findWorkingPassword().catch(console.error);
