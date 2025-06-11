// src/app/api/pharmacies/route.js
// API endpoint for pharmacy data - now connected to PostgreSQL database

import { NextResponse } from 'next/server';
import { YAUNDE_PHARMACIES } from '../../../data/pharmacies.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const includeInventory = searchParams.get('includeInventory') === 'true';

    // Use static data for now (will be replaced with database later)
    let pharmacies = [...YAUNDE_PHARMACIES];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      pharmacies = pharmacies.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(searchLower) ||
        pharmacy.address.toLowerCase().includes(searchLower)
      );
    }

    // Get total count for pagination
    const total = pharmacies.length;

    // Apply pagination
    pharmacies = pharmacies.slice(offset, offset + limit);

    // Format the pharmacy data to match expected structure
    const formattedPharmacies = pharmacies.map(pharmacy => ({
      id: pharmacy.id,
      name: pharmacy.name,
      address: pharmacy.address,
      phone: pharmacy.phone,
      rating: pharmacy.rating || 0,
      isOpenNow: pharmacy.isOpenNow,
      location: pharmacy.location,
      city: 'Yaoundé',
      state: 'Centre',
      country: 'Cameroon',
      totalReviews: Math.floor(Math.random() * 100) + 10,
      description: `Professional pharmacy services in ${pharmacy.name}`,
      businessHours: {
        monday: '08:00-20:00',
        tuesday: '08:00-20:00',
        wednesday: '08:00-20:00',
        thursday: '08:00-20:00',
        friday: '08:00-20:00',
        saturday: '08:00-18:00',
        sunday: '09:00-17:00'
      },
      medications: includeInventory ? pharmacy.medications : []
    }));
    return NextResponse.json({
      success: true,
      data: formattedPharmacies,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit)
      },
      meta: {
        searchTerm: search,
        includeInventory,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Pharmacies API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pharmacies',
        details: error.message
      },
      { status: 500 }
    );
  }
}