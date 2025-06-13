'use client';

import React, { useState } from 'react';
import { Bot, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ChatWidgetSimpleProps {
  className?: string;
}

export default function ChatWidgetSimple({ className = '' }: ChatWidgetSimpleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    console.log('ChatWidgetSimple toggle clicked, current isOpen:', isOpen);
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    console.log('ChatWidgetSimple close clicked');
    setIsOpen(false);
  };

  console.log('ChatWidgetSimple render, isOpen:', isOpen);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
          <button
            onClick={handleToggle}
            className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            type="button"
            style={{ zIndex: 9999 }}
          >
            <Bot className="h-7 w-7 text-white" />
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-20 right-0 mb-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Click to open Qala-Lwazi
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border"
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6" />
              <div>
                <span className="font-semibold">Qala-Lwazi</span>
                <p className="text-xs text-blue-100">Medical Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                href="/use-pages/medical-assistant"
                className="h-8 w-8 flex items-center justify-center hover:bg-white/20 rounded text-white"
                title="Open full page"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
              <button
                onClick={handleClose}
                className="h-8 w-8 flex items-center justify-center hover:bg-white/20 rounded"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <Bot className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Qala-Lwazi Medical Assistant
              </h3>
              <p className="text-gray-600 mb-6">
                Your AI-powered medical companion is ready to help with health questions and medication guidance.
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/use-pages/medical-assistant"
                  className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Open Full Chat Interface
                </Link>
                
                <div className="text-xs text-gray-500">
                  Click above to access the complete medical assistant experience
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</p>
                <div className="space-y-2">
                  <Link
                    href="/use-pages/medical-assistant"
                    className="block text-sm text-blue-600 hover:text-blue-800 py-1"
                  >
                    • Ask about medication side effects
                  </Link>
                  <Link
                    href="/use-pages/medical-assistant"
                    className="block text-sm text-blue-600 hover:text-blue-800 py-1"
                  >
                    • Get drug interaction information
                  </Link>
                  <Link
                    href="/use-pages/medical-assistant"
                    className="block text-sm text-blue-600 hover:text-blue-800 py-1"
                  >
                    • Learn about health conditions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
