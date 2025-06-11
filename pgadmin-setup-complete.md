# Complete pgAdmin4 Setup Guide for PharmaLink Database

## ✅ Current Status
- ✅ PostgreSQL 17 is running on port 5432
- ✅ Database `pharmacy_platform` exists
- ✅ Password: `Joshua`
- ✅ User: `postgres`
- ✅ Tables created: users, patient_profiles, pharmacy_profiles, medications

## 🚀 Step 1: Launch pgAdmin4

1. **Open pgAdmin4** from your Start Menu or Desktop
2. It will open in your web browser (usually at `http://localhost:5050`)
3. Enter your pgAdmin master password if prompted

## 🔧 Step 2: Create Server Connection

### Right-click on "Servers" in the left panel
1. Select **"Create"** → **"Server..."**

### General Tab:
- **Name**: `PharmaLink Database`
- **Server Group**: `Servers` (default)
- **Comments**: `PharmaLink Pharmacy Platform Database`

### Connection Tab:
- **Host name/address**: `localhost`
- **Port**: `5432`
- **Maintenance database**: `postgres`
- **Username**: `postgres`
- **Password**: `Joshua`

### Advanced Tab (Optional):
- **DB restriction**: `pharmacy_platform`
- **Connection timeout**: `10`

### SSL Tab:
- **SSL mode**: `Prefer` (default)

4. Click **"Save"** to create the connection.

## 📊 Step 3: Verify Database Structure

After connecting, you should see:

### Database: pharmacy_platform
- **Tables** (4 total):
  - `users` - User accounts and authentication
  - `patient_profiles` - Patient information
  - `pharmacy_profiles` - Pharmacy information  
  - `medications` - Medication catalog

### Sample Queries to Test:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'patient_profiles', COUNT(*) FROM patient_profiles
UNION ALL
SELECT 'pharmacy_profiles', COUNT(*) FROM pharmacy_profiles
UNION ALL
SELECT 'medications', COUNT(*) FROM medications;

-- View sample users
SELECT id, email, user_type, status, created_at 
FROM users 
LIMIT 5;
```

## 🔍 Step 4: Useful pgAdmin Features

### Query Tool:
1. Right-click on `pharmacy_platform` database
2. Select **"Query Tool"**
3. Write and execute SQL queries

### Dashboard:
1. Click on your server name
2. View **"Dashboard"** tab for real-time statistics

### Table Browser:
1. Expand **Databases** → **pharmacy_platform** → **Schemas** → **public** → **Tables**
2. Right-click any table → **"View/Edit Data"** → **"All Rows"**

## 🛠️ Step 5: Common Operations

### Backup Database:
1. Right-click on `pharmacy_platform`
2. Select **"Backup..."**
3. Choose format and location

### Restore Database:
1. Right-click on **Databases**
2. Select **"Restore..."**
3. Choose backup file

### Monitor Activity:
1. Click on server name
2. Go to **"Dashboard"** tab
3. View active connections and queries

## 🚨 Troubleshooting

### If Connection Fails:
1. **Check PostgreSQL Service**:
   ```powershell
   Get-Service -Name "*postgresql*"
   ```

2. **Test Connection**:
   ```powershell
   $env:PGPASSWORD="Joshua"; & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -U postgres -d pharmacy_platform -c "SELECT version();"
   ```

3. **Check Firewall**: Ensure port 5432 is open

### If Database is Empty:
1. Run the database setup script:
   ```bash
   node setup-db-clean.js
   ```

2. Refresh pgAdmin browser tree (F5)

## 📈 Monitoring Queries

### Real-time Database Stats:
```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('pharmacy_platform')) as database_size;

-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    query
FROM pg_stat_activity 
WHERE datname = 'pharmacy_platform';
```

## ✅ Success Indicators

You'll know everything is working when:
- ✅ pgAdmin connects without errors
- ✅ You can see the `pharmacy_platform` database
- ✅ All 4 tables are visible
- ✅ Sample data exists in the `users` table
- ✅ Queries execute successfully

## 🎯 Next Steps

1. **Explore the data structure**
2. **Run sample queries**
3. **Set up regular backups**
4. **Monitor database performance**
5. **Create additional users if needed**

Your PharmaLink database is now fully accessible through pgAdmin4!
