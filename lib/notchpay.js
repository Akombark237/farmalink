// lib/notchpay.js
// NotchPay payment gateway integration for PharmaLink

import crypto from 'crypto';

class NotchPayClient {
  constructor(publicKey, secretKey, environment = 'sandbox') {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
    this.environment = environment;
    this.baseUrl = environment === 'production' 
      ? 'https://api.notchpay.co' 
      : 'https://sandbox.notchpay.co';
  }

  // Initialize payment
  async initializePayment(paymentData) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency || 'XAF', // Central African Franc for Cameroon
          email: paymentData.email,
          phone: paymentData.phone,
          name: paymentData.name,
          description: paymentData.description,
          callback: paymentData.callback,
          reference: paymentData.reference
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment initialization failed');
      }

      return {
        success: true,
        data: data,
        paymentUrl: data.authorization_url,
        reference: data.reference
      };
    } catch (error) {
      console.error('NotchPay initialization error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify payment
  async verifyPayment(reference) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment verification failed');
      }

      return {
        success: true,
        data: data,
        status: data.status,
        amount: data.amount,
        currency: data.currency
      };
    } catch (error) {
      console.error('NotchPay verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment details
  async getPayment(reference) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get payment details');
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('NotchPay get payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate payment reference
  generateReference(prefix = 'PHARMA') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  // Format amount for NotchPay (convert to smallest currency unit)
  formatAmount(amount, currency = 'XAF') {
    // For XAF (Central African Franc), no decimal places
    if (currency === 'XAF') {
      return Math.round(amount);
    }
    // For other currencies, convert to smallest unit (e.g., cents for USD)
    return Math.round(amount * 100);
  }

  // Validate webhook signature
  validateWebhook(payload, signature, secret) {
    const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
    return hash === signature;
  }
}

// Export singleton instance
let notchPayInstance = null;

export function getNotchPayClient() {
  if (!notchPayInstance) {
    const publicKey = process.env.NOTCHPAY_PUBLIC_KEY;
    const secretKey = process.env.NOTCHPAY_SECRET_KEY;
    const environment = process.env.NOTCHPAY_ENVIRONMENT || 'sandbox';

    if (!publicKey || !secretKey) {
      throw new Error('NotchPay credentials not configured. Please set NOTCHPAY_PUBLIC_KEY and NOTCHPAY_SECRET_KEY environment variables.');
    }

    notchPayInstance = new NotchPayClient(publicKey, secretKey, environment);
  }

  return notchPayInstance;
}

export default NotchPayClient;
