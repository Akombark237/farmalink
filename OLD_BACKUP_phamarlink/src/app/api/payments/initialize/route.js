// src/app/api/payments/initialize/route.js
// Initialize NotchPay payment

import { NextResponse } from 'next/server';
import { getNotchPayClient } from '../../../../../lib/notchpay.js';
import Database from '../../../../../lib/database.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      orderId,
      amount,
      currency = 'XAF',
      email,
      phone,
      name,
      description
    } = body;

    // Validate required fields
    if (!orderId || !amount || !email || !name) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: orderId, amount, email, name'
      }, { status: 400 });
    }

    // Get NotchPay client
    const notchPay = getNotchPayClient();

    // Generate unique reference
    const reference = notchPay.generateReference('PHARMA');

    // Format amount for NotchPay
    const formattedAmount = notchPay.formatAmount(amount, currency);

    // Prepare payment data
    const paymentData = {
      amount: formattedAmount,
      currency,
      email,
      phone,
      name,
      description: description || `PharmaLink Order #${orderId}`,
      reference,
      callback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`
    };

    // Initialize payment with NotchPay
    const paymentResult = await notchPay.initializePayment(paymentData);

    if (!paymentResult.success) {
      return NextResponse.json({
        success: false,
        error: paymentResult.error
      }, { status: 400 });
    }

    // Store payment record in database
    try {
      await Database.query(`
        INSERT INTO payments (
          order_id, payment_method, payment_status, amount, currency,
          processor, transaction_id, processor_response, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
        )
      `, [
        orderId,
        'notchpay',
        'pending',
        amount,
        currency,
        'notchpay',
        reference,
        JSON.stringify(paymentResult.data)
      ]);

      console.log('Payment record created in database');
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if database fails - payment can still proceed
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl: paymentResult.paymentUrl,
        reference: reference,
        amount: formattedAmount,
        currency
      }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
