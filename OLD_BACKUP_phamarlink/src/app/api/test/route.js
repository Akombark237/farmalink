// src/app/api/test/route.js
// Database connection test endpoint

import { NextResponse } from 'next/server';
import Database from '../../../../lib/database';

export async function GET() {
  try {
    // Test basic connection
    const result = await Database.query('SELECT NOW() as current_time, version() as postgres_version');
    
    // Test table existence
    const tablesResult = await Database.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    // Test sample data
    const usersCount = await Database.query('SELECT COUNT(*) as count FROM users');
    const medicationsCount = await Database.query('SELECT COUNT(*) as count FROM medications');
    const pharmaciesCount = await Database.query('SELECT COUNT(*) as count FROM pharmacy_profiles');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        currentTime: result.rows[0].current_time,
        postgresVersion: result.rows[0].postgres_version,
        tables: tablesResult.rows.map(row => row.table_name),
        counts: {
          users: parseInt(usersCount.rows[0].count),
          medications: parseInt(medicationsCount.rows[0].count),
          pharmacies: parseInt(pharmaciesCount.rows[0].count)
        }
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error.message
    }, { status: 500 });
  }
}
