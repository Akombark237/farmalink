# 🚀 PharmaLink - Complete Setup Instructions

## 📋 **Prerequisites**

Before setting up PharmaLink, ensure you have the following installed:

### **Required Software**
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 13.0 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended

### **Optional Tools**
- **pgAdmin 4**: PostgreSQL administration tool
- **Postman**: API testing tool
- **Docker**: For containerized deployment

## 🛠️ **Installation Steps**

### **Step 1: Clone the Repository**
```bash
git clone <repository-url>
cd pharmalink
```

### **Step 2: Install Dependencies**
```bash
# Install Node.js dependencies
npm install

# Install additional development tools
npm install -g typescript
npm install -g @next/cli
```

### **Step 3: Database Setup**

#### **3.1 Install PostgreSQL**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# Download and install from https://www.postgresql.org/download/windows/
```

#### **3.2 Create Database**
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE pharmacy_platform;
CREATE USER pharmacy_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE pharmacy_platform TO pharmacy_user;
\q
```

#### **3.3 Run Database Migrations**
```bash
# Execute schema files in order
psql -U pharmacy_user -d pharmacy_platform -f database/01_users_table.sql
psql -U pharmacy_user -d pharmacy_platform -f database/02_pharmacy_profiles.sql
psql -U pharmacy_user -d pharmacy_platform -f database/03_medications.sql
psql -U pharmacy_user -d pharmacy_platform -f database/04_orders.sql
psql -U pharmacy_user -d pharmacy_platform -f database/05_reviews.sql
psql -U pharmacy_user -d pharmacy_platform -f database/06_sample_data.sql
psql -U pharmacy_user -d pharmacy_platform -f database/07_cameroon_pharmacies.sql
psql -U pharmacy_user -d pharmacy_platform -f database/08_cameroon_medications.sql
psql -U pharmacy_user -d pharmacy_platform -f database/09_payments_table.sql
```

### **Step 4: Environment Configuration**

#### **4.1 Create Environment File**
```bash
cp .env.example .env.local
```

#### **4.2 Configure Environment Variables**
Edit `.env.local` with your settings:

```bash
# Database Configuration
DATABASE_URL="postgresql://pharmacy_user:your_secure_password@localhost:5432/pharmacy_platform"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_platform
DB_USER=pharmacy_user
DB_PASSWORD=your_secure_password

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# NotchPay Configuration
NOTCHPAY_PUBLIC_KEY=your_notchpay_public_key_here
NOTCHPAY_SECRET_KEY=your_notchpay_secret_key_here
NOTCHPAY_WEBHOOK_SECRET=your_notchpay_webhook_secret_here
NOTCHPAY_ENVIRONMENT=sandbox

# Application Settings
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_OPENSTREETMAP_ENABLED=true
NEXT_PUBLIC_DEFAULT_LAT=3.8480
NEXT_PUBLIC_DEFAULT_LNG=11.5021

# Memory Optimization
NODE_OPTIONS="--max-old-space-size=1024"
NEXT_TELEMETRY_DISABLED=1
```

### **Step 5: API Keys Setup**

#### **5.1 Google Gemini AI**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local` as `GEMINI_API_KEY`

#### **5.2 NotchPay Payment Gateway**
1. Visit [NotchPay](https://notchpay.com/integrations)
2. Create merchant account
3. Get API keys from dashboard
4. Add to `.env.local`

#### **5.3 Google OAuth (Optional)**
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add to `.env.local`

## 🚀 **Running the Application**

### **Development Mode**
```bash
# Standard development
npm run dev

# Fast development (optimized)
npm run dev-fast

# Ultra-fast development (minimal features)
npm run dev-ultra

# Simple server (basic functionality)
npm run simple
```

### **Production Mode**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Database Operations**
```bash
# Run migrations
npm run db:migrate

# Rollback migrations
npm run db:rollback

# Seed sample data
npm run db:seed

# Reset database
npm run db:reset
```

## 🧪 **Testing Setup**

### **Test Database**
```bash
# Create test database
createdb pharmacy_platform_test

# Run test migrations
NODE_ENV=test npm run db:migrate
```

### **Run Tests**
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "API"

# Run with coverage
npm run test:coverage
```

## 🔧 **Development Tools**

### **Database Management**
```bash
# Install pgAdmin 4
# Ubuntu/Debian
sudo apt install pgadmin4

# macOS
brew install --cask pgadmin4

# Connect to database
# Host: localhost
# Port: 5432
# Database: pharmacy_platform
# Username: pharmacy_user
# Password: your_secure_password
```

### **API Testing**
```bash
# Test API endpoints
node test-api.js

# Test specific endpoint
curl http://localhost:3000/api/search?q=aspirin&type=drugs
```

## 📊 **Monitoring and Logging**

### **Application Logs**
```bash
# View application logs
npm run logs

# View database logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

### **Performance Monitoring**
```bash
# Monitor memory usage
node --max-old-space-size=1024 -e "console.log(process.memoryUsage())"

# Monitor database performance
psql -U pharmacy_user -d pharmacy_platform -c "SELECT * FROM pg_stat_activity;"
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Database Connection Error**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check connection
psql -U pharmacy_user -d pharmacy_platform -c "SELECT 1;"
```

#### **Memory Issues**
```bash
# Use optimized development mode
npm run dev-fast

# Or use simple server
npm run simple

# Clear Next.js cache
rm -rf .next
```

#### **Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### **API Key Issues**
```bash
# Verify environment variables
node -e "console.log(process.env.GEMINI_API_KEY)"

# Test API key
curl -H "Authorization: Bearer $GEMINI_API_KEY" https://generativelanguage.googleapis.com/v1/models
```

## 🔐 **Security Setup**

### **Environment Security**
```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set proper file permissions
chmod 600 .env.local
```

### **Database Security**
```bash
# Create read-only user for reporting
CREATE USER pharmacy_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE pharmacy_platform TO pharmacy_readonly;
GRANT USAGE ON SCHEMA public TO pharmacy_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pharmacy_readonly;
```

## 📱 **Mobile Development**

### **Responsive Testing**
```bash
# Test on different screen sizes
# Use browser developer tools
# Test on actual mobile devices
```

### **PWA Setup**
```bash
# Install PWA dependencies
npm install next-pwa

# Configure PWA in next.config.js
# Test PWA functionality
```

## 🌐 **Deployment**

### **Production Checklist**
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Domain name configured
- [ ] Payment gateway configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented

### **Deployment Commands**
```bash
# Build for production
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "pharmalink" -- start
```

## 📚 **Additional Resources**

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NotchPay API Documentation](https://docs.notchpay.com)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

### **Community**
- [Next.js GitHub](https://github.com/vercel/next.js)
- [PostgreSQL Community](https://www.postgresql.org/community/)
- [React Community](https://reactjs.org/community/support.html)

## 🎉 **Success Verification**

After setup, verify everything works:

1. **Application Loads**: Visit `http://localhost:3000`
2. **Database Connected**: Check user registration
3. **Search Works**: Test pharmacy/medication search
4. **Map Displays**: Verify OpenStreetMap integration
5. **AI Chat Works**: Test medical assistant
6. **Payment Ready**: Verify NotchPay integration

**Setup Complete! Your PharmaLink platform is ready! 🚀🏥**
