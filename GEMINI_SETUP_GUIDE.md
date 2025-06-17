# 🤖 Gemini Proxy Backend Setup Guide

This guide will help you set up the Gemini proxy backend and integrate it with your Next.js frontend for the medical chat functionality.

## 📋 Overview

Your project already has most components in place:
- ✅ Gemini proxy backend (`gemini-proxy/`)
- ✅ Next.js API proxy routes (`/api/medical-chat`, `/api/chat-history`)
- ✅ Medical chat component (`MedicalChat.tsx`)
- ✅ Environment configuration files

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the setup script:
```bash
node setup-gemini-integration.js
```

### Option 2: Manual Setup

Follow the steps below if you prefer manual setup.

## 📝 Manual Setup Steps

### Step 1: Environment Configuration

#### 1.1 Next.js Environment (.env.local)
Ensure your `.env.local` file contains:
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

#### 1.2 Gemini Backend Environment (gemini-proxy/.env)
Your `gemini-proxy/.env` should contain:
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

### Step 2: Install Dependencies

#### 2.1 Gemini Backend Dependencies
```bash
cd gemini-proxy
npm install
```

#### 2.2 Next.js Dependencies (if needed)
```bash
npm install
```

### Step 3: Start Services

#### 3.1 Start Gemini Backend (Terminal 1)
```bash
cd gemini-proxy
npm start
```

You should see:
```
Qala-Lwazi Medical Assistant API running on port 3001
```

#### 3.2 Start Next.js App (Terminal 2)
```bash
npm run dev
```

You should see:
```
Ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 🔍 Testing the Integration

### 1. Health Check
Test the Gemini backend:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Qala-Lwazi Medical Assistant API is running"
}
```

### 2. Next.js Proxy Test
Test the Next.js proxy:
```bash
curl http://localhost:3000/api/medical-chat
```

### 3. Frontend Test
1. Open http://localhost:3000
2. Look for the medical chat widget (should appear on all pages)
3. Try asking a medical question like "What are the side effects of aspirin?"

## 🎯 Features Available

### 1. Medical Chat Widget
- **Location**: Available on all pages via the floating chat button
- **Features**: 
  - RAG-enhanced responses using medical handbook
  - Conversation history persistence
  - Customizable response settings
  - Real-time typing indicators

### 2. API Endpoints
- `POST /api/medical-chat` - Send medical questions
- `GET /api/chat-history/:sessionId` - Get conversation history
- `DELETE /api/chat-history/:sessionId` - Clear conversation history

### 3. Advanced Features
- **RAG Integration**: Uses Pinecone vector database for medical handbook retrieval
- **Conversation Memory**: Stores chat history in Supabase
- **Safety Filters**: Built-in content safety for medical responses
- **Customizable Settings**: Response length, detail level, creativity controls

## 🛠️ Configuration Options

### Chat Preferences
Users can customize:
- **RAG Mode**: Enable/disable enhanced medical handbook responses
- **Detail Level**: Simple, Balanced, or Detailed explanations
- **Creativity**: Conservative, Balanced, or Creative responses
- **Response Length**: Short, Medium, or Long responses
- **References**: Include/exclude medical references

### Backend Configuration
Modify `gemini-proxy/server.js` for:
- System prompts
- Safety settings
- Generation parameters
- RAG behavior

## 🔧 Troubleshooting

### Common Issues

#### 1. "Failed to connect to medical chat service"
- Check if Gemini backend is running on port 3001
- Verify `GEMINI_BACKEND_URL` in `.env.local`

#### 2. "Gemini backend is not available"
- Ensure Gemini API key is valid
- Check internet connection
- Verify all dependencies are installed

#### 3. Chat widget not appearing
- Check browser console for errors
- Verify Next.js app is running
- Clear browser cache

#### 4. RAG responses not working
- Check Pinecone API key and index name
- Verify Supabase configuration
- Check network connectivity

### Debug Commands
```bash
# Check Gemini backend status
curl http://localhost:3001/health

# Check Next.js proxy
curl http://localhost:3000/api/medical-chat

# View Gemini backend logs
cd gemini-proxy && npm start

# View Next.js logs
npm run dev
```

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🎉 Success!

Once everything is running, you should have:
- ✅ Gemini backend running on http://localhost:3001
- ✅ Next.js frontend running on http://localhost:3000
- ✅ Medical chat widget available on all pages
- ✅ RAG-enhanced medical responses
- ✅ Conversation history persistence

Your medical assistant "Qala-Lwazi" is now ready to help users with medical questions!
