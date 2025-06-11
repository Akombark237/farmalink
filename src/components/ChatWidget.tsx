'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle, X, Minimize2, Maximize2, ExternalLink } from 'lucide-react';
import SimpleMedicalChat from './SimpleMedicalChat';
import Link from 'next/link';

interface ChatWidgetProps {
  className?: string;
}

export default function ChatWidget({ className }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Generate session ID
    const newSessionId = 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    setSessionId(newSessionId);

    // Check if service is online with retry logic
    const checkStatus = async (retryCount = 0) => {
      try {
        const response = await fetch('/api/medical-chat', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const wasOffline = !isOnline;
          setIsOnline(true);
          console.log('✅ Qala-Lwazi Medical Assistant is online');

          // Show welcome notification if coming online for the first time
          if (wasOffline && retryCount > 0) {
            setShowWelcome(true);
            setTimeout(() => setShowWelcome(false), 5000);
          }
        } else {
          setIsOnline(false);
          if (retryCount < 3) {
            console.log(`⚠️ Chatbot API not ready, retrying... (${retryCount + 1}/3)`);
            setTimeout(() => checkStatus(retryCount + 1), 5000);
          }
        }
      } catch (error) {
        setIsOnline(false);
        if (retryCount < 3) {
          console.log(`🔄 Connecting to chatbot API... (${retryCount + 1}/3)`);
          setTimeout(() => checkStatus(retryCount + 1), 5000);
        } else {
          console.log('❌ Chatbot API unavailable. Please start the Gemini proxy server.');
        }
      }
    };

    // Initial check with delay to allow server startup
    setTimeout(() => checkStatus(), 2000);

    // Regular status checks
    const interval = setInterval(() => checkStatus(), 30000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Welcome Notification */}
      {showWelcome && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in-right">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span className="font-medium">Qala-Lwazi is now online!</span>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 group ${className}`}>
          <button
            onClick={handleToggle}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center border-0 cursor-pointer"
            type="button"
          >
            <div className="relative">
              <Bot className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-200" />
              {hasNewMessage && (
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
              )}
            </div>
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-20 right-0 mb-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chat with Qala-Lwazi
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-96 bg-white rounded-lg shadow-2xl border transition-all duration-200 ${
            isMinimized ? 'h-16' : 'h-[600px]'
          }`}
        >
          {/* Custom Header */}
          <div className="flex-shrink-0 p-4 pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                    isOnline ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                </div>
                <div>
                  <span className="text-sm font-semibold">Qala-Lwazi</span>
                  <div className="text-xs opacity-90">
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <Link href="/use-pages/medical-assistant">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex-1 min-h-0">
              {isOnline ? (
                <SimpleMedicalChat
                  sessionId={sessionId}
                  onSessionChange={setSessionId}
                  className="h-full border-0 shadow-none"
                />
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center space-y-3">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-gray-400 animate-pulse" />
                    <div>
                      <p className="text-gray-700 font-medium mb-1">Qala-Lwazi Starting Up...</p>
                      <p className="text-sm text-gray-500 mb-3">
                        The medical assistant is initializing. This may take a moment.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => window.location.reload()}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        🔄 Retry Connection
                      </Button>
                      <Button asChild size="sm" className="w-full">
                        <Link href="/use-pages/medical-assistant">
                          Open Full Page
                        </Link>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Need help? Run: <code className="bg-gray-100 px-1 rounded">npm run dev:full</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
