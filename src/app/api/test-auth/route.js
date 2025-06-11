// Test authentication endpoint
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No valid authorization token provided' 
        },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    console.log('Received token:', token.substring(0, 50) + '...');
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pharmalink-jwt-secret-2024');
    console.log('Decoded token:', decoded);
    
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      data: {
        userId: decoded.userId,
        email: decoded.email,
        userType: decoded.userType
      }
    });

  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication failed',
        details: error.message
      },
      { status: 401 }
    );
  }
}
