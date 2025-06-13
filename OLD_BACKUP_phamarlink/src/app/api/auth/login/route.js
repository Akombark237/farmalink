// src/app/api/auth/login/route.js
// Login API endpoint

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from '../../../../../lib/database';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const userQuery = `
      SELECT u.*, 
             pp.first_name, pp.last_name, pp.id as patient_id,
             ph.name as pharmacy_name, ph.id as pharmacy_id
      FROM users u
      LEFT JOIN patient_profiles pp ON u.id = pp.user_id
      LEFT JOIN pharmacy_profiles ph ON u.id = ph.user_id
      WHERE u.email = $1 AND u.status = 'active'
    `;
    
    const result = await Database.query(userQuery, [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await Database.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
        patientId: user.patient_id,
        pharmacyId: user.pharmacy_id
      },
      process.env.JWT_SECRET || 'your-secret-key',
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
    }

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
