# DATABASE SETUP GUIDE
# Complete PostgreSQL Database Setup for Pharmacy Platform

## Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed
- Access to PostgreSQL command line (psql)

## Step 1: Create Database
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE pharmacy_platform;

# Create user (optional, for security)
CREATE USER pharmacy_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE pharmacy_platform TO pharmacy_user;

# Exit psql
\q
```

## Step 2: Environment Configuration
1. Copy `.env.example` to `.env.local`
2. Update database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_platform
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## Step 3: Install Dependencies
```bash
npm install pg bcryptjs jsonwebtoken
npm install --save-dev @types/pg @types/bcryptjs @types/jsonwebtoken
```

## Step 4: Run Database Migrations
```bash
# Run all migrations
npm run db:migrate

# Or run manually:
node scripts/migrate.js migrate
```

## Step 5: Seed Sample Data
```bash
# Load sample data
npm run db:seed

# Or run manually:
psql -h localhost -U postgres -d pharmacy_platform -f database/06_sample_data.sql
```

## Step 6: Verify Setup
```bash
# Connect to database and check tables
psql -h localhost -U postgres -d pharmacy_platform

# List all tables
\dt

# Check sample data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM medications;
SELECT COUNT(*) FROM pharmacy_profiles;
```

## Database Schema Overview

### Core Tables:
1. **users** - Authentication and user management
2. **patient_profiles** - Patient information
3. **pharmacy_profiles** - Pharmacy information
4. **medications** - Master medication list
5. **pharmacy_inventory** - Stock management
6. **orders** - Order management
7. **prescriptions** - Prescription tracking
8. **reviews** - Rating system
9. **notifications** - Alert system

### Key Features:
- ✅ UUID primary keys for security
- ✅ Proper foreign key relationships
- ✅ Indexes for performance
- ✅ Triggers for automatic timestamps
- ✅ JSONB for flexible data storage
- ✅ Enum types for data consistency
- ✅ Transaction support

## Useful Commands

### Migration Commands:
```bash
npm run db:migrate     # Run pending migrations
npm run db:rollback    # Rollback last migration
npm run db:reset       # Reset and reseed database
```

### Database Commands:
```bash
# Backup database
pg_dump -h localhost -U postgres pharmacy_platform > backup.sql

# Restore database
psql -h localhost -U postgres pharmacy_platform < backup.sql

# Connect to database
psql -h localhost -U postgres -d pharmacy_platform
```

### Useful SQL Queries:
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('pharmacy_platform'));

-- List all tables with row counts
SELECT schemaname,tablename,n_tup_ins-n_tup_del as rowcount 
FROM pg_stat_user_tables 
ORDER BY rowcount DESC;

-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'pharmacy_platform';
```

## Security Notes
- Always use environment variables for credentials
- Use connection pooling in production
- Enable SSL for production databases
- Regularly backup your database
- Monitor database performance
- Use prepared statements to prevent SQL injection

## Troubleshooting

### Common Issues:
1. **Connection refused**: Check if PostgreSQL is running
2. **Authentication failed**: Verify credentials in .env.local
3. **Database does not exist**: Create database first
4. **Permission denied**: Grant proper privileges to user
5. **Migration fails**: Check SQL syntax in migration files

### Performance Tips:
- Add indexes for frequently queried columns
- Use EXPLAIN ANALYZE to optimize queries
- Monitor slow queries
- Consider partitioning for large tables
- Use connection pooling

## Next Steps
1. Set up your .env.local file
2. Run the migrations
3. Load sample data
4. Test database connection in your Next.js app
5. Start building your API endpoints

For questions or issues, refer to the PostgreSQL documentation or create an issue in the project repository.
