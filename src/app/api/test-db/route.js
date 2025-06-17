// src/app/api/test-db/route.js
// Test database connection and table existence

import { NextResponse } from 'next/server';
import Database from '../../../../lib/database.js';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const connectionTest = await Database.testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionTest.error
      }, { status: 500 });
    }

    // Check if tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    const tablesResult = await Database.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.table_name);

    // Check specific tables we need
    const requiredTables = ['medications', 'pharmacy_profiles', 'medication_categories'];
    const missingTables = requiredTables.filter(table => !tables.includes(table));

    return NextResponse.json({
      success: true,
      connection: connectionTest.data,
      tables: {
        all: tables,
        required: requiredTables,
        missing: missingTables,
        hasAllRequired: missingTables.length === 0
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error.message
    }, { status: 500 });
  }
}
