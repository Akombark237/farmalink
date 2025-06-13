# 🤖 Qala-Lwazi AI Chatbot Setup Guide

This guide explains how to set up the Google Gemini AI integration for the Qala-Lwazi medical assistant chatbot.

## 🚀 Quick Setup

### 1. Get Google Gemini API Key

1. **Visit Google AI Studio:**
   - Go to [https://aistudio.google.com/](https://aistudio.google.com/)
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Get API Key" in the top navigation
   - Click "Create API Key"
   - Choose "Create API key in new project" or select existing project
   - Copy the generated API key

3. **Add to Environment:**
   ```bash
   # Create .env.local file (if it doesn't exist)
   cp .env.example .env.local
   
   # Add your Gemini API key
   echo "GEMINI_API_KEY=your_actual_api_key_here" >> .env.local
   ```

### 2. Test the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the chatbot:**
   - Open http://localhost:3002
   - Click the blue chatbot button in bottom-right
   - Send a message like "Hello" or "I have a headache"
   - You should see AI-powered responses

3. **Check the status:**
   - Visit http://localhost:3002/api/medical-chat
   - Look for `"aiEnabled": true` in the response

## 🔧 Configuration Options

### Environment Variables

```env
# Required for AI responses
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Customize the backend URL (if using external service)
GEMINI_BACKEND_URL=http://localhost:3001
```

### API Features

**With Gemini API Key:**
- ✅ Real-time AI responses
- ✅ Contextual understanding
- ✅ Personalized medical advice
- ✅ Multi-language support
- ✅ Advanced medical knowledge

**Without API Key (Fallback):**
- ⚠️ Basic predefined responses
- ⚠️ Limited medical guidance
- ⚠️ Emergency information only

## 🛡️ Safety & Compliance

### Medical Disclaimer
The AI assistant:
- Provides general medical information only
- Cannot diagnose medical conditions
- Cannot prescribe medications
- Always recommends consulting healthcare professionals
- Includes safety disclaimers in responses

### Content Safety
- Uses Google's built-in safety filters
- Blocks harmful or inappropriate content
- Maintains professional medical context
- Culturally sensitive to Cameroon context

## 🔍 Troubleshooting

### Chatbot Shows "Offline"
1. Check if `GEMINI_API_KEY` is set in `.env.local`
2. Verify API key is valid at [Google AI Studio](https://aistudio.google.com/)
3. Check browser console for error messages
4. Restart the development server

### API Errors
```bash
# Check API status
curl http://localhost:3002/api/medical-chat

# Expected response with API key:
{
  "status": "ok",
  "aiEnabled": true,
  "service": "Google Gemini AI"
}

# Without API key:
{
  "status": "ok", 
  "aiEnabled": false,
  "service": "Fallback Responses"
}
```

### Common Issues

**"API key not found"**
- Ensure `.env.local` file exists in project root
- Check that `GEMINI_API_KEY=your_key` is properly set
- Restart the development server after adding the key

**"Invalid API key"**
- Verify the API key at Google AI Studio
- Ensure no extra spaces or characters in the key
- Try generating a new API key

**"Rate limit exceeded"**
- Google Gemini has usage limits on free tier
- Wait a few minutes before trying again
- Consider upgrading to paid tier for higher limits

## 📊 Monitoring

### Logs
The application logs all chatbot interactions:
```bash
# View logs in development
npm run dev

# Look for messages like:
[session_123] Processing message: Hello...
[session_123] Generated response: Hello! I'm Qala-Lwazi...
```

### Health Check
Monitor the service status:
```bash
# Check health endpoint
curl http://localhost:3002/api/medical-chat

# Response includes:
- status: ok/error
- aiEnabled: true/false  
- service: "Google Gemini AI" or "Fallback Responses"
- capabilities: list of features
```

## 🚀 Production Deployment

### Environment Setup
```env
# Production environment variables
NODE_ENV=production
GEMINI_API_KEY=your_production_api_key
NEXTAUTH_URL=https://your-domain.com
```

### Render Deployment
The `render.yaml` file is already configured. Just add the environment variable:

1. Go to your Render dashboard
2. Select your service
3. Go to Environment tab
4. Add: `GEMINI_API_KEY` = `your_api_key`
5. Deploy

## 💡 Tips

1. **Free Tier Limits:** Google Gemini free tier has rate limits
2. **Response Time:** AI responses take 1-3 seconds
3. **Fallback Mode:** App works without API key using basic responses
4. **Session Management:** Each chat session gets a unique ID
5. **Medical Context:** AI is trained specifically for medical assistance

## 🆘 Support

If you need help:
1. Check the troubleshooting section above
2. Review the application logs
3. Test the API endpoints directly
4. Verify your Google AI Studio setup

The chatbot will automatically fall back to basic responses if there are any issues with the AI service, ensuring the application always remains functional.
