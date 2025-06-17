-- 08_cameroon_medications.sql
-- Insert medication inventory for Cameroon pharmacies

-- First, let's create medication categories if they don't exist
INSERT INTO medication_categories (name, description, created_at, updated_at) VALUES
('Pain Relief', 'Medications for pain management and inflammation', NOW(), NOW()),
('Antibiotics', 'Antimicrobial medications for bacterial infections', NOW(), NOW()),
('Antimalarials', 'Medications for malaria prevention and treatment', NOW(), NOW()),
('Cardiovascular', 'Medications for heart and blood vessel conditions', NOW(), NOW()),
('Gastrointestinal', 'Medications for digestive system disorders', NOW(), NOW()),
('Neurological', 'Medications for nervous system disorders', NOW(), NOW()),
('Respiratory', 'Medications for breathing and lung conditions', NOW(), NOW()),
('Dermatology', 'Medications for skin conditions', NOW(), NOW()),
('Vitamins', 'Vitamin and mineral supplements', NOW(), NOW()),
('Endocrine', 'Medications for hormonal disorders', NOW(), NOW()),
('Antihistamines', 'Medications for allergic reactions', NOW(), NOW()),
('Corticosteroids', 'Anti-inflammatory steroid medications', NOW(), NOW()),
('Antifungals', 'Medications for fungal infections', NOW(), NOW()),
('Antivirals', 'Medications for viral infections', NOW(), NOW()),
('Antiparasitics', 'Medications for parasitic infections', NOW(), NOW()),
('Obstetrics', 'Medications for pregnancy and childbirth', NOW(), NOW()),
('Contraceptives', 'Birth control medications', NOW(), NOW()),
('Vaccines', 'Immunization products', NOW(), NOW()),
('Antiseptics', 'Topical antimicrobial products', NOW(), NOW()),
('Ophthalmology', 'Eye medications', NOW(), NOW()),
('ENT', 'Ear, nose, and throat medications', NOW(), NOW()),
('Muscle Relaxants', 'Medications for muscle spasms', NOW(), NOW()),
('Psychiatry', 'Medications for mental health conditions', NOW(), NOW()),
('Rheumatology', 'Medications for joint and autoimmune conditions', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert common medications (sample - this would be much longer in practice)
INSERT INTO medications (name, generic_name, category, description, requires_prescription, created_at, updated_at) VALUES
-- Pain Relief
('Paracetamol (Acetaminophen)', 'Acetaminophen', 'Pain Relief', 'Common pain reliever and fever reducer', false, NOW(), NOW()),
('Ibuprofen', 'Ibuprofen', 'Pain Relief', 'NSAID for pain and inflammation', false, NOW(), NOW()),
('Aspirin', 'Acetylsalicylic acid', 'Pain Relief', 'Pain reliever and blood thinner', false, NOW(), NOW()),
('Diclofenac', 'Diclofenac', 'Pain Relief', 'NSAID for pain and inflammation', false, NOW(), NOW()),
('Tramadol', 'Tramadol', 'Pain Relief', 'Opioid pain medication', true, NOW(), NOW()),

-- Antibiotics
('Amoxicillin', 'Amoxicillin', 'Antibiotics', 'Penicillin antibiotic', true, NOW(), NOW()),
('Ciprofloxacin', 'Ciprofloxacin', 'Antibiotics', 'Fluoroquinolone antibiotic', true, NOW(), NOW()),
('Metronidazole', 'Metronidazole', 'Antibiotics', 'Antibiotic for anaerobic bacteria', true, NOW(), NOW()),
('Doxycycline', 'Doxycycline', 'Antibiotics', 'Tetracycline antibiotic', true, NOW(), NOW()),
('Azithromycin', 'Azithromycin', 'Antibiotics', 'Macrolide antibiotic', true, NOW(), NOW()),

-- Antimalarials
('Chloroquine', 'Chloroquine', 'Antimalarials', 'Antimalarial medication', true, NOW(), NOW()),
('Artemether-Lumefantrine', 'Artemether-Lumefantrine', 'Antimalarials', 'Combination antimalarial', true, NOW(), NOW()),
('Quinine', 'Quinine', 'Antimalarials', 'Antimalarial for severe malaria', true, NOW(), NOW()),

-- Cardiovascular
('Lisinopril', 'Lisinopril', 'Cardiovascular', 'ACE inhibitor for blood pressure', true, NOW(), NOW()),
('Amlodipine', 'Amlodipine', 'Cardiovascular', 'Calcium channel blocker', true, NOW(), NOW()),
('Atenolol', 'Atenolol', 'Cardiovascular', 'Beta blocker', true, NOW(), NOW()),
('Metformin', 'Metformin', 'Diabetes', 'Diabetes medication', true, NOW(), NOW()),

-- Gastrointestinal
('Omeprazole', 'Omeprazole', 'Gastrointestinal', 'Proton pump inhibitor', false, NOW(), NOW()),
('Ranitidine', 'Ranitidine', 'Gastrointestinal', 'H2 receptor antagonist', false, NOW(), NOW()),
('ORS (Oral Rehydration Salts)', 'Oral Rehydration Salts', 'Gastrointestinal', 'Rehydration solution', false, NOW(), NOW()),

-- Vitamins
('Vitamin C', 'Ascorbic acid', 'Vitamins', 'Vitamin C supplement', false, NOW(), NOW()),
('Folic Acid', 'Folic acid', 'Vitamins', 'B vitamin supplement', false, NOW(), NOW()),
('Iron supplements', 'Ferrous sulfate', 'Vitamins', 'Iron supplement for anemia', false, NOW(), NOW()),

-- Antihistamines
('Loratadine', 'Loratadine', 'Antihistamines', 'Non-sedating antihistamine', false, NOW(), NOW()),
('Cetirizine', 'Cetirizine', 'Antihistamines', 'Antihistamine for allergies', false, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- Now let's add pharmacy inventory for each pharmacy
-- This is a simplified version - in practice, you'd have hundreds of medications per pharmacy

-- EKOUMDOUM PHARMACY inventory
INSERT INTO pharmacy_inventory (pharmacy_id, medication_id, price, stock_quantity, is_available, last_updated, created_at, updated_at)
SELECT 
    pp.id as pharmacy_id,
    m.id as medication_id,
    CASE m.name
        WHEN 'Paracetamol (Acetaminophen)' THEN 500
        WHEN 'Ibuprofen' THEN 750
        WHEN 'Aspirin' THEN 400
        WHEN 'Amoxicillin' THEN 2500
        WHEN 'Ciprofloxacin' THEN 3000
        WHEN 'Metronidazole' THEN 1800
        WHEN 'Omeprazole' THEN 2200
        WHEN 'Ranitidine' THEN 1500
        WHEN 'Loratadine' THEN 1200
        WHEN 'Cetirizine' THEN 1000
        WHEN 'Diclofenac' THEN 800
        ELSE 1500
    END as price,
    FLOOR(RANDOM() * 100 + 10) as stock_quantity,
    true as is_available,
    NOW() as last_updated,
    NOW() as created_at,
    NOW() as updated_at
FROM pharmacy_profiles pp
CROSS JOIN medications m
WHERE pp.name = 'EKOUMDOUM PHARMACY'
AND m.name IN (
    'Paracetamol (Acetaminophen)', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 
    'Ciprofloxacin', 'Metronidazole', 'Omeprazole', 'Ranitidine', 
    'Loratadine', 'Cetirizine', 'Diclofenac'
)
ON CONFLICT (pharmacy_id, medication_id) DO NOTHING;

-- GOLF PHARMACY inventory (specialized in cardiovascular and diabetes)
INSERT INTO pharmacy_inventory (pharmacy_id, medication_id, price, stock_quantity, is_available, last_updated, created_at, updated_at)
SELECT 
    pp.id as pharmacy_id,
    m.id as medication_id,
    CASE m.name
        WHEN 'Metformin' THEN 2000
        WHEN 'Lisinopril' THEN 2500
        WHEN 'Amlodipine' THEN 2800
        WHEN 'Atenolol' THEN 1800
        ELSE 2000
    END as price,
    FLOOR(RANDOM() * 100 + 10) as stock_quantity,
    true as is_available,
    NOW() as last_updated,
    NOW() as created_at,
    NOW() as updated_at
FROM pharmacy_profiles pp
CROSS JOIN medications m
WHERE pp.name = 'GOLF PHARMACY'
AND m.name IN ('Metformin', 'Lisinopril', 'Amlodipine', 'Atenolol')
ON CONFLICT (pharmacy_id, medication_id) DO NOTHING;

-- CODEX PHARMACY inventory (specialized in antimalarials)
INSERT INTO pharmacy_inventory (pharmacy_id, medication_id, price, stock_quantity, is_available, last_updated, created_at, updated_at)
SELECT 
    pp.id as pharmacy_id,
    m.id as medication_id,
    CASE m.name
        WHEN 'Chloroquine' THEN 1500
        WHEN 'Artemether-Lumefantrine' THEN 3500
        WHEN 'Quinine' THEN 2500
        WHEN 'Doxycycline' THEN 2800
        ELSE 2000
    END as price,
    FLOOR(RANDOM() * 100 + 10) as stock_quantity,
    true as is_available,
    NOW() as last_updated,
    NOW() as created_at,
    NOW() as updated_at
FROM pharmacy_profiles pp
CROSS JOIN medications m
WHERE pp.name = 'CODEX PHARMACY'
AND m.name IN ('Chloroquine', 'Artemether-Lumefantrine', 'Quinine', 'Doxycycline')
ON CONFLICT (pharmacy_id, medication_id) DO NOTHING;

-- Add common medications to all pharmacies
INSERT INTO pharmacy_inventory (pharmacy_id, medication_id, price, stock_quantity, is_available, last_updated, created_at, updated_at)
SELECT 
    pp.id as pharmacy_id,
    m.id as medication_id,
    FLOOR(RANDOM() * 2000 + 500) as price, -- Random price between 500-2500 CFA
    FLOOR(RANDOM() * 100 + 10) as stock_quantity,
    true as is_available,
    NOW() as last_updated,
    NOW() as created_at,
    NOW() as updated_at
FROM pharmacy_profiles pp
CROSS JOIN medications m
WHERE pp.country = 'Cameroon'
AND m.name IN (
    'Paracetamol (Acetaminophen)', 'Ibuprofen', 'Aspirin', 
    'Omeprazole', 'Vitamin C', 'ORS (Oral Rehydration Salts)'
)
ON CONFLICT (pharmacy_id, medication_id) DO NOTHING;

-- Update pharmacy medication counts
UPDATE pharmacy_profiles 
SET medication_count = (
    SELECT COUNT(*) 
    FROM pharmacy_inventory pi 
    WHERE pi.pharmacy_id = pharmacy_profiles.id 
    AND pi.is_available = true
),
updated_at = NOW()
WHERE country = 'Cameroon';

-- Create some medication specializations for pharmacies
-- LE CIGNE ODZA PHARMACY - Maternal health specialization
UPDATE pharmacy_profiles 
SET specialization = 'Maternal Health and Obstetrics',
    description = 'Specialized in maternal health, contraceptives, and obstetric medications'
WHERE name = 'LE CIGNE ODZA PHARMACY';

-- CODEX PHARMACY - Antimalarial specialization  
UPDATE pharmacy_profiles 
SET specialization = 'Antimalarial and Tropical Diseases',
    description = 'Specialized in antimalarial medications and tropical disease treatments'
WHERE name = 'CODEX PHARMACY';

-- GOLF PHARMACY - Cardiovascular and Diabetes
UPDATE pharmacy_profiles 
SET specialization = 'Cardiovascular and Diabetes Care',
    description = 'Specialized in cardiovascular medications and diabetes management'
WHERE name = 'GOLF PHARMACY';

-- Display summary
SELECT 
    pp.name as pharmacy_name,
    COUNT(pi.id) as medication_count,
    AVG(pi.price) as average_price,
    pp.specialization
FROM pharmacy_profiles pp
LEFT JOIN pharmacy_inventory pi ON pp.id = pi.pharmacy_id AND pi.is_available = true
WHERE pp.country = 'Cameroon'
GROUP BY pp.id, pp.name, pp.specialization
ORDER BY medication_count DESC;
