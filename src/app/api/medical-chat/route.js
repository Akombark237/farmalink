// src/app/api/medical-chat/route.js
// Medical chat API with built-in responses

import { NextResponse } from 'next/server';

// Medical knowledge base for basic responses
const medicalResponses = {
  greetings: [
    "Hello! I'm Qala-Lwazi, your medical assistant. How can I help you today?",
    "Hi there! I'm here to help with your medical questions. What would you like to know?",
    "Welcome! I'm Qala-Lwazi, ready to assist with your health-related questions."
  ],
  symptoms: {
    fever: "For fever, rest and stay hydrated. Take paracetamol as directed. If fever persists over 3 days or exceeds 39°C, consult a doctor.",
    headache: "For headaches, try rest in a quiet, dark room. Stay hydrated and consider paracetamol. If severe or persistent, see a healthcare provider.",
    cough: "For cough, stay hydrated and consider honey. If persistent, productive, or with fever, consult a healthcare professional.",
    "stomach pain": "For stomach pain, avoid spicy foods and stay hydrated. If severe, persistent, or with other symptoms, seek medical attention."
  },
  medications: {
    paracetamol: "Paracetamol: 500-1000mg every 4-6 hours, max 4g daily. Good for pain and fever. Available at most pharmacies.",
    ibuprofen: "Ibuprofen: 200-400mg every 4-6 hours with food. Anti-inflammatory. Avoid if you have stomach issues.",
    aspirin: "Aspirin: 300-600mg every 4 hours. Good for pain and inflammation. Not for children under 16."
  },
  general: [
    "I understand your concern. For specific medical advice, please consult with a healthcare professional.",
    "That's a good question. I recommend discussing this with your doctor for personalized advice.",
    "I can provide general information, but for your specific situation, please see a healthcare provider."
  ]
};

function generateResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return medicalResponses.greetings[Math.floor(Math.random() * medicalResponses.greetings.length)];
  }

  // Symptoms
  for (const [symptom, response] of Object.entries(medicalResponses.symptoms)) {
    if (lowerMessage.includes(symptom)) {
      return response;
    }
  }

  // Medications
  for (const [medication, response] of Object.entries(medicalResponses.medications)) {
    if (lowerMessage.includes(medication)) {
      return response;
    }
  }

  // Pharmacy-related questions
  if (lowerMessage.includes('pharmacy') || lowerMessage.includes('medicine') || lowerMessage.includes('drug')) {
    return "You can find medications at nearby pharmacies. Use our pharmacy locator to find the closest one to you. Always consult a pharmacist for medication advice.";
  }

  // Emergency
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('serious')) {
    return "⚠️ For medical emergencies, please call emergency services immediately or visit the nearest hospital. This chat is for general information only.";
  }

  // Default response
  return medicalResponses.general[Math.floor(Math.random() * medicalResponses.general.length)];
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

    // Generate response based on message content
    const response = generateResponse(body.message);

    // Simulate a slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      response: response,
      sessionId: body.sessionId || 'default',
      timestamp: new Date().toISOString(),
      status: 'success'
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
    // Always return online status since we have built-in responses
    return NextResponse.json({
      status: 'ok',
      message: 'Qala-Lwazi Medical Assistant is online and ready',
      service: 'Built-in Medical Chat',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      capabilities: [
        'General medical information',
        'Symptom guidance',
        'Medication information',
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
