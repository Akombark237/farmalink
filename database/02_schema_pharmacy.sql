-- =====================================================
-- PHARMACY PLATFORM - PHARMACY MANAGEMENT SCHEMA
-- Part 2: Pharmacies, Staff, Hours, Services
-- =====================================================

-- Pharmacy status
CREATE TYPE pharmacy_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');

-- Pharmacy profiles
CREATE TABLE pharmacy_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL UNIQUE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    dea_number VARCHAR(50),
    npi_number VARCHAR(20),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Cameroon',
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    cover_photo_url VARCHAR(500),
    status pharmacy_status DEFAULT 'active',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    verification_documents JSONB,
    business_hours JSONB,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_open_now BOOLEAN DEFAULT true,
    delivery_radius DECIMAL(5,2) DEFAULT 10.00,
    delivery_fee DECIMAL(8,2) DEFAULT 0.00,
    minimum_order_amount DECIMAL(8,2) DEFAULT 0.00,
    accepts_insurance BOOLEAN DEFAULT TRUE,
    parking_available BOOLEAN DEFAULT TRUE,
    wheelchair_accessible BOOLEAN DEFAULT TRUE,
    drive_through BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy operating hours
CREATE TABLE pharmacy_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    break_start_time TIME,
    break_end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy services
CREATE TABLE pharmacy_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    service_name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(8,2),
    duration_minutes INTEGER,
    requires_appointment BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy staff
CREATE TABLE pharmacy_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    title VARCHAR(100),
    license_number VARCHAR(100),
    license_state VARCHAR(50),
    license_expiry DATE,
    photo_url VARCHAR(500),
    specializations TEXT[],
    years_experience INTEGER,
    education TEXT,
    certifications TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy certifications
CREATE TABLE pharmacy_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    certification_name VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(200),
    certification_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    document_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy delivery options
CREATE TABLE pharmacy_delivery_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    delivery_type VARCHAR(50) NOT NULL, -- 'standard', 'express', 'same_day', 'scheduled'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_fee DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    per_mile_fee DECIMAL(8,2) DEFAULT 0.00,
    minimum_order DECIMAL(8,2) DEFAULT 0.00,
    estimated_time_min INTEGER,
    estimated_time_max INTEGER,
    max_distance DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy payment methods
CREATE TABLE pharmacy_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL, -- 'cash', 'credit_card', 'debit_card', 'insurance', 'hsa', 'fsa'
    is_accepted BOOLEAN DEFAULT TRUE,
    processing_fee_percentage DECIMAL(5,4) DEFAULT 0.0000,
    processing_fee_fixed DECIMAL(8,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_pharmacy_profiles_user_id ON pharmacy_profiles(user_id);
CREATE INDEX idx_pharmacy_profiles_status ON pharmacy_profiles(status);
CREATE INDEX idx_pharmacy_profiles_zip ON pharmacy_profiles(zip_code);
CREATE INDEX idx_pharmacy_profiles_rating ON pharmacy_profiles(rating);
CREATE INDEX idx_pharmacy_hours_pharmacy_id ON pharmacy_hours(pharmacy_id);
CREATE INDEX idx_pharmacy_services_pharmacy_id ON pharmacy_services(pharmacy_id);
CREATE INDEX idx_pharmacy_staff_pharmacy_id ON pharmacy_staff(pharmacy_id);

-- Triggers
CREATE TRIGGER update_pharmacy_profiles_updated_at BEFORE UPDATE ON pharmacy_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
