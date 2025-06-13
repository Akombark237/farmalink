// src/app/api/admin/database/route.js
// Database viewer API for real-time monitoring

import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') || 'overview';
    const limit = parseInt(searchParams.get('limit')) || 10;

    let result = {};

    if (table === 'overview') {
      // Get overview of all tables
      const tables = [
        'users',
        'patient_profiles', 
        'pharmacy_profiles',
        'medications',
        'medication_categories',
        'pharmacy_inventory',
        'pharmacy_hours',
        'pharmacy_services',
        'pharmacy_staff'
      ];

      const counts = await Promise.all(
        tables.map(async (tableName) => {
          try {
            const countResult = await Database.query(`SELECT COUNT(*) as count FROM ${tableName}`);
            return {
              table: tableName,
              count: parseInt(countResult.rows[0].count),
              status: 'success'
            };
          } catch (error) {
            return {
              table: tableName,
              count: 0,
              status: 'error',
              error: error.message
            };
          }
        })
      );

      // Get recent activity
      const recentUsers = await Database.query(`
        SELECT email, user_type, status, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
      `);

      result = {
        tableCounts: counts,
        recentUsers: recentUsers.rows,
        timestamp: new Date().toISOString()
      };

    } else if (table === 'users') {
      const users = await Database.query(`
        SELECT 
          u.id,
          u.email,
          u.user_type,
          u.status,
          u.email_verified,
          u.created_at,
          u.last_login,
          pp.first_name,
          pp.last_name,
          ph.name as pharmacy_name
        FROM users u
        LEFT JOIN patient_profiles pp ON u.id = pp.user_id
        LEFT JOIN pharmacy_profiles ph ON u.id = ph.user_id
        ORDER BY u.created_at DESC
        LIMIT $1
      `, [limit]);

      result = {
        table: 'users',
        data: users.rows,
        total: users.rows.length
      };

    } else if (table === 'medications') {
      const medications = await Database.query(`
        SELECT 
          m.id,
          m.name,
          m.generic_name,
          m.manufacturer,
          m.requires_prescription,
          m.status,
          mc.name as category,
          COUNT(pi.id) as pharmacy_count,
          MIN(pi.unit_price) as min_price,
          MAX(pi.unit_price) as max_price
        FROM medications m
        LEFT JOIN medication_categories mc ON m.category_id = mc.id
        LEFT JOIN pharmacy_inventory pi ON m.id = pi.medication_id AND pi.is_available = true
        GROUP BY m.id, mc.name
        ORDER BY m.name
        LIMIT $1
      `, [limit]);

      result = {
        table: 'medications',
        data: medications.rows,
        total: medications.rows.length
      };

    } else if (table === 'pharmacies') {
      const pharmacies = await Database.query(`
        SELECT 
          pp.id,
          pp.name,
          pp.address,
          pp.city,
          pp.state,
          pp.phone,
          pp.status,
          pp.rating,
          pp.total_reviews,
          pp.created_at,
          COUNT(pi.id) as medication_count,
          COUNT(ps.id) as service_count
        FROM pharmacy_profiles pp
        LEFT JOIN pharmacy_inventory pi ON pp.id = pi.pharmacy_id AND pi.is_available = true
        LEFT JOIN pharmacy_services ps ON pp.id = ps.pharmacy_id AND ps.is_active = true
        GROUP BY pp.id
        ORDER BY pp.created_at DESC
        LIMIT $1
      `, [limit]);

      result = {
        table: 'pharmacies',
        data: pharmacies.rows,
        total: pharmacies.rows.length
      };

    } else if (table === 'inventory') {
      const inventory = await Database.query(`
        SELECT 
          pi.id,
          pp.name as pharmacy_name,
          m.name as medication_name,
          pi.current_stock,
          pi.minimum_stock,
          pi.unit_price,
          pi.is_available,
          pi.expiry_date,
          pi.last_restocked
        FROM pharmacy_inventory pi
        JOIN pharmacy_profiles pp ON pi.pharmacy_id = pp.id
        JOIN medications m ON pi.medication_id = m.id
        ORDER BY pi.last_restocked DESC NULLS LAST
        LIMIT $1
      `, [limit]);

      result = {
        table: 'inventory',
        data: inventory.rows,
        total: inventory.rows.length
      };

    } else if (table === 'activity') {
      // Get recent database activity
      const activity = await Database.query(`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_tup_hot_upd as hot_updates,
          last_vacuum,
          last_analyze
        FROM pg_stat_user_tables
        ORDER BY (n_tup_ins + n_tup_upd + n_tup_del) DESC
      `);

      result = {
        table: 'activity',
        data: activity.rows,
        total: activity.rows.length
      };

    } else {
      return NextResponse.json(
        { error: 'Invalid table parameter' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database viewer error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database query failed',
      details: error.message
    }, { status: 500 });
  }
}
