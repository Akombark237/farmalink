import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database';

// Payment gateway configurations
const PAYMENT_GATEWAYS = {
  paystack: {
    baseUrl: 'https://api.paystack.co',
    secretKey: process.env.PAYSTACK_SECRET_KEY,
    publicKey: process.env.PAYSTACK_PUBLIC_KEY
  },
  noch: {
    baseUrl: process.env.NOCH_PAY_BASE_URL || 'https://api.nochpay.com',
    secretKey: process.env.NOCH_PAY_SECRET_KEY,
    publicKey: process.env.NOCH_PAY_PUBLIC_KEY
  }
};

// Generate unique payment reference
function generateReference() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `pharmalink_${timestamp}_${random}`;
}

// Paystack payment initialization
async function initializePaystackPayment(paymentData) {
  const config = PAYMENT_GATEWAYS.paystack;
  
  const payload = {
    email: paymentData.email,
    amount: Math.round(paymentData.amount * 100), // Convert to kobo
    currency: paymentData.currency || 'NGN',
    reference: paymentData.reference,
    callback_url: paymentData.callback_url,
    metadata: {
      order_id: paymentData.order_id,
      customer_name: paymentData.customer_name,
      pharmacy_id: paymentData.pharmacy_id
    }
  };

  const response = await fetch(`${config.baseUrl}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.secretKey}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Payment initialization failed');
  }

  return {
    reference: paymentData.reference,
    authorization_url: result.data.authorization_url,
    access_code: result.data.access_code,
    gateway: 'paystack'
  };
}

// Noch Pay payment initialization
async function initializeNochPayment(paymentData) {
  const config = PAYMENT_GATEWAYS.noch;
  
  const payload = {
    reference: paymentData.reference,
    amount: paymentData.amount,
    currency: paymentData.currency || 'NGN',
    email: paymentData.email,
    callback_url: paymentData.callback_url,
    customer_name: paymentData.customer_name,
    metadata: {
      order_id: paymentData.order_id,
      pharmacy_id: paymentData.pharmacy_id
    }
  };

  const response = await fetch(`${config.baseUrl}/payments/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.secretKey}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Payment initialization failed');
  }

  return {
    reference: paymentData.reference,
    authorization_url: result.data.authorization_url || result.data.payment_url,
    gateway: 'noch'
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const required = ['amount', 'email', 'order_id', 'customer_name'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`
      }, { status: 400 });
    }

    // Generate payment reference
    const reference = generateReference();
    
    // Prepare payment data
    const paymentData = {
      reference,
      amount: parseFloat(body.amount),
      currency: body.currency || 'NGN',
      email: body.email,
      customer_name: body.customer_name,
      order_id: body.order_id,
      pharmacy_id: body.pharmacy_id,
      callback_url: body.callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`
    };

    // Determine which gateway to use
    const gateway = body.gateway || 'paystack';
    
    let paymentResult;
    
    switch (gateway) {
      case 'paystack':
        paymentResult = await initializePaystackPayment(paymentData);
        break;
      case 'noch':
        paymentResult = await initializeNochPayment(paymentData);
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Unsupported payment gateway'
        }, { status: 400 });
    }

    // Save payment record to database
    const paymentRecord = await Database.query(`
      INSERT INTO payments (
        order_id, payment_method, payment_status, amount, currency,
        processor, transaction_id, processor_response
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      body.order_id,
      'online_payment',
      'pending',
      paymentData.amount,
      paymentData.currency,
      gateway,
      reference,
      JSON.stringify(paymentResult)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        payment_id: paymentRecord.rows[0].id,
        ...paymentResult
      },
      message: 'Payment initialized successfully'
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Payment initialization failed'
    }, { status: 500 });
  }
}