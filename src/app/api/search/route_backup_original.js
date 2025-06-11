// src/app/api/search/route.js
// Search API for medications and pharmacies - CORRECTED VERSION

import { NextResponse } from 'next/server';
import Database from '../../../../lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'drugs'; // 'drugs' or 'pharmacies'
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: 'No search query provided'
      });
    }

    let results = [];
    let total = 0;

    if (type === 'drugs') {
      // Search medications - CORRECTED QUERY
      const medicationQuery = `
        SELECT 
          m.id,
          m.name,
          m.generic_name,
          m.description,
          m.requires_prescription,
          COALESCE(m.image_url, '') as image_url,
          mc.name as category,
          COUNT(pi.id) as pharmacy_count,
          MIN(pi.unit_price) as min_price,
          MAX(pi.unit_price) as max_price,
          AVG(pi.unit_price) as avg_price
        FROM medications m
        LEFT JOIN medication_categories mc ON m.category_id = mc.id
        LEFT JOIN pharmacy_inventory pi ON m.id = pi.medication_id AND pi.is_available = true
        WHERE 
          (
            LOWER(m.name) LIKE LOWER($1) OR 
            LOWER(COALESCE(m.generic_name, '')) LIKE LOWER($1) OR
            LOWER(COALESCE(mc.name, '')) LIKE LOWER($1)
          )
        GROUP BY m.id, m.name, m.generic_name, m.description, m.requires_prescription, m.image_url, mc.name
        ORDER BY 
          CASE 
            WHEN LOWER(m.name) LIKE LOWER($2) THEN 1
            WHEN LOWER(COALESCE(m.generic_name, '')) LIKE LOWER($2) THEN 2
            ELSE 3
          END,
          pharmacy_count DESC
        LIMIT $3 OFFSET $4
      `;

      const countQuery = `
        SELECT COUNT(DISTINCT m.id) as total
        FROM medications m
        LEFT JOIN medication_categories mc ON m.category_id = mc.id
        WHERE 
          (
            LOWER(m.name) LIKE LOWER($1) OR 
            LOWER(COALESCE(m.generic_name, '')) LIKE LOWER($1) OR
            LOWER(COALESCE(mc.name, '')) LIKE LOWER($1)
          )
      `;

      const searchPattern = `%${query}%`;
      const exactPattern = `${query}%`;

      const [medicationResult, countResult] = await Promise.all([
        Database.query(medicationQuery, [searchPattern, exactPattern, limit, offset]),
        Database.query(countQuery, [searchPattern])
      ]);

      results = medicationResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        generic_name: row.generic_name,
        category: row.category,
        description: row.description,
        requires_prescription: row.requires_prescription,
        image_url: row.image_url,
        pharmacy_count: parseInt(row.pharmacy_count) || 0,
        min_price: parseFloat(row.min_price) || 0,
        max_price: parseFloat(row.max_price) || 0,
        avg_price: parseFloat(row.avg_price) || 0,
        availability: parseInt(row.pharmacy_count) > 0 ? 'Available' : 'Not Available'
      }));

      total = parseInt(countResult.rows[0].total);

    } else if (type === 'pharmacies') {
      // Search pharmacies - CORRECTED QUERY
      const pharmacyQuery = `
        SELECT 
          pp.id,
          pp.name,
          pp.address,
          pp.city,
          pp.state,
          pp.zip_code,
          pp.phone,
          COALESCE(pp.rating, 0) as rating,
          COALESCE(pp.total_reviews, 0) as total_reviews,
          COALESCE(pp.logo_url, '') as logo_url,
          COUNT(pi.id) as medication_count
        FROM pharmacy_profiles pp
        LEFT JOIN pharmacy_inventory pi ON pp.id = pi.pharmacy_id AND pi.is_available = true
        WHERE 
          (
            LOWER(pp.name) LIKE LOWER($1) OR 
            LOWER(pp.address) LIKE LOWER($1) OR
            LOWER(pp.city) LIKE LOWER($1)
          )
        GROUP BY pp.id, pp.name, pp.address, pp.city, pp.state, pp.zip_code, pp.phone, pp.rating, pp.total_reviews, pp.logo_url
        ORDER BY 
          CASE 
            WHEN LOWER(pp.name) LIKE LOWER($2) THEN 1
            ELSE 2
          END,
          pp.rating DESC,
          medication_count DESC
        LIMIT $3 OFFSET $4
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM pharmacy_profiles pp
        WHERE 
          (
            LOWER(pp.name) LIKE LOWER($1) OR 
            LOWER(pp.address) LIKE LOWER($1) OR
            LOWER(pp.city) LIKE LOWER($1)
          )
      `;

      const searchPattern = `%${query}%`;
      const exactPattern = `${query}%`;

      const [pharmacyResult, countResult] = await Promise.all([
        Database.query(pharmacyQuery, [searchPattern, exactPattern, limit, offset]),
        Database.query(countQuery, [searchPattern])
      ]);

      results = pharmacyResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        address: row.address,
        city: row.city,
        state: row.state,
        zip_code: row.zip_code,
        phone: row.phone,
        rating: parseFloat(row.rating) || 0,
        total_reviews: parseInt(row.total_reviews) || 0,
        logo_url: row.logo_url,
        medication_count: parseInt(row.medication_count) || 0
      }));

      total = parseInt(countResult.rows[0].total);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total,
      query,
      type,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Search failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}