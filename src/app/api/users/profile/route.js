// User Profile API - Complete user management system
import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper function to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization token provided');
  }
  
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

// GET - Fetch user profile
export async function GET(request) {
  try {
    // Verify user authentication
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    // Get user profile data
    const userQuery = `
      SELECT 
        u.id,
        u.email,
        u.user_type,
        u.email_verified,
        u.created_at,
        u.last_login,
        pp.first_name,
        pp.last_name,
        pp.date_of_birth,
        pp.gender,
        pp.phone,
        pp.address,
        pp.city,
        pp.state,
        pp.zip_code,
        pp.country,
        pp.emergency_contact_name,
        pp.emergency_contact_phone,
        pp.medical_conditions,
        pp.allergies,
        pp.current_medications,
        pp.insurance_provider,
        pp.insurance_policy_number
      FROM users u
      LEFT JOIN patient_profiles pp ON u.id = pp.user_id
      WHERE u.id = $1 AND u.status = 'active'
    `;

    const result = await Database.query(userQuery, [userId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // Format response
    const profile = {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      profile: {
        firstName: user.first_name,
        lastName: user.last_name,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zip_code,
        country: user.country,
        emergencyContact: {
          name: user.emergency_contact_name,
          phone: user.emergency_contact_phone
        },
        medical: {
          conditions: user.medical_conditions,
          allergies: user.allergies,
          currentMedications: user.current_medications
        },
        insurance: {
          provider: user.insurance_provider,
          policyNumber: user.insurance_policy_number
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Profile GET API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user profile',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request) {
  try {
    const body = await request.json();
    
    // Verify user authentication
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      emergencyContactName,
      emergencyContactPhone,
      medicalConditions,
      allergies,
      currentMedications,
      insuranceProvider,
      insurancePolicyNumber
    } = body;

    // Start transaction
    const result = await Database.transaction(async (client) => {
      // Check if patient profile exists
      const profileCheck = await client.query(
        'SELECT id FROM patient_profiles WHERE user_id = $1',
        [userId]
      );

      if (profileCheck.rows.length === 0) {
        // Create new patient profile
        await client.query(`
          INSERT INTO patient_profiles (
            user_id, first_name, last_name, date_of_birth, gender,
            phone, address, city, state, zip_code, country,
            emergency_contact_name, emergency_contact_phone,
            medical_conditions, allergies, current_medications,
            insurance_provider, insurance_policy_number
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        `, [
          userId, firstName, lastName, dateOfBirth, gender,
          phone, address, city, state, zipCode, country,
          emergencyContactName, emergencyContactPhone,
          medicalConditions, allergies, currentMedications,
          insuranceProvider, insurancePolicyNumber
        ]);
      } else {
        // Update existing patient profile
        await client.query(`
          UPDATE patient_profiles SET
            first_name = COALESCE($2, first_name),
            last_name = COALESCE($3, last_name),
            date_of_birth = COALESCE($4, date_of_birth),
            gender = COALESCE($5, gender),
            phone = COALESCE($6, phone),
            address = COALESCE($7, address),
            city = COALESCE($8, city),
            state = COALESCE($9, state),
            zip_code = COALESCE($10, zip_code),
            country = COALESCE($11, country),
            emergency_contact_name = COALESCE($12, emergency_contact_name),
            emergency_contact_phone = COALESCE($13, emergency_contact_phone),
            medical_conditions = COALESCE($14, medical_conditions),
            allergies = COALESCE($15, allergies),
            current_medications = COALESCE($16, current_medications),
            insurance_provider = COALESCE($17, insurance_provider),
            insurance_policy_number = COALESCE($18, insurance_policy_number),
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $1
        `, [
          userId, firstName, lastName, dateOfBirth, gender,
          phone, address, city, state, zipCode, country,
          emergencyContactName, emergencyContactPhone,
          medicalConditions, allergies, currentMedications,
          insuranceProvider, insurancePolicyNumber
        ]);
      }

      // Get updated profile
      const updatedProfile = await client.query(`
        SELECT 
          pp.first_name, pp.last_name, pp.phone, pp.address,
          pp.city, pp.state, pp.country, pp.updated_at
        FROM patient_profiles pp
        WHERE pp.user_id = $1
      `, [userId]);

      return updatedProfile.rows[0];
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        firstName: result.first_name,
        lastName: result.last_name,
        phone: result.phone,
        address: result.address,
        city: result.city,
        state: result.state,
        country: result.country,
        updatedAt: result.updated_at
      }
    });

  } catch (error) {
    console.error('Profile PUT API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update profile',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Change password
export async function POST(request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    // Verify user authentication
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Current password and new password are required' 
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'New password must be at least 6 characters long' 
        },
        { status: 400 }
      );
    }

    // Get current password hash
    const userResult = await Database.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await Database.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to change password',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
