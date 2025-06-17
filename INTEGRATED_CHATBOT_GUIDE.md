# 🤖 Integrated Chatbot Startup Guide

## 🎯 Overview
Your PharmaLink project now has **integrated chatbot startup** that automatically launches both the Next.js frontend and Gemini chatbot backend together!

## 🚀 Quick Start Options

### Option 1: One-Click Startup (Recommended)
**Double-click:** `start-pharmalink.bat`
- ✅ Automatically starts both services
- ✅ Opens browser to your app
- ✅ Shows real-time status

### Option 2: PowerShell Script
```powershell
# Run in PowerShell
.\start-with-chatbot.ps1
```

### Option 3: npm Scripts
```bash
# Start both services together
npm run dev:chatbot

# Or using Node.js script
npm run dev:full
```

### Option 4: Manual Startup
```bash
# Terminal 1: Start chatbot backend
npm run chatbot:start

# Terminal 2: Start frontend
npm run dev
```

## 📊 Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js frontend only |
| `npm run dev:full` | Start both frontend + chatbot (Node.js) |
| `npm run dev:chatbot` | Start both frontend + chatbot (PowerShell) |
| `npm run chatbot:start` | Start chatbot backend only |
| `npm run chatbot:dev` | Start chatbot in development mode |
| `npm run chatbot:test` | Test chatbot connection |

## 🔧 How It Works

### Automatic Service Management
1. **Environment Check**: Validates Node.js, npm, and configuration files
2. **Port Cleanup**: Automatically stops any existing processes on ports 3000 and 3001
3. **Backend Startup**: Launches Gemini chatbot backend on port 3001
4. **Frontend Startup**: Launches Next.js frontend on port 3000
5. **Health Checks**: Tests connections and displays status
6. **Browser Launch**: Automatically opens your application

### Service URLs
- **Frontend**: http://localhost:3000
- **Chatbot Backend**: http://localhost:3001
- **Medical Assistant**: http://localhost:3000/use-pages/medical-assistant
- **Database Viewer**: http://localhost:3000/database-viewer
- **Admin Dashboard**: http://localhost:3000/admin_panel/admin_dashboard

## 🎛️ Chatbot Status Monitoring

### Real-Time Status Display
- **Widget Status**: Shows online/offline status in chat widget
- **API Health Check**: Automatic health monitoring every 30 seconds
- **Manual Refresh**: Click refresh button to check status immediately

### Status Indicators
- 🟢 **Online**: Chatbot is running and responding
- 🔴 **Offline**: Chatbot backend is not available
- 🟡 **Checking**: Status check in progress

## 🛠️ Configuration

### Environment Files
The startup scripts automatically create necessary configuration:

**Main Project (.env.local)**:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_platform
DB_USER=postgres
DB_PASSWORD=Joshua

# Gemini Backend Configuration
GEMINI_BACKEND_URL=http://localhost:3001
```

**Chatbot Backend (gemini-proxy/.env)**:
```env
# Gemini API Configuration
GEMINI_API_KEY=AIzaSyBIXbgZ3EE043v9RLa0Z_h93-BArAF-Hr4
PORT=3001

# Optional: Pinecone for RAG
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=medical-handbook

# Optional: Supabase for conversation history
SUPABASE_URL=https://lfcbxeqfbvvvfqxnwrxr.supabase.co
SUPABASE_KEY=your_supabase_key_here
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Port already in use"
**Solution**: The startup scripts automatically handle this, but if needed:
```bash
# Kill processes manually
taskkill /f /im node.exe
# Or use the built-in cleanup
npm run dev:chatbot
```

#### 2. "Chatbot offline"
**Symptoms**: Red status indicator, "Service Offline" message
**Solutions**:
- Check if backend started: http://localhost:3001/health
- Restart with: `npm run chatbot:start`
- Check gemini-proxy/.env file exists

#### 3. "Environment file missing"
**Solution**: Run any startup script - it will create missing .env files automatically

#### 4. "Node.js not found"
**Solution**: Install Node.js from https://nodejs.org/

### Debug Commands
```bash
# Test chatbot connection
npm run chatbot:test

# Check what's running on ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# View chatbot logs
cd gemini-proxy && npm run dev
```

## 🎯 Features

### Integrated Chat Widget
- **Global Availability**: Chat widget appears on all pages
- **Real-time Status**: Shows connection status
- **Quick Actions**: Common medical questions
- **Minimize/Maximize**: Collapsible interface
- **Full Page Mode**: Link to dedicated chat page

### Medical Assistant Features
- **AI-Powered**: Uses Google Gemini for medical responses
- **RAG Integration**: Retrieval-Augmented Generation with medical knowledge
- **Conversation History**: Persistent chat sessions
- **Safety Filters**: Medical-focused content filtering
- **Quick Questions**: Pre-defined medical queries

### Admin Features
- **Status Monitoring**: Real-time chatbot status in admin dashboard
- **Health Checks**: API endpoint monitoring
- **Configuration Management**: Environment variable management

## 🚀 Next Steps

### 1. Customize Chatbot Behavior
Edit `gemini-proxy/server.js` to modify:
- Medical prompts and responses
- Safety settings
- Response formatting
- RAG configuration

### 2. Add More Features
- Custom medical knowledge base
- User authentication for chat history
- Advanced analytics
- Multi-language support

### 3. Production Deployment
- Set up production environment variables
- Configure proper API keys
- Set up monitoring and logging
- Implement rate limiting

## 📞 Support

### If Issues Persist:
1. **Check Logs**: Look at both terminal windows for errors
2. **Restart Services**: Use `npm run dev:chatbot` to restart everything
3. **Verify Configuration**: Ensure all .env files are properly set
4. **Test Individually**: Start services separately to isolate issues

### Quick Health Check:
```bash
# Test everything is working
curl http://localhost:3000/api/database/test
curl http://localhost:3001/health
```

---

## 🎉 Success!

Your PharmaLink project now has **fully integrated chatbot functionality**! 

- ✅ **One-command startup** for both services
- ✅ **Automatic configuration** management
- ✅ **Real-time status** monitoring
- ✅ **Professional chat interface** on all pages
- ✅ **Medical AI assistant** powered by Gemini

**Happy coding with your AI-powered pharmacy platform!** 🚀
