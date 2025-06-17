import { Loader2, Search, MapPin, Pill } from 'lucide-react';

export default function UsePageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Main Loading Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Loading Healthcare Services
        </h2>
        
        <p className="text-gray-600 mb-8">
          Preparing your personalized healthcare experience...
        </p>

        {/* Service Icons */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse delay-200">
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center animate-pulse delay-400">
            <Pill className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <span>Loading user preferences...</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            <span>Connecting to pharmacy network...</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-400"></div>
            <span>Preparing dashboard...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
