'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Home, Search, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setRetryCount(0);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    
    // Try to reload the page
    if (navigator.onLine) {
      window.location.reload();
    } else {
      // Show feedback that we're still offline
      setTimeout(() => {
        setRetryCount(prev => prev - 1);
      }, 2000);
    }
  };

  const cachedPages = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search Medications', path: '/use-pages/search', icon: Search },
    { name: 'Medical Assistant', path: '/use-pages/medical-assistant', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Offline Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600">
            {isOnline 
              ? "Connection restored! You can now browse online content."
              : "No internet connection. You can still access some cached content."
            }
          </p>
        </div>

        {/* Connection Status */}
        <div className={`mb-6 p-3 rounded-lg ${
          isOnline 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              isOnline ? 'text-green-700' : 'text-red-700'
            }`}>
              {isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={retryCount > 0}
          className={`w-full mb-6 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            retryCount > 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isOnline
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${retryCount > 0 ? 'animate-spin' : ''}`} />
          <span>
            {retryCount > 0 
              ? 'Checking...' 
              : isOnline 
                ? 'Reload Page' 
                : 'Try Again'
            }
          </span>
        </button>

        {/* Available Offline Content */}
        {!isOnline && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Offline</h2>
            <div className="space-y-2">
              {cachedPages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <page.icon className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">{page.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Offline Features */}
        <div className="text-left">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">What you can do offline:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span>Browse cached medication information</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span>View your shopping cart</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span>Access saved pharmacy contacts</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Medical assistant (limited functionality)</span>
            </li>
          </ul>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tip</h4>
          <p className="text-xs text-blue-700">
            When you're back online, any actions you took offline will be synchronized automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
