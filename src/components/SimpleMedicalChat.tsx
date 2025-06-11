'use client';

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp?: Date;
}

interface SimpleMedicalChatProps {
  className?: string;
  sessionId?: string;
  onSessionChange?: (sessionId: string) => void;
}

export interface SimpleMedicalChatRef {
  sendQuickMessage: (message: string) => void;
}

const SimpleMedicalChat = forwardRef<SimpleMedicalChatRef, SimpleMedicalChatProps>(({
  className = '',
  sessionId: initialSessionId,
  onSessionChange
}, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId || '');
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    sendQuickMessage: (message: string) => {
      sendMessage(message);
    }
  }));

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: messageToSend }],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const requestData = {
        message: messageToSend,
        sessionId: sessionId || undefined,
        userPreferences: {
          useRAG: true,
          detailLevel: 'balanced',
          creativity: 'balanced',
          responseLength: 'medium',
          includeReferences: false
        }
      };

      const response = await fetch('/api/medical-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Update session ID if it was created
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        onSessionChange?.(data.sessionId);
      }

      const assistantMessage: Message = {
        role: 'model',
        parts: [{ text: data.response || 'No response received' }],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">Qala-Lwazi Medical Assistant</CardTitle>
            <p className="text-sm text-gray-500">Powered by Ukuqala Labs</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <Bot className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Welcome to Qala-Lwazi!</h3>
              <p className="text-gray-600">Ask me anything about health, medications, or medical conditions.</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`mx-3 p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{message.parts[0].text}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-end">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-green-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="mx-3 p-4 bg-white border border-gray-200 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-700">Qala-Lwazi is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t pt-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about medications, symptoms, or health conditions..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SimpleMedicalChat.displayName = 'SimpleMedicalChat';

export default SimpleMedicalChat;
