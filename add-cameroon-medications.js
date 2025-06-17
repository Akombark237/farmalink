// add-cameroon-medications.js
// Script to add medication inventory for Cameroon pharmacies

import Database from './lib/database.js';

// Medication data organized by pharmacy
const pharmacyMedications = {
  'EKOUMDOUM PHARMACY': [
    { name: 'Paracetamol (Acetaminophen)', category: 'Pain Relief', price: 500, requiresPrescription: false },
    { name: 'Ibuprofen', category: 'Pain Relief', price: 750, requiresPrescription: false },
    { name: 'Aspirin', category: 'Pain Relief', price: 400, requiresPrescription: false },
    { name: 'Amoxicillin', category: 'Antibiotics', price: 2500, requiresPrescription: true },
    { name: 'Ciprofloxacin', category: 'Antibiotics', price: 3000, requiresPrescription: true },
    { name: 'Metronidazole', category: 'Antibiotics', price: 1800, requiresPrescription: true },
    { name: 'Omeprazole', category: 'Gastrointestinal', price: 2200, requiresPrescription: false },
    { name: 'Ranitidine', category: 'Gastrointestinal', price: 1500, requiresPrescription: false },
    { name: 'Loratadine', category: 'Antihistamines', price: 1200, requiresPrescription: false },
    { name: 'Cetirizine', category: 'Antihistamines', price: 1000, requiresPrescription: false },
    { name: 'Diclofenac', category: 'Pain Relief', price: 800, requiresPrescription: false },
    { name: 'Prednisolone', category: 'Corticosteroids', price: 1800, requiresPrescription: true }
  ],

  'HAPPY EKOUMDOUM PHARMACY': [
    { name: 'Doxycycline', category: 'Antibiotics', price: 2800, requiresPrescription: true },
    { name: 'Azithromycin', category: 'Antibiotics', price: 3500, requiresPrescription: true },
    { name: 'Fluconazole', category: 'Antifungals', price: 2000, requiresPrescription: true },
    { name: 'Nystatin', category: 'Antifungals', price: 1500, requiresPrescription: false },
    { name: 'Hydrocortisone', category: 'Corticosteroids', price: 1200, requiresPrescription: false },
    { name: 'Betamethasone', category: 'Corticosteroids', price: 2500, requiresPrescription: true },
    { name: 'Salbutamol', category: 'Respiratory', price: 3000, requiresPrescription: true },
    { name: 'Theophylline', category: 'Respiratory', price: 2200, requiresPrescription: true },
    { name: 'Atenolol', category: 'Cardiovascular', price: 1800, requiresPrescription: true },
    { name: 'Lisinopril', category: 'Cardiovascular', price: 2500, requiresPrescription: true },
    { name: 'Amlodipine', category: 'Cardiovascular', price: 2800, requiresPrescription: true },
    { name: 'Furosemide', category: 'Cardiovascular', price: 1500, requiresPrescription: true }
  ],

  'GOLF PHARMACY': [
    { name: 'Metformin', category: 'Diabetes', price: 2000, requiresPrescription: true },
    { name: 'Glibenclamide', category: 'Diabetes', price: 1800, requiresPrescription: true },
    { name: 'Insulin (various types)', category: 'Diabetes', price: 15000, requiresPrescription: true },
    { name: 'Simvastatin', category: 'Cardiovascular', price: 3000, requiresPrescription: true },
    { name: 'Atorvastatin', category: 'Cardiovascular', price: 3500, requiresPrescription: true },
    { name: 'Warfarin', category: 'Cardiovascular', price: 2200, requiresPrescription: true },
    { name: 'Clopidogrel', category: 'Cardiovascular', price: 4000, requiresPrescription: true },
    { name: 'Digoxin', category: 'Cardiovascular', price: 1800, requiresPrescription: true },
    { name: 'Spironolactone', category: 'Cardiovascular', price: 2500, requiresPrescription: true },
    { name: 'Captopril', category: 'Cardiovascular', price: 2000, requiresPrescription: true },
    { name: 'Nifedipine', category: 'Cardiovascular', price: 2800, requiresPrescription: true },
    { name: 'Hydrochlorothiazide', category: 'Cardiovascular', price: 1500, requiresPrescription: true }
  ],

  'GOOD BERGER PHARMACY': [
    { name: 'Levothyroxine', category: 'Endocrine', price: 3000, requiresPrescription: true },
    { name: 'Carbimazole', category: 'Endocrine', price: 2500, requiresPrescription: true },
    { name: 'Folic Acid', category: 'Vitamins', price: 800, requiresPrescription: false },
    { name: 'Iron supplements', category: 'Vitamins', price: 1200, requiresPrescription: false },
    { name: 'Vitamin B12', category: 'Vitamins', price: 1500, requiresPrescription: false },
    { name: 'Vitamin D3', category: 'Vitamins', price: 2000, requiresPrescription: false },
    { name: 'Multivitamins', category: 'Vitamins', price: 2500, requiresPrescription: false },
    { name: 'Calcium carbonate', category: 'Vitamins', price: 1000, requiresPrescription: false },
    { name: 'Magnesium oxide', category: 'Vitamins', price: 1200, requiresPrescription: false },
    { name: 'Zinc sulfate', category: 'Vitamins', price: 800, requiresPrescription: false },
    { name: 'Cod liver oil', category: 'Vitamins', price: 1800, requiresPrescription: false },
    { name: 'Vitamin C', category: 'Vitamins', price: 600, requiresPrescription: false }
  ],

  '2 CHAPEL PHARMACY': [
    { name: 'Tramadol', category: 'Pain Relief', price: 2500, requiresPrescription: true },
    { name: 'Codeine', category: 'Pain Relief', price: 2000, requiresPrescription: true },
    { name: 'Morphine', category: 'Pain Relief', price: 5000, requiresPrescription: true },
    { name: 'Diazepam', category: 'Neurological', price: 1800, requiresPrescription: true },
    { name: 'Lorazepam', category: 'Neurological', price: 2200, requiresPrescription: true },
    { name: 'Alprazolam', category: 'Neurological', price: 2500, requiresPrescription: true },
    { name: 'Fluoxetine', category: 'Neurological', price: 3000, requiresPrescription: true },
    { name: 'Sertraline', category: 'Neurological', price: 3500, requiresPrescription: true },
    { name: 'Amitriptyline', category: 'Neurological', price: 2000, requiresPrescription: true },
    { name: 'Carbamazepine', category: 'Neurological', price: 2800, requiresPrescription: true },
    { name: 'Phenytoin', category: 'Neurological', price: 2200, requiresPrescription: true },
    { name: 'Valproic acid', category: 'Neurological', price: 3200, requiresPrescription: true }
  ],

  'CODEX PHARMACY': [
    { name: 'Chloroquine', category: 'Antimalarials', price: 1500, requiresPrescription: true },
    { name: 'Artemether-Lumefantrine', category: 'Antimalarials', price: 3500, requiresPrescription: true },
    { name: 'Quinine', category: 'Antimalarials', price: 2500, requiresPrescription: true },
    { name: 'Doxycycline (malaria prophylaxis)', category: 'Antimalarials', price: 2800, requiresPrescription: true },
    { name: 'Mefloquine', category: 'Antimalarials', price: 4000, requiresPrescription: true },
    { name: 'Atovaquone-Proguanil', category: 'Antimalarials', price: 8000, requiresPrescription: true },
    { name: 'Sulfadoxine-Pyrimethamine', category: 'Antimalarials', price: 2000, requiresPrescription: true },
    { name: 'Chloramphenicol', category: 'Antibiotics', price: 2200, requiresPrescription: true },
    { name: 'Gentamicin', category: 'Antibiotics', price: 3000, requiresPrescription: true },
    { name: 'Streptomycin', category: 'Antibiotics', price: 2800, requiresPrescription: true },
    { name: 'Rifampicin', category: 'Antibiotics', price: 3500, requiresPrescription: true },
    { name: 'Isoniazid', category: 'Antibiotics', price: 2000, requiresPrescription: true }
  ],

  'PHARMACY OF THE VERSE': [
    { name: 'Ethambutol', category: 'Antibiotics', price: 2800, requiresPrescription: true },
    { name: 'Pyrazinamide', category: 'Antibiotics', price: 2500, requiresPrescription: true },
    { name: 'Mebendazole', category: 'Antiparasitics', price: 1200, requiresPrescription: false },
    { name: 'Albendazole', category: 'Antiparasitics', price: 1500, requiresPrescription: false },
    { name: 'Praziquantel', category: 'Antiparasitics', price: 3000, requiresPrescription: true },
    { name: 'Ivermectin', category: 'Antiparasitics', price: 2000, requiresPrescription: true },
    { name: 'Permethrin', category: 'Antiparasitics', price: 1800, requiresPrescription: false },
    { name: 'Lindane', category: 'Antiparasitics', price: 1500, requiresPrescription: true },
    { name: 'Acyclovir', category: 'Antivirals', price: 3500, requiresPrescription: true },
    { name: 'Zidovudine', category: 'Antivirals', price: 8000, requiresPrescription: true },
    { name: 'Lamivudine', category: 'Antivirals', price: 7500, requiresPrescription: true },
    { name: 'Efavirenz', category: 'Antivirals', price: 9000, requiresPrescription: true }
  ],

  'BIYEM-ASSI PHARMACY': [
    { name: 'Tenofovir', category: 'Antivirals', price: 8500, requiresPrescription: true },
    { name: 'Emtricitabine', category: 'Antivirals', price: 7000, requiresPrescription: true },
    { name: 'Lopinavir-Ritonavir', category: 'Antivirals', price: 12000, requiresPrescription: true },
    { name: 'Nevirapine', category: 'Antivirals', price: 6500, requiresPrescription: true },
    { name: 'Abacavir', category: 'Antivirals', price: 9500, requiresPrescription: true },
    { name: 'Raltegravir', category: 'Antivirals', price: 15000, requiresPrescription: true },
    { name: 'Dolutegravir', category: 'Antivirals', price: 18000, requiresPrescription: true },
    { name: 'Trimethoprim-Sulfamethoxazole', category: 'Antibiotics', price: 1800, requiresPrescription: true },
    { name: 'Pentamidine', category: 'Antiparasitics', price: 5000, requiresPrescription: true },
    { name: 'Amphotericin B', category: 'Antifungals', price: 8000, requiresPrescription: true },
    { name: 'Ketoconazole', category: 'Antifungals', price: 2500, requiresPrescription: true },
    { name: 'Itraconazole', category: 'Antifungals', price: 4000, requiresPrescription: true }
  ],

  'LE CIGNE ODZA PHARMACY': [
    { name: 'Ergometrine', category: 'Obstetrics', price: 2000, requiresPrescription: true },
    { name: 'Oxytocin', category: 'Obstetrics', price: 1500, requiresPrescription: true },
    { name: 'Magnesium sulfate', category: 'Obstetrics', price: 1200, requiresPrescription: true },
    { name: 'Ferrous sulfate', category: 'Obstetrics', price: 800, requiresPrescription: false },
    { name: 'Combined oral contraceptives', category: 'Contraceptives', price: 2500, requiresPrescription: true },
    { name: 'Progesterone-only pills', category: 'Contraceptives', price: 2000, requiresPrescription: true },
    { name: 'Medroxyprogesterone injection', category: 'Contraceptives', price: 3000, requiresPrescription: true },
    { name: 'Levonorgestrel (emergency contraception)', category: 'Contraceptives', price: 3500, requiresPrescription: false },
    { name: 'Misoprostol', category: 'Obstetrics', price: 4000, requiresPrescription: true },
    { name: 'Methyldopa', category: 'Cardiovascular', price: 2200, requiresPrescription: true },
    { name: 'Nifedipine (pregnancy)', category: 'Cardiovascular', price: 2800, requiresPrescription: true },
    { name: 'Labetalol', category: 'Cardiovascular', price: 3200, requiresPrescription: true }
  ],

  'GENEVA PHARMACY': [
    { name: 'Vaccines (Hepatitis B, Tetanus, etc.)', category: 'Vaccines', price: 15000, requiresPrescription: true },
    { name: 'Immunoglobulins', category: 'Vaccines', price: 25000, requiresPrescription: true },
    { name: 'ORS (Oral Rehydration Salts)', category: 'Gastrointestinal', price: 300, requiresPrescription: false },
    { name: 'Zinc sulfate (diarrhea treatment)', category: 'Gastrointestinal', price: 500, requiresPrescription: false },
    { name: 'Loperamide', category: 'Gastrointestinal', price: 1200, requiresPrescription: false },
    { name: 'Bisacodyl', category: 'Gastrointestinal', price: 800, requiresPrescription: false },
    { name: 'Senna', category: 'Gastrointestinal', price: 600, requiresPrescription: false },
    { name: 'Lactulose', category: 'Gastrointestinal', price: 1500, requiresPrescription: false },
    { name: 'Simethicone', category: 'Gastrointestinal', price: 1000, requiresPrescription: false },
    { name: 'Domperidone', category: 'Gastrointestinal', price: 1800, requiresPrescription: false },
    { name: 'Metoclopramide', category: 'Gastrointestinal', price: 1500, requiresPrescription: true },
    { name: 'Ondansetron', category: 'Gastrointestinal', price: 2500, requiresPrescription: true }
  ]
};

async function addMedicationsToDatabase() {
  console.log('💊 Adding medication inventory for Cameroon pharmacies...\n');

  try {
    // Test database connection
    const connectionTest = await Database.testConnection();
    if (!connectionTest.success) {
      console.log('❌ Database connection failed:', connectionTest.error);
      return;
    }

    console.log('✅ Database connection successful');

    // Check if required tables exist
    const tablesCheck = await Database.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('pharmacy_profiles', 'medications', 'pharmacy_inventory')
    `);

    const existingTables = tablesCheck.rows.map(row => row.table_name);
    const requiredTables = ['pharmacy_profiles', 'medications', 'pharmacy_inventory'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log('❌ Missing required tables:', missingTables.join(', '));
      console.log('Please run the database schema setup first');
      return;
    }

    console.log('✅ All required tables exist');

    let totalMedications = 0;
    let totalInventoryItems = 0;

    // Process each pharmacy
    for (const [pharmacyName, medications] of Object.entries(pharmacyMedications)) {
      console.log(`\n🏥 Processing ${pharmacyName}...`);

      // Get pharmacy ID
      const pharmacyResult = await Database.query(
        'SELECT id FROM pharmacy_profiles WHERE name = $1',
        [pharmacyName]
      );

      if (pharmacyResult.rows.length === 0) {
        console.log(`❌ Pharmacy not found: ${pharmacyName}`);
        continue;
      }

      const pharmacyId = pharmacyResult.rows[0].id;
      console.log(`   Pharmacy ID: ${pharmacyId}`);

      let medicationCount = 0;
      let inventoryCount = 0;

      // Process each medication
      for (const med of medications) {
        try {
          // Insert or get medication
          let medicationId;
          const existingMed = await Database.query(
            'SELECT id FROM medications WHERE name = $1',
            [med.name]
          );

          if (existingMed.rows.length > 0) {
            medicationId = existingMed.rows[0].id;
          } else {
            const newMed = await Database.query(`
              INSERT INTO medications (name, generic_name, category, requires_prescription, created_at, updated_at)
              VALUES ($1, $2, $3, $4, NOW(), NOW())
              RETURNING id
            `, [med.name, med.name, med.category, med.requiresPrescription]);
            
            medicationId = newMed.rows[0].id;
            medicationCount++;
          }

          // Add to pharmacy inventory
          await Database.query(`
            INSERT INTO pharmacy_inventory (
              pharmacy_id, medication_id, price, stock_quantity, 
              is_available, last_updated, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW())
            ON CONFLICT (pharmacy_id, medication_id) 
            DO UPDATE SET 
              price = EXCLUDED.price,
              is_available = EXCLUDED.is_available,
              last_updated = NOW(),
              updated_at = NOW()
          `, [
            pharmacyId, 
            medicationId, 
            med.price, 
            Math.floor(Math.random() * 100) + 10, // Random stock 10-109
            true
          ]);

          inventoryCount++;

        } catch (error) {
          console.log(`   ❌ Error adding ${med.name}: ${error.message}`);
        }
      }

      console.log(`   ✅ Added ${medicationCount} new medications`);
      console.log(`   ✅ Added ${inventoryCount} inventory items`);
      
      totalMedications += medicationCount;
      totalInventoryItems += inventoryCount;
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Total new medications added: ${totalMedications}`);
    console.log(`✅ Total inventory items added: ${totalInventoryItems}`);
    console.log(`🏥 Pharmacies processed: ${Object.keys(pharmacyMedications).length}`);

    // Update pharmacy medication counts
    console.log('\n🔄 Updating pharmacy medication counts...');
    await Database.query(`
      UPDATE pharmacy_profiles 
      SET medication_count = (
        SELECT COUNT(*) 
        FROM pharmacy_inventory pi 
        WHERE pi.pharmacy_id = pharmacy_profiles.id 
        AND pi.is_available = true
      ),
      updated_at = NOW()
      WHERE country = 'Cameroon'
    `);

    console.log('✅ Pharmacy medication counts updated');

    console.log('\n🎉 Medication inventory successfully added to Cameroon pharmacies!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the search functionality');
    console.log('2. Verify medication availability on the map');
    console.log('3. Add more detailed medication information if needed');

  } catch (error) {
    console.error('❌ Error adding medications:', error);
  } finally {
    await Database.close();
  }
}

// Run the script
addMedicationsToDatabase().catch(console.error);
