'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestChatSimple() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendTestMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');

    try {
      console.log('Sending test message:', message);
      
      const requestData = {
        message: message.trim(),
        sessionId: 'test-session-' + Date.now(),
        userPreferences: {
          useRAG: false,
          detailLevel: 'balanced',
          creativity: 'balanced',
          responseLength: 'medium',
          includeReferences: false
        }
      };

      console.log('Request data:', requestData);

      const res = await fetch('/api/medical-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log('Response data:', data);
      setResponse(data.response || 'No response received');

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Simple Chat Test</h1>
      
      <div className="space-y-4">
        <div>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
        </div>
        
        <Button 
          onClick={sendTestMessage} 
          disabled={loading || !message.trim()}
          className="w-full"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Response:</h3>
            <p className="text-green-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
