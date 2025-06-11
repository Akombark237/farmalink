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

const MedicalChat = forwardRef<MedicalChatRef, MedicalChatProps>(({
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
    includeReferences: false // Disabled by default as requested
  });
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversation history when sessionId changes
  useEffect(() => {
    if (sessionId) {
      loadConversationHistory();
    }
  }, [sessionId]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    sendQuickMessage: (message: string) => {
      sendMessage(message);
    }
  }));

  const loadConversationHistory = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/chat-history/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.history && Array.isArray(data.history)) {
          setMessages(data.history.map((msg: Message) => ({
            ...msg,
            timestamp: new Date()
          })));
        }
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

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

    console.log('Sending message:', messageToSend);

    try {
      // Ensure we only send serializable data
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
      console.log('Received response:', data);

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

  const clearConversation = async () => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    try {
      await fetch(`/api/chat-history/${sessionId}`, {
        method: 'DELETE',
      });
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
      // Clear locally even if server request fails
      setMessages([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text: string) => {
    // Remove reference citations like [1], [2], etc.
    const cleanText = text.replace(/\[\d+\]/g, '');
    
    // Simple formatting for now - can be enhanced later
    return (
      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
        {cleanText.split('\n').map((line, index) => (
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
        
        {showSettings && (
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 space-y-4 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <label className="flex items-center space-x-2 p-3 bg-white/70 rounded-lg hover:bg-white/90 transition-all duration-200 cursor-pointer border border-blue-100/50">
                <input
                  type="checkbox"
                  checked={preferences.useRAG}
                  onChange={(e) => setPreferences(prev => ({ ...prev, useRAG: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="font-medium text-gray-700">Enhanced Mode (RAG)</span>
              </label>
              <label className="flex items-center space-x-2 p-3 bg-white/70 rounded-lg hover:bg-white/90 transition-all duration-200 cursor-pointer border border-blue-100/50">
                <input
                  type="checkbox"
                  checked={preferences.includeReferences}
                  onChange={(e) => setPreferences(prev => ({ ...prev, includeReferences: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="font-medium text-gray-700">Include References</span>
              </label>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Bot className="h-16 w-16 mx-auto text-blue-400 relative z-10" />
              </div>
              <div className="space-y-3 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Welcome to Qala-Lwazi!</h3>
                <p className="text-gray-600 leading-relaxed">I'm your AI medical assistant. Ask me anything about health, medications, or medical conditions.</p>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700 font-medium">💡 Try asking about medication side effects, drug interactions, or health symptoms</p>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">Always consult healthcare professionals for personalized medical advice.</p>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-green-400 to-blue-500 text-white'}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`mx-3 p-4 rounded-2xl shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-md border border-blue-500/20'
                    : 'bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-800 rounded-bl-md shadow-xl'
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
                  <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="mx-3 p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl rounded-bl-md shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Qala-Lwazi is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-gradient-to-r from-gray-100 to-blue-100 pt-6">
          <div className="flex space-x-4 items-end">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about medications, symptoms, or health conditions..."
                disabled={isLoading}
                className="pr-16 py-4 rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 resize-none bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 text-gray-700 placeholder-gray-500"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                Press Enter
              </div>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-blue-500/20"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MedicalChat.displayName = 'MedicalChat';

export default MedicalChat;
