'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Smartphone, Download, Bell, BellOff } from 'lucide-react';
import { 
  getInstallationStatus, 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications,
  requestNotificationPermission 
} from '@/utils/pwa';

interface PWAStatusProps {
  className?: string;
  showDetails?: boolean;
}

export default function PWAStatus({ className = '', showDetails = false }: PWAStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [installStatus, setInstallStatus] = useState({
    isInstalled: false,
    canInstall: false,
    isIOS: false,
    supportsServiceWorker: false,
    supportsPushNotifications: false,
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check online status
    const updateOnlineStatus = () => {
      if (typeof navigator !== 'undefined') {
        setIsOnline(navigator.onLine);
      }
    };

    // Check installation status
    const updateInstallStatus = () => {
      setInstallStatus(getInstallationStatus());
    };

    // Check notification permission
    const updateNotificationStatus = () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    // Check push subscription status
    const checkSubscriptionStatus = async () => {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (error) {
          console.error('Error checking subscription status:', error);
        }
      }
    };

    // Initial checks
    updateOnlineStatus();
    updateInstallStatus();
    updateNotificationStatus();
    checkSubscriptionStatus();

    // Event listeners (only on client side)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      window.addEventListener('beforeinstallprompt', updateInstallStatus);
      window.addEventListener('appinstalled', updateInstallStatus);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        window.removeEventListener('beforeinstallprompt', updateInstallStatus);
        window.removeEventListener('appinstalled', updateInstallStatus);
      };
    }
  }, []);

  const handleNotificationToggle = async () => {
    if (isSubscribed) {
      const success = await unsubscribeFromPushNotifications();
      if (success) {
        setIsSubscribed(false);
        setNotificationPermission('default');
      }
    } else {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        const subscription = await subscribeToPushNotifications();
        setIsSubscribed(!!subscription);
      }
    }
  };

  // Don't render on server side
  if (!isClient) {
    return null;
  }

  if (!showDetails) {
    // Simple status indicators
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Online/Offline Status */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" title="Online" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" title="Offline" />
          )}
        </div>

        {/* Installation Status */}
        {installStatus.isInstalled && (
          <Smartphone className="h-4 w-4 text-blue-500" title="Installed as PWA" />
        )}

        {/* Notification Status */}
        {notificationPermission === 'granted' ? (
          <Bell className="h-4 w-4 text-green-500" title="Notifications enabled" />
        ) : (
          <BellOff className="h-4 w-4 text-gray-400" title="Notifications disabled" />
        )}
      </div>
    );
  }

  // Detailed status panel
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">App Status</h3>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">Connection</p>
              <p className="text-sm text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isOnline ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Installation Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {installStatus.isInstalled ? (
              <Smartphone className="h-5 w-5 text-blue-500" />
            ) : (
              <Download className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium text-gray-900">Installation</p>
              <p className="text-sm text-gray-600">
                {installStatus.isInstalled 
                  ? 'Installed as app' 
                  : installStatus.canInstall 
                    ? 'Can be installed' 
                    : 'Browser only'
                }
              </p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            installStatus.isInstalled 
              ? 'bg-blue-100 text-blue-700' 
              : installStatus.canInstall
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {installStatus.isInstalled 
              ? 'Installed' 
              : installStatus.canInstall 
                ? 'Available' 
                : 'Web Only'
            }
          </div>
        </div>

        {/* Notification Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {notificationPermission === 'granted' ? (
              <Bell className="h-5 w-5 text-green-500" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium text-gray-900">Notifications</p>
              <p className="text-sm text-gray-600">
                {notificationPermission === 'granted' 
                  ? 'Enabled' 
                  : notificationPermission === 'denied'
                    ? 'Blocked'
                    : 'Not enabled'
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleNotificationToggle}
            disabled={!installStatus.supportsPushNotifications}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              notificationPermission === 'granted'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            {notificationPermission === 'granted' ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* PWA Features */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">PWA Features</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center space-x-2 ${
              installStatus.supportsServiceWorker ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                installStatus.supportsServiceWorker ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>Offline Support</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              installStatus.supportsPushNotifications ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                installStatus.supportsPushNotifications ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>Push Notifications</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              installStatus.canInstall || installStatus.isInstalled ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                installStatus.canInstall || installStatus.isInstalled ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>App Install</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              isOnline ? 'text-green-600' : 'text-orange-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-orange-500'
              }`}></div>
              <span>Background Sync</span>
            </div>
          </div>
        </div>

        {/* iOS Instructions */}
        {installStatus.isIOS && !installStatus.isInstalled && (
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-3">
              <h5 className="font-medium text-blue-900 text-sm mb-1">Install on iOS</h5>
              <p className="text-xs text-blue-700">
                Tap the Share button and select "Add to Home Screen" to install PharmaLink as an app.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
