'use client';

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2, Trash2, Settings, X } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp?: Date;
}

interface ChatPreferences {
  useRAG?: boolean;
  detailLevel?: 'simple' | 'balanced' | 'detailed';
  creativity?: 'conservative' | 'balanced' | 'creative';
  responseLength?: 'short' | 'medium' | 'long';
  includeReferences?: boolean;
}

interface MedicalChatProps {
  className?: string;
  sessionId?: string;
  onSessionChange?: (sessionId: string) => void;
}

export interface MedicalChatRef {
  sendQuickMessage: (message: string) => void;
}

const MedicalChatSimple = forwardRef<MedicalChatRef, MedicalChatProps>(({
  className = '',
  sessionId: initialSessionId,
  onSessionChange
}, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId || '');
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<ChatPreferences>({
    useRAG: true,
    detailLevel: 'balanced',
    creativity: 'balanced',
    responseLength: 'medium',
    includeReferences: false
  });
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
        message: String(userMessage.parts[0].text),
        sessionId: sessionId || undefined,
        userPreferences: {
          useRAG: Boolean(preferences.useRAG),
          detailLevel: String(preferences.detailLevel || 'balanced'),
          creativity: String(preferences.creativity || 'balanced'),
          responseLength: String(preferences.responseLength || 'medium'),
          includeReferences: Boolean(preferences.includeReferences)
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
        let errorMessage = 'Failed to get response';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
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

  const clearConversation = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text: string) => {
    // Simple text formatting without markdown
    return (
      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
        {text.split('\n').map((line, index) => (
          <p key={index} className="mb-2 last:mb-0 text-sm leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    );
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
              <p className="text-gray-600 leading-relaxed">I'm your AI medical assistant. Ask me anything about health, medications, or medical conditions.</p>
              <p className="text-xs text-gray-400 mt-4 italic">Always consult healthcare professionals for personalized medical advice.</p>
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
                <div className={`mx-3 p-4 rounded-2xl shadow-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                }`}>
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.parts[0].text}</p>
                  ) : (
                    <div className="text-gray-800">
                      {formatMessage(message.parts[0].text)}
                    </div>
                  )}
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
                <div className="mx-3 p-4 bg-white border border-gray-200 rounded-2xl rounded-bl-md">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Qala-Lwazi is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <X className="h-4 w-4 text-red-600" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-gray-100 pt-4">
          <div className="flex space-x-4 items-end">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about medications, symptoms, or health conditions..."
                disabled={isLoading}
                className="py-3 rounded-xl"
              />
            </div>
            <Button
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MedicalChatSimple.displayName = 'MedicalChatSimple';

export default MedicalChatSimple;
