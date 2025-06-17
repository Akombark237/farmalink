// src/app/api/medical-chat/route.js
// Proxy API for medical chat requests to Gemini backend

import { NextResponse } from 'next/server';

const GEMINI_BACKEND_URL = process.env.GEMINI_BACKEND_URL || 'http://localhost:3001';

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

    // Forward the request to the Gemini backend
    const response = await fetch(`${GEMINI_BACKEND_URL}/api/medical-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Failed to get response from medical assistant',
          details: errorData.error || 'Unknown error'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in medical chat proxy:', error);
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
    const response = await fetch(`${GEMINI_BACKEND_URL}/health`);
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Gemini backend is not available',
          backendUrl: GEMINI_BACKEND_URL
        },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      status: 'ok',
      message: 'Medical chat service is available',
      backend: data,
      backendUrl: GEMINI_BACKEND_URL
    });

  } catch (error) {
    console.error('Error checking medical chat service:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to connect to medical chat service',
        details: error.message,
        backendUrl: GEMINI_BACKEND_URL
      },
      { status: 503 }
    );
  }
}
