'use client';

// src/components/PaymentStatus.tsx
// Payment status display component

import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';

interface PaymentStatusProps {
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';
  amount?: number;
  currency?: string;
  reference?: string;
  date?: string;
  className?: string;
}

export default function PaymentStatus({
  status,
  amount,
  currency = 'XAF',
  reference,
  date,
  className = ''
}: PaymentStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.'
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again.'
        };
      case 'cancelled':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Payment Cancelled',
          description: 'The payment was cancelled by the user.'
        };
      case 'processing':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Processing Payment',
          description: 'Your payment is being processed. Please wait...'
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Payment Pending',
          description: 'Waiting for payment confirmation.'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'XAF') {
      return `${amount.toLocaleString()} FCFA`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={`payment-status ${className}`}>
      <div className={`
        p-6 rounded-lg border-2 ${config.bgColor} ${config.borderColor}
        transition-all duration-200
      `}>
        <div className="flex items-start gap-4">
          <div className={`
            p-2 rounded-full ${config.bgColor} border ${config.borderColor}
          `}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${config.color} mb-1`}>
              {config.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {config.description}
            </p>
            
            <div className="space-y-2">
              {amount && (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Amount: <span className="font-medium">{formatAmount(amount, currency)}</span>
                  </span>
                </div>
              )}
              
              {reference && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Reference: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{reference}</span>
                  </span>
                </div>
              )}
              
              {date && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Date: <span className="font-medium">{formatDate(date)}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment history component
interface PaymentHistoryProps {
  payments: Array<{
    id: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    amount: number;
    currency: string;
    reference: string;
    date: string;
    orderId?: string;
  }>;
  className?: string;
}

export function PaymentHistory({ payments, className = '' }: PaymentHistoryProps) {
  if (!payments || payments.length === 0) {
    return (
      <div className={`payment-history ${className}`}>
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No payment history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`payment-history ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment History</h3>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {payment.orderId ? `Order #${payment.orderId}` : `Payment #${payment.id}`}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(payment.date)}
              </span>
            </div>
            
            <PaymentStatus
              status={payment.status}
              amount={payment.amount}
              currency={payment.currency}
              reference={payment.reference}
              className="mb-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
