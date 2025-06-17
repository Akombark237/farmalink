// Database Tables API
// Next.js 13+ App Router API Route

import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database';

export async function GET() {
  try {
    // Get all tables with their column and row counts
    const tablesQuery = `
      SELECT 
        t.table_name,
        COUNT(c.column_name) as column_count,
        COALESCE(s.n_tup_ins, 0) as row_count
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
      LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
      WHERE t.table_schema = 'public' 
        AND t.table_type = 'BASE TABLE'
      GROUP BY t.table_name, s.n_tup_ins
      ORDER BY t.table_name;
    `;
    
    const result = await Database.query(tablesQuery);
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch table information' },
      { status: 500 }
    );
  }
}
