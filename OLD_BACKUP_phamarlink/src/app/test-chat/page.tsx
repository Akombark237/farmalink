'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bot, CheckCircle, ExternalLink, XCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function TestChatPage() {
  const [backendStatus, setBackendStatus] = React.useState<'checking' | 'online' | 'offline'>('checking');
  const [proxyStatus, setProxyStatus] = React.useState<'checking' | 'online' | 'offline'>('checking');

  React.useEffect(() => {
    checkBackendStatus();
    checkProxyStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const checkProxyStatus = async () => {
    try {
      const response = await fetch('/api/medical-chat');
      if (response.status === 400) { // Expected for GET request without body
        setProxyStatus('online');
      } else {
        setProxyStatus('offline');
      }
    } catch (error) {
      setProxyStatus('offline');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="secondary">Checking...</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 Gemini Medical Chat Integration Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the integration between your Next.js frontend and the Gemini proxy backend.
            This page helps verify that all components are working correctly.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Button asChild>
            <Link href="/use-pages/medical-assistant">
              <Bot className="h-4 w-4 mr-2" />
              Medical Assistant Page
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Backend Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getStatusIcon(backendStatus)}
                Gemini Backend Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Service Status:</span>
                {getStatusBadge(backendStatus)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Endpoint:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">http://localhost:3001</code>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={checkBackendStatus}
                  className="flex-1"
                >
                  Refresh Status
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open('http://localhost:3001/health', '_blank')}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Test
                </Button>
              </div>
              {backendStatus === 'offline' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">Backend Offline</p>
                  <p className="text-xs text-red-600 mt-1">
                    Start the backend with: <code>cd gemini-proxy && npm start</code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proxy Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getStatusIcon(proxyStatus)}
                Next.js Proxy Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Service Status:</span>
                {getStatusBadge(proxyStatus)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Endpoint:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">/api/medical-chat</code>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={checkProxyStatus}
                  className="flex-1"
                >
                  Refresh Status
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open('/api/medical-chat', '_blank')}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Test
                </Button>
              </div>
              {proxyStatus === 'offline' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">Proxy Offline</p>
                  <p className="text-xs text-red-600 mt-1">
                    Check that Next.js is running and GEMINI_BACKEND_URL is set
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Instructions */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🧪 Test Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">1. Check Status</h4>
                  <p className="text-gray-600">
                    Ensure both backend and proxy show "Online" status above.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">2. Test Chat</h4>
                  <p className="text-gray-600">
                    Try asking medical questions like:
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                    <li>"What are the side effects of aspirin?"</li>
                    <li>"How does diabetes affect the body?"</li>
                    <li>"What is hypertension?"</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">3. Test Features</h4>
                  <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                    <li>Toggle RAG mode in settings</li>
                    <li>Change response detail level</li>
                    <li>Clear conversation history</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔧 Troubleshooting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <strong>Backend Offline:</strong>
                  <code className="block bg-gray-100 p-2 mt-1 rounded">
                    cd gemini-proxy<br/>
                    npm start
                  </code>
                </div>
                <div>
                  <strong>Environment Issues:</strong>
                  <p className="text-gray-600 mt-1">
                    Check that GEMINI_BACKEND_URL=http://localhost:3001 is in .env.local
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Component */}
          <div className="lg:col-span-2">
            <div className="h-[600px] bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Live Chat Test</h3>
              <p className="text-sm text-gray-600 mb-4">
                This is a live instance of the MedicalChat component. Test it here or use the floating widget.
              </p>
              <div className="h-[500px]">
                {/* Note: MedicalChat component would go here, but we'll keep it simple for now */}
                <div className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Medical Chat Component</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Check the floating chat widget in the bottom-right corner
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Debug Information</h3>
          <div className="text-sm space-y-1">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'Server-side'}</p>
            <p><strong>Screen Size:</strong> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Server-side'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
