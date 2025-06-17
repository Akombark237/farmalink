-- 09_payments_table.sql
-- Create payments table for NotchPay integration

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'notchpay',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'XAF',
    processor VARCHAR(50) NOT NULL DEFAULT 'notchpay',
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    processor_response JSONB,
    processed_at TIMESTAMP,
    failed_at TIMESTAMP,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_processor ON payments(processor);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Add payment status check constraint
ALTER TABLE payments 
ADD CONSTRAINT chk_payment_status 
CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'));

-- Add payment method check constraint
ALTER TABLE payments 
ADD CONSTRAINT chk_payment_method 
CHECK (payment_method IN ('notchpay', 'card', 'mobile_money', 'bank_transfer', 'cash', 'paypal'));

-- Add currency check constraint
ALTER TABLE payments 
ADD CONSTRAINT chk_currency 
CHECK (currency IN ('XAF', 'USD', 'EUR', 'GBP'));

-- Add processor check constraint
ALTER TABLE payments 
ADD CONSTRAINT chk_processor 
CHECK (processor IN ('notchpay', 'stripe', 'paypal', 'manual'));

-- Create payment_logs table for audit trail
CREATE TABLE IF NOT EXISTS payment_logs (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for payment logs
CREATE INDEX IF NOT EXISTS idx_payment_logs_payment_id ON payment_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_event_type ON payment_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON payment_logs(created_at);

-- Create payment_methods table for storing user payment preferences
CREATE TABLE IF NOT EXISTS user_payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_reference VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for user payment methods
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_type ON user_payment_methods(payment_type);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_provider ON user_payment_methods(provider);

-- Add payment method type constraint
ALTER TABLE user_payment_methods 
ADD CONSTRAINT chk_payment_type 
CHECK (payment_type IN ('mobile_money', 'bank_account', 'card', 'wallet'));

-- Add provider constraint
ALTER TABLE user_payment_methods 
ADD CONSTRAINT chk_provider 
CHECK (provider IN ('orange_money', 'mtn_momo', 'express_union', 'visa', 'mastercard', 'notchpay_wallet'));

-- Create function to update payment timestamps
CREATE OR REPLACE FUNCTION update_payment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payments table
DROP TRIGGER IF EXISTS trigger_update_payment_timestamp ON payments;
CREATE TRIGGER trigger_update_payment_timestamp
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_timestamp();

-- Create trigger for user_payment_methods table
DROP TRIGGER IF EXISTS trigger_update_user_payment_methods_timestamp ON user_payment_methods;
CREATE TRIGGER trigger_update_user_payment_methods_timestamp
    BEFORE UPDATE ON user_payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_timestamp();

-- Insert sample payment statuses for testing
INSERT INTO payments (
    order_id, payment_method, payment_status, amount, currency, 
    processor, transaction_id, processor_response, created_at, updated_at
) VALUES 
(1, 'notchpay', 'completed', 15000.00, 'XAF', 'notchpay', 'PHARMA_TEST_001', 
 '{"status": "successful", "reference": "PHARMA_TEST_001", "amount": 15000}', NOW(), NOW()),
(2, 'notchpay', 'pending', 8500.00, 'XAF', 'notchpay', 'PHARMA_TEST_002', 
 '{"status": "pending", "reference": "PHARMA_TEST_002", "amount": 8500}', NOW(), NOW()),
(3, 'cash', 'pending', 12000.00, 'XAF', 'manual', 'CASH_001', 
 '{"method": "cash_on_delivery"}', NOW(), NOW())
ON CONFLICT (transaction_id) DO NOTHING;

-- Create view for payment analytics
CREATE OR REPLACE VIEW payment_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as payment_date,
    payment_method,
    payment_status,
    currency,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    MIN(amount) as min_amount,
    MAX(amount) as max_amount
FROM payments
GROUP BY DATE_TRUNC('day', created_at), payment_method, payment_status, currency
ORDER BY payment_date DESC;

-- Create view for recent payments
CREATE OR REPLACE VIEW recent_payments AS
SELECT 
    p.id,
    p.transaction_id,
    p.payment_method,
    p.payment_status,
    p.amount,
    p.currency,
    p.created_at,
    o.id as order_id,
    u.email as customer_email,
    u.first_name || ' ' || u.last_name as customer_name
FROM payments p
LEFT JOIN orders o ON p.order_id = o.id
LEFT JOIN users u ON o.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 100;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON payments TO pharmacy_app;
GRANT SELECT, INSERT, UPDATE ON payment_logs TO pharmacy_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_payment_methods TO pharmacy_app;
GRANT USAGE ON SEQUENCE payments_id_seq TO pharmacy_app;
GRANT USAGE ON SEQUENCE payment_logs_id_seq TO pharmacy_app;
GRANT USAGE ON SEQUENCE user_payment_methods_id_seq TO pharmacy_app;

-- Display summary
SELECT 
    'Payments table created successfully' as status,
    COUNT(*) as sample_payments_inserted
FROM payments;
