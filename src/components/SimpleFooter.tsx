'use client';

import React from 'react';
import Link from 'next/link';

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-lg font-bold">PharmaLink</span>
            </div>
            <p className="text-gray-300 text-sm">
              Connecting patients with local pharmacies for easy medication access and health assistance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/use-pages/search" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Search Medications
                </Link>
              </li>
              <li>
                <Link href="/public/about" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/public/contact" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/authentication/register" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Join Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/public/privacy" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/public/terms" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} PharmaLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
