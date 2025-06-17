# API ENDPOINTS SETUP GUIDE
# Complete guide to set up and test your pharmacy platform APIs

## �� QUICK START

### 1. Environment Setup
Create `.env.local` file in your project root:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_platform
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 2. Install Dependencies
```bash
npm install pg bcryptjs jsonwebtoken
npm install --save-dev @types/pg @types/bcryptjs @types/jsonwebtoken
```

### 3. Setup Database
```bash
# Create database
createdb pharmacy_platform

# Run migrations
npm run db:migrate

# Load sample data
npm run db:seed
```

### 4. Test Database Connection
Start your Next.js server and visit:
```
http://localhost:3000/api/test
```

## 📡 AVAILABLE API ENDPOINTS

### Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Search APIs
- `GET /api/search?q=query&type=drugs` - Search medications
- `GET /api/search?q=query&type=pharmacies` - Search pharmacies

### Pharmacy APIs
- `GET /api/pharmacy/[id]` - Get pharmacy details

### Test APIs
- `GET /api/test` - Database connection test

## 🧪 TESTING THE APIS

### 1. Test Database Connection
```bash
curl http://localhost:3000/api/test
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "userType": "patient",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Test User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "password123"
  }'
```

### 4. Test Search
```bash
# Search for medications
curl "http://localhost:3000/api/search?q=paracetamol&type=drugs"

# Search for pharmacies
curl "http://localhost:3000/api/search?q=health&type=pharmacies"
```

### 5. Test Pharmacy Details
```bash
curl "http://localhost:3000/api/pharmacy/[pharmacy-id]"
```

## 🔧 UPDATED PAGES

### Login Page (`/authentication/login`)
- ✅ Now connects to real API
- ✅ Handles authentication
- ✅ Redirects based on user type
- ✅ Stores user data in localStorage

### Search Page (`/use-pages/search`)
- ✅ Now uses real search API
- ✅ Searches medications and pharmacies
- ✅ Real-time search with debouncing
- ✅ Displays actual database results

## 🎯 NEXT STEPS

### Immediate Tasks:
1. **Set up your database** using the provided schema
2. **Configure environment variables**
3. **Test the APIs** using the examples above
4. **Update password hashes** in sample data with real bcrypt hashes

### Additional APIs to Create:
- Cart management (`/api/cart`)
- Order processing (`/api/orders`)
- Prescription management (`/api/prescriptions`)
- User profile management (`/api/profile`)
- Admin panel APIs (`/api/admin`)

### Frontend Integration:
- Update remaining pages to use real APIs
- Add proper error handling
- Implement loading states
- Add authentication middleware

## 🔐 SECURITY NOTES

- All passwords are hashed with bcrypt
- JWT tokens are used for authentication
- HTTP-only cookies for secure token storage
- Input validation on all endpoints
- SQL injection protection with parameterized queries

## 🐛 TROUBLESHOOTING

### Common Issues:
1. **Database connection fails**: Check PostgreSQL is running and credentials are correct
2. **Migration errors**: Ensure database exists and user has proper permissions
3. **API 500 errors**: Check server logs for detailed error messages
4. **CORS issues**: Ensure API routes are in the correct Next.js structure

### Debug Commands:
```bash
# Check database connection
psql -h localhost -U postgres -d pharmacy_platform -c "SELECT COUNT(*) FROM users;"

# View server logs
npm run dev

# Test specific API endpoint
curl -v http://localhost:3000/api/test
```

## �� SAMPLE DATA INCLUDED

- **3 pharmacy profiles** with complete information
- **8 medications** across different categories
- **3 patient users** for testing
- **Pharmacy inventory** with realistic pricing
- **Operating hours and services**

Your pharmacy platform is now ready for development with real database integration! 🎉
