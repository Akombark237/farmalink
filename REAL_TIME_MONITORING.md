# REAL-TIME DATABASE MONITORING GUIDE
# Multiple ways to view your PostgreSQL data in real-time

## METHOD 1: pgAdmin (Best GUI Option)

### Download and Install pgAdmin
1. Go to: https://www.pgadmin.org/download/pgadmin-4-windows/
2. Download and install pgAdmin 4
3. Launch pgAdmin

### Connect to Your Database
1. Right-click "Servers" → "Create" → "Server"
2. General Tab:
   - Name: "Pharmacy Platform"
3. Connection Tab:
   - Host: localhost
   - Port: 5432
   - Database: pharmacy_platform
   - Username: postgres
   - Password: [your password]

### Real-Time Monitoring Features
- **Query Tool**: Write and execute SQL queries
- **Dashboard**: Real-time server statistics
- **Activity Monitor**: See active connections and queries
- **Auto-refresh**: Set queries to refresh automatically

## METHOD 2: DBeaver (Free Alternative)

### Download DBeaver
1. Go to: https://dbeaver.io/download/
2. Download Community Edition (free)
3. Install and launch

### Connect to Database
1. New Database Connection → PostgreSQL
2. Server Host: localhost
3. Port: 5432
4. Database: pharmacy_platform
5. Username: postgres
6. Password: [your password]

### Features
- **SQL Editor** with syntax highlighting
- **Data viewer** with real-time refresh
- **ER diagrams** to visualize relationships
- **Query history** and bookmarks

## METHOD 3: VS Code Extension

### Install PostgreSQL Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "PostgreSQL" by Chris Kolkman
4. Install the extension

### Connect to Database
1. Ctrl+Shift+P → "PostgreSQL: New Connection"
2. Enter connection details:
   - Host: localhost
   - User: postgres
   - Password: [your password]
   - Port: 5432
   - Database: pharmacy_platform

## METHOD 4: Web-Based Tools

### Adminer (Lightweight Web Interface)
1. Download from: https://www.adminer.org/
2. Place adminer.php in a web server directory
3. Access via browser: http://localhost/adminer.php
4. Login with your PostgreSQL credentials

### pgweb (Go-based Web Interface)
1. Download from: https://github.com/sosedoff/pgweb
2. Run: pgweb --host localhost --user postgres --db pharmacy_platform
3. Access via browser: http://localhost:8081

## METHOD 5: Command Line (If PostgreSQL is in PATH)

### Find PostgreSQL Installation
# Check if PostgreSQL is installed
Get-Service -Name "*postgresql*"

# Common installation paths:
# C:\Program Files\PostgreSQL\15\bin\
# C:\Program Files (x86)\PostgreSQL\15\bin\

### Add to PATH (if needed)
# Add PostgreSQL bin directory to your PATH environment variable

### Basic Commands
# Connect to database
psql -h localhost -U postgres -d pharmacy_platform

# List tables
\dt

# View data
SELECT * FROM users LIMIT 5;
SELECT * FROM medications LIMIT 5;
SELECT * FROM pharmacy_profiles;

## METHOD 6: Custom Monitoring Dashboard

### Create a Simple Web Dashboard
I can help you create a custom web dashboard that shows:
- Real-time user registrations
- Medication searches
- Pharmacy activity
- Order statistics (when implemented)

## QUICK START RECOMMENDATIONS

### For Beginners: pgAdmin
- Most user-friendly
- Great visualization
- Built-in monitoring tools
- No command line needed

### For Developers: DBeaver
- Excellent SQL editor
- Great for development
- Free and powerful
- Cross-platform

### For Quick Checks: VS Code Extension
- Integrated with your development environment
- Quick queries
- Good for debugging

## SAMPLE QUERIES TO TRY

### Check Your Data
-- Count all records
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
  'medications', COUNT(*) FROM medications
UNION ALL
SELECT 
  'pharmacies', COUNT(*) FROM pharmacy_profiles;

-- View recent activity
SELECT email, user_type, created_at 
FROM users 
ORDER BY created_at DESC;

-- Check pharmacy inventory
SELECT 
  pp.name as pharmacy,
  m.name as medication,
  pi.unit_price,
  pi.current_stock
FROM pharmacy_inventory pi
JOIN pharmacy_profiles pp ON pi.pharmacy_id = pp.id
JOIN medications m ON pi.medication_id = m.id
WHERE pi.is_available = true;

### Monitor Real-Time Changes
-- Set up auto-refresh in your tool of choice
-- Watch for new users every 30 seconds
-- Monitor inventory changes
-- Track search queries (when logging is implemented)

## TROUBLESHOOTING

### Can't Connect?
1. Check if PostgreSQL service is running
2. Verify connection details (host, port, username, password)
3. Check firewall settings
4. Ensure database exists

### No Data?
1. Run migrations: npm run db:migrate
2. Load sample data: npm run db:seed
3. Check table creation: \dt in psql

### Performance Issues?
1. Add indexes to frequently queried columns
2. Monitor slow queries
3. Use connection pooling
4. Optimize query patterns

Choose the method that works best for you! I recommend starting with pgAdmin for the best user experience.
