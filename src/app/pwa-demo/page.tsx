'use client';

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Bell, 
  Wifi, 
  WifiOff, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import PWAStatus from '@/components/PWAStatus';
import { 
  getInstallationStatus, 
  subscribeToPushNotifications, 
  createPharmaLinkNotification,
  NotificationTypes,
  scheduleBackgroundSync,
  storeOfflineData,
  getOfflineData,
  clearOfflineData
} from '@/utils/pwa';
import ClientOnly from '@/components/ClientOnly';

export default function PWADemoPage() {
  const [installStatus, setInstallStatus] = useState({
    isInstalled: false,
    canInstall: false,
    isIOS: false,
    supportsServiceWorker: false,
    supportsPushNotifications: false,
  });
  const [isOnline, setIsOnline] = useState(true);
  const [offlineDataCount, setOfflineDataCount] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Update installation status
    setInstallStatus(getInstallationStatus());
    
    // Update online status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Check offline data count
    checkOfflineDataCount();
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const checkOfflineDataCount = async () => {
    try {
      const data = await getOfflineData();
      setOfflineDataCount(data.length);
    } catch (error) {
      console.error('Failed to check offline data:', error);
    }
  };

  const addTestResult = (message: string, success: boolean = true) => {
    const icon = success ? '✅' : '❌';
    setTestResults(prev => [...prev, `${icon} ${message}`]);
  };

  const testNotifications = async () => {
    try {
      await createPharmaLinkNotification(NotificationTypes.ORDER_CONFIRMED, {
        orderId: 'TEST-001',
        pharmacyName: 'Demo Pharmacy'
      });
      addTestResult('Test notification sent successfully');
    } catch (error) {
      addTestResult('Failed to send test notification', false);
      console.error(error);
    }
  };

  const testPushSubscription = async () => {
    try {
      const subscription = await subscribeToPushNotifications();
      if (subscription) {
        addTestResult('Push notifications subscribed successfully');
      } else {
        addTestResult('Failed to subscribe to push notifications', false);
      }
    } catch (error) {
      addTestResult('Push subscription failed', false);
      console.error(error);
    }
  };

  const testOfflineStorage = async () => {
    try {
      const testData = {
        type: 'test',
        data: { message: 'Test offline data', timestamp: Date.now() },
        timestamp: Date.now()
      };
      
      await storeOfflineData({ ...testData, id: `test-${Date.now()}` });
      await checkOfflineDataCount();
      addTestResult('Offline data stored successfully');
    } catch (error) {
      addTestResult('Failed to store offline data', false);
      console.error(error);
    }
  };

  const testBackgroundSync = async () => {
    try {
      await scheduleBackgroundSync({
        type: 'order',
        data: { orderId: 'SYNC-TEST-001', amount: 25.99 },
        timestamp: Date.now()
      });
      await checkOfflineDataCount();
      addTestResult('Background sync scheduled successfully');
    } catch (error) {
      addTestResult('Failed to schedule background sync', false);
      console.error(error);
    }
  };

  const clearTestData = async () => {
    try {
      await clearOfflineData();
      await checkOfflineDataCount();
      addTestResult('Offline data cleared successfully');
    } catch (error) {
      addTestResult('Failed to clear offline data', false);
      console.error(error);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PWA Features Demo</h1>
          <p className="text-gray-600">Test and explore Progressive Web App capabilities</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ClientOnly fallback={
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          }>
            <PWAStatus showDetails={true} />
          </ClientOnly>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Connection Status</span>
                <div className="flex items-center space-x-2">
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                  <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Offline Data Items</span>
                <span className="font-medium text-gray-900">{offlineDataCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Service Worker</span>
                <span className={`font-medium ${
                  installStatus.supportsServiceWorker ? 'text-green-600' : 'text-red-600'
                }`}>
                  {installStatus.supportsServiceWorker ? 'Active' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PWA Feature Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={testNotifications}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span>Test Notification</span>
            </button>
            
            <button
              onClick={testPushSubscription}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Smartphone className="h-4 w-4" />
              <span>Subscribe Push</span>
            </button>
            
            <button
              onClick={testOfflineStorage}
              className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Store Offline Data</span>
            </button>
            
            <button
              onClick={testBackgroundSync}
              className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Background Sync</span>
            </button>
            
            <button
              onClick={clearTestData}
              className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Clear Data</span>
            </button>
            
            <button
              onClick={clearResults}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear Results</span>
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">How to Test PWA Features</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Install App:</strong> Look for the install prompt or use browser menu</li>
                <li>• <strong>Test Offline:</strong> Disconnect internet and try navigating</li>
                <li>• <strong>Notifications:</strong> Allow notifications when prompted</li>
                <li>• <strong>Background Sync:</strong> Go offline, perform actions, then come back online</li>
                <li>• <strong>Mobile:</strong> Add to home screen on mobile devices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
