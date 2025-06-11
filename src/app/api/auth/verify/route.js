// Authentication API - Token verification endpoint
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user data for verification
const MOCK_USERS = [
  {
    id: '1',
    email: 'patient@pharmalink.com',
    user_type: 'patient',
    status: 'active',
    email_verified: true,
    first_name: 'John',
    last_name: 'Doe',
    patient_id: '1'
  },
  {
    id: '2',
    email: 'pharmacy@pharmalink.com',
    user_type: 'pharmacy',
    status: 'active',
    email_verified: true,
    pharmacy_id: '1',
    pharmacy_name: 'PHARMACIE FRANCAISE'
  },
  {
    id: '3',
    email: 'admin@pharmalink.com',
    user_type: 'admin',
    status: 'active',
    email_verified: true,
    first_name: 'Admin',
    last_name: 'User'
  }
];

export async function GET(request) {
  try {
    // Get token from cookie or Authorization header
    let token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No authentication token provided' 
        },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pharmalink-jwt-secret-2024');

    // Find user by ID (in real app, this would be a database query)
    const user = MOCK_USERS.find(u => u.id === decoded.userId);

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found' 
        },
        { status: 404 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { 
          success: false,
          error: 'User account is not active' 
        },
        { status: 401 }
      );
    }

    // Prepare user data for response
    const userData = {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      emailVerified: user.email_verified,
      profile: {}
    };

    if (user.user_type === 'patient') {
      userData.profile = {
        id: user.patient_id,
        firstName: user.first_name,
        lastName: user.last_name
      };
    } else if (user.user_type === 'pharmacy') {
      userData.profile = {
        id: user.pharmacy_id,
        name: user.pharmacy_name
      };
    } else if (user.user_type === 'admin') {
      userData.profile = {
        firstName: user.first_name,
        lastName: user.last_name
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        tokenValid: true,
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid authentication token' 
        },
        { status: 401 }
      );
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication token expired' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
