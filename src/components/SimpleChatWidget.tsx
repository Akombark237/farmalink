'use client';

import React from 'react';
import Link from 'next/link';

export default function SimpleChatWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/use-pages/medical-assistant"
        className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        title="Open Qala-Lwazi Medical Assistant"
      >
        <svg
          className="h-7 w-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        
        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 mb-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat with Qala-Lwazi
        </div>
      </Link>
    </div>
  );
}
