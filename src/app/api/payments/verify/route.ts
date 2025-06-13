import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database';

// TypeScript interfaces
interface PaymentRecord {
  id: string;
  order_id: string;
  payment_method: string;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  amount: number;
  currency: string;
  processor: string;
  transaction_id: string;
  processor_response: any;
  created_at: string;
  updated_at: string;
}

interface VerificationResult {
  status: string;
  amount: number;
  currency: string;
  reference: string;
  gateway_response: string;
  paid_at: string;
  metadata?: any;
}

// Payment gateway configurations
const PAYMENT_GATEWAYS = {
  paystack: {
    baseUrl: 'https://api.paystack.co',
    secretKey: process.env.PAYSTACK_SECRET_KEY,
  },
  noch: {
    baseUrl: process.env.NOCH_PAY_BASE_URL || 'https://api.nochpay.com',
    secretKey: process.env.NOCH_PAY_SECRET_KEY,
  }
};

// Verify Paystack payment
async function verifyPaystackPayment(reference: string) {
  const config = PAYMENT_GATEWAYS.paystack;

  const response = await fetch(`${config.baseUrl}/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${config.secretKey}`
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Payment verification failed');
  }

  return {
    status: result.data.status,
    amount: result.data.amount / 100, // Convert from kobo
    currency: result.data.currency,
    reference: result.data.reference,
    gateway_response: result.data.gateway_response,
    paid_at: result.data.paid_at,
    metadata: result.data.metadata
  };
}

// Verify Noch Pay payment
async function verifyNochPayment(reference: string) {
  const config = PAYMENT_GATEWAYS.noch;

  const response = await fetch(`${config.baseUrl}/payments/verify/${reference}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${config.secretKey}`
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Payment verification failed');
  }

  return {
    status: result.data.status,
    amount: result.data.amount,
    currency: result.data.currency,
    reference: result.data.reference,
    gateway_response: result.data.gateway_response || 'success',
    paid_at: result.data.paid_at || result.data.created_at,
    metadata: result.data.metadata
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({
        success: false,
        error: 'Payment reference is required'
      }, { status: 400 });
    }

    // Get payment record from database
    const paymentRecord = await Database.query(`
      SELECT * FROM payments
      WHERE transaction_id = $1
    `, [reference]);

    if (paymentRecord.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Payment record not found'
      }, { status: 404 });
    }

    const payment = paymentRecord.rows[0] as unknown as PaymentRecord;

    // If payment is already verified, return cached result
    if (payment.payment_status === 'completed') {
      return NextResponse.json({
        success: true,
        data: {
          status: 'success',
          amount: payment.amount,
          currency: payment.currency,
          reference: payment.transaction_id,
          order_id: payment.order_id
        },
        message: 'Payment already verified'
      });
    }

    // Verify payment with the appropriate gateway
    let verificationResult;

    switch (payment.processor) {
      case 'paystack':
        verificationResult = await verifyPaystackPayment(reference);
        break;
      case 'noch':
        verificationResult = await verifyNochPayment(reference);
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Unsupported payment gateway'
        }, { status: 400 });
    }

    // Update payment status in database
    const newStatus = verificationResult.status === 'success' ? 'completed' : 'failed';

    await Database.query(`
      UPDATE payments
      SET payment_status = $1, processor_response = $2, updated_at = NOW()
      WHERE transaction_id = $3
    `, [
      newStatus,
      JSON.stringify(verificationResult),
      reference
    ]);

    // If payment is successful, update order status
    if (newStatus === 'completed') {
      await Database.query(`
        UPDATE orders
        SET status = 'confirmed', updated_at = NOW()
        WHERE id = $1
      `, [payment.order_id]);
    }

    return NextResponse.json({
      success: true,
      data: {
        status: verificationResult.status,
        amount: verificationResult.amount,
        currency: verificationResult.currency,
        reference: verificationResult.reference,
        order_id: payment.order_id,
        paid_at: verificationResult.paid_at
      },
      message: newStatus === 'completed' ? 'Payment verified successfully' : 'Payment verification failed'
    });

  } catch (error) {
    console.error('Payment verification error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({
        success: false,
        error: 'Payment reference is required'
      }, { status: 400 });
    }

    // Redirect to GET method for verification
    const url = new URL(request.url);
    url.searchParams.set('reference', reference);

    return GET(new Request(url.toString()));

  } catch (error) {
    console.error('Payment verification error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed'
    }, { status: 500 });
  }
}