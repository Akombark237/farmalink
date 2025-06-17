'use client';

// src/components/NotchPayButton.tsx
// NotchPay payment button component

import React, { useState, useEffect } from 'react';
import { CreditCard, Loader2, Shield, AlertTriangle } from 'lucide-react';
import { useErrorHandler } from './ErrorBoundary';

interface NotchPayButtonProps {
  amount: number;
  currency?: string;
  email: string;
  phone?: string;
  name: string;
  orderId: string;
  description?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function NotchPayButton({
  amount,
  currency = 'XAF',
  email,
  phone,
  name,
  orderId,
  description,
  onSuccess,
  onError,
  onCancel,
  className = '',
  disabled = false,
  children
}: NotchPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { handleError } = useErrorHandler();

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="w-full bg-gray-200 animate-pulse h-12 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading payment...</span>
      </div>
    );
  }

  const handlePayment = async () => {
    if (disabled || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!email || !name || !orderId || !amount) {
        throw new Error('Missing required payment information');
      }

      // Initialize payment
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency,
          email,
          phone,
          name,
          description
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      // Redirect to NotchPay payment page
      const paymentWindow = window.open(
        data.data.paymentUrl,
        'notchpay-payment',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!paymentWindow) {
        throw new Error('Payment window blocked. Please allow popups and try again.');
      }

      // Monitor payment window
      const checkClosed = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkClosed);
          setLoading(false);
          
          // Verify payment after window closes
          verifyPayment(data.data.reference);
        }
      }, 1000);

      // Listen for payment completion message
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'NOTCHPAY_PAYMENT_SUCCESS') {
          clearInterval(checkClosed);
          paymentWindow.close();
          window.removeEventListener('message', messageListener);
          setLoading(false);
          
          verifyPayment(data.data.reference);
        } else if (event.data.type === 'NOTCHPAY_PAYMENT_CANCELLED') {
          clearInterval(checkClosed);
          paymentWindow.close();
          window.removeEventListener('message', messageListener);
          setLoading(false);
          
          if (onCancel) onCancel();
        }
      };

      window.addEventListener('message', messageListener);

    } catch (err) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();

      if (data.success && data.data.isSuccessful) {
        if (onSuccess) onSuccess(data.data);
      } else {
        const errorMessage = 'Payment verification failed';
        setError(errorMessage);
        if (onError) onError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Payment verification error';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'XAF') {
      return `${amount.toLocaleString()} FCFA`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  return (
    <div className="notchpay-button-container">
      <button
        onClick={handlePayment}
        disabled={disabled || loading}
        className={`
          relative w-full bg-gradient-to-r from-blue-600 to-purple-600 
          hover:from-blue-700 hover:to-purple-700 
          text-white font-semibold py-3 px-6 rounded-lg 
          transition-all duration-200 transform hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          flex items-center justify-center gap-2
          ${className}
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            {children || `Pay ${formatAmount(amount, currency)}`}
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
        <Shield className="w-3 h-3" />
        <span>Secured by NotchPay</span>
      </div>
    </div>
  );
}
