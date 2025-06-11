'use client';

import React from 'react';
import SiteMap from '@/components/ui/SiteMap';
import Link from 'next/link';

export default function SiteMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Site Map Component */}
        <SiteMap />

        {/* Additional Information */}
        <div className="mt-12 glass p-8 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🌐</div>
              <h3 className="font-bold text-lg mb-2">Public Access</h3>
              <p className="text-gray-600 text-sm">
                Homepage, about, contact, and authentication pages accessible to everyone
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👤</div>
              <h3 className="font-bold text-lg mb-2">Patient Portal</h3>
              <p className="text-gray-600 text-sm">
                Dashboard, search, prescriptions, AI assistant, and health management
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏪</div>
              <h3 className="font-bold text-lg mb-2">Pharmacy System</h3>
              <p className="text-gray-600 text-sm">
                Inventory management, order processing, and business analytics
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👑</div>
              <h3 className="font-bold text-lg mb-2">Admin Panel</h3>
              <p className="text-gray-600 text-sm">
                User management, system oversight, and platform administration
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/project-status" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📊 Project Status
            </Link>
            <Link 
              href="/use-pages/dashboard" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              🚀 Try Dashboard
            </Link>
            <Link 
              href="/use-pages/medical-assistant" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              🤖 AI Assistant
            </Link>
            <Link 
              href="/authentication/register" 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              ✍️ Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
