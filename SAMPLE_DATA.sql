-- =====================================================
-- SAMPLE DATA FOR PHARMACY PLATFORM
-- Run this AFTER the schema setup
-- =====================================================

-- Insert medication categories
INSERT INTO medication_categories (id, name, description) VALUES
(uuid_generate_v4(), 'Pain Relief', 'Medications for pain management and inflammation'),
(uuid_generate_v4(), 'Antibiotics', 'Medications to treat bacterial infections'),
(uuid_generate_v4(), 'Blood Pressure', 'Medications for hypertension management'),
(uuid_generate_v4(), 'Diabetes', 'Medications for diabetes management'),
(uuid_generate_v4(), 'Cholesterol', 'Medications for cholesterol management'),
(uuid_generate_v4(), 'Vitamins & Supplements', 'Nutritional supplements and vitamins'),
(uuid_generate_v4(), 'Cold & Flu', 'Medications for cold and flu symptoms'),
(uuid_generate_v4(), 'Allergy', 'Medications for allergy relief');

-- Insert medications
INSERT INTO medications (id, name, generic_name, category_id, manufacturer, description, requires_prescription, strengths, dosage_forms, image_url) VALUES
(uuid_generate_v4(), 'Paracetamol', 'Acetaminophen', (SELECT id FROM medication_categories WHERE name = 'Pain Relief'), 'Generic Pharma', 'Pain reliever and fever reducer', false, ARRAY['500mg', '325mg'], ARRAY['tablet', 'liquid'], '/images/medications/paracetamol.jpg'),
(uuid_generate_v4(), 'Amoxicillin', 'Amoxicillin', (SELECT id FROM medication_categories WHERE name = 'Antibiotics'), 'Antibiotic Corp', 'Antibiotic for bacterial infections', true, ARRAY['250mg', '500mg'], ARRAY['capsule', 'liquid'], '/images/medications/amoxicillin.jpg'),
(uuid_generate_v4(), 'Lisinopril', 'Lisinopril', (SELECT id FROM medication_categories WHERE name = 'Blood Pressure'), 'CardioMed', 'ACE inhibitor for blood pressure', true, ARRAY['5mg', '10mg', '20mg'], ARRAY['tablet'], '/images/medications/lisinopril.jpg'),
(uuid_generate_v4(), 'Metformin', 'Metformin', (SELECT id FROM medication_categories WHERE name = 'Diabetes'), 'DiabetesCare', 'Medication for type 2 diabetes', true, ARRAY['500mg', '850mg', '1000mg'], ARRAY['tablet'], '/images/medications/metformin.jpg'),
(uuid_generate_v4(), 'Atorvastatin', 'Atorvastatin', (SELECT id FROM medication_categories WHERE name = 'Cholesterol'), 'CholesterolRx', 'Statin for cholesterol management', true, ARRAY['10mg', '20mg', '40mg'], ARRAY['tablet'], '/images/medications/atorvastatin.jpg'),
(uuid_generate_v4(), 'Vitamin D3', 'Cholecalciferol', (SELECT id FROM medication_categories WHERE name = 'Vitamins & Supplements'), 'VitaminCorp', 'Vitamin D supplement', false, ARRAY['1000IU', '2000IU', '5000IU'], ARRAY['tablet', 'softgel'], '/images/medications/vitamin-d3.jpg'),
(uuid_generate_v4(), 'Ibuprofen', 'Ibuprofen', (SELECT id FROM medication_categories WHERE name = 'Pain Relief'), 'PainAway', 'Anti-inflammatory pain reliever', false, ARRAY['200mg', '400mg', '600mg'], ARRAY['tablet', 'liquid'], '/images/medications/ibuprofen.jpg'),
(uuid_generate_v4(), 'Cetirizine', 'Cetirizine', (SELECT id FROM medication_categories WHERE name = 'Allergy'), 'AllergyFree', 'Antihistamine for allergies', false, ARRAY['10mg'], ARRAY['tablet', 'liquid'], '/images/medications/cetirizine.jpg');

-- Insert admin user
INSERT INTO users (id, email, password_hash, user_type, status, email_verified) VALUES
(uuid_generate_v4(), 'admin@pharmconnect.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'admin', 'active', true);

-- Insert sample patient users
INSERT INTO users (id, email, password_hash, user_type, status, email_verified) VALUES
(uuid_generate_v4(), 'john.doe@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'patient', 'active', true),
(uuid_generate_v4(), 'jane.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'patient', 'active', true),
(uuid_generate_v4(), 'mike.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'patient', 'active', true);

-- Insert sample pharmacy users
INSERT INTO users (id, email, password_hash, user_type, status, email_verified) VALUES
(uuid_generate_v4(), 'healthfirst@pharmacy.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'pharmacy', 'active', true),
(uuid_generate_v4(), 'medicare@pharmacy.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'pharmacy', 'active', true),
(uuid_generate_v4(), 'quickmeds@pharmacy.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'pharmacy', 'active', true);

-- Insert patient profiles
INSERT INTO patient_profiles (id, user_id, first_name, last_name, date_of_birth, gender, address, city, state, zip_code, phone) VALUES
(uuid_generate_v4(), (SELECT id FROM users WHERE email = 'john.doe@email.com'), 'John', 'Doe', '1985-06-15', 'Male', '123 Main St', 'New York', 'NY', '10001', '+1-212-555-0101'),
(uuid_generate_v4(), (SELECT id FROM users WHERE email = 'jane.smith@email.com'), 'Jane', 'Smith', '1990-03-22', 'Female', '456 Oak Ave', 'New York', 'NY', '10002', '+1-212-555-0102'),
(uuid_generate_v4(), (SELECT id FROM users WHERE email = 'mike.johnson@email.com'), 'Mike', 'Johnson', '1978-11-08', 'Male', '789 Pine St', 'New York', 'NY', '10003', '+1-212-555-0103');

-- Insert pharmacy profiles
INSERT INTO pharmacy_profiles (id, user_id, name, license_number, address, city, state, zip_code, phone, email, status, rating, total_reviews, description) VALUES
(uuid_generate_v4(), (SELECT id FROM users WHERE email = 'healthfirst@pharmacy.com'), 'HealthFirst Pharmacy', 'PH-NY-001', '123 Wellness Ave', 'New York', 'NY', '10001', '+1-212-555-0123', 'contact@healthfirst.com', 'approved', 4.5, 150, 'Your trusted neighborhood pharmacy providing quality healthcare services for over 20 years.'),
(uuid_generate_v4(), (SELECT id FROM users WHERE email = 'medicare@pharmacy.com'), 'MediCare Plus Pharmacy', 'PH-NY-002', '456 Health Blvd', 'New York', 'NY', '10002', '+1-212-555-0456', 'info@medicareplus.com', 'approved', 4.3, 89, 'Comprehensive pharmacy services with specialized care for chronic conditions.'),
(uuid_generate_v4(), (SELECT id FROM users WHERE email = 'quickmeds@pharmacy.com'), 'QuickMeds Express', 'PH-NY-003', '789 Fast Lane', 'New York', 'NY', '10003', '+1-212-555-0789', 'support@quickmeds.com', 'approved', 4.1, 67, 'Fast and convenient pharmacy services with same-day delivery options.');

-- Insert pharmacy inventory
INSERT INTO pharmacy_inventory (pharmacy_id, medication_id, current_stock, minimum_stock, unit_price, wholesale_price, is_available, batch_number) VALUES
-- HealthFirst Pharmacy inventory
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), (SELECT id FROM medications WHERE name = 'Paracetamol'), 500, 50, 12.99, 8.50, true, 'BATCH001'),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), (SELECT id FROM medications WHERE name = 'Amoxicillin'), 200, 20, 25.50, 18.75, true, 'BATCH002'),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), (SELECT id FROM medications WHERE name = 'Lisinopril'), 150, 15, 38.75, 28.50, true, 'BATCH003'),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), (SELECT id FROM medications WHERE name = 'Vitamin D3'), 300, 30, 15.99, 10.25, true, 'BATCH004'),

-- MediCare Plus Pharmacy inventory
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), (SELECT id FROM medications WHERE name = 'Metformin'), 180, 18, 22.30, 16.75, true, 'BATCH005'),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), (SELECT id FROM medications WHERE name = 'Atorvastatin'), 120, 12, 45.20, 32.80, true, 'BATCH006'),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), (SELECT id FROM medications WHERE name = 'Ibuprofen'), 400, 40, 8.99, 5.50, true, 'BATCH007'),

-- QuickMeds Express inventory
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), (SELECT id FROM medications WHERE name = 'Cetirizine'), 250, 25, 14.99, 9.75, true, 'BATCH008'),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), (SELECT id FROM medications WHERE name = 'Paracetamol'), 350, 35, 11.99, 7.80, true, 'BATCH009'),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), (SELECT id FROM medications WHERE name = 'Vitamin D3'), 200, 20, 16.50, 11.25, true, 'BATCH010');

-- Insert pharmacy hours (Monday = 1, Sunday = 0)
INSERT INTO pharmacy_hours (pharmacy_id, day_of_week, open_time, close_time) VALUES
-- HealthFirst Pharmacy hours
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 1, '08:00', '20:00'), -- Monday
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 2, '08:00', '20:00'), -- Tuesday
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 3, '08:00', '20:00'), -- Wednesday
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 4, '08:00', '20:00'), -- Thursday
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 5, '08:00', '20:00'), -- Friday
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 6, '09:00', '18:00'), -- Saturday
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 0, '10:00', '16:00'), -- Sunday

-- MediCare Plus Pharmacy hours
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 1, '07:00', '21:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 2, '07:00', '21:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 3, '07:00', '21:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 4, '07:00', '21:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 5, '07:00', '21:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 6, '08:00', '20:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 0, '09:00', '18:00'),

-- QuickMeds Express hours
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 1, '06:00', '22:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 2, '06:00', '22:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 3, '06:00', '22:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 4, '06:00', '22:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 5, '06:00', '22:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 6, '07:00', '23:00'),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 0, '08:00', '20:00');

-- Insert pharmacy services
INSERT INTO pharmacy_services (pharmacy_id, service_name, description, price, is_active) VALUES
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 'Prescription Filling', 'Fast and accurate prescription filling service', NULL, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 'Medication Counseling', 'Professional consultation on medication usage', 25.00, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 'Immunizations', 'Flu shots and other vaccinations', 35.00, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 'Health Screenings', 'Blood pressure and diabetes screenings', 15.00, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 'Delivery Service', 'Free delivery within 5 miles', 0.00, true),

((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 'Prescription Filling', 'Expert prescription services', NULL, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 'Compounding', 'Custom medication preparation', 50.00, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 'Medication Therapy Management', 'Comprehensive medication review', 75.00, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 'Immunizations', 'Complete vaccination services', 30.00, true),

((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 'Prescription Filling', 'Quick prescription services', NULL, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 'Express Delivery', 'Same-day delivery service', 10.00, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 'Drive-Through Service', 'Convenient drive-through pickup', 0.00, true),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 'Online Ordering', 'Order medications online', 0.00, true);

-- Insert pharmacy staff
INSERT INTO pharmacy_staff (pharmacy_id, name, title, license_number, specializations, is_active) VALUES
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 'Dr. Sarah Johnson', 'Head Pharmacist', 'RPH-NY-12345', ARRAY['Clinical Pharmacy', 'Medication Therapy Management'], true),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 'Dr. Michael Chen', 'Clinical Pharmacist', 'RPH-NY-67890', ARRAY['Diabetes Care', 'Immunizations'], true),
((SELECT id FROM pharmacy_profiles WHERE name = 'HealthFirst Pharmacy'), 'Lisa Rodriguez', 'Pharmacy Technician', 'PT-NY-11111', ARRAY['Prescription Processing'], true),

((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 'Dr. Emily Rodriguez', 'Pharmacy Manager', 'RPH-NY-22222', ARRAY['Geriatric Pharmacy', 'Compounding'], true),
((SELECT id FROM pharmacy_profiles WHERE name = 'MediCare Plus Pharmacy'), 'Dr. James Wilson', 'Staff Pharmacist', 'RPH-NY-33333', ARRAY['Pain Management', 'MTM'], true),

((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 'Dr. David Kim', 'Staff Pharmacist', 'RPH-NY-44444', ARRAY['Fast Service', 'Customer Care'], true),
((SELECT id FROM pharmacy_profiles WHERE name = 'QuickMeds Express'), 'Maria Garcia', 'Pharmacy Technician', 'PT-NY-55555', ARRAY['Drive-Through Service'], true);

-- Success message
SELECT 'Sample data inserted successfully!' as message,
       (SELECT COUNT(*) FROM users) as total_users,
       (SELECT COUNT(*) FROM medications) as total_medications,
       (SELECT COUNT(*) FROM pharmacy_profiles) as total_pharmacies,
       (SELECT COUNT(*) FROM pharmacy_inventory) as total_inventory_items;
