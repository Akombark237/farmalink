// lib/payment-gateways/paystack-gateway.js
// Paystack payment gateway implementation

import crypto from 'crypto';

export class PaystackGateway {
  constructor(config) {
    this.config = config;
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
    this.baseUrl = config.environment === 'live' 
      ? 'https://api.paystack.co' 
      : 'https://api.paystack.co';
    this.environment = config.environment || 'sandbox';
  }

  async initializePayment(paymentData) {
    try {
      const reference = paymentData.reference || this.generateReference();
      
      const payload = {
        email: paymentData.email,
        amount: this.formatAmount(paymentData.amount, paymentData.currency),
        currency: paymentData.currency || 'NGN',
        reference: reference,
        callback_url: paymentData.callback_url,
        metadata: {
          order_id: paymentData.order_id,
          customer_name: paymentData.customer_name,
          pharmacy_id: paymentData.pharmacy_id,
          ...paymentData.metadata
        }
      };

      const response = await this.makeRequest('/transaction/initialize', 'POST', payload);

      return {
        success: true,
        data: {
          reference: reference,
          authorization_url: response.data.authorization_url,
          access_code: response.data.access_code,
          gateway: 'paystack'
        },
        message: 'Payment initialized successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyPayment(reference) {
    try {
      const response = await this.makeRequest(`/transaction/verify/${reference}`);
      const transaction = response.data;

      return {
        success: true,
        data: {
          reference: transaction.reference,
          amount: transaction.amount / 100,
          currency: transaction.currency,
          status: this.mapPaymentStatus(transaction.status),
          gateway_response: transaction.gateway_response,
          paid_at: transaction.paid_at,
          channel: transaction.channel,
          fees: transaction.fees / 100,
          customer: transaction.customer,
          metadata: transaction.metadata
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `pharmalink_${timestamp}_${random}`;
  }

  formatAmount(amount, currency = 'NGN') {
    if (currency === 'NGN') {
      return Math.round(amount * 100);
    }
    return amount;
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.secretKey}`
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    return result;
  }

  mapPaymentStatus(paystackStatus) {
    const statusMap = {
      'success': 'completed',
      'failed': 'failed',
      'abandoned': 'cancelled',
      'pending': 'pending'
    };
    return statusMap[paystackStatus] || 'unknown';
  }

  verifyWebhookSignature(payload, signature) {
    const hash = crypto.createHmac('sha512', this.secretKey)
                      .update(JSON.stringify(payload))
                      .digest('hex');
    return hash === signature;
  }
}
