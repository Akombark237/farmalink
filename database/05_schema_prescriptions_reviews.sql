-- =====================================================
-- PHARMACY PLATFORM - PRESCRIPTIONS & REVIEWS SCHEMA
-- Part 5: Prescriptions, Reviews, Notifications
-- =====================================================

-- Prescription status
CREATE TYPE prescription_status AS ENUM ('pending', 'verified', 'filled', 'expired', 'cancelled', 'transferred');

-- Prescriptions
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    medication_id UUID REFERENCES medications(id),
    medication_name VARCHAR(300) NOT NULL,
    
    -- Doctor information
    doctor_name VARCHAR(200) NOT NULL,
    doctor_license VARCHAR(100),
    doctor_phone VARCHAR(20),
    doctor_address TEXT,
    hospital_clinic VARCHAR(200),
    
    -- Prescription details
    dosage VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    days_supply INTEGER,
    refills_allowed INTEGER DEFAULT 0,
    refills_used INTEGER DEFAULT 0,
    instructions TEXT,
    
    -- Dates
    prescribed_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    last_filled_date DATE,
    
    -- Status and verification
    status prescription_status DEFAULT 'pending',
    prescription_image_url VARCHAR(500),
    verification_notes TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Transfer information
    transferred_from_pharmacy VARCHAR(200),
    transferred_to_pharmacy_id UUID REFERENCES pharmacy_profiles(id),
    transfer_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prescription fills (tracking each time prescription is filled)
CREATE TABLE prescription_fills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    quantity_filled INTEGER NOT NULL,
    days_supply INTEGER,
    fill_date DATE NOT NULL,
    pharmacist_name VARCHAR(200),
    pharmacist_license VARCHAR(100),
    lot_number VARCHAR(100),
    expiry_date DATE,
    filled_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    medication_id UUID REFERENCES medications(id),
    
    -- Review details
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    review_text TEXT,
    
    -- Review categories
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    speed_rating INTEGER CHECK (speed_rating >= 1 AND speed_rating <= 5),
    price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
    
    -- Moderation
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    moderation_notes TEXT,
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    
    -- Helpful votes
    helpful_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Review responses (pharmacy responses to reviews)
CREATE TABLE review_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    responded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'order_update', 'prescription_ready', 'low_stock', 'promotion', etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Notification data
    data JSONB, -- Additional data like order_id, prescription_id, etc.
    
    -- Delivery channels
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    in_app_read BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User notification preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_type)
);

-- Favorites (patients can favorite pharmacies and medications)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES pharmacy_profiles(id),
    medication_id UUID REFERENCES medications(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK ((pharmacy_id IS NOT NULL AND medication_id IS NULL) OR (pharmacy_id IS NULL AND medication_id IS NOT NULL))
);

-- Indexes
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_expiry ON prescriptions(expiry_date);
CREATE INDEX idx_prescription_fills_prescription_id ON prescription_fills(prescription_id);
CREATE INDEX idx_reviews_pharmacy_id ON reviews(pharmacy_id);
CREATE INDEX idx_reviews_patient_id ON reviews(patient_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(in_app_read);
CREATE INDEX idx_favorites_patient_id ON favorites(patient_id);

-- Triggers
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
