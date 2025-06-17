const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pineconeService = require('./pineconeService');
const supabaseClient = require('./supabaseClient');
const addStatusEndpoint = require('./status-endpoint');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Add status endpoint
addStatusEndpoint(app);

// We'll use Supabase for conversation history storage
// Keeping a small in-memory cache for performance
const conversationCache = new Map();

// Helper function to retry Gemini requests with exponential backoff
async function retryGeminiRequest(chat, prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to contact Gemini API`);

      // Set a timeout for the request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
      });

      const requestPromise = chat.sendMessage(prompt);
      const result = await Promise.race([requestPromise, timeoutPromise]);

      return result.response.text();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: wait 2^attempt seconds
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Helper function to generate static medical responses as fallback
function generateStaticMedicalResponse(message) {
  console.log('Using static fallback response');

  const lowerMessage = message.toLowerCase();

  // Common medical topics with static responses
  if (lowerMessage.includes('diabetes')) {
    return `**Qala-Lwazi is thinking...**

I apologize, but I'm currently experiencing connectivity issues with my advanced AI systems. However, I can provide you with some basic information about diabetes:

**Common Diabetes Symptoms:**
- Increased thirst and frequent urination
- Extreme fatigue
- Blurred vision
- Slow-healing cuts and wounds
- Unexplained weight loss (Type 1)
- Tingling or numbness in hands/feet

**Important:** Please consult with a healthcare professional for proper diagnosis and treatment. This is general information and should not replace professional medical advice.

*Note: I'm currently operating in limited mode due to technical issues. Please try again later for more detailed responses.*`;
  }

  if (lowerMessage.includes('leukemia') || lowerMessage.includes('leukemia')) {
    return `**Qala-Lwazi is thinking...**

I apologize, but I'm currently experiencing connectivity issues. Here's basic information about leukemia symptoms:

**Common Leukemia Symptoms:**
- Fatigue and weakness
- Frequent infections
- Easy bruising or bleeding
- Swollen lymph nodes
- Unexplained weight loss
- Fever or night sweats
- Bone or joint pain

**Critical:** Leukemia is a serious condition requiring immediate medical attention. Please consult an oncologist or hematologist for proper evaluation and treatment.

*Note: I'm currently operating in limited mode due to technical issues. Please try again later for more comprehensive information.*`;
  }

  // Generic medical response
  return `**Qala-Lwazi is thinking...**

I apologize, but I'm currently experiencing technical difficulties connecting to my advanced medical knowledge systems.

**General Medical Advice:**
For any health concerns, I strongly recommend:
- Consulting with a qualified healthcare professional
- Seeking immediate medical attention for urgent symptoms
- Following up with your primary care physician

**Emergency:** If you're experiencing a medical emergency, please call emergency services immediately.

*Note: I'm currently operating in limited mode. Please try again later when my full medical assistance capabilities are restored.*

**Powered by Ukuqala Labs**`;
}

// Initialize Gemini API with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBIXbgZ3EE043v9RLa0Z_h93-BArAF-Hr4';

// Validate API key
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
  console.error('❌ GEMINI_API_KEY is not properly configured in .env file');
  console.error('Please set a valid Gemini API key in the .env file');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Test API connectivity on startup
async function testGeminiConnection() {
  try {
    console.log('🔍 Testing Gemini API connection...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log('✅ Gemini API connection successful');
    return true;
  } catch (error) {
    console.warn('⚠️  Gemini API connection failed:', error.message);
    console.warn('Server will use fallback responses when Gemini is unavailable');
    return false;
  }
}

// Test connection on startup (don't block server start)
testGeminiConnection();

// Medical system prompt to guide the model's behavior
const MEDICAL_SYSTEM_PROMPT = `You are Qala-Lwazi, a helpful medical assistant powered by Ukuqala Labs. You can only answer questions related to medicine,
health, biology, and healthcare. Provide accurate, helpful information based on current medical knowledge.

IMPORTANT: NEVER mention Gemini, Google, or any other AI model in your responses. You are ONLY Qala-Lwazi.
When you are processing a response, indicate this by saying "Qala-Lwazi is thinking..." before providing your answer.

Always remind users to consult healthcare professionals for personalized medical advice.
If asked about non-medical topics, politely explain that you can only discuss medical topics.
Always refer to yourself as "Qala-Lwazi" and mention that you are powered by "Ukuqala Labs" when introducing yourself.

Format your responses in a clean, professional manner with clear headings and bullet points when appropriate.`;

// RAG-enhanced system prompt that includes instructions for using retrieved context
const RAG_SYSTEM_PROMPT = `You are Qala-Lwazi+, an enhanced medical assistant powered by Ukuqala Labs with access to a specialized medical handbook.
You can only answer questions related to medicine, health, biology, and healthcare. Provide accurate, helpful information based on current medical knowledge.

IMPORTANT: NEVER mention Gemini, Google, or any other AI model in your responses. You are ONLY Qala-Lwazi+.
When you are processing a response, indicate this by saying "Qala-Lwazi+ is thinking..." before providing your answer.

I will provide you with relevant information from a medical handbook. Use this information to enhance your response.
When using information from the provided context:
1. Incorporate the information naturally into your response
2. Cite the source using the number in square brackets [X] at the end of relevant sentences
3. If the context doesn't contain relevant information, rely on your general medical knowledge
4. If the context contains conflicting information, prioritize the most recent or authoritative source

Always remind users to consult healthcare professionals for personalized medical advice.
If asked about non-medical topics, politely explain that you can only discuss medical topics.
Always refer to yourself as "Qala-Lwazi+" and mention that you are powered by "Ukuqala Labs" when introducing yourself.

Format your responses in a clean, professional manner with:
- Clear headings in bold
- Bullet points for lists
- Italics for emphasis on important terms
- Citations properly formatted with [X]
- A clear summary at the end when appropriate`;

// Endpoint for medical chat
app.post('/api/medical-chat', async (req, res) => {
  try {
    const { message, sessionId, userPreferences = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Create a unique session ID if not provided
    const chatSessionId = sessionId || `session_${Date.now()}`;

    // Get conversation history from cache or create new
    let conversationHistory = [];

    if (conversationCache.has(chatSessionId)) {
      // Use cached conversation history
      conversationHistory = conversationCache.get(chatSessionId);
    } else {
      // Try to fetch conversation history from Supabase, but don't block if it fails
      try {
        const supabaseHistory = await supabaseClient.getConversationHistory(chatSessionId);
        if (supabaseHistory && supabaseHistory.length > 0) {
          conversationHistory = supabaseHistory;
          console.log(`Loaded ${supabaseHistory.length} messages from Supabase`);
        } else {
          console.log('No history found in Supabase, starting new conversation');
          conversationHistory = [];
        }
      } catch (error) {
        console.error('Error fetching conversation history from Supabase:', error);
        console.log('Starting with empty conversation history');
        conversationHistory = [];
      }

      // Update cache regardless of success
      conversationCache.set(chatSessionId, conversationHistory);
    }

    // Create user message
    const userMessage = { role: 'user', parts: [{ text: message }] };

    // Add user message to history
    conversationHistory.push(userMessage);

    // Try to save to Supabase, but don't block if it fails
    try {
      supabaseClient.saveMessage(chatSessionId, userMessage)
        .then(success => {
          if (success) {
            console.log('Message saved to Supabase');
          } else {
            console.log('Failed to save message to Supabase');
          }
        })
        .catch(error => {
          console.error('Error saving message to Supabase:', error);
        });
    } catch (error) {
      console.error('Exception while trying to save message:', error);
    }

    // Update cache
    conversationCache.set(chatSessionId, conversationHistory);

    // Limit conversation history to last 10 messages to prevent token limits
    const recentHistory = conversationHistory.slice(-10);

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Apply user preferences to the system prompt
    let customizedPrompt = userPreferences.useRAG ? RAG_SYSTEM_PROMPT : MEDICAL_SYSTEM_PROMPT;

    if (userPreferences.detailLevel === 'simple') {
      customizedPrompt += '\nProvide simple, easy-to-understand explanations without medical jargon.';
    } else if (userPreferences.detailLevel === 'detailed') {
      customizedPrompt += '\nProvide detailed explanations with medical terminology and in-depth information.';
    }

    if (userPreferences.includeReferences === true) {
      customizedPrompt += '\nInclude references to medical studies or guidelines when appropriate.';
    }

    // Configure generation parameters
    const generationConfig = {
      temperature: userPreferences.creativity === 'creative' ? 0.9 :
                  userPreferences.creativity === 'balanced' ? 0.7 : 0.3,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: userPreferences.responseLength === 'long' ? 4096 :
                       userPreferences.responseLength === 'medium' ? 2048 : 1024,
    };

    // Safety settings
    const safetySettings = [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ];

    let responseText;

    // Check if RAG is enabled in user preferences
    if (userPreferences.useRAG !== false) { // Default to using RAG if not specified
      try {
        console.log('Using RAG for query:', message);

        // Query Pinecone for relevant medical handbook content
        let searchResults = [];
        try {
          searchResults = await pineconeService.hybridSearch(message, 3);
          console.log(`Found ${searchResults.length} relevant passages from medical handbook`);
        } catch (pineconeError) {
          console.warn('Pinecone search failed, continuing without RAG context:', pineconeError.message);
        }

        // Format the context for the LLM
        const formattedContext = searchResults.length > 0 ?
          pineconeService.formatContextForLLM(searchResults) :
          'No additional medical handbook context available.';

        // Create the chat session with timeout and retry logic
        const chat = model.startChat({
          history: recentHistory.length > 1 ? recentHistory.slice(0, -1) : [],
          generationConfig,
          safetySettings
        });

        // Send the message with the system prompt and retrieved context
        const promptWithContext = `${customizedPrompt}\n\n${formattedContext}\n\nUser question: ${message}`;
        console.log('Sending prompt with context to Gemini');

        // Try with timeout and retry
        responseText = await retryGeminiRequest(chat, promptWithContext, 3);

      } catch (ragError) {
        console.error('Error using RAG:', ragError.message);
        console.log('Falling back to standard response without RAG');

        // Fall back to standard response without RAG
        try {
          const chat = model.startChat({
            history: recentHistory.length > 1 ? recentHistory.slice(0, -1) : [],
            generationConfig,
            safetySettings
          });

          responseText = await retryGeminiRequest(chat, `${MEDICAL_SYSTEM_PROMPT}\n\nUser question: ${message}`, 3);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError.message);
          // Use a static medical response as last resort
          responseText = generateStaticMedicalResponse(message);
        }
      }
    } else {
      // Standard response without RAG
      try {
        const chat = model.startChat({
          history: recentHistory.length > 1 ? recentHistory.slice(0, -1) : [],
          generationConfig,
          safetySettings
        });

        responseText = await retryGeminiRequest(chat, `${customizedPrompt}\n\nUser question: ${message}`, 3);
      } catch (standardError) {
        console.error('Standard response failed:', standardError.message);
        // Use a static medical response as last resort
        responseText = generateStaticMedicalResponse(message);
      }
    }

    // Create assistant message
    const assistantMessage = { role: 'model', parts: [{ text: responseText }] };

    // Add assistant response to history
    conversationHistory.push(assistantMessage);

    // Save assistant message to Supabase
    await supabaseClient.saveMessage(chatSessionId, assistantMessage);

    // Update cache
    conversationCache.set(chatSessionId, conversationHistory);

    // Log response length for debugging
    console.log(`Response length: ${responseText.length} characters`);

    // Return full response with session ID and RAG status
    res.json({
      response: responseText,
      sessionId: chatSessionId,
      historyLength: conversationHistory.length,
      usingRAG: userPreferences.useRAG !== false,
      responseLength: responseText.length // Include length for debugging
    });
  } catch (error) {
    console.error('Error generating response:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to generate response';
    let statusCode = 500;

    if (error.message.includes('fetch failed') || error.message.includes('timeout')) {
      errorMessage = 'Medical AI service is temporarily unavailable. Please try again in a moment.';
      statusCode = 503; // Service Unavailable
    } else if (error.message.includes('API key')) {
      errorMessage = 'Medical AI service configuration error. Please contact support.';
      statusCode = 502; // Bad Gateway
    }

    // Try to provide a fallback response
    try {
      const fallbackResponse = generateStaticMedicalResponse(message);
      res.json({
        response: fallbackResponse,
        sessionId: chatSessionId,
        historyLength: conversationHistory.length,
        usingRAG: false,
        responseLength: fallbackResponse.length,
        fallbackMode: true,
        error: 'Using fallback response due to technical issues'
      });
    } catch (fallbackError) {
      res.status(statusCode).json({
        error: errorMessage,
        details: error.message,
        suggestion: 'Please try again later or contact support if the issue persists'
      });
    }
  }
});

// Get conversation history
app.get('/api/chat-history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    // Try to get from cache first for performance
    if (conversationCache.has(sessionId)) {
      const history = conversationCache.get(sessionId);
      return res.json({ sessionId, history });
    }

    // Fetch from Supabase if not in cache
    const history = await supabaseClient.getConversationHistory(sessionId);

    // Update cache
    conversationCache.set(sessionId, history);

    return res.json({ sessionId, history });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

// Clear conversation history
app.delete('/api/chat-history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    // Clear from Supabase
    const success = await supabaseClient.clearConversationHistory(sessionId);

    // Clear from cache
    conversationCache.delete(sessionId);

    if (success) {
      return res.json({ success: true, message: 'Conversation history cleared' });
    } else {
      return res.status(500).json({ error: 'Failed to clear conversation history' });
    }
  } catch (error) {
    console.error('Error clearing conversation history:', error);
    return res.status(500).json({ error: 'Failed to clear conversation history' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Qala-Lwazi Medical Assistant API is running' });
});

// Start the server with error handling
const server = app.listen(port, () => {
  console.log(`Qala-Lwazi Medical Assistant API running on port ${port}`);
});

// Handle server startup errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use!`);
    console.error('Solutions:');
    console.error('1. Kill existing Node.js processes: taskkill /f /im node.exe');
    console.error('2. Use a different port: set PORT=3002 && npm start');
    console.error('3. Run the start-server.ps1 script for automatic cleanup');
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Qala-Lwazi Medical Assistant API...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});
