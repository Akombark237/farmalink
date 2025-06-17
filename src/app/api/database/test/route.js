// Database Connection Test API
// Next.js 13+ App Router API Route

import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database';

export async function GET() {
  try {
    // Test database connection
    const connectionTest = await Database.testConnection();
    
    if (connectionTest.success) {
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        data: connectionTest.data,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionTest.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error.message
    }, { status: 500 });
  }
}
