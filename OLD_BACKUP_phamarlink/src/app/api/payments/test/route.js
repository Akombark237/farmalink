// src/app/api/payments/test/route.js
// Test endpoint for payment system

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Payment API is working',
      timestamp: new Date().toISOString(),
      endpoints: {
        initialize: '/api/payments/initialize',
        verify: '/api/payments/verify',
        callback: '/api/payments/callback'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Payment API test failed',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Payment API POST endpoint is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Payment API POST test failed',
      details: error.message
    }, { status: 500 });
  }
}
