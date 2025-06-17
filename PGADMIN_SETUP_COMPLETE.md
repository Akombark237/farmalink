# 🗄️ PgAdmin 4 Setup Guide for PharmaLink

## ✅ Current Database Status
Your PostgreSQL database is **WORKING** with these credentials:
- **Host:** localhost
- **Port:** 5432
- **Database:** pharmacy_platform
- **Username:** postgres
- **Password:** Joshua

## 📥 Install PgAdmin 4

### Option 1: Download from Official Website
1. Go to https://www.pgadmin.org/download/
2. Download PgAdmin 4 for Windows
3. Run the installer and follow the setup wizard

### Option 2: Using Package Manager (if you have Chocolatey)
```powershell
choco install pgadmin4
```

## 🔗 Connect to Your Database

### Step 1: Launch PgAdmin 4
1. Open PgAdmin 4 from your Start Menu
2. Set a master password when prompted (this is for PgAdmin security)

### Step 2: Add New Server Connection
1. Right-click on "Servers" in the left panel
2. Select "Register" → "Server..."

### Step 3: Configure Connection
**General Tab:**
- **Name:** PharmaLink Database (or any name you prefer)

**Connection Tab:**
- **Host name/address:** localhost
- **Port:** 5432
- **Maintenance database:** pharmacy_platform
- **Username:** postgres
- **Password:** Joshua
- **Save password:** ✅ (check this box)

### Step 4: Test Connection
1. Click "Save"
2. If successful, you'll see your server appear in the left panel
3. Expand the server to see your databases

## 📊 Database Structure

Your PharmaLink database should contain these tables:
- `users` - User accounts and authentication
- `pharmacies` - Pharmacy information and locations
- `medications` - Drug catalog and inventory
- `orders` - Customer orders and transactions
- `prescriptions` - Medical prescriptions
- `reviews` - User reviews and ratings

## 🔍 Verify Database Setup

### Method 1: Using PgAdmin 4
1. Connect to your database
2. Navigate to: Servers → PharmaLink Database → Databases → pharmacy_platform → Schemas → public → Tables
3. You should see all the tables listed above

### Method 2: Using Your Application
1. Open your browser to http://localhost:3000
2. Navigate to http://localhost:3000/database-viewer
3. This page will show your database connection status and table information

### Method 3: Using API Test
1. Open http://localhost:3000/api/database/test
2. You should see a JSON response with database version and connection info

## 🛠️ Common PgAdmin 4 Tasks

### View Table Data
1. Navigate to your table in the tree view
2. Right-click the table → "View/Edit Data" → "All Rows"

### Run SQL Queries
1. Right-click on your database
2. Select "Query Tool"
3. Write your SQL and click the "Execute" button (▶️)

### Example Queries
```sql
-- Check all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count users
SELECT COUNT(*) FROM users;

-- View recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

### Backup Database
1. Right-click on "pharmacy_platform" database
2. Select "Backup..."
3. Choose location and format (Custom recommended)
4. Click "Backup"

### Restore Database
1. Right-click on "Databases"
2. Select "Restore..."
3. Choose your backup file
4. Configure restore options
5. Click "Restore"

## 🚀 Next Steps

1. **Install PgAdmin 4** using the instructions above
2. **Connect to your database** with the provided credentials
3. **Explore your data** using the PgAdmin interface
4. **Run your application** with `npm run dev`
5. **Test the database viewer** at http://localhost:3000/database-viewer

## 🔧 Troubleshooting

### Connection Issues
- Ensure PostgreSQL service is running
- Verify the password is "Joshua" (case-sensitive)
- Check if port 5432 is available

### Permission Issues
- Make sure you're running PgAdmin as administrator if needed
- Verify PostgreSQL user permissions

### Database Not Found
- Create the database if it doesn't exist:
  ```sql
  CREATE DATABASE pharmacy_platform;
  ```

## 📞 Support
If you encounter any issues:
1. Check the PostgreSQL service status
2. Verify your connection credentials
3. Test the API endpoint: http://localhost:3000/api/database/test
4. Check the application logs in your terminal

Your database is now ready for use with PgAdmin 4! 🎉
