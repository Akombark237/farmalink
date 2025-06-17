-- 07_cameroon_pharmacies.sql
-- Insert Cameroon pharmacies data into pharmacy_profiles table

-- Insert Cameroon pharmacies in Yaoundé
INSERT INTO pharmacy_profiles (
  name, license_number, address, city, state, zip_code, 
  phone, email, rating, total_reviews, status, country,
  latitude, longitude, created_at, updated_at
) VALUES 
-- EKOUMDOUM PHARMACY
(
  'EKOUMDOUM PHARMACY',
  'CM-YDE-001',
  'HAPPY EKOUMDOUM',
  'Yaoundé',
  'Centre',
  '00000',
  '650 85 30 31',
  'ekoumdoum.pharmacy@example.cm',
  4.2,
  45,
  'approved',
  'Cameroon',
  3.8480,  -- Approximate coordinates for Yaoundé
  11.5021,
  NOW(),
  NOW()
),

-- HAPPY EKOUMDOUM PHARMACY  
(
  'HAPPY EKOUMDOUM PHARMACY',
  'CM-YDE-002',
  'HAPPY EKOUMDOUM',
  'Yaoundé',
  'Centre',
  '00000',
  '620 02 44 92',
  'happy.ekoumdoum@example.cm',
  4.5,
  67,
  'approved',
  'Cameroon',
  3.8485,
  11.5025,
  NOW(),
  NOW()
),

-- GOLF PHARMACY
(
  'GOLF PHARMACY',
  'CM-YDE-003',
  'Carrefour GOLF',
  'Yaoundé',
  'Centre',
  '00000',
  '692 33 47 46',
  'golf.pharmacy@example.cm',
  4.3,
  89,
  'approved',
  'Cameroon',
  3.8520,
  11.5080,
  NOW(),
  NOW()
),

-- GOOD BERGER PHARMACY
(
  'GOOD BERGER PHARMACY',
  'CM-YDE-004',
  'NEW OMNISPORTS ROAD FOE street',
  'Yaoundé',
  'Centre',
  '00000',
  '242 60 67 77',
  'goodberger.pharmacy@example.cm',
  4.1,
  34,
  'approved',
  'Cameroon',
  3.8450,
  11.4980,
  NOW(),
  NOW()
),

-- 2 CHAPEL PHARMACY
(
  '2 CHAPEL PHARMACY',
  'CM-YDE-005',
  'NGOUSSO CHAPEL',
  'Yaoundé',
  'Centre',
  '00000',
  '222 21 33 21',
  'chapel2.pharmacy@example.cm',
  4.0,
  28,
  'approved',
  'Cameroon',
  3.8600,
  11.5150,
  NOW(),
  NOW()
),

-- CODEX PHARMACY
(
  'CODEX PHARMACY',
  'CM-YDE-006',
  'AHALA 1, PHARMACAM entrance',
  'Yaoundé',
  'Centre',
  '00000',
  '242 07 59 88',
  'codex.pharmacy@example.cm',
  4.4,
  52,
  'approved',
  'Cameroon',
  3.8350,
  11.4900,
  NOW(),
  NOW()
),

-- PHARMACY OF THE VERSE
(
  'PHARMACY OF THE VERSE',
  'CM-YDE-007',
  'BEHIND CINEMA REX',
  'Yaoundé',
  'Centre',
  '00000',
  '222 20 95 07',
  'verse.pharmacy@example.cm',
  3.9,
  23,
  'approved',
  'Cameroon',
  3.8470,
  11.5010,
  NOW(),
  NOW()
),

-- BIYEM-ASSI PHARMACY
(
  'BIYEM-ASSI PHARMACY',
  'CM-YDE-008',
  'facing NIKI',
  'Yaoundé',
  'Centre',
  '00000',
  '222 31 71 93',
  'biyemassi.pharmacy@example.cm',
  4.6,
  78,
  'approved',
  'Cameroon',
  3.8380,
  11.4950,
  NOW(),
  NOW()
),

-- LE CIGNE ODZA PHARMACY
(
  'LE CIGNE ODZA PHARMACY',
  'CM-YDE-009',
  'FACE TOTAL TERMINAL 10 ODZA',
  'Yaoundé',
  'Centre',
  '00000',
  '657 35 88 353',
  'lecigne.odza@example.cm',
  4.7,
  95,
  'approved',
  'Cameroon',
  3.8650,
  11.5200,
  NOW(),
  NOW()
),

-- GENEVA PHARMACY
(
  'GENEVA PHARMACY',
  'CM-YDE-010',
  'NEW MIMBOMAN ROAD MVOG ENYEGUE CROSSROAD',
  'Yaoundé',
  'Centre',
  '00000',
  '657 83 10 64',
  'geneva.pharmacy@example.cm',
  4.2,
  41,
  'approved',
  'Cameroon',
  3.8550,
  11.5100,
  NOW(),
  NOW()
),

-- H&L PHARMACY
(
  'H&L PHARMACY',
  'CM-YDE-011',
  'Opposite Essomba Bakery',
  'Yaoundé',
  'Centre',
  '00000',
  '696 61 39 74',
  'hl.pharmacy@example.cm',
  4.3,
  56,
  'approved',
  'Cameroon',
  3.8420,
  11.4970,
  NOW(),
  NOW()
),

-- XAVYO PHARMACY
(
  'XAVYO PHARMACY',
  'CM-YDE-012',
  'OFFICERS'' MESS',
  'Yaoundé',
  'Centre',
  '00000',
  '222 23 63 40',
  'xavyo.pharmacy@example.cm',
  4.1,
  33,
  'approved',
  'Cameroon',
  3.8500,
  11.5050,
  NOW(),
  NOW()
),

-- OYOM ABANG PHARMACY
(
  'OYOM ABANG PHARMACY',
  'CM-YDE-013',
  'MARKET SQUARE',
  'Yaoundé',
  'Centre',
  '00000',
  '678 59 56 66',
  'oyomabang.pharmacy@example.cm',
  4.0,
  29,
  'approved',
  'Cameroon',
  3.8460,
  11.5000,
  NOW(),
  NOW()
),

-- ROYAL PHARMACY
(
  'ROYAL PHARMACY',
  'CM-YDE-014',
  'ELIG-EFFA',
  'Yaoundé',
  'Centre',
  '00000',
  '222 22 32 17',
  'royal.pharmacy@example.cm',
  4.5,
  72,
  'approved',
  'Cameroon',
  3.8530,
  11.5070,
  NOW(),
  NOW()
),

-- MESSASSI CENTER PHARMACY
(
  'MESSASSI CENTER PHARMACY',
  'CM-YDE-015',
  'MESSASSI Crossroads',
  'Yaoundé',
  'Centre',
  '00000',
  '222 21 81 72',
  'messassi.center@example.cm',
  4.4,
  63,
  'approved',
  'Cameroon',
  3.8400,
  11.4920,
  NOW(),
  NOW()
),

-- OBILI CHAPEL PHARMACY
(
  'OBILI CHAPEL PHARMACY',
  'CM-YDE-016',
  'OBILI CHAPEL',
  'Yaoundé',
  'Centre',
  '00000',
  '222 31 41 22',
  'obili.chapel@example.cm',
  4.2,
  48,
  'approved',
  'Cameroon',
  3.8580,
  11.5120,
  NOW(),
  NOW()
),

-- TONGOLO PHARMACY
(
  'TONGOLO PHARMACY',
  'CM-YDE-017',
  'Carrefour CLUB YANNICK',
  'Yaoundé',
  'Centre',
  '00000',
  '222 20 94 85',
  'tongolo.pharmacy@example.cm',
  4.1,
  37,
  'approved',
  'Cameroon',
  3.8440,
  11.4990,
  NOW(),
  NOW()
),

-- PHARMACY OF GRACE
(
  'PHARMACY OF GRACE',
  'CM-YDE-018',
  'MENDONG - PEACE Hardware Store',
  'Yaoundé',
  'Centre',
  '00000',
  '242 04 15 61',
  'grace.pharmacy@example.cm',
  4.3,
  51,
  'approved',
  'Cameroon',
  3.8320,
  11.4880,
  NOW(),
  NOW()
);

-- Add pharmacy hours for all Cameroon pharmacies (typical hours)
INSERT INTO pharmacy_hours (pharmacy_id, day_of_week, open_time, close_time, is_closed)
SELECT 
  pp.id,
  generate_series(1, 6) as day_of_week,  -- Monday to Saturday
  '08:00:00'::time as open_time,
  '20:00:00'::time as close_time,
  false as is_closed
FROM pharmacy_profiles pp 
WHERE pp.country = 'Cameroon';

-- Add Sunday hours (shorter hours)
INSERT INTO pharmacy_hours (pharmacy_id, day_of_week, open_time, close_time, is_closed)
SELECT 
  pp.id,
  0 as day_of_week,  -- Sunday
  '09:00:00'::time as open_time,
  '18:00:00'::time as close_time,
  false as is_closed
FROM pharmacy_profiles pp 
WHERE pp.country = 'Cameroon';

-- Add some basic services for Cameroon pharmacies
INSERT INTO pharmacy_services (pharmacy_id, service_name, description, is_available)
SELECT 
  pp.id,
  service_name,
  description,
  true
FROM pharmacy_profiles pp 
CROSS JOIN (
  VALUES 
    ('Prescription Filling', 'Fill prescriptions from doctors'),
    ('Over-the-Counter Medications', 'Non-prescription medications available'),
    ('Health Consultation', 'Basic health advice and consultation'),
    ('Blood Pressure Check', 'Free blood pressure monitoring'),
    ('Vaccination Services', 'Various vaccination services available')
) AS services(service_name, description)
WHERE pp.country = 'Cameroon';

-- Update statistics
UPDATE pharmacy_profiles 
SET updated_at = NOW() 
WHERE country = 'Cameroon';

-- Display summary
SELECT 
  COUNT(*) as total_cameroon_pharmacies,
  AVG(rating) as average_rating,
  SUM(total_reviews) as total_reviews
FROM pharmacy_profiles 
WHERE country = 'Cameroon';
