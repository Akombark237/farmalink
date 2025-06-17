'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ChatbotStatusProps {
  className?: string;
  showDetails?: boolean;
}

interface StatusData {
  status: 'online' | 'offline' | 'checking';
  message?: string;
  backend?: any;
  backendUrl?: string;
  lastChecked?: Date;
}

export default function ChatbotStatus({ className = '', showDetails = false }: ChatbotStatusProps) {
  const [status, setStatus] = useState<StatusData>({ status: 'checking' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkChatbotStatus = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/medical-chat', {
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus({
          status: 'online',
          message: data.message || 'Chatbot is online',
          backend: data.backend,
          backendUrl: data.backendUrl,
          lastChecked: new Date()
        });
      } else {
        setStatus({
          status: 'offline',
          message: 'Chatbot service unavailable',
          lastChecked: new Date()
        });
      }
    } catch (error) {
      setStatus({
        status: 'offline',
        message: 'Failed to connect to chatbot',
        lastChecked: new Date()
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkChatbotStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkChatbotStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status.status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    if (isRefreshing) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    
    switch (status.status) {
      case 'online': return <Wifi className="h-4 w-4" />;
      case 'offline': return <WifiOff className="h-4 w-4" />;
      case 'checking': return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  if (!showDetails) {
    // Simple status indicator
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        <button
          onClick={checkChatbotStatus}
          disabled={isRefreshing}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  // Detailed status card
  return (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Chatbot Status</h3>
        </div>
        <button
          onClick={checkChatbotStatus}
          disabled={isRefreshing}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
          title="Refresh status"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
        
        {status.message && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Message:</span>
            <span className="text-sm text-gray-900">{status.message}</span>
          </div>
        )}
        
        {status.backendUrl && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Backend:</span>
            <span className="text-sm text-gray-900 font-mono">{status.backendUrl}</span>
          </div>
        )}
        
        {status.lastChecked && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last checked:</span>
            <span className="text-sm text-gray-900">
              {status.lastChecked.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      
      {status.status === 'offline' && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Chatbot is offline.</strong> To start the chatbot:
          </p>
          <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
            <li>Run: <code className="bg-yellow-100 px-1 rounded">npm run dev:chatbot</code></li>
            <li>Or: <code className="bg-yellow-100 px-1 rounded">npm run chatbot:start</code></li>
            <li>Or double-click: <code className="bg-yellow-100 px-1 rounded">start-pharmalink.bat</code></li>
          </ul>
        </div>
      )}
    </div>
  );
}
