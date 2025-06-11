// src/app/api/search/route.js - Static Data Version
import { NextResponse } from 'next/server';
import { YAUNDE_PHARMACIES } from '../../../data/pharmacies.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('q') || '';
    const type = searchParams.get('type') || 'drugs';
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
    const queryLower = query.toLowerCase();

    if (type === 'drugs') {
      // Extract all medications from pharmacy data
      const allMedications = new Map();

      YAUNDE_PHARMACIES.forEach(pharmacy => {
        pharmacy.medications.forEach(med => {
          if (!allMedications.has(med.name)) {
            allMedications.set(med.name, {
              id: med.id,
              name: med.name,
              generic_name: med.name,
              category: getCategoryForMedication(med.name),
              description: `${med.name} medication`,
              requires_prescription: false,
              image_url: '',
              pharmacies: [],
              prices: []
            });
          }

          const medication = allMedications.get(med.name);
          medication.pharmacies.push(pharmacy.name);
          medication.prices.push(med.price);
        });
      });

      // Filter medications based on search query
      const filteredMedications = Array.from(allMedications.values()).filter(med =>
        med.name.toLowerCase().includes(queryLower) ||
        med.category.toLowerCase().includes(queryLower)
      );

      // Calculate statistics and format results
      const medicationResults = filteredMedications.map(med => ({
        id: med.id,
        name: med.name,
        generic_name: med.generic_name,
        category: med.category,
        description: med.description,
        requires_prescription: med.requires_prescription,
        image_url: med.image_url,
        pharmacy_count: med.pharmacies.length,
        min_price: Math.min(...med.prices),
        max_price: Math.max(...med.prices),
        avg_price: med.prices.reduce((a, b) => a + b, 0) / med.prices.length,
        availability: med.pharmacies.length > 0 ? 'Available' : 'Not Available'
      }));

      // Sort by relevance (exact matches first)
      medicationResults.sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(queryLower) ? 1 : 0;
        const bExact = b.name.toLowerCase().startsWith(queryLower) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return b.pharmacy_count - a.pharmacy_count;
      });

      total = medicationResults.length;
      results = medicationResults.slice(offset, offset + limit);

    } else if (type === 'pharmacies') {
      // Filter pharmacies based on search query
      const filteredPharmacies = YAUNDE_PHARMACIES.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(queryLower) ||
        pharmacy.address.toLowerCase().includes(queryLower) ||
        'yaoundé'.includes(queryLower)
      );

      // Format pharmacy results
      const pharmacyResults = filteredPharmacies.map(pharmacy => ({
        id: pharmacy.id,
        name: pharmacy.name,
        address: pharmacy.address,
        city: 'Yaoundé',
        state: 'Centre',
        zip_code: '',
        phone: pharmacy.phone,
        rating: pharmacy.rating || 0,
        total_reviews: Math.floor(Math.random() * 100) + 10,
        logo_url: '',
        medication_count: pharmacy.medications.length
      }));

      // Sort by relevance (exact matches first, then by rating)
      pharmacyResults.sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(queryLower) ? 1 : 0;
        const bExact = b.name.toLowerCase().startsWith(queryLower) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return b.rating - a.rating;
      });

      total = pharmacyResults.length;
      results = pharmacyResults.slice(offset, offset + limit);
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

// Helper function to categorize medications
function getCategoryForMedication(medicationName) {
  const categories = {
    'Paracetamol': 'Pain Relief',
    'Ibuprofen': 'Pain Relief',
    'Aspirin': 'Pain Relief',
    'Diclofenac': 'Pain Relief',
    'Naproxen': 'Pain Relief',
    'Meloxicam': 'Pain Relief',
    'Tramadol': 'Pain Relief',
    'Morphine': 'Pain Relief',
    'Codeine': 'Pain Relief',
    'Morphine Sulfate': 'Pain Relief',
    'Fentanyl': 'Pain Relief',
    'Amoxicillin': 'Antibiotics',
    'Ciprofloxacin': 'Antibiotics',
    'Azithromycin': 'Antibiotics',
    'Ceftriaxone': 'Antibiotics',
    'Metronidazole': 'Antibiotics',
    'Doxycycline': 'Antibiotics',
    'Clarithromycin': 'Antibiotics',
    'Erythromycin': 'Antibiotics',
    'Tetracycline': 'Antibiotics',
    'Penicillin': 'Antibiotics',
    'Ampicillin': 'Antibiotics',
    'Cephalexin': 'Antibiotics',
    'Lisinopril': 'Cardiovascular',
    'Atorvastatin': 'Cardiovascular',
    'Amlodipine': 'Cardiovascular',
    'Enalapril': 'Cardiovascular',
    'Losartan': 'Cardiovascular',
    'Valsartan': 'Cardiovascular',
    'Simvastatin': 'Cardiovascular',
    'Metformin': 'Diabetes',
    'Glibenclamide': 'Diabetes',
    'Insulin': 'Diabetes',
    'Gliclazide': 'Diabetes',
    'Salbutamol': 'Respiratory',
    'Beclomethasone': 'Respiratory',
    'Theophylline': 'Respiratory',
    'Montelukast': 'Respiratory',
    'Omeprazole': 'Gastrointestinal',
    'Lansoprazole': 'Gastrointestinal',
    'Ranitidine': 'Gastrointestinal',
    'Prednisolone': 'Gastrointestinal',
    'Vitamin C': 'Vitamins',
    'Zinc Sulfate': 'Vitamins',
    'Loratadine': 'Antihistamines',
    'Cetirizine': 'Antihistamines',
    'Chloroquine': 'Antimalarial',
    'Artemether': 'Antimalarial',
    'Quinine': 'Antimalarial'
  };

  return categories[medicationName] || 'General Medicine';
}