-- =====================================================
-- PHARMACY PLATFORM - ORDERS & CART SCHEMA
-- Part 4: Shopping Cart, Orders, Payments
-- =====================================================

-- Order status
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');
CREATE TYPE delivery_method AS ENUM ('pickup', 'delivery', 'mail');

-- Shopping cart
CREATE TABLE shopping_cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, pharmacy_id)
);

-- Shopping cart items
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES shopping_cart(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES pharmacy_inventory(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    prescription_id UUID, -- References prescriptions table (to be created)
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES pharmacy_profiles(id) ON DELETE CASCADE,
    status order_status DEFAULT 'pending',
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    insurance_coverage DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    -- Delivery information
    delivery_method delivery_method NOT NULL DEFAULT 'pickup',
    delivery_address JSONB, -- Stores full address object
    delivery_instructions TEXT,
    estimated_delivery_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    
    -- Tracking
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    
    -- Special instructions
    special_instructions TEXT,
    pharmacy_notes TEXT,
    
    -- Timestamps
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    ready_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES pharmacy_inventory(id),
    medication_name VARCHAR(300) NOT NULL, -- Store name in case inventory item is deleted
    medication_strength VARCHAR(100),
    medication_form VARCHAR(100),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    insurance_copay DECIMAL(10,2) DEFAULT 0.00,
    prescription_id UUID, -- References prescriptions table
    special_instructions TEXT,
    substitution_allowed BOOLEAN DEFAULT TRUE,
    generic_substitution BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'debit_card', 'cash', 'insurance', 'hsa', 'fsa'
    payment_status payment_status DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Payment processor information
    processor VARCHAR(50), -- 'stripe', 'paypal', 'square', etc.
    transaction_id VARCHAR(255),
    processor_response JSONB,
    
    -- Card information (encrypted/tokenized)
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    -- Insurance information
    insurance_provider VARCHAR(200),
    insurance_policy_number VARCHAR(100),
    insurance_group_number VARCHAR(100),
    insurance_claim_number VARCHAR(100),
    
    processed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    refund_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order status history
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    old_status order_status,
    new_status order_status NOT NULL,
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_shopping_cart_patient_id ON shopping_cart(patient_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_orders_patient_id ON orders(patient_id);
CREATE INDEX idx_orders_pharmacy_id ON orders(pharmacy_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- Triggers
CREATE TRIGGER update_shopping_cart_updated_at BEFORE UPDATE ON shopping_cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
