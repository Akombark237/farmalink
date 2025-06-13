// src/app/api/payments/verify/route.js
// Verify NotchPay payment

import { NextResponse } from 'next/server';
import { getNotchPayClient } from '../../../../../lib/notchpay.js';
import Database from '../../../../../lib/database.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({
        success: false,
        error: 'Payment reference is required'
      }, { status: 400 });
    }

    // Get NotchPay client
    const notchPay = getNotchPayClient();

    // Verify payment with NotchPay
    const verificationResult = await notchPay.verifyPayment(reference);

    if (!verificationResult.success) {
      return NextResponse.json({
        success: false,
        error: verificationResult.error
      }, { status: 400 });
    }

    const paymentData = verificationResult.data;
    const isSuccessful = paymentData.status === 'successful' || paymentData.status === 'success';

    // Update payment record in database
    try {
      const updateResult = await Database.query(`
        UPDATE payments 
        SET 
          payment_status = $1,
          processor_response = $2,
          processed_at = $3,
          updated_at = NOW()
        WHERE transaction_id = $4
        RETURNING order_id
      `, [
        isSuccessful ? 'completed' : 'failed',
        JSON.stringify(paymentData),
        isSuccessful ? new Date() : null,
        reference
      ]);

      if (updateResult.rows.length > 0) {
        const orderId = updateResult.rows[0].order_id;

        // If payment successful, update order status
        if (isSuccessful) {
          await Database.query(`
            UPDATE orders 
            SET 
              status = 'confirmed',
              amount_paid = $1,
              updated_at = NOW()
            WHERE id = $2
          `, [paymentData.amount / 100, orderId]); // Convert back from smallest unit

          console.log(`Order ${orderId} payment confirmed`);
        }
      }
    } catch (dbError) {
      console.error('Database update error:', dbError);
      // Continue even if database update fails
    }

    return NextResponse.json({
      success: true,
      data: {
        status: paymentData.status,
        amount: paymentData.amount,
        currency: paymentData.currency,
        reference: reference,
        isSuccessful
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
