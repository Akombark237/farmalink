// src/app/api/auth/login/route.js
// Login API endpoint - Updated with mock data and better error handling

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock user database (will be replaced with real database later)
const MOCK_USERS = [
  {
    id: '1',
    email: 'patient@pharmalink.com',
    password_hash: '$2b$12$zMbVshg7EX9ES9tp3Mu45e2SQpivz5UlQS5e1ZhmBmrEvC/WwOL.2', // password: 'password123'
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
    password_hash: '$2b$12$zMbVshg7EX9ES9tp3Mu45e2SQpivz5UlQS5e1ZhmBmrEvC/WwOL.2', // password: 'password123'
    user_type: 'pharmacy',
    status: 'active',
    email_verified: true,
    pharmacy_id: '1',
    pharmacy_name: 'PHARMACIE FRANCAISE'
  },
  {
    id: '3',
    email: 'admin@pharmalink.com',
    password_hash: '$2b$12$zMbVshg7EX9ES9tp3Mu45e2SQpivz5UlQS5e1ZhmBmrEvC/WwOL.2', // password: 'password123'
    user_type: 'admin',
    status: 'active',
    email_verified: true,
    first_name: 'Admin',
    last_name: 'User'
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Find user by email (using mock data)
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Account is not active. Please contact support.'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
        patientId: user.patient_id || null,
        pharmacyId: user.pharmacy_id || null
      },
      process.env.JWT_SECRET || 'pharmalink-jwt-secret-2024',
      { expiresIn: '7d' }
    );

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

    // Set HTTP-only cookie and return token in response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token,
        expiresIn: '7d'
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
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
