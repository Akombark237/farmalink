'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle, X, Minimize2, Maximize2, ExternalLink } from 'lucide-react';
import MedicalChat from './MedicalChat';
// import ChatbotStatus from './ChatbotStatus'; // Temporarily disabled
import Link from 'next/link';

interface ChatWidgetProps {
  className?: string;
}

export default function ChatWidget({ className = '' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('ChatWidget mounted');
    return () => console.log('ChatWidget unmounted');
  }, []);

  // Check if the medical chat service is available
  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const response = await fetch('/api/medical-chat', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Service status check:', response.status, response.ok);
        setIsOnline(response.ok);
      } catch (error) {
        console.log('Service status check failed:', error);
        // Set to true so the widget still shows, but handle offline in content
        setIsOnline(true);
      }
    };

    // Initial check with a small delay to ensure the app is loaded
    setTimeout(checkServiceStatus, 1000);

    // Check every 30 seconds
    const interval = setInterval(checkServiceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate session ID when widget is first opened
  useEffect(() => {
    if (isOpen && !sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, [isOpen, sessionId]);

  const handleToggle = () => {
    console.log('ChatWidget toggle clicked, current isOpen:', isOpen);
    setIsOpen(!isOpen);
    setHasNewMessage(false);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Always show the widget, but handle offline state in the content

  return (
    <>
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
          <div className="absolute bottom-20 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap shadow-lg">
              Ask Qala-Lwazi Medical Assistant
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </div>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-blue-600 opacity-20 animate-ping"></div>
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
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold">Qala-Lwazi</span>
                  <p className="text-xs text-blue-100">Medical Assistant</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  <Link href="/use-pages/medical-assistant" title="Open full page">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
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
                <MedicalChat
                  sessionId={sessionId}
                  onSessionChange={setSessionId}
                  className="h-full border-0 shadow-none"
                />
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-2">Service Offline</p>
                    <Button asChild size="sm">
                      <Link href="/use-pages/medical-assistant">
                        Open Full Page
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Access Buttons (when chat is open) */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-6 right-[25rem] z-40 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-md hover:shadow-lg transition-shadow text-xs px-3 py-2 h-auto"
            onClick={() => {
              // You can add quick actions here
              console.log('Quick action: Common symptoms');
            }}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Common Symptoms
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-md hover:shadow-lg transition-shadow text-xs px-3 py-2 h-auto"
            onClick={() => {
              // You can add quick actions here
              console.log('Quick action: Drug interactions');
            }}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Drug Interactions
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-md hover:shadow-lg transition-shadow text-xs px-3 py-2 h-auto"
            onClick={() => {
              // You can add quick actions here
              console.log('Quick action: Side effects');
            }}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Side Effects
          </Button>
        </div>
      )}

      {/* Enhanced Status Indicator */}
      {isOpen && (
        <div className="fixed bottom-2 right-8 z-40">
          <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-md text-xs">
            <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
