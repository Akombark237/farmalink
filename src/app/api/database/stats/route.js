// Database Statistics API
// Next.js 13+ App Router API Route

import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database';

export async function GET() {
  try {
    // Get database statistics
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM information_schema.tables 
         WHERE table_schema = 'public' AND table_type = 'BASE TABLE') as total_tables,
        (SELECT SUM(n_tup_ins) FROM pg_stat_user_tables) as total_rows,
        pg_size_pretty(pg_database_size(current_database())) as database_size;
    `;
    
    const result = await Database.query(statsQuery);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch database statistics' },
      { status: 500 }
    );
  }
}
