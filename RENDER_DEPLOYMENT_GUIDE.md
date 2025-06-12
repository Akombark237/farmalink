# 🚀 Render Deployment Guide for PharmaLink

## 🌟 **Why Render?**

- ✅ **Free tier** with PostgreSQL database included
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in SSL** certificates
- ✅ **Environment variables** management
- ✅ **Great for Next.js** applications
- ✅ **African-friendly** infrastructure

## 📋 **STEP-BY-STEP DEPLOYMENT**

### **Step 1: Sign Up for Render**

1. **Go to**: https://render.com
2. **Click "Get Started"**
3. **Sign up with GitHub** (recommended)
4. **Authorize Render** to access your repositories

### **Step 2: Create New Web Service**

1. **Click "New +"** in Render dashboard
2. **Select "Web Service"**
3. **Connect your GitHub repository**:
   - Repository: `https://github.com/Akombark237/pharmalink`
   - Branch: `main`

### **Step 3: Configure Service Settings**

**Basic Settings:**
- **Name**: `pharmalink`
- **Region**: `Oregon (US West)` or `Frankfurt (Europe)` (closest to Africa)
- **Branch**: `main`
- **Runtime**: `Node`

**Build & Deploy Settings:**
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` (or latest)

### **Step 4: Environment Variables**

**CRITICAL**: Add these environment variables in Render dashboard:

```env
# Authentication
JWT_SECRET=pharmalink_jwt_secret_2024_super_secure_key_32_chars_minimum
NEXTAUTH_SECRET=pharmalink_nextauth_secret_2024
NEXTAUTH_URL=https://pharmalink.onrender.com

# Database (will be auto-generated when you add PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Payment Gateway (NotchPay for Cameroon)
NOTCHPAY_PUBLIC_KEY=your_notchpay_public_key_here
NOTCHPAY_SECRET_KEY=your_notchpay_secret_key_here

# Application Settings
NODE_ENV=production
PORT=10000
```

**How to add them:**
1. **Go to "Environment"** tab in your service
2. **Click "Add Environment Variable"**
3. **Add each variable** one by one
4. **Save changes**

### **Step 5: Add PostgreSQL Database**

1. **Click "New +"** in dashboard
2. **Select "PostgreSQL"**
3. **Configure database**:
   - **Name**: `pharmalink-db`
   - **Database Name**: `pharmalink`
   - **User**: `pharmalink_user`
   - **Region**: Same as your web service
   - **Plan**: `Free` (100MB storage)

4. **Copy connection string** from database dashboard
5. **Add to your web service** as `DATABASE_URL` environment variable

### **Step 6: Deploy**

1. **Click "Create Web Service"**
2. **Wait for build** (3-5 minutes)
3. **Your app will be live!**

---

## 🎯 **EXPECTED DEPLOYMENT RESULT**

### **Your Live URLs:**
- **Main App**: `https://pharmalink.onrender.com`
- **API Health**: `https://pharmalink.onrender.com/api/health`
- **API Docs**: `https://pharmalink.onrender.com/api/docs`
- **Pharmacies**: `https://pharmalink.onrender.com/api/pharmacies`

### **What Will Work Immediately:**
✅ **All APIs** (pharmacies, medications, search)
✅ **API Documentation** at `/api/docs`
✅ **Health Check** at `/api/health`
✅ **Authentication** system
✅ **Database integration** (with PostgreSQL)
✅ **Order management** (full functionality)
✅ **Vendor dashboard** (complete)

---

## 🗄️ **DATABASE SETUP**

### **Automatic Database Migration:**

After deployment, run database migrations:

1. **Go to your web service** in Render dashboard
2. **Click "Shell"** tab
3. **Run migration commands**:

```bash
# Connect to your service shell
npm run db:migrate

# Seed with pharmacy data
npm run db:seed
```

### **Manual Database Setup:**

If automatic migration doesn't work:

1. **Connect to PostgreSQL** using provided credentials
2. **Run SQL files** from your `database/` folder:
   - `01_schema.sql`
   - `02_pharmacies.sql`
   - `03_medications.sql`
   - `04_sample_data.sql`

---

## 🧪 **TESTING YOUR DEPLOYMENT**

### **Test Commands:**

```bash
# Test health check
curl https://pharmalink.onrender.com/api/health

# Test pharmacies API
curl https://pharmalink.onrender.com/api/pharmacies

# Test search API
curl "https://pharmalink.onrender.com/api/search?query=paracetamol"

# Test authentication
curl -X POST https://pharmalink.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@pharmalink.com","password":"password123"}'

# Test vendor dashboard (with auth token)
curl -X GET https://pharmalink.onrender.com/api/vendor/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Expected Results:**
- ✅ **Health check**: Returns "healthy" status
- ✅ **Pharmacies**: Returns 18 Yaoundé pharmacies
- ✅ **Search**: Returns medication results
- ✅ **Authentication**: Returns JWT token
- ✅ **Vendor dashboard**: Returns analytics data

---

## 🔧 **RENDER-SPECIFIC FEATURES**

### **Automatic Deployments:**
- ✅ **Auto-deploy** on GitHub push
- ✅ **Build logs** in real-time
- ✅ **Rollback** to previous versions
- ✅ **Preview deployments** for pull requests

### **Monitoring:**
- ✅ **Service metrics** (CPU, memory, requests)
- ✅ **Log streaming** in real-time
- ✅ **Health checks** with automatic restarts
- ✅ **Custom domains** and SSL

### **Database Features:**
- ✅ **Automated backups**
- ✅ **Connection pooling**
- ✅ **Read replicas** (paid plans)
- ✅ **Database metrics**

---

## 🌍 **CUSTOM DOMAIN SETUP**

To use a custom domain like `pharmalink.cm`:

1. **Go to "Settings"** in your web service
2. **Click "Custom Domains"**
3. **Add your domain**
4. **Configure DNS** records:
   - **Type**: CNAME
   - **Name**: @ (or www)
   - **Value**: `pharmalink.onrender.com`
5. **SSL certificate** will be auto-generated

---

## 💰 **RENDER PRICING**

### **Free Tier Includes:**
- ✅ **Web Service**: 750 hours/month
- ✅ **PostgreSQL**: 100MB storage
- ✅ **SSL certificates**
- ✅ **Custom domains**
- ✅ **GitHub integration**

### **Paid Plans:**
- **Starter ($7/month)**: Always-on service, more resources
- **Standard ($25/month)**: Increased limits, priority support
- **Pro ($85/month)**: Advanced features, dedicated resources

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues:**

**1. Build Fails**
- Check **build logs** in Render dashboard
- Verify **Node.js version** compatibility
- Ensure all **dependencies** are in package.json

**2. Database Connection Issues**
- Verify **DATABASE_URL** environment variable
- Check **database status** in Render dashboard
- Run **database migrations** after deployment

**3. Environment Variables Missing**
- Double-check **all required variables** are set
- Verify **variable names** (case-sensitive)
- **Redeploy** after adding variables

**4. Service Won't Start**
- Check **start command**: `npm start`
- Verify **port configuration**: Render uses PORT=10000
- Review **service logs** for errors

---

## 📊 **MONITORING & MAINTENANCE**

### **Render Dashboard Features:**
- ✅ **Real-time logs**
- ✅ **Service metrics**
- ✅ **Database monitoring**
- ✅ **Build history**
- ✅ **Environment management**

### **Health Monitoring:**
- ✅ **Health check endpoint**: `/api/health`
- ✅ **Automatic restarts** on failures
- ✅ **Email notifications** for issues
- ✅ **Uptime monitoring**

---

## 🎯 **POST-DEPLOYMENT CHECKLIST**

After successful deployment:

- [ ] ✅ **App is live** and accessible
- [ ] ✅ **Database connected** and migrations run
- [ ] ✅ **All APIs working** (test with curl commands)
- [ ] ✅ **Authentication functional**
- [ ] ✅ **Environment variables** properly set
- [ ] ⏳ **Configure NotchPay** payment gateway
- [ ] ⏳ **Set up custom domain** (optional)
- [ ] ⏳ **Configure monitoring** alerts

---

## 🎉 **SUCCESS INDICATORS**

**Your deployment is successful when:**

1. ✅ **Build completes** without errors
2. ✅ **Service shows "Live"** status
3. ✅ **Health check** returns 200 OK
4. ✅ **Database connected** successfully
5. ✅ **All API endpoints** respond correctly
6. ✅ **No errors** in service logs

---

## 📞 **NEXT STEPS**

1. **Test all APIs** using provided curl commands
2. **Run database migrations** and seed data
3. **Configure NotchPay** for payments
4. **Set up monitoring** and alerts
5. **Add custom domain** (optional)
6. **Test mobile app integration**

**🎯 Your PharmaLink platform will be serving customers in Yaoundé within 10 minutes!**

---

## 🆘 **NEED HELP?**

- **Render Documentation**: https://render.com/docs
- **Support**: https://render.com/support
- **Community**: https://community.render.com
- **Status Page**: https://status.render.com

**🇨🇲 Ready to revolutionize pharmacy services in Cameroon!**
