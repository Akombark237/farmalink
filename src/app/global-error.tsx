'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Application Error:', error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Critical Error
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 mb-6">
              We encountered a critical error that prevented the application from loading properly. 
              This is likely a temporary issue.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Error Details:</h3>
                <p className="text-sm text-gray-600 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
                {error.stack && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">Stack Trace</summary>
                    <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Reload Application Button */}
              <button
                onClick={reset}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>

              {/* Go Home Button */}
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </button>

              {/* Refresh Page Button */}
              <button
                onClick={() => window.location.reload()}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>

            {/* Emergency Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                If this error persists, please contact our technical support:
              </p>
              <div className="space-y-1">
                <a 
                  href="mailto:tech-support@pharmalink.cm" 
                  className="block text-sm text-red-600 hover:text-red-700 underline"
                >
                  tech-support@pharmalink.cm
                </a>
                <a 
                  href="tel:+237123456789" 
                  className="block text-sm text-red-600 hover:text-red-700 underline"
                >
                  +237 123 456 789
                </a>
              </div>
            </div>

            {/* System Status */}
            <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-800">
                🔧 Our team has been automatically notified of this issue and is working to resolve it.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
