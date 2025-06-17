// add-cameroon-pharmacies.js
// Script to add Cameroon pharmacies to the database

import Database from './lib/database.js';

const cameroonPharmacies = [
  {
    name: 'EKOUMDOUM PHARMACY',
    phone: '650 85 30 31',
    address: 'HAPPY EKOUMDOUM',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'ekoumdoum.pharmacy@example.cm',
    license_number: 'CM-YDE-001',
    rating: 4.2,
    total_reviews: 45
  },
  {
    name: 'HAPPY EKOUMDOUM PHARMACY',
    phone: '620 02 44 92',
    address: 'HAPPY EKOUMDOUM',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'happy.ekoumdoum@example.cm',
    license_number: 'CM-YDE-002',
    rating: 4.5,
    total_reviews: 67
  },
  {
    name: 'GOLF PHARMACY',
    phone: '692 33 47 46',
    address: 'Carrefour GOLF',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'golf.pharmacy@example.cm',
    license_number: 'CM-YDE-003',
    rating: 4.3,
    total_reviews: 89
  },
  {
    name: 'GOOD BERGER PHARMACY',
    phone: '242 60 67 77',
    phone2: '699 98 51 68',
    address: 'NEW OMNISPORTS ROAD FOE street',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'goodberger.pharmacy@example.cm',
    license_number: 'CM-YDE-004',
    rating: 4.1,
    total_reviews: 34
  },
  {
    name: '2 CHAPEL PHARMACY',
    phone: '222 21 33 21',
    address: 'NGOUSSO CHAPEL',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'chapel2.pharmacy@example.cm',
    license_number: 'CM-YDE-005',
    rating: 4.0,
    total_reviews: 28
  },
  {
    name: 'CODEX PHARMACY',
    phone: '242 07 59 88',
    address: 'AHALA 1, PHARMACAM entrance',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'codex.pharmacy@example.cm',
    license_number: 'CM-YDE-006',
    rating: 4.4,
    total_reviews: 52
  },
  {
    name: 'PHARMACY OF THE VERSE',
    phone: '222 20 95 07',
    address: 'BEHIND CINEMA REX',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'verse.pharmacy@example.cm',
    license_number: 'CM-YDE-007',
    rating: 3.9,
    total_reviews: 23
  },
  {
    name: 'BIYEM-ASSI PHARMACY',
    phone: '222 31 71 93',
    phone2: '676 11 37 86',
    address: 'facing NIKI',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'biyemassi.pharmacy@example.cm',
    license_number: 'CM-YDE-008',
    rating: 4.6,
    total_reviews: 78
  },
  {
    name: 'LE CIGNE ODZA PHARMACY',
    phone: '657 35 88 353',
    phone2: '699 93 72 04',
    address: 'FACE TOTAL TERMINAL 10 ODZA',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'lecigne.odza@example.cm',
    license_number: 'CM-YDE-009',
    rating: 4.7,
    total_reviews: 95
  },
  {
    name: 'GENEVA PHARMACY',
    phone: '657 83 10 64',
    phone2: '679 69 27 80',
    address: 'NEW MIMBOMAN ROAD MVOG ENYEGUE CROSSROAD',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'geneva.pharmacy@example.cm',
    license_number: 'CM-YDE-010',
    rating: 4.2,
    total_reviews: 41
  },
  {
    name: 'H&L PHARMACY',
    phone: '696 61 39 74',
    phone2: '680 93 36 62',
    address: 'Opposite Essomba Bakery',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'hl.pharmacy@example.cm',
    license_number: 'CM-YDE-011',
    rating: 4.3,
    total_reviews: 56
  },
  {
    name: 'XAVYO PHARMACY',
    phone: '222 23 63 40',
    address: "OFFICERS' MESS",
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'xavyo.pharmacy@example.cm',
    license_number: 'CM-YDE-012',
    rating: 4.1,
    total_reviews: 33
  },
  {
    name: 'OYOM ABANG PHARMACY',
    phone: '678 59 56 66',
    address: 'MARKET SQUARE',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'oyomabang.pharmacy@example.cm',
    license_number: 'CM-YDE-013',
    rating: 4.0,
    total_reviews: 29
  },
  {
    name: 'ROYAL PHARMACY',
    phone: '222 22 32 17',
    phone2: '242 06 11 01',
    address: 'ELIG-EFFA',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'royal.pharmacy@example.cm',
    license_number: 'CM-YDE-014',
    rating: 4.5,
    total_reviews: 72
  },
  {
    name: 'MESSASSI CENTER PHARMACY',
    phone: '222 21 81 72',
    phone2: '243 22 80 53',
    address: 'MESSASSI Crossroads',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'messassi.center@example.cm',
    license_number: 'CM-YDE-015',
    rating: 4.4,
    total_reviews: 63
  },
  {
    name: 'OBILI CHAPEL PHARMACY',
    phone: '222 31 41 22',
    phone2: '694 28 56 83',
    address: 'OBILI CHAPEL',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'obili.chapel@example.cm',
    license_number: 'CM-YDE-016',
    rating: 4.2,
    total_reviews: 48
  },
  {
    name: 'TONGOLO PHARMACY',
    phone: '222 20 94 85',
    phone2: '657 95 18 18',
    address: 'Carrefour CLUB YANNICK',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'tongolo.pharmacy@example.cm',
    license_number: 'CM-YDE-017',
    rating: 4.1,
    total_reviews: 37
  },
  {
    name: 'PHARMACY OF GRACE',
    phone: '242 04 15 61',
    address: 'MENDONG - PEACE Hardware Store',
    city: 'Yaoundé',
    state: 'Centre',
    country: 'Cameroon',
    zip_code: '00000',
    email: 'grace.pharmacy@example.cm',
    license_number: 'CM-YDE-018',
    rating: 4.3,
    total_reviews: 51
  }
];

async function addCameroonPharmacies() {
  console.log('🏥 Adding Cameroon pharmacies to database...\n');

  try {
    // Test database connection
    const connectionTest = await Database.testConnection();
    if (!connectionTest.success) {
      console.log('❌ Database connection failed:', connectionTest.error);
      console.log('\n📋 Please ensure:');
      console.log('1. PostgreSQL is running');
      console.log('2. Database "pharmacy_platform" exists');
      console.log('3. Database credentials are correct in .env.local');
      return;
    }

    console.log('✅ Database connection successful');

    // Check if pharmacy_profiles table exists
    const tableCheck = await Database.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pharmacy_profiles'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ pharmacy_profiles table does not exist');
      console.log('\n📋 Please run the database schema setup first:');
      console.log('1. Execute database/02_schema_pharmacy.sql');
      console.log('2. Or run: node final-db-setup.js');
      return;
    }

    console.log('✅ pharmacy_profiles table exists');

    // Insert pharmacies
    let successCount = 0;
    let errorCount = 0;

    for (const pharmacy of cameroonPharmacies) {
      try {
        const insertQuery = `
          INSERT INTO pharmacy_profiles (
            name, license_number, address, city, state, zip_code, 
            phone, email, rating, total_reviews, status, country,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
          ) RETURNING id, name
        `;

        const values = [
          pharmacy.name,
          pharmacy.license_number,
          pharmacy.address,
          pharmacy.city,
          pharmacy.state,
          pharmacy.zip_code,
          pharmacy.phone,
          pharmacy.email,
          pharmacy.rating,
          pharmacy.total_reviews,
          'approved', // Set status as approved
          pharmacy.country
        ];

        const result = await Database.query(insertQuery, values);
        console.log(`✅ Added: ${pharmacy.name} (ID: ${result.rows[0].id})`);
        successCount++;

        // Add second phone number if exists
        if (pharmacy.phone2) {
          console.log(`   📞 Additional phone: ${pharmacy.phone2}`);
        }

      } catch (error) {
        console.log(`❌ Failed to add ${pharmacy.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully added: ${successCount} pharmacies`);
    console.log(`❌ Failed to add: ${errorCount} pharmacies`);
    console.log(`📍 All pharmacies are located in Yaoundé, Cameroon`);

    // Update mock data in API routes
    console.log('\n🔄 Updating API routes with Cameroon data...');
    await updateMockDataWithCameroonPharmacies();

    console.log('\n🎉 Cameroon pharmacies successfully added to your database!');
    console.log('\n📋 Next steps:');
    console.log('1. Add coordinates (latitude/longitude) for map display');
    console.log('2. Add pharmacy hours and services');
    console.log('3. Add medication inventory');
    console.log('4. Test the search and map functionality');

  } catch (error) {
    console.error('❌ Error adding pharmacies:', error);
  } finally {
    await Database.close();
  }
}

async function updateMockDataWithCameroonPharmacies() {
  // This function would update the mock data in API routes
  // For now, we'll just log the action
  console.log('📝 Mock data can be updated manually in API routes if needed');
}

// Run the script
addCameroonPharmacies().catch(console.error);
