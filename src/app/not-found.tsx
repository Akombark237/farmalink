import { Search, Home, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          The page might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Quick Links */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Where would you like to go?
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Search Drugs */}
            <Link
              href="/use-pages/search"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-left"
            >
              <Search className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Search Medications</div>
                <div className="text-sm text-gray-600">Find drugs and pharmacies</div>
              </div>
            </Link>

            {/* Find Pharmacies */}
            <Link
              href="/use-pages/pharmacies"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-left"
            >
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Find Pharmacies</div>
                <div className="text-sm text-gray-600">Locate nearby pharmacies</div>
              </div>
            </Link>

            {/* Medical Assistant */}
            <Link
              href="/use-pages/medical-assistant"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 text-left"
            >
              <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Medical Assistant</div>
                <div className="text-sm text-gray-600">Get AI-powered health advice</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Go Home Button */}
          <Link
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>

          {/* Go Back Button */}
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Still can't find what you're looking for?{' '}
            <Link 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
