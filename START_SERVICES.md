# 🚀 Quick Start Guide - Gemini Medical Chat

## 📋 Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js and npm installed
- ✅ PostgreSQL running (for main app database)
- ✅ Internet connection (for Gemini API, Pinecone, Supabase)

## 🔧 Step 1: Environment Setup

### 1.1 Check/Create .env.local
Ensure your `.env.local` file in the root directory contains:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_platform
DB_USER=postgres
DB_PASSWORD=Joshua

# JWT Configuration
JWT_SECRET=pharmacy-platform-jwt-secret-key-2024-super-secure-random-string
NEXTAUTH_SECRET=pharmacy-platform-nextauth-secret-2024-another-secure-string

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000

# Application Settings
NODE_ENV=development

# Gemini Backend Configuration
GEMINI_BACKEND_URL=http://localhost:3001
```

**⚠️ IMPORTANT:** If the `GEMINI_BACKEND_URL` line is missing, add it manually!

### 1.2 Check Gemini Backend Environment
Verify `gemini-proxy/.env` contains:

```bash
GEMINI_API_KEY=AIzaSyBIXbgZ3EE043v9RLa0Z_h93-BArAF-Hr4
PORT=3001

# Pinecone Configuration (for RAG functionality)
PINECONE_API_KEY=pcsk_7Ja3Eb_RjiusV2FSEbXVwcvQh5EcyDor8acU2tsK3CiKnBcGD9eX8H8A7RH1ar7TmnfBvr
PINECONE_INDEX=medical-handbook

# Supabase Configuration (for conversation history)
SUPABASE_URL=https://lfcbxeqfbvvvfqxnwrxr.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmY2J4ZXFmYnZ2dmZxeG53cnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0MzA0NzcsImV4cCI6MjAzMTAwNjQ3N30.Nh83ebqzf1iGHTaGzK0LUEbxcwFb8HWAL9ZqAZKLvQE
```

## 🚀 Step 2: Start Services

### 2.1 Terminal 1: Start Gemini Backend

```bash
# Navigate to gemini-proxy directory
cd gemini-proxy

# Install dependencies (if not already installed)
npm install

# Start the backend server
npm start
```

**Expected Output:**
```
Qala-Lwazi Medical Assistant API running on port 3001
```

### 2.2 Terminal 2: Start Next.js Frontend

```bash
# In the main project directory
npm install  # if dependencies not installed

# Start the development server
npm run dev
```

**Expected Output:**
```
Ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 🧪 Step 3: Test the Integration

### 3.1 Quick Health Checks

1. **Backend Health Check:**
   - Open: http://localhost:3001/health
   - Should show: `{"status":"ok","message":"Qala-Lwazi Medical Assistant API is running"}`

2. **Frontend Health Check:**
   - Open: http://localhost:3000
   - Should load the main application

3. **Integration Test Page:**
   - Open: http://localhost:3000/test-chat
   - Check that both status indicators show "Online"

### 3.2 Test Medical Chat

1. **Floating Widget Test:**
   - Look for chat button in bottom-right corner of any page
   - Click to open chat widget
   - Send a test message: "What are the side effects of aspirin?"

2. **Full Page Test:**
   - Visit: http://localhost:3000/use-pages/medical-assistant
   - Try the medical chat interface
   - Test different settings (RAG mode, detail level, etc.)

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Backend shows "Online" status at http://localhost:3000/test-chat
- ✅ Proxy shows "Online" status at http://localhost:3000/test-chat
- ✅ Chat widget appears on all pages
- ✅ Medical questions get intelligent responses
- ✅ Conversation history is preserved
- ✅ Settings panel works (gear icon in chat)

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if port 3001 is in use
netstat -an | findstr :3001

# Kill any process using port 3001
# Then try starting again
cd gemini-proxy
npm start
```

### Frontend Won't Start
```bash
# Check if port 3000 is in use
netstat -an | findstr :3000

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Chat Not Working
1. Check browser console for errors
2. Verify both services are running
3. Check environment variables
4. Test API endpoints directly:
   - http://localhost:3001/health
   - http://localhost:3000/api/medical-chat

### Environment Issues
- Ensure `.env.local` has `GEMINI_BACKEND_URL=http://localhost:3001`
- Check that `gemini-proxy/.env` has all required keys
- Restart both services after environment changes

## 🎯 What You Get

Once everything is running:

### 🤖 Medical Assistant Features
- **Intelligent Responses**: Powered by Google Gemini AI
- **RAG Enhancement**: Uses medical handbook for accurate information
- **Conversation Memory**: Remembers chat history across sessions
- **Customizable Settings**: Adjust response style, length, and detail
- **Safety Filters**: Built-in medical content safety

### 🌐 Integration Points
- **Global Widget**: Available on all pages via floating button
- **API Endpoints**: RESTful APIs for chat and history management
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live typing indicators and status

### 🔒 Security & Privacy
- **Secure API Keys**: Environment-based configuration
- **Content Filtering**: Medical-focused responses only
- **Data Persistence**: Optional conversation history storage

## 📚 Next Steps

1. **Customize Prompts**: Edit `gemini-proxy/server.js` to modify AI behavior
2. **Add Features**: Extend the chat component with new functionality
3. **Deploy**: Set up production environment with proper API keys
4. **Monitor**: Use the status endpoints for health monitoring

## 🆘 Need Help?

- Check the comprehensive setup guide: `GEMINI_SETUP_GUIDE.md`
- Review troubleshooting: `TROUBLESHOOTING_GUIDE.md`
- Test integration: http://localhost:3000/test-chat
- View logs in both terminal windows for error details

---

**🎉 Congratulations!** Your Gemini Medical Chat integration is now ready to help users with medical questions!
