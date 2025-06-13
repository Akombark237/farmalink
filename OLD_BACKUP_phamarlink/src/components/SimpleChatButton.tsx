'use client';

import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import Link from 'next/link';

export default function SimpleChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    console.log('Simple chat button clicked!');
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Simple Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <button
            onClick={handleToggle}
            className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            type="button"
          >
            <Bot className="h-6 w-6 text-white" />
          </button>
          <div className="absolute bottom-16 right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Simple Test Button
            </div>
          </div>
        </div>
      )}

      {/* Simple Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-2xl border">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-green-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Test Chat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 flex items-center justify-center hover:bg-white/20 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 h-full">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-4">Simple chat button is working!</p>
              <Link
                href="/use-pages/medical-assistant"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Go to Full Chat
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
