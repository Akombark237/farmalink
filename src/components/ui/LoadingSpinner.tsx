'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-purple-500',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color]} rounded-full animate-spin`}></div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}

// Skeleton Loading Component
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="glass p-6 rounded-2xl shadow-soft">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

// Floating Action Button
export function FloatingActionButton({ 
  onClick, 
  icon, 
  className = '' 
}: { 
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-glow hover-lift flex items-center justify-center transition-all duration-300 z-50 ${className}`}
    >
      {icon}
    </button>
  );
}

// Notification Toast
export function NotificationToast({ 
  message, 
  type = 'info',
  onClose 
}: { 
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}) {
  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white'
  };

  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 ${typeStyles[type]} animate-slideInRight`}>
      <span className="text-lg">{typeIcons[type]}</span>
      <span className="font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-lg hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}
