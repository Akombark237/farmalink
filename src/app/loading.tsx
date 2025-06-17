import { Loader2, Heart, Pill } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Main Loading Animation */}
        <div className="relative mb-8">
          {/* Outer Ring */}
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          
          {/* Inner Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Pill className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Loading PharmaLink
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We're preparing your healthcare experience. This will just take a moment...
        </p>

        {/* Progress Indicators */}
        <div className="space-y-4 max-w-sm mx-auto">
          {/* Loading Steps */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>Connecting to pharmacy network...</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            <span>Loading medication database...</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-500"></div>
            <span>Preparing your dashboard...</span>
          </div>
        </div>

        {/* Healthcare Icons Animation */}
        <div className="mt-12 flex justify-center gap-6">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center animate-bounce delay-200">
            <Pill className="w-4 h-4 text-blue-500" />
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-bounce delay-400">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> You can search for medications by name, condition, or active ingredient.
          </p>
        </div>
      </div>
    </div>
  );
}
