// src/app/api/auth/register/route.js
// Registration API endpoint - Updated with mock data

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock user storage (in real app, this would be database)
let MOCK_USER_COUNTER = 4; // Start from 4 since we have 3 existing users

export async function POST(request) {
  try {
    const formData = await request.json();
    const { 
      email, 
      password, 
      confirmPassword, 
      userType, 
      firstName, 
      lastName,
      pharmacyName,
      pharmacyAddress,
      licenseNumber,
      phone
    } = formData;

    // Validate input
    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Email, password, and user type are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate user type specific fields
    if (userType === 'patient' && (!firstName || !lastName)) {
      return NextResponse.json(
        { error: 'First name and last name are required for patients' },
        { status: 400 }
      );
    }

    if (userType === 'pharmacy' && (!pharmacyName || !licenseNumber)) {
      return NextResponse.json(
        { error: 'Pharmacy name and license number are required for pharmacies' },
        { status: 400 }
      );
    }

    // Check if user already exists (using mock data)
    const existingUsers = [
      'patient@pharmalink.com',
      'pharmacy@pharmalink.com',
      'admin@pharmalink.com'
    ];

    if (existingUsers.includes(email.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists'
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user object (in real app, this would be saved to database)
    const newUser = {
      id: MOCK_USER_COUNTER.toString(),
      email: email.toLowerCase(),
      password_hash: passwordHash,
      user_type: userType,
      status: 'active', // For demo purposes, make users active immediately
      email_verified: false,
      phone: phone || null,
      created_at: new Date().toISOString(),
      // Profile data
      first_name: firstName || null,
      last_name: lastName || null,
      pharmacy_name: pharmacyName || null,
      pharmacy_address: pharmacyAddress || null,
      license_number: licenseNumber || null
    };

    // Increment counter for next user
    MOCK_USER_COUNTER++;

    console.log('New user registered:', {
      id: newUser.id,
      email: newUser.email,
      userType: newUser.user_type
    });

    // Create JWT token for immediate login
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        userType: newUser.user_type,
        pharmacyId: userType === 'pharmacy' ? newUser.id : null
      },
      process.env.JWT_SECRET || 'pharmalink-jwt-secret-2024',
      { expiresIn: '7d' }
    );

    // Prepare user data for response
    const userData = {
      id: newUser.id,
      email: newUser.email,
      userType: newUser.user_type,
      emailVerified: newUser.email_verified,
      profile: {}
    };

    if (userType === 'patient') {
      userData.profile = {
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phone: newUser.phone
      };
    } else if (userType === 'pharmacy') {
      userData.profile = {
        name: newUser.pharmacy_name,
        address: newUser.pharmacy_address,
        licenseNumber: newUser.license_number,
        phone: newUser.phone
      };
    }

    // Set HTTP-only cookie and return token in response
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful! You are now logged in.',
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
    console.error('Registration error:', error);

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
