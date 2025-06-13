// Medications API
// src/app/api/medications/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const limit = parseInt(searchParams.get('limit')) || 50;

        // Mock data for now - replace with actual database query later
        const mockMedications = [
            {
                id: 1,
                name: 'Paracetamol',
                genericName: 'Acetaminophen',
                category: 'Pain Relief',
                manufacturer: 'Generic Pharma',
                description: 'Pain reliever and fever reducer',
                requiresPrescription: false,
                type: 'Over-the-Counter',
                price: '$12.99',
                inStock: true,
                rating: '4.5'
            },
            {
                id: 2,
                name: 'Amoxicillin',
                genericName: 'Amoxicillin',
                category: 'Antibiotics',
                manufacturer: 'MedCorp',
                description: 'Antibiotic for bacterial infections',
                requiresPrescription: true,
                type: 'Prescription',
                price: '$25.50',
                inStock: true,
                rating: '4.7'
            },
            {
                id: 3,
                name: 'Lisinopril',
                genericName: 'Lisinopril',
                category: 'Blood Pressure',
                manufacturer: 'CardioMed',
                description: 'ACE inhibitor for high blood pressure',
                requiresPrescription: true,
                type: 'Prescription',
                price: '$38.75',
                inStock: false,
                rating: '4.3'
            },
            {
                id: 4,
                name: 'Metformin',
                genericName: 'Metformin HCl',
                category: 'Diabetes',
                manufacturer: 'DiabetesCare',
                description: 'Medication for type 2 diabetes',
                requiresPrescription: true,
                type: 'Prescription',
                price: '$22.30',
                inStock: true,
                rating: '4.6'
            },
            {
                id: 5,
                name: 'Atorvastatin',
                genericName: 'Atorvastatin Calcium',
                category: 'Cholesterol',
                manufacturer: 'HeartHealth',
                description: 'Statin for lowering cholesterol',
                requiresPrescription: true,
                type: 'Prescription',
                price: '$45.20',
                inStock: true,
                rating: '4.4'
            },
            {
                id: 6,
                name: 'Ibuprofen',
                genericName: 'Ibuprofen',
                category: 'Pain Relief',
                manufacturer: 'PainAway Inc',
                description: 'Anti-inflammatory pain reliever',
                requiresPrescription: false,
                type: 'Over-the-Counter',
                price: '$8.99',
                inStock: true,
                rating: '4.2'
            },
            {
                id: 7,
                name: 'Omeprazole',
                genericName: 'Omeprazole',
                category: 'Digestive Health',
                manufacturer: 'GastroMed',
                description: 'Proton pump inhibitor for acid reflux',
                requiresPrescription: false,
                type: 'Over-the-Counter',
                price: '$18.75',
                inStock: true,
                rating: '4.1'
            },
            {
                id: 8,
                name: 'Levothyroxine',
                genericName: 'Levothyroxine Sodium',
                category: 'Thyroid',
                manufacturer: 'ThyroidCare',
                description: 'Thyroid hormone replacement',
                requiresPrescription: true,
                type: 'Prescription',
                price: '$15.60',
                inStock: true,
                rating: '4.8'
            }
        ];

        // Filter medications based on search and category
        let filteredMedications = mockMedications;

        if (search) {
            const searchLower = search.toLowerCase();
            filteredMedications = filteredMedications.filter(med =>
                med.name.toLowerCase().includes(searchLower) ||
                med.genericName.toLowerCase().includes(searchLower) ||
                med.manufacturer.toLowerCase().includes(searchLower) ||
                med.category.toLowerCase().includes(searchLower)
            );
        }

        if (category) {
            const categoryLower = category.toLowerCase();
            filteredMedications = filteredMedications.filter(med =>
                med.category.toLowerCase().includes(categoryLower)
            );
        }

        // Apply limit
        filteredMedications = filteredMedications.slice(0, limit);

        return NextResponse.json({
            success: true,
            data: filteredMedications,
            count: filteredMedications.length,
            total: mockMedications.length
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
