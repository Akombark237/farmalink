# 🤖 Gemini Proxy Backend Connection Guide

## 📋 Overview

Your PharmaLink project has a **complete Gemini AI medical assistant integration** that's ready to use! This guide will help you connect the Gemini proxy backend to your Next.js frontend.

## ✅ What's Already Set Up

### Backend Components:
- ✅ **Gemini Proxy Server** (`gemini-proxy/server.js`) - Complete medical chat API
- ✅ **RAG Integration** - Pinecone vector database for enhanced medical responses
- ✅ **Conversation History** - Supabase for persistent chat storage
- ✅ **API Endpoints** - `/api/medical-chat`, `/api/chat-history`
- ✅ **Environment Config** - `.env` files with API keys

### Frontend Components:
- ✅ **Medical Chat Component** (`MedicalChat.tsx`) - Advanced chat interface
- ✅ **Medical Assistant Page** (`/use-pages/medical-assistant`) - Full chat experience
- ✅ **API Proxy Routes** - Next.js routes that forward to Gemini backend
- ✅ **Chat Widget** - Floating chat button on all pages
- ✅ **Environment Config** - Backend URL properly configured

## 🚀 Quick Start Options

### Option 1: One-Click Startup (Recommended)
**Double-click:** `start-pharmalink-with-chatbot.bat`
- ✅ Automatically starts both Gemini backend and Next.js frontend
- ✅ Opens browser to your application
- ✅ Shows real-time status in separate terminal windows

### Option 2: npm Scripts
```bash
# Start both services together
npm run dev:full

# Or using PowerShell
npm run dev:chatbot
```

### Option 3: Manual Startup
```bash
# Terminal 1: Start Gemini backend
cd gemini-proxy
node server.js

# Terminal 2: Start Next.js frontend
npm run dev
```

## 🔧 Configuration Details

### Environment Variables

**Main Project (`.env.local`):**
```env
GEMINI_BACKEND_URL=http://localhost:3001
```

**Gemini Proxy (`gemini-proxy/.env`):**
```env
GEMINI_API_KEY=AIzaSyBIXbgZ3EE043v9RLa0Z_h93-BArAF-Hr4
PORT=3001
PINECONE_API_KEY=pcsk_7Ja3Eb_RjiusV2FSEbXVwcvQh5EcyDor8acU2tsK3CiKnBcGD9eX8H8A7RH1ar7TmnfBvr
PINECONE_INDEX=medical-handbook
SUPABASE_URL=https://lfcbxeqfbvvvfqxnwrxr.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Service URLs
- **Gemini Backend**: http://localhost:3001
- **Next.js Frontend**: http://localhost:3000
- **Medical Assistant**: http://localhost:3000/use-pages/medical-assistant
- **Chat Widget**: Available on all pages (bottom-right corner)

## 🧪 Testing the Connection

### 1. Test Gemini Backend Health
```bash
curl http://localhost:3001/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "message": "Qala-Lwazi Medical Assistant API is running"
}
```

### 2. Test Next.js Proxy
```bash
curl http://localhost:3000/api/medical-chat
```
**Expected Response:**
```json
{
  "status": "ok",
  "message": "Medical chat service is available",
  "backendUrl": "http://localhost:3001"
}
```

### 3. Test Medical Chat
1. Open http://localhost:3000/use-pages/medical-assistant
2. Ask a medical question like: "What are the side effects of aspirin?"
3. You should get a detailed medical response from Qala-Lwazi

## 🎯 Features Available

### 1. Advanced Medical Chat
- **RAG-Enhanced Responses** - Uses medical handbook for accurate information
- **Conversation Memory** - Remembers chat history across sessions
- **Customizable Settings** - Detail level, creativity, response length
- **Safety Filters** - Built-in medical content safety

### 2. Multiple Access Points
- **Floating Chat Widget** - Available on all pages
- **Dedicated Medical Assistant Page** - Full-featured chat interface
- **Quick Questions** - Pre-defined medical queries
- **Mobile Responsive** - Works on all devices

### 3. Professional Features
- **Markdown Support** - Rich text formatting in responses
- **Typing Indicators** - Real-time chat experience
- **Error Handling** - Graceful fallbacks when services are unavailable
- **Session Management** - Persistent conversations

## 🛠️ Troubleshooting

### Common Issues:

**1. "Medical Assistant Unavailable"**
- **Cause**: Gemini backend not running
- **Solution**: Start backend with `cd gemini-proxy && node server.js`

**2. "Failed to connect to medical chat service"**
- **Cause**: Backend URL misconfigured
- **Solution**: Check `GEMINI_BACKEND_URL` in `.env.local`

**3. Port 3001 already in use**
- **Solution**: Kill existing processes with `taskkill /f /im node.exe`

**4. API Key errors**
- **Cause**: Invalid Gemini API key
- **Solution**: Update `GEMINI_API_KEY` in `gemini-proxy/.env`

### Health Check Commands:
```bash
# Check if backend is running
curl http://localhost:3001/health

# Check if frontend proxy works
curl http://localhost:3000/api/medical-chat

# Kill all Node.js processes
taskkill /f /im node.exe
```

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. **Backend Terminal**: "Qala-Lwazi Medical Assistant API running on port 3001"
2. **Frontend Terminal**: "Ready in X seconds" and "Local: http://localhost:3000"
3. **Medical Assistant Page**: Shows "Online" status badge
4. **Chat Widget**: Floating blue chat button on all pages
5. **Chat Responses**: Detailed medical answers from Qala-Lwazi

## 📱 Usage Examples

### Quick Medical Questions:
- "What are the side effects of ibuprofen?"
- "How should I store my medications?"
- "Can I take multiple vitamins together?"
- "What's the difference between generic and brand name drugs?"

### Advanced Medical Queries:
- "Explain the mechanism of action of ACE inhibitors"
- "What are the contraindications for aspirin therapy?"
- "Describe the pharmacokinetics of metformin"

## 🔒 Security & Privacy

- **No Personal Data Storage** - Conversations are anonymized
- **Medical Disclaimers** - Always recommends consulting healthcare professionals
- **Content Safety** - Built-in filters for harmful content
- **Secure API Keys** - Environment variables for sensitive data

---

## 🎯 Next Steps

1. **Start the services** using one of the methods above
2. **Test the connection** using the health check endpoints
3. **Try the medical assistant** at `/use-pages/medical-assistant`
4. **Use the chat widget** on any page
5. **Customize settings** in the chat interface

Your Gemini-powered medical assistant is ready to help users with medical questions and medication guidance!
