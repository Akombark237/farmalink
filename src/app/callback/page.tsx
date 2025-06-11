'use client';

import { CheckCircle, Loader, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference') || searchParams.get('tx_ref');
      const gateway = searchParams.get('gateway') || 'paystack';

      if (!reference) {
        setStatus('failed');
        setMessage('Payment reference not found');
        return;
      }

      try {
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference, gateway }),
        });

        const result = await response.json();

        if (result.success && result.data.status === 'success') {
          setStatus('success');
          setMessage('Payment successful! Your order has been confirmed.');
          
          // Redirect to order confirmation after 3 seconds
          setTimeout(() => {
            router.push('/order-confirmation');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage('Payment verification failed. Please contact support.');
        }
           } catch {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support.');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {status === 'loading' && (
          <>
            <Loader className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/use-pages/checkout')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}