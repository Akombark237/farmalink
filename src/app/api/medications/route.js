// Medications API - Static Data (will be database connected later)
import { NextResponse } from 'next/server';
import { YAUNDE_PHARMACIES } from '../../../data/pharmacies.js';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit')) || 50;
        const offset = parseInt(searchParams.get('offset')) || 0;
        const includePharmacies = searchParams.get('includePharmacies') === 'true';

        // Extract all unique medications from pharmacy data
        const allMedications = [];
        const medicationMap = new Map();

        YAUNDE_PHARMACIES.forEach(pharmacy => {
            pharmacy.medications.forEach(med => {
                if (!medicationMap.has(med.name)) {
                    medicationMap.set(med.name, {
                        id: med.id,
                        name: med.name,
                        description: `${med.name} medication`,
                        dosageForm: 'Tablet',
                        strength: '500mg',
                        manufacturer: 'Generic Manufacturer',
                        requiresPrescription: false,
                        category: getCategoryForMedication(med.name),
                        categoryId: getCategoryId(getCategoryForMedication(med.name)),
                        pharmacies: []
                    });
                }

                // Add pharmacy info if requested
                if (includePharmacies) {
                    const medication = medicationMap.get(med.name);
                    medication.pharmacies.push({
                        id: pharmacy.id,
                        name: pharmacy.name,
                        address: pharmacy.address,
                        phone: pharmacy.phone,
                        rating: pharmacy.rating || 0,
                        location: pharmacy.location,
                        price: med.price,
                        quantity: med.quantity,
                        currency: 'XAF',
                        inStock: med.inStock
                    });
                }
            });
        });

        // Convert map to array
        let medications = Array.from(medicationMap.values());

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            medications = medications.filter(med =>
                med.name.toLowerCase().includes(searchLower)
            );
        }

        // Apply category filter
        if (category) {
            medications = medications.filter(med =>
                med.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Get total count for pagination
        const total = medications.length;

        // Apply pagination
        medications = medications.slice(offset, offset + limit);
        return NextResponse.json({
            success: true,
            data: medications,
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
                category,
                includePharmacies,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Medications API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch medications',
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

// Helper function to get category ID
function getCategoryId(categoryName) {
    const categoryIds = {
        'Pain Relief': 1,
        'Antibiotics': 2,
        'Cardiovascular': 3,
        'Diabetes': 4,
        'Respiratory': 5,
        'Gastrointestinal': 6,
        'Vitamins': 7,
        'Antihistamines': 8,
        'Antimalarial': 9,
        'General Medicine': 10
    };

    return categoryIds[categoryName] || 10;
}
