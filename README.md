# 🏥 PharmaLink - Cameroon's Leading Pharmacy Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://postgresql.org/)

A comprehensive pharmacy management and medication ordering platform designed specifically for Cameroon, featuring real pharmacy data from Yaoundé and CFA currency integration.

## 🌟 **Key Features**

### 🏪 **For Customers**
- **18 Real Yaoundé Pharmacies** with verified contact information
- **50+ Medications** with categories and pricing in CFA
- **Smart Search** for drugs and pharmacies
- **Order Management** with status tracking
- **Mobile-Optimized** interface for Cameroon's mobile-first market

### 🏥 **For Pharmacies**
- **Vendor Dashboard** with comprehensive analytics
- **Inventory Management** with low-stock alerts
- **Order Processing** and customer management
- **Revenue Analytics** and top-selling medications
- **Real-time Notifications** for new orders

### 🔐 **Security & Authentication**
- **JWT Authentication** with secure HTTP-only cookies
- **Role-based Access** (Patient, Pharmacy, Admin)
- **Password Security** with bcrypt hashing
- **Input Validation** and error handling

## 🚀 **Live Demo**

- **API Documentation**: [/api/docs](https://pharmalink.vercel.app/api/docs)
- **Health Check**: [/api/health](https://pharmalink.vercel.app/api/health)
- **Pharmacies API**: [/api/pharmacies](https://pharmalink.vercel.app/api/pharmacies)

## 🛠 **Tech Stack**

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Authentication**: JWT, NextAuth.js
- **Payment**: NotchPay (Cameroon's leading payment gateway)
- **Deployment**: Vercel (Production-ready)
- **Database**: PostgreSQL with real Cameroon data

## 📱 **Mobile Integration Ready**

All APIs are designed for mobile app integration with comprehensive documentation and examples for React Native, Flutter, and other mobile frameworks.

## 🏥 **Real Cameroon Data**

### **18 Verified Yaoundé Pharmacies:**
1. **PHARMACIE FRANCAISE** - 178, avenue Ahmadou AHIDJO
2. **PHARMACIE DU SOLEIL** - 642 AV Ahmadou Ahidjo
3. **PHARMACIE MINDILI** - Carrefour Obili
4. **PHARMACIE ST MARTIN** - Centre Ville
5. **PHARMACIE MOLIVA** - Madagascar
6. And 13 more verified pharmacies...

### **50+ Medications with Categories:**
- **Pain Relief**: Paracetamol, Ibuprofen, Aspirin
- **Antibiotics**: Amoxicillin, Ciprofloxacin, Azithromycin
- **Cardiovascular**: Lisinopril, Atorvastatin
- **Diabetes**: Metformin, Insulin
- **And many more...**

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/Akombark237/pharmalink.git
cd pharmalink
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Configure environment variables:**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/pharmalink

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_32_chars_minimum
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Payment (NotchPay for Cameroon)
NOTCHPAY_PUBLIC_KEY=your_notchpay_public_key
NOTCHPAY_SECRET_KEY=your_notchpay_secret_key
```

5. **Set up database:**
```bash
npm run db:migrate
npm run db:seed
```

6. **Start development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 **API Documentation**

### **Interactive Documentation**
Visit `/api/docs` for comprehensive API documentation with examples.

### **Key Endpoints**
- **Authentication**: `/api/auth/*`
- **Pharmacies**: `/api/pharmacies`
- **Medications**: `/api/medications`
- **Search**: `/api/search`
- **Orders**: `/api/orders`
- **Vendor Dashboard**: `/api/vendor/dashboard`

### **Example API Usage**
```javascript
// Get all pharmacies
const pharmacies = await fetch('/api/pharmacies').then(r => r.json());

// Search for medications
const results = await fetch('/api/search?query=paracetamol&type=drugs').then(r => r.json());

// Authenticate user
const auth = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
}).then(r => r.json());
```

## 🌍 **Deployment**

### **Deploy to Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables
vercel env add JWT_SECRET
vercel env add DATABASE_URL
vercel env add NOTCHPAY_PUBLIC_KEY
```

### **Custom Domain Setup**
```bash
# Add Cameroon domain
vercel domains add pharmalink.cm
```

## 💰 **Payment Integration**

Integrated with **NotchPay** - Cameroon's leading payment gateway supporting:
- ✅ **MTN Mobile Money**
- ✅ **Orange Money**
- ✅ **Express Union Mobile**
- ✅ **Bank Cards**
- ✅ **CFA Currency**

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Test API endpoints
npm run test:api

# Run comprehensive test suite
./scripts/test-apis.ps1
```

## 📊 **Project Structure**

```
pharmalink/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   └── dashboard/     # Dashboard pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and database
│   └── middleware/       # Authentication middleware
├── database/             # Database schemas and migrations
├── scripts/              # Deployment and testing scripts
└── public/              # Static assets
```

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Cameroon Ministry of Health** for pharmacy regulations
- **NotchPay** for payment gateway integration
- **Yaoundé Pharmacies** for providing real data
- **Open Source Community** for amazing tools and libraries

## 📞 **Support**

- **Documentation**: [/api/docs](https://pharmalink.vercel.app/api/docs)
- **Issues**: [GitHub Issues](https://github.com/Akombark237/pharmalink/issues)
- **Email**: akombark237@gmail.com

---

**🎉 Built with ❤️ for Cameroon's healthcare ecosystem**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Akombark237/pharmalink)
