'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Search } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UsePageError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Use Pages Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Service Temporarily Unavailable
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 mb-6">
          We're experiencing some technical difficulties with this service. 
          Please try again in a few moments or use an alternative feature.
        </p>

        {/* Quick Actions */}
        <div className="space-y-3 mb-6">
          <Link
            href="/use-pages/search"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Medications
          </Link>

          <button
            onClick={reset}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Alternative Services */}
        <div className="text-left">
          <h3 className="font-semibold text-gray-800 mb-3">Available Services:</h3>
          <div className="space-y-2">
            <Link href="/use-pages/pharmacies" className="block text-sm text-blue-600 hover:text-blue-700">
              🏥 Find Pharmacies
            </Link>
            <Link href="/use-pages/medical-assistant" className="block text-sm text-blue-600 hover:text-blue-700">
              🤖 Medical Assistant
            </Link>
            <Link href="/use-pages/dashboard" className="block text-sm text-blue-600 hover:text-blue-700">
              📊 Dashboard
            </Link>
          </div>
        </div>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Debug Info:</h3>
            <p className="text-xs text-gray-600 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
