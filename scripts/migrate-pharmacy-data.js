#!/usr/bin/env node

// Database migration script to move pharmacy data from static files to PostgreSQL
// This script will populate the database with real Yaoundé pharmacy data

import Database from '../lib/database.js';
import { YAUNDE_PHARMACIES } from '../src/data/pharmacies.js';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting PharmaLink Database Migration...');
console.log('================================================');

// First, ensure all required tables exist
async function ensureTablesExist() {
  console.log('📋 Ensuring database tables exist...');

  try {
    // Check if tables exist
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const result = await Database.query(tablesQuery);
    const existingTables = result.rows.map(row => row.table_name);

    const requiredTables = [
      'users', 'patient_profiles', 'pharmacy_profiles',
      'medication_categories', 'medications', 'pharmacy_inventory',
      'orders', 'order_items', 'payments'
    ];

    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log(`⚠️  Missing tables: ${missingTables.join(', ')}`);
      console.log('🔧 Creating missing tables...');

      // Read and execute SQL files
      const sqlFiles = [
        'database/01_schema_users.sql',
        'database/02_schema_pharmacy.sql',
        'database/03_schema_medications.sql',
        'database/04_schema_orders.sql'
      ];

      for (const sqlFile of sqlFiles) {
        if (fs.existsSync(sqlFile)) {
          console.log(`   📄 Executing ${sqlFile}...`);
          const sql = fs.readFileSync(sqlFile, 'utf8');
          await Database.query(sql);
        }
      }
    } else {
      console.log('✅ All required tables exist');
    }

  } catch (error) {
    console.error('❌ Error checking/creating tables:', error);
    throw error;
  }
}

async function migratePharmacyData() {
  try {
    // First ensure all tables exist
    await ensureTablesExist();

    console.log('📊 Migration Statistics:');
    console.log(`- Pharmacies to migrate: ${YAUNDE_PHARMACIES.length}`);

    // Calculate total medications
    const totalMedications = YAUNDE_PHARMACIES.reduce((total, pharmacy) =>
      total + pharmacy.medications.length, 0
    );
    console.log(`- Medications to migrate: ${totalMedications}`);
    
    // Start transaction
    await Database.transaction(async (client) => {
      console.log('\n🏥 Migrating Pharmacies...');
      
      // First, create medication categories if they don't exist
      const categories = [
        'Pain Relief', 'Antibiotics', 'Cardiovascular', 'Diabetes', 
        'Respiratory', 'Gastrointestinal', 'Vitamins', 'Antimalarial'
      ];
      
      for (const category of categories) {
        await client.query(`
          INSERT INTO medication_categories (name, description)
          VALUES ($1, $2)
          ON CONFLICT (name) DO NOTHING
        `, [category, `${category} medications`]);
      }
      
      // Create a mapping of medication names to categories
      const medicationCategories = {
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
        'Loratadine': 'Pain Relief',
        'Cetirizine': 'Pain Relief',
        'Chloroquine': 'Antimalarial',
        'Artemether': 'Antimalarial',
        'Quinine': 'Antimalarial'
      };
      
      // Get category IDs
      const categoryResult = await client.query('SELECT id, name FROM medication_categories');
      const categoryMap = {};
      categoryResult.rows.forEach(row => {
        categoryMap[row.name] = row.id;
      });
      
      // Migrate pharmacies
      for (const pharmacy of YAUNDE_PHARMACIES) {
        console.log(`  📍 Migrating: ${pharmacy.name}`);
        
        // Insert pharmacy profile
        const pharmacyResult = await client.query(`
          INSERT INTO pharmacy_profiles (
            name, address, phone, rating, 
            latitude, longitude, is_open_now,
            license_number, status, city, state, country
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (name) DO UPDATE SET
            address = EXCLUDED.address,
            phone = EXCLUDED.phone,
            rating = EXCLUDED.rating,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            is_open_now = EXCLUDED.is_open_now
          RETURNING id
        `, [
          pharmacy.name,
          pharmacy.address,
          pharmacy.phone || null,
          pharmacy.rating || 0,
          pharmacy.location.lat,
          pharmacy.location.lng,
          pharmacy.isOpenNow || false,
          `LIC-${pharmacy.id}-${Date.now()}`, // Generate license number
          'active',
          'Yaoundé',
          'Centre',
          'Cameroon'
        ]);
        
        const pharmacyId = pharmacyResult.rows[0].id;
        
        // Migrate medications for this pharmacy
        for (const medication of pharmacy.medications) {
          // First, ensure the medication exists in the medications table
          const categoryId = categoryMap[medicationCategories[medication.name]] || categoryMap['Pain Relief'];
          
          const medicationResult = await client.query(`
            INSERT INTO medications (
              name, category_id, description, dosage_form,
              strength, manufacturer, requires_prescription
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (name) DO UPDATE SET
              category_id = EXCLUDED.category_id
            RETURNING id
          `, [
            medication.name,
            categoryId,
            `${medication.name} medication`,
            'Tablet',
            '500mg',
            'Generic Manufacturer',
            false
          ]);
          
          const medicationId = medicationResult.rows[0].id;
          
          // Insert into pharmacy inventory
          await client.query(`
            INSERT INTO pharmacy_inventory (
              pharmacy_id, medication_id, quantity_available,
              unit_price, currency, last_updated
            ) VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (pharmacy_id, medication_id) DO UPDATE SET
              quantity_available = EXCLUDED.quantity_available,
              unit_price = EXCLUDED.unit_price,
              last_updated = EXCLUDED.last_updated
          `, [
            pharmacyId,
            medicationId,
            medication.quantity || 0,
            medication.price,
            'XAF', // Central African Franc
            new Date()
          ]);
        }
      }
      
      console.log('\n✅ Migration completed successfully!');
    });
    
    // Verify migration
    console.log('\n📊 Verifying Migration...');
    const pharmacyCount = await Database.query('SELECT COUNT(*) FROM pharmacy_profiles');
    const medicationCount = await Database.query('SELECT COUNT(*) FROM medications');
    const inventoryCount = await Database.query('SELECT COUNT(*) FROM pharmacy_inventory');
    
    console.log(`✅ Pharmacies in database: ${pharmacyCount.rows[0].count}`);
    console.log(`✅ Medications in database: ${medicationCount.rows[0].count}`);
    console.log(`✅ Inventory records: ${inventoryCount.rows[0].count}`);
    
    console.log('\n🎉 Database migration completed successfully!');
    console.log('Your PharmaLink database is now populated with real Yaoundé pharmacy data.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePharmacyData()
    .then(() => {
      console.log('\n🚀 Migration script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration script failed:', error);
      process.exit(1);
    });
}

export default migratePharmacyData;
