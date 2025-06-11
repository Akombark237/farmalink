# POSTGRESQL REAL-TIME MONITORING GUIDE
# Complete guide to view and monitor your pharmacy database

## 1. BASIC DATABASE CONNECTION

# Connect to your database
psql -h localhost -U postgres -d pharmacy_platform

# Or if you have a different setup
psql postgresql://postgres:your_password@localhost:5432/pharmacy_platform

## 2. ESSENTIAL COMMANDS TO VIEW DATA

### List all tables
\dt

### View table structure
\d users
\d medications
\d pharmacy_profiles

### Count records in all main tables
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
  'medications' as table_name, COUNT(*) as count FROM medications
UNION ALL
SELECT 
  'pharmacy_profiles' as table_name, COUNT(*) as count FROM pharmacy_profiles
UNION ALL
SELECT 
  'pharmacy_inventory' as table_name, COUNT(*) as count FROM pharmacy_inventory;

### View recent users
SELECT id, email, user_type, status, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

### View all medications
SELECT m.name, m.generic_name, mc.name as category, m.requires_prescription
FROM medications m
LEFT JOIN medication_categories mc ON m.category_id = mc.id
ORDER BY m.name;

### View pharmacy details
SELECT name, address, city, state, phone, rating, status
FROM pharmacy_profiles
ORDER BY rating DESC;

### View pharmacy inventory with prices
SELECT 
  pp.name as pharmacy_name,
  m.name as medication_name,
  pi.unit_price,
  pi.current_stock,
  pi.is_available
FROM pharmacy_inventory pi
JOIN pharmacy_profiles pp ON pi.pharmacy_id = pp.id
JOIN medications m ON pi.medication_id = m.id
WHERE pi.is_available = true
ORDER BY pp.name, m.name;

## 3. REAL-TIME MONITORING QUERIES

### Monitor active connections
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  query
FROM pg_stat_activity 
WHERE datname = 'pharmacy_platform' 
AND state = 'active';

### Monitor recent activity (last 5 minutes)
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
WHERE n_tup_ins > 0 OR n_tup_upd > 0 OR n_tup_del > 0;

### Watch for new users (run periodically)
SELECT 
  email, 
  user_type, 
  status, 
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minutes_ago
FROM users 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

## 4. USEFUL WATCH COMMANDS

### Auto-refresh every 2 seconds (in psql)
\watch 2

# Example: Watch user count update every 2 seconds
SELECT COUNT(*) as total_users FROM users; \watch 2

### Watch recent orders (when you implement orders)
SELECT 
  o.order_number,
  pp.first_name || ' ' || pp.last_name as patient_name,
  ph.name as pharmacy_name,
  o.status,
  o.total_amount,
  o.created_at
FROM orders o
JOIN patient_profiles pp ON o.patient_id = pp.id
JOIN pharmacy_profiles ph ON o.pharmacy_id = ph.id
WHERE o.created_at > NOW() - INTERVAL '1 hour'
ORDER BY o.created_at DESC; \watch 5
