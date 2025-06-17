'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Package, 
  Pill, 
  Heart, 
  Gift, 
  AlertTriangle,
  Mail,
  MessageSquare,
  Smartphone,
  Wifi,
  CheckCircle
} from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';

export default function NotificationDemoPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string, success: boolean = true) => {
    const icon = success ? '✅' : '❌';
    setResults(prev => [...prev, `${icon} ${message}`]);
  };

  const sendTestNotification = async (type: string, title: string, message: string, channels: string[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token'}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'user123',
          type,
          title,
          message,
          channels,
          priority: 'high',
          data: {
            orderId: 'ord_demo_123',
            orderNumber: 'DEMO-2024-001',
            pharmacyName: 'PHARMACIE DEMO',
            pharmacyAddress: 'Yaoundé, Cameroon',
            pharmacyPhone: '+237 6XX XXX XXX',
            medicationName: 'Demo Medication',
            dosage: '500mg',
            time: new Date().toLocaleTimeString()
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        addResult(`${title} notification sent successfully via ${channels.join(', ')}`);
      } else {
        addResult(`Failed to send ${title} notification`, false);
      }
    } catch (error) {
      addResult(`Error sending ${title} notification: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const testWebSocketConnection = async () => {
    try {
      const response = await fetch('/api/websocket');
      if (response.ok) {
        const result = await response.json();
        addResult(`WebSocket status: ${result.data.isHealthy ? 'Healthy' : 'Unhealthy'}`);
        addResult(`Connected users: ${result.data.stats.uniqueUsers}`);
        addResult(`Total connections: ${result.data.stats.totalConnections}`);
      } else {
        addResult('Failed to get WebSocket status', false);
      }
    } catch (error) {
      addResult(`WebSocket test error: ${error.message}`, false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const notificationTests = [
    {
      type: 'order_confirmed',
      title: '🛒 Order Confirmed',
      message: 'Your order #DEMO-2024-001 has been confirmed and is being prepared.',
      channels: ['websocket', 'push', 'email'],
      icon: Package,
      color: 'bg-blue-600'
    },
    {
      type: 'order_ready',
      title: '✅ Order Ready',
      message: 'Your order #DEMO-2024-001 is ready for pickup at PHARMACIE DEMO.',
      channels: ['websocket', 'push', 'email', 'sms'],
      icon: Package,
      color: 'bg-green-600'
    },
    {
      type: 'prescription_ready',
      title: '💊 Prescription Ready',
      message: 'Your prescription for Demo Medication is ready at PHARMACIE DEMO.',
      channels: ['websocket', 'push', 'email', 'sms'],
      icon: Pill,
      color: 'bg-purple-600'
    },
    {
      type: 'medication_reminder',
      title: '⏰ Medication Reminder',
      message: 'Time to take your Demo Medication (500mg).',
      channels: ['push', 'sms'],
      icon: Heart,
      color: 'bg-orange-600'
    },
    {
      type: 'pharmacy_promotion',
      title: '🎉 Special Offer',
      message: 'PHARMACIE DEMO has a special offer: 20% off all vitamins!',
      channels: ['websocket', 'push', 'email'],
      icon: Gift,
      color: 'bg-pink-600'
    },
    {
      type: 'security_alert',
      title: '🔒 Security Alert',
      message: 'New login detected from a different device.',
      channels: ['websocket', 'push', 'email', 'sms'],
      icon: AlertTriangle,
      color: 'bg-red-600'
    }
  ];

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification System Demo</h1>
            <p className="text-gray-600">Test real-time notifications across all channels</p>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Wifi className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">WebSocket</p>
                  <p className="text-xs text-blue-700">Real-time updates</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Push Notifications</p>
                  <p className="text-xs text-green-700">Mobile & web alerts</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Mail className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Email Service</p>
                  <p className="text-xs text-purple-700">SMTP delivery</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-900">SMS Service</p>
                  <p className="text-xs text-orange-700">Twilio integration</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-4">
              <button
                onClick={testWebSocketConnection}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test WebSocket
              </button>
              <button
                onClick={clearResults}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Notification Tests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Notifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificationTests.map((test, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${test.color}`}>
                      <test.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{test.title}</h4>
                      <p className="text-sm text-gray-600">{test.message}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Channels:</p>
                    <div className="flex flex-wrap gap-1">
                      {test.channels.map((channel) => (
                        <span
                          key={channel}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => sendTestNotification(test.type, test.title, test.message, test.channels)}
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Test</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">How to Test</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>WebSocket:</strong> Check the notification center in the top navigation</li>
              <li>• <strong>Push Notifications:</strong> Allow notifications when prompted by your browser</li>
              <li>• <strong>Email:</strong> Check console logs for email delivery (SMTP not configured in demo)</li>
              <li>• <strong>SMS:</strong> Check console logs for SMS delivery (Twilio not configured in demo)</li>
              <li>• <strong>Real-time:</strong> Open multiple browser tabs to see real-time updates</li>
            </ul>
          </div>

          {/* Environment Setup */}
          <div className="mt-8 bg-yellow-50 rounded-lg p-6">
            <h4 className="font-semibold text-yellow-900 mb-2">Production Setup</h4>
            <p className="text-sm text-yellow-700 mb-3">
              To enable full functionality in production, configure these environment variables:
            </p>
            <div className="text-xs text-yellow-700 font-mono bg-yellow-100 p-3 rounded">
              <div>FIREBASE_PROJECT_ID=your-project-id</div>
              <div>FIREBASE_SERVICE_ACCOUNT_KEY=your-service-account-json</div>
              <div>SMTP_HOST=smtp.gmail.com</div>
              <div>SMTP_USER=your-email@gmail.com</div>
              <div>SMTP_PASS=your-app-password</div>
              <div>TWILIO_ACCOUNT_SID=your-twilio-sid</div>
              <div>TWILIO_AUTH_TOKEN=your-twilio-token</div>
              <div>TWILIO_PHONE_NUMBER=your-twilio-number</div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
