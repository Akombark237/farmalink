// src/app/api/search/route.js
// Search API for medications and pharmacies

import { NextResponse } from 'next/server';
import Database from '../../../../lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'drugs'; // 'drugs' or 'pharmacies'
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    console.log('Search API called:', { query, type, limit, offset });

    // Test database connection first
    const connectionTest = await Database.testConnection();
    if (!connectionTest.success) {
      console.log('Database connection failed, using mock data');
      return getMockData(query, type, limit, offset);
    }

    // Check if required tables exist
    try {
      const tablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('medications', 'pharmacy_profiles', 'medication_categories')
      `;
      const tablesResult = await Database.query(tablesQuery);
      const existingTables = tablesResult.rows.map(row => row.table_name);

      if (existingTables.length === 0) {
        console.log('Required tables not found, using mock data');
        return getMockData(query, type, limit, offset);
      }
    } catch (error) {
      console.log('Error checking tables, using mock data:', error.message);
      return getMockData(query, type, limit, offset);
    }

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
      // Search medications
      const medicationQuery = `
        SELECT 
          m.id,
          m.name,
          m.generic_name,
          m.description,
          m.requires_prescription,
          m.image_url,
          mc.name as category,
          COUNT(pi.id) as pharmacy_count,
          MIN(pi.unit_price) as min_price,
          MAX(pi.unit_price) as max_price,
          AVG(pi.unit_price) as avg_price
        FROM medications m
        LEFT JOIN medication_categories mc ON m.category_id = mc.id
        LEFT JOIN pharmacy_inventory pi ON m.id = pi.medication_id AND pi.is_available = true
        WHERE 
          m.status = 'active' AND
          (
            LOWER(m.name) LIKE LOWER($1) OR 
            LOWER(m.generic_name) LIKE LOWER($1) OR
            LOWER(mc.name) LIKE LOWER($1)
          )
        GROUP BY m.id, mc.name
        ORDER BY 
          CASE 
            WHEN LOWER(m.name) LIKE LOWER($2) THEN 1
            WHEN LOWER(m.generic_name) LIKE LOWER($2) THEN 2
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
          m.status = 'active' AND
          (
            LOWER(m.name) LIKE LOWER($1) OR 
            LOWER(m.generic_name) LIKE LOWER($1) OR
            LOWER(mc.name) LIKE LOWER($1)
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
        genericName: row.generic_name,
        category: row.category,
        description: row.description,
        requiresPrescription: row.requires_prescription,
        imageUrl: row.image_url,
        pharmacyCount: parseInt(row.pharmacy_count) || 0,
        priceRange: {
          min: parseFloat(row.min_price) || 0,
          max: parseFloat(row.max_price) || 0,
          avg: parseFloat(row.avg_price) || 0
        },
        availability: parseInt(row.pharmacy_count) > 0 ? 'Available' : 'Not Available'
      }));

      total = parseInt(countResult.rows[0].total);

    } else if (type === 'pharmacies') {
      // Search pharmacies
      const pharmacyQuery = `
        SELECT 
          pp.id,
          pp.name,
          pp.address,
          pp.city,
          pp.state,
          pp.zip_code,
          pp.phone,
          pp.rating,
          pp.total_reviews,
          pp.logo_url,
          COUNT(pi.id) as medication_count,
          CASE 
            WHEN EXISTS(
              SELECT 1 FROM pharmacy_hours ph 
              WHERE ph.pharmacy_id = pp.id 
              AND ph.day_of_week = EXTRACT(DOW FROM CURRENT_TIMESTAMP)
              AND ph.is_closed = false
              AND CURRENT_TIME BETWEEN ph.open_time AND ph.close_time
            ) THEN true
            ELSE false
          END as is_open_now
        FROM pharmacy_profiles pp
        LEFT JOIN pharmacy_inventory pi ON pp.id = pi.pharmacy_id AND pi.is_available = true
        WHERE 
          pp.status = 'approved' AND
          (
            LOWER(pp.name) LIKE LOWER($1) OR 
            LOWER(pp.address) LIKE LOWER($1) OR
            LOWER(pp.city) LIKE LOWER($1)
          )
        GROUP BY pp.id
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
          pp.status = 'approved' AND
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
        address: `${row.address}, ${row.city}, ${row.state} ${row.zip_code}`,
        phone: row.phone,
        rating: parseFloat(row.rating) || 0,
        totalReviews: parseInt(row.total_reviews) || 0,
        logoUrl: row.logo_url,
        medicationCount: parseInt(row.medication_count) || 0,
        isOpenNow: row.is_open_now,
        distance: '0.8 km' // TODO: Calculate actual distance based on user location
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
    console.log('Database search failed, falling back to mock data');
    return getMockData(query, type, limit, offset);
  }
}

// Mock data function for when database is not available
function getMockData(query, type, limit, offset) {
  console.log('Using mock data for search:', { query, type });

  const mockDrugs = [
    {
      id: '1',
      name: 'Paracetamol (Acetaminophen)',
      genericName: 'Acetaminophen',
      category: 'Pain Relief',
      description: 'Common pain reliever and fever reducer',
      requiresPrescription: false,
      imageUrl: '/api/placeholder/100/100',
      pharmacyCount: 18,
      priceRange: { min: 400, max: 600, avg: 500 },
      availability: 'Available',
      currency: 'CFA'
    },
    {
      id: '2',
      name: 'Chloroquine',
      genericName: 'Chloroquine phosphate',
      category: 'Antimalarials',
      description: 'Antimalarial medication for malaria treatment',
      requiresPrescription: true,
      imageUrl: '/api/placeholder/100/100',
      pharmacyCount: 12,
      priceRange: { min: 1200, max: 1800, avg: 1500 },
      availability: 'Available',
      currency: 'CFA'
    },
    {
      id: '3',
      name: 'Artemether-Lumefantrine',
      genericName: 'Artemether-Lumefantrine',
      category: 'Antimalarials',
      description: 'Combination antimalarial for malaria treatment',
      requiresPrescription: true,
      imageUrl: '/api/placeholder/100/100',
      pharmacyCount: 15,
      priceRange: { min: 3000, max: 4000, avg: 3500 },
      availability: 'Available',
      currency: 'CFA'
    },
    {
      id: '4',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      category: 'Antibiotics',
      description: 'Penicillin antibiotic for bacterial infections',
      requiresPrescription: true,
      imageUrl: '/api/placeholder/100/100',
      pharmacyCount: 16,
      priceRange: { min: 2000, max: 3000, avg: 2500 },
      availability: 'Available',
      currency: 'CFA'
    },
    {
      id: '5',
      name: 'Omeprazole',
      genericName: 'Omeprazole',
      category: 'Gastrointestinal',
      description: 'Proton pump inhibitor for acid reflux',
      requiresPrescription: false,
      imageUrl: '/api/placeholder/100/100',
      pharmacyCount: 14,
      priceRange: { min: 1800, max: 2600, avg: 2200 },
      availability: 'Available',
      currency: 'CFA'
    },
    {
      id: '6',
      name: 'Metformin',
      genericName: 'Metformin hydrochloride',
      category: 'Diabetes',
      description: 'Medication for type 2 diabetes management',
      requiresPrescription: true,
      imageUrl: '/api/placeholder/100/100',
      pharmacyCount: 8,
      priceRange: { min: 1500, max: 2500, avg: 2000 },
      availability: 'Available',
      currency: 'CFA'
    },
    {
      id: '7',
      name: 'Vitamin C',
      genericName: 'Ascorbic acid',
      category: 'Vitamins',
      description: 'Vitamin C supplement for immune support',
      requiresPrescription: false,
      imageUrl: '/api/placeholder/100/100',
      pharmacyCount: 18,
      priceRange: { min: 500, max: 800, avg: 600 },
      availability: 'Available',
      currency: 'CFA'
    },
    {
      id: '8',
      name: 'ORS (Oral Rehydration Salts)',
      genericName: 'Oral Rehydration Salts',
      category: 'Gastrointestinal',
      description: 'Rehydration solution for diarrhea treatment',
      requiresPrescription: false,
      imageUrl: '/api/placeholder/100/100',
      pharmacyCount: 18,
      priceRange: { min: 200, max: 400, avg: 300 },
      availability: 'Available',
      currency: 'CFA'
    }
  ];

  const mockPharmacies = [
    {
      id: '1',
      name: 'GOLF PHARMACY',
      address: 'Carrefour GOLF, Yaoundé, Centre, Cameroon',
      phone: '692 33 47 46',
      rating: 4.3,
      totalReviews: 89,
      logoUrl: '/api/placeholder/80/80',
      medicationCount: 320,
      isOpenNow: true,
      distance: '0.8 km'
    },
    {
      id: '2',
      name: 'LE CIGNE ODZA PHARMACY',
      address: 'FACE TOTAL TERMINAL 10 ODZA, Yaoundé, Centre, Cameroon',
      phone: '657 35 88 353',
      rating: 4.7,
      totalReviews: 95,
      logoUrl: '/api/placeholder/80/80',
      medicationCount: 450,
      isOpenNow: true,
      distance: '1.2 km'
    },
    {
      id: '3',
      name: 'BIYEM-ASSI PHARMACY',
      address: 'facing NIKI, Yaoundé, Centre, Cameroon',
      phone: '222 31 71 93',
      rating: 4.6,
      totalReviews: 78,
      logoUrl: '/api/placeholder/80/80',
      medicationCount: 380,
      isOpenNow: true,
      distance: '1.5 km'
    },
    {
      id: '4',
      name: 'ROYAL PHARMACY',
      address: 'ELIG-EFFA, Yaoundé, Centre, Cameroon',
      phone: '222 22 32 17',
      rating: 4.5,
      totalReviews: 72,
      logoUrl: '/api/placeholder/80/80',
      medicationCount: 290,
      isOpenNow: true,
      distance: '2.1 km'
    },
    {
      id: '5',
      name: 'CODEX PHARMACY',
      address: 'AHALA 1, PHARMACAM entrance, Yaoundé, Centre, Cameroon',
      phone: '242 07 59 88',
      rating: 4.4,
      totalReviews: 52,
      logoUrl: '/api/placeholder/80/80',
      medicationCount: 250,
      isOpenNow: true,
      distance: '2.8 km'
    },
    {
      id: '6',
      name: 'MESSASSI CENTER PHARMACY',
      address: 'MESSASSI Crossroads, Yaoundé, Centre, Cameroon',
      phone: '222 21 81 72',
      rating: 4.4,
      totalReviews: 63,
      logoUrl: '/api/placeholder/80/80',
      medicationCount: 340,
      isOpenNow: false,
      distance: '3.2 km'
    },
    {
      id: '7',
      name: 'H&L PHARMACY',
      address: 'Opposite Essomba Bakery, Yaoundé, Centre, Cameroon',
      phone: '696 61 39 74',
      rating: 4.3,
      totalReviews: 56,
      logoUrl: '/api/placeholder/80/80',
      medicationCount: 280,
      isOpenNow: true,
      distance: '3.5 km'
    },
    {
      id: '8',
      name: 'PHARMACY OF GRACE',
      address: 'MENDONG - PEACE Hardware Store, Yaoundé, Centre, Cameroon',
      phone: '242 04 15 61',
      rating: 4.3,
      totalReviews: 51,
      logoUrl: '/api/placeholder/80/80',
      medicationCount: 220,
      isOpenNow: true,
      distance: '4.2 km'
    }
  ];

  let results = [];
  let total = 0;

  if (type === 'drugs') {
    results = mockDrugs.filter(drug =>
      drug.name.toLowerCase().includes(query.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(query.toLowerCase()) ||
      drug.category.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    results = mockPharmacies.filter(pharmacy =>
      pharmacy.name.toLowerCase().includes(query.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(query.toLowerCase())
    );
  }

  total = results.length;
  results = results.slice(offset, offset + limit);

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
    },
    usingMockData: true
  });
}
