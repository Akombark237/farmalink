// add-remaining-medications.js
// Script to add remaining medication inventory for Cameroon pharmacies

import Database from './lib/database.js';

// Remaining pharmacy medications
const remainingPharmacyMedications = {
  'H&L PHARMACY': [
    { name: 'Esomeprazole', category: 'Gastrointestinal', price: 2800, requiresPrescription: true },
    { name: 'Lansoprazole', category: 'Gastrointestinal', price: 2500, requiresPrescription: true },
    { name: 'Sucralfate', category: 'Gastrointestinal', price: 2000, requiresPrescription: true },
    { name: 'Famotidine', category: 'Gastrointestinal', price: 1800, requiresPrescription: false },
    { name: 'Cimetidine', category: 'Gastrointestinal', price: 1500, requiresPrescription: false },
    { name: 'Antacids (Aluminum hydroxide/Magnesium hydroxide)', category: 'Gastrointestinal', price: 800, requiresPrescription: false },
    { name: 'Hyoscine butylbromide', category: 'Gastrointestinal', price: 1200, requiresPrescription: false },
    { name: 'Dicyclomine', category: 'Gastrointestinal', price: 1500, requiresPrescription: true },
    { name: 'Mebeverine', category: 'Gastrointestinal', price: 2000, requiresPrescription: true },
    { name: 'Psyllium husk', category: 'Gastrointestinal', price: 1200, requiresPrescription: false },
    { name: 'Activated charcoal', category: 'Gastrointestinal', price: 600, requiresPrescription: false },
    { name: 'Probiotics', category: 'Gastrointestinal', price: 3000, requiresPrescription: false }
  ],

  'XAVYO PHARMACY': [
    { name: 'Clotrimazole', category: 'Dermatology', price: 1500, requiresPrescription: false },
    { name: 'Miconazole', category: 'Dermatology', price: 1800, requiresPrescription: false },
    { name: 'Terbinafine', category: 'Dermatology', price: 2500, requiresPrescription: true },
    { name: 'Griseofulvin', category: 'Dermatology', price: 3000, requiresPrescription: true },
    { name: 'Benzoyl peroxide', category: 'Dermatology', price: 2000, requiresPrescription: false },
    { name: 'Tretinoin', category: 'Dermatology', price: 3500, requiresPrescription: true },
    { name: 'Adapalene', category: 'Dermatology', price: 4000, requiresPrescription: true },
    { name: 'Erythromycin (topical)', category: 'Dermatology', price: 2200, requiresPrescription: true },
    { name: 'Clindamycin (topical)', category: 'Dermatology', price: 2800, requiresPrescription: true },
    { name: 'Mupirocin', category: 'Dermatology', price: 2500, requiresPrescription: true },
    { name: 'Fusidic acid', category: 'Dermatology', price: 3000, requiresPrescription: true },
    { name: 'Silver sulfadiazine', category: 'Dermatology', price: 2200, requiresPrescription: true }
  ],

  'OYOM ABANG PHARMACY': [
    { name: 'Calamine lotion', category: 'Dermatology', price: 800, requiresPrescription: false },
    { name: 'Zinc oxide', category: 'Dermatology', price: 600, requiresPrescription: false },
    { name: 'Petroleum jelly', category: 'Dermatology', price: 400, requiresPrescription: false },
    { name: 'Povidone iodine', category: 'Antiseptics', price: 1000, requiresPrescription: false },
    { name: 'Hydrogen peroxide', category: 'Antiseptics', price: 500, requiresPrescription: false },
    { name: 'Alcohol (70%)', category: 'Antiseptics', price: 300, requiresPrescription: false },
    { name: 'Gentian violet', category: 'Antiseptics', price: 400, requiresPrescription: false },
    { name: 'Methylene blue', category: 'Antiseptics', price: 600, requiresPrescription: false },
    { name: 'Malachite green', category: 'Antiseptics', price: 500, requiresPrescription: false },
    { name: 'Tetracycline eye ointment', category: 'Ophthalmology', price: 1200, requiresPrescription: true },
    { name: 'Chloramphenicol eye drops', category: 'Ophthalmology', price: 1500, requiresPrescription: true },
    { name: 'Atropine eye drops', category: 'Ophthalmology', price: 2000, requiresPrescription: true }
  ],

  'ROYAL PHARMACY': [
    { name: 'Timolol eye drops', category: 'Ophthalmology', price: 2500, requiresPrescription: true },
    { name: 'Pilocarpine eye drops', category: 'Ophthalmology', price: 2200, requiresPrescription: true },
    { name: 'Tropicamide eye drops', category: 'Ophthalmology', price: 1800, requiresPrescription: true },
    { name: 'Sodium cromoglycate eye drops', category: 'Ophthalmology', price: 2000, requiresPrescription: false },
    { name: 'Artificial tears', category: 'Ophthalmology', price: 1500, requiresPrescription: false },
    { name: 'Ear drops (various)', category: 'ENT', price: 1200, requiresPrescription: false },
    { name: 'Glycerin', category: 'Gastrointestinal', price: 500, requiresPrescription: false },
    { name: 'Docusate sodium', category: 'Gastrointestinal', price: 1000, requiresPrescription: false },
    { name: 'Paregoric', category: 'Gastrointestinal', price: 1500, requiresPrescription: true },
    { name: 'Kaolin-Pectin', category: 'Gastrointestinal', price: 800, requiresPrescription: false },
    { name: 'Diphenoxylate-Atropine', category: 'Gastrointestinal', price: 2000, requiresPrescription: true },
    { name: 'Hyoscyamine', category: 'Gastrointestinal', price: 1800, requiresPrescription: true }
  ],

  'MESSASSI CENTER PHARMACY': [
    { name: 'Phenobarbital', category: 'Neurological', price: 1500, requiresPrescription: true },
    { name: 'Clonazepam', category: 'Neurological', price: 2500, requiresPrescription: true },
    { name: 'Gabapentin', category: 'Neurological', price: 3000, requiresPrescription: true },
    { name: 'Pregabalin', category: 'Neurological', price: 4000, requiresPrescription: true },
    { name: 'Baclofen', category: 'Muscle Relaxants', price: 2200, requiresPrescription: true },
    { name: 'Cyclobenzaprine', category: 'Muscle Relaxants', price: 2800, requiresPrescription: true },
    { name: 'Methocarbamol', category: 'Muscle Relaxants', price: 2500, requiresPrescription: true },
    { name: 'Orphenadrine', category: 'Muscle Relaxants', price: 2000, requiresPrescription: true },
    { name: 'Dantrolene', category: 'Muscle Relaxants', price: 3500, requiresPrescription: true },
    { name: 'Pyridostigmine', category: 'Neurological', price: 3000, requiresPrescription: true },
    { name: 'Neostigmine', category: 'Neurological', price: 2500, requiresPrescription: true },
    { name: 'Edrophonium', category: 'Neurological', price: 2800, requiresPrescription: true }
  ],

  'OBILI CHAPEL PHARMACY': [
    { name: 'Haloperidol', category: 'Psychiatry', price: 2000, requiresPrescription: true },
    { name: 'Chlorpromazine', category: 'Psychiatry', price: 1800, requiresPrescription: true },
    { name: 'Risperidone', category: 'Psychiatry', price: 4000, requiresPrescription: true },
    { name: 'Olanzapine', category: 'Psychiatry', price: 5000, requiresPrescription: true },
    { name: 'Quetiapine', category: 'Psychiatry', price: 4500, requiresPrescription: true },
    { name: 'Lithium carbonate', category: 'Psychiatry', price: 2500, requiresPrescription: true },
    { name: 'Sodium valproate', category: 'Neurological', price: 2800, requiresPrescription: true },
    { name: 'Lamotrigine', category: 'Neurological', price: 3500, requiresPrescription: true },
    { name: 'Topiramate', category: 'Neurological', price: 3200, requiresPrescription: true },
    { name: 'Levetiracetam', category: 'Neurological', price: 4000, requiresPrescription: true },
    { name: 'Phenytoin sodium', category: 'Neurological', price: 2200, requiresPrescription: true },
    { name: 'Ethosuximide', category: 'Neurological', price: 2800, requiresPrescription: true }
  ],

  'TONGOLO PHARMACY': [
    { name: 'Allopurinol', category: 'Rheumatology', price: 2000, requiresPrescription: true },
    { name: 'Colchicine', category: 'Rheumatology', price: 2500, requiresPrescription: true },
    { name: 'Probenecid', category: 'Rheumatology', price: 2200, requiresPrescription: true },
    { name: 'Indomethacin', category: 'Pain Relief', price: 1800, requiresPrescription: true },
    { name: 'Naproxen', category: 'Pain Relief', price: 1500, requiresPrescription: false },
    { name: 'Celecoxib', category: 'Pain Relief', price: 3000, requiresPrescription: true },
    { name: 'Meloxicam', category: 'Pain Relief', price: 2200, requiresPrescription: true },
    { name: 'Piroxicam', category: 'Pain Relief', price: 1800, requiresPrescription: true },
    { name: 'Ketoprofen', category: 'Pain Relief', price: 2000, requiresPrescription: true },
    { name: 'Nimesulide', category: 'Pain Relief', price: 1600, requiresPrescription: false },
    { name: 'Aceclofenac', category: 'Pain Relief', price: 2200, requiresPrescription: true },
    { name: 'Etoricoxib', category: 'Pain Relief', price: 2800, requiresPrescription: true }
  ],

  'PHARMACY OF GRACE': [
    { name: 'Cefalexin', category: 'Antibiotics', price: 2500, requiresPrescription: true },
    { name: 'Cefuroxime', category: 'Antibiotics', price: 3000, requiresPrescription: true },
    { name: 'Ceftriaxone', category: 'Antibiotics', price: 3500, requiresPrescription: true },
    { name: 'Cefixime', category: 'Antibiotics', price: 2800, requiresPrescription: true },
    { name: 'Ampicillin', category: 'Antibiotics', price: 2000, requiresPrescription: true },
    { name: 'Cloxacillin', category: 'Antibiotics', price: 2200, requiresPrescription: true },
    { name: 'Erythromycin', category: 'Antibiotics', price: 2500, requiresPrescription: true },
    { name: 'Clarithromycin', category: 'Antibiotics', price: 3200, requiresPrescription: true },
    { name: 'Tetracycline', category: 'Antibiotics', price: 1800, requiresPrescription: true },
    { name: 'Cotrimoxazole', category: 'Antibiotics', price: 1500, requiresPrescription: true },
    { name: 'Nitrofurantoin', category: 'Antibiotics', price: 2000, requiresPrescription: true },
    { name: 'Norfloxacin', category: 'Antibiotics', price: 2500, requiresPrescription: true }
  ]
};

async function addRemainingMedications() {
  console.log('💊 Adding remaining medication inventory for Cameroon pharmacies...\n');

  try {
    // Test database connection
    const connectionTest = await Database.testConnection();
    if (!connectionTest.success) {
      console.log('❌ Database connection failed:', connectionTest.error);
      return;
    }

    console.log('✅ Database connection successful');

    let totalMedications = 0;
    let totalInventoryItems = 0;

    // Process each pharmacy
    for (const [pharmacyName, medications] of Object.entries(remainingPharmacyMedications)) {
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
    console.log(`🏥 Pharmacies processed: ${Object.keys(remainingPharmacyMedications).length}`);

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

    console.log('\n🎉 All medication inventory successfully added to Cameroon pharmacies!');

  } catch (error) {
    console.error('❌ Error adding medications:', error);
  } finally {
    await Database.close();
  }
}

// Run the script
addRemainingMedications().catch(console.error);
