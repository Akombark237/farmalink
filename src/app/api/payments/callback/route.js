// src/app/api/payments/callback/route.js
// NotchPay webhook callback handler

import { NextResponse } from 'next/server';
import { getNotchPayClient } from '../../../../../lib/notchpay.js';
import Database from '../../../../../lib/database.js';

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-notchpay-signature');

    // Validate webhook signature
    const notchPay = getNotchPayClient();
    const webhookSecret = process.env.NOTCHPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const isValid = notchPay.validateWebhook(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json({
          success: false,
          error: 'Invalid signature'
        }, { status: 401 });
      }
    }

    const data = JSON.parse(body);
    const { event, data: paymentData } = data;

    console.log('NotchPay webhook received:', event, paymentData);

    // Handle different webhook events
    switch (event) {
      case 'payment.successful':
      case 'payment.completed':
        await handleSuccessfulPayment(paymentData);
        break;
      
      case 'payment.failed':
        await handleFailedPayment(paymentData);
        break;
      
      case 'payment.cancelled':
        await handleCancelledPayment(paymentData);
        break;
      
      default:
        console.log('Unhandled webhook event:', event);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Webhook processing failed'
    }, { status: 500 });
  }
}

async function handleSuccessfulPayment(paymentData) {
  try {
    const { reference, amount } = paymentData;

    // Update payment record
    const updateResult = await Database.query(`
      UPDATE payments 
      SET 
        payment_status = 'completed',
        processor_response = $1,
        processed_at = NOW(),
        updated_at = NOW()
      WHERE transaction_id = $2
      RETURNING order_id
    `, [JSON.stringify(paymentData), reference]);

    if (updateResult.rows.length > 0) {
      const orderId = updateResult.rows[0].order_id;

      // Update order status
      await Database.query(`
        UPDATE orders 
        SET 
          status = 'confirmed',
          amount_paid = $1,
          updated_at = NOW()
        WHERE id = $2
      `, [amount / 100, orderId]); // Convert from smallest unit

      console.log(`Payment successful for order ${orderId}`);

      // Here you could add additional logic like:
      // - Send confirmation email
      // - Update inventory
      // - Notify pharmacy
      // - Send SMS notification
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(paymentData) {
  try {
    const { reference, failure_reason } = paymentData;

    // Update payment record
    await Database.query(`
      UPDATE payments 
      SET 
        payment_status = 'failed',
        processor_response = $1,
        failed_at = NOW(),
        failure_reason = $2,
        updated_at = NOW()
      WHERE transaction_id = $3
    `, [JSON.stringify(paymentData), failure_reason, reference]);

    console.log(`Payment failed for reference ${reference}: ${failure_reason}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

async function handleCancelledPayment(paymentData) {
  try {
    const { reference } = paymentData;

    // Update payment record
    await Database.query(`
      UPDATE payments 
      SET 
        payment_status = 'cancelled',
        processor_response = $1,
        updated_at = NOW()
      WHERE transaction_id = $2
    `, [JSON.stringify(paymentData), reference]);

    console.log(`Payment cancelled for reference ${reference}`);
  } catch (error) {
    console.error('Error handling cancelled payment:', error);
  }
}
