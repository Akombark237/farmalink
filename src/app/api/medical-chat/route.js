// src/app/api/medical-chat/route.js
// Medical chat API with Google Gemini AI integration

import { NextResponse } from 'next/server';

// Medical system prompt for Qala-Lwazi
const MEDICAL_SYSTEM_PROMPT = `You are Qala-Lwazi, a helpful medical assistant for PharmaLink, a pharmacy platform in Cameroon.

IMPORTANT GUIDELINES:
- Provide general medical information and guidance
- Always recommend consulting healthcare professionals for serious concerns
- Be culturally sensitive to Cameroon context
- Mention local pharmacies when relevant
- Use CFA currency when discussing costs
- Keep responses concise but informative
- Include safety disclaimers for medical advice
- Be empathetic and professional

CAPABILITIES:
- General health information
- Symptom guidance (not diagnosis)
- Medication information
- Pharmacy assistance
- Health education
- Emergency guidance

LIMITATIONS:
- Cannot diagnose medical conditions
- Cannot prescribe medications
- Cannot replace professional medical advice
- Cannot provide emergency medical care

Always end serious medical concerns with: "Please consult a healthcare professional for proper evaluation and treatment."`;

// Fallback responses for when Gemini API is unavailable
const fallbackResponses = {
  greetings: [
    "Hello! I'm Qala-Lwazi, your medical assistant. How can I help you today?",
    "Hi there! I'm here to help with your medical questions. What would you like to know?",
    "Welcome! I'm Qala-Lwazi, ready to assist with your health-related questions."
  ],
  general: [
    "I understand your concern. For specific medical advice, please consult with a healthcare professional.",
    "That's a good question. I recommend discussing this with your doctor for personalized advice.",
    "I can provide general information, but for your specific situation, please see a healthcare provider."
  ]
};

async function callGeminiAPI(message, sessionId) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found, using fallback responses');
    return generateFallbackResponse(message);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${MEDICAL_SYSTEM_PROMPT}\n\nUser Question: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
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
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    return generateFallbackResponse(message);
  }
}

function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return fallbackResponses.greetings[Math.floor(Math.random() * fallbackResponses.greetings.length)];
  }

  // Emergency
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('serious')) {
    return "⚠️ For medical emergencies, please call emergency services immediately or visit the nearest hospital. This chat is for general information only.";
  }

  // Default response
  return fallbackResponses.general[Math.floor(Math.random() * fallbackResponses.general.length)] +
         "\n\n(Note: AI assistant is temporarily using simplified responses. For detailed medical guidance, please consult a healthcare professional.)";
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate session ID if not provided
    const sessionId = body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[${sessionId}] Processing message: ${body.message.substring(0, 50)}...`);

    // Get response from Gemini AI or fallback
    const response = await callGeminiAPI(body.message, sessionId);

    console.log(`[${sessionId}] Generated response: ${response.substring(0, 100)}...`);

    return NextResponse.json({
      response: response,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      status: 'success',
      source: process.env.GEMINI_API_KEY ? 'gemini-ai' : 'fallback'
    });

  } catch (error) {
    console.error('Error in medical chat:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;

    return NextResponse.json({
      status: 'ok',
      message: 'Qala-Lwazi Medical Assistant is online and ready',
      service: hasGeminiKey ? 'Google Gemini AI' : 'Fallback Responses',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      aiEnabled: hasGeminiKey,
      capabilities: [
        'General medical information',
        'Symptom guidance',
        'Medication information',
        'Pharmacy assistance',
        'Health education',
        'Emergency guidance'
      ],
      features: hasGeminiKey ? [
        'Real-time AI responses',
        'Contextual understanding',
        'Personalized advice',
        'Multi-language support'
      ] : [
        'Basic medical guidance',
        'Emergency information',
        'Pharmacy assistance'
      ]
    });

  } catch (error) {
    console.error('Error in health check:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}
