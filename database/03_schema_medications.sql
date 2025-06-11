-- =====================================================
-- PHARMACY PLATFORM - MEDICATIONS & INVENTORY SCHEMA
-- Part 3: Medications, Categories, Inventory
-- =====================================================

-- Medication status
CREATE TYPE medication_status AS ENUM ('active', 'discontinued', 'flagged', 'pending_approval');

-- Medication categories
CREATE TABLE medication_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id UUID REFERENCES medication_categories(id),
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medications master list
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(300) NOT NULL,
    generic_name VARCHAR(300),
    brand_names TEXT[],
    category_id UUID REFERENCES medication_categories(id),
    manufacturer VARCHAR(200),
    description TEXT,
    usage_instructions TEXT,
    side_effects TEXT,
    contraindications TEXT,
    warnings TEXT,
    dosage_forms TEXT[], -- tablet, capsule, liquid, injection, etc.
    strengths TEXT[], -- 500mg, 250mg, etc.
    active_ingredients TEXT[],
    inactive_ingredients TEXT,
    requires_prescription BOOLEAN DEFAULT TRUE,
    controlled_substance_schedule VARCHAR(10), -- I, II, III, IV, V
    ndc_number VARCHAR(20), -- National Drug Code
    upc_code VARCHAR(20),
    rxcui VARCHAR(20), -- RxNorm Concept Unique Identifier
    status medication_status DEFAULT 'active',
    image_url VARCHAR(500),
    package_size VARCHAR(100),
    storage_instructions TEXT,
    pregnancy_category VARCHAR(10),
    drug_class VARCHAR(200),
    therapeutic_class VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medication interactions
CREATE TABLE medication_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medication_id_1 UUID REFERENCES medications(id) ON DELETE CASCADE,
    medication_id_2 UUID REFERENCES medications(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'major', 'moderate', 'minor'
    description TEXT NOT NULL,
    severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 5),
    clinical_significance TEXT,
    management_recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(medication_id_1, medication_id_2)
);

-- Pharmacy inventory
CREATE TABLE pharmacy_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
    sku VARCHAR(100),
    current_stock INTEGER NOT NULL DEFAULT 0,
    reserved_stock INTEGER DEFAULT 0, -- Stock reserved for pending orders
    minimum_stock INTEGER DEFAULT 10,
    maximum_stock INTEGER DEFAULT 1000,
    reorder_point INTEGER DEFAULT 20,
    unit_price DECIMAL(10,2) NOT NULL,
    wholesale_price DECIMAL(10,2),
    insurance_copay DECIMAL(10,2),
    cash_price DECIMAL(10,2),
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    expiry_date DATE,
    batch_number VARCHAR(100),
    lot_number VARCHAR(100),
    supplier VARCHAR(200),
    supplier_item_code VARCHAR(100),
    last_restocked TIMESTAMP WITH TIME ZONE,
    last_sold TIMESTAMP WITH TIME ZONE,
    is_available BOOLEAN DEFAULT TRUE,
    requires_refrigeration BOOLEAN DEFAULT FALSE,
    location_in_pharmacy VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pharmacy_id, medication_id, batch_number)
);

-- Inventory transactions (for tracking stock changes)
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES pharmacy_inventory(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'sale', 'adjustment', 'return', 'expired'
    quantity_change INTEGER NOT NULL, -- positive for additions, negative for reductions
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reference_id UUID, -- Could reference order_id, purchase_order_id, etc.
    reference_type VARCHAR(50), -- 'order', 'purchase_order', 'adjustment', etc.
    notes TEXT,
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medication pricing history
CREATE TABLE medication_pricing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES pharmacy_inventory(id) ON DELETE CASCADE,
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2),
    price_change_reason VARCHAR(200),
    effective_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_medications_name ON medications(name);
CREATE INDEX idx_medications_generic_name ON medications(generic_name);
CREATE INDEX idx_medications_category ON medications(category_id);
CREATE INDEX idx_medications_status ON medications(status);
CREATE INDEX idx_medications_ndc ON medications(ndc_number);
CREATE INDEX idx_pharmacy_inventory_pharmacy_id ON pharmacy_inventory(pharmacy_id);
CREATE INDEX idx_pharmacy_inventory_medication_id ON pharmacy_inventory(medication_id);
CREATE INDEX idx_pharmacy_inventory_stock ON pharmacy_inventory(current_stock);
CREATE INDEX idx_pharmacy_inventory_available ON pharmacy_inventory(is_available);
CREATE INDEX idx_inventory_transactions_inventory_id ON inventory_transactions(inventory_id);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);

-- Triggers
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pharmacy_inventory_updated_at BEFORE UPDATE ON pharmacy_inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
