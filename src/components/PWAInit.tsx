'use client';

import { useEffect } from 'react';
import { registerServiceWorker, createPharmaLinkNotification, NotificationTypes } from '@/utils/pwa';

export default function PWAInit() {
  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    // Initialize PWA features
    const initializePWA = async () => {
      try {
        // Register service worker
        const registration = await registerServiceWorker();
        
        if (registration) {
          console.log('✅ PWA Service Worker registered successfully');
          
          // Listen for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  createPharmaLinkNotification(NotificationTypes.SYSTEM_UPDATE, {
                    version: '1.1.0',
                    features: ['Improved offline support', 'Better performance']
                  });
                }
              });
            }
          });
        }
        
        // Initialize offline data cleanup
        cleanupOldOfflineData();
        
        // Set up periodic sync check
        setInterval(checkForPendingSync, 30000); // Check every 30 seconds
        
      } catch (error) {
        console.error('❌ PWA initialization failed:', error);
      }
    };

    initializePWA();
  }, []);

  // Cleanup old offline data (older than 7 days)
  const cleanupOldOfflineData = async () => {
    try {
      const db = await openIndexedDB();

      // Check if the object store exists
      if (!db.objectStoreNames.contains('syncData')) {
        console.log('📦 IndexedDB syncData store not yet created, skipping cleanup');
        return;
      }

      const transaction = db.transaction(['syncData'], 'readwrite');
      const store = transaction.objectStore('syncData');

      // Check if the timestamp index exists
      if (!store.indexNames.contains('timestamp')) {
        console.log('📦 IndexedDB timestamp index not yet created, skipping cleanup');
        return;
      }

      const index = store.index('timestamp');
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const range = IDBKeyRange.upperBound(sevenDaysAgo);

      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      request.onerror = () => {
        console.error('Failed to cleanup old offline data:', request.error);
      };
    } catch (error) {
      console.error('Failed to cleanup old offline data:', error);
    }
  };

  // Check for pending sync data
  const checkForPendingSync = async () => {
    if (!navigator.onLine) return;

    try {
      const db = await openIndexedDB();

      // Check if the object store exists
      if (!db.objectStoreNames.contains('syncData')) {
        console.log('📦 IndexedDB syncData store not yet created');
        return;
      }

      const transaction = db.transaction(['syncData'], 'readonly');
      const store = transaction.objectStore('syncData');
      const request = store.count();

      request.onsuccess = () => {
        const count = request.result;
        if (count > 0) {
          console.log(`📤 ${count} items pending sync`);
          // Trigger background sync if available
          if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then((registration) => {
              return (registration as any).sync.register('pharmalink-sync-pending');
            });
          }
        }
      };

      request.onerror = () => {
        console.error('Failed to count pending sync items:', request.error);
      };
    } catch (error) {
      console.error('Failed to check pending sync:', error);
    }
  };

  // Helper function to safely open IndexedDB
  const openIndexedDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open('PharmaLinkOffline', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('syncData')) {
          const store = db.createObjectStore('syncData', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          console.log('📦 PWAInit: Created IndexedDB syncData object store');
        }
      };
    });
  };

  // This component doesn't render anything
  return null;
}

// Hook for PWA features
export function usePWAFeatures() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('🌐 Back online - checking for pending sync');
      checkForPendingSync();
    };

    const handleOffline = () => {
      console.log('📴 Gone offline - enabling offline mode');
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('📱 App installed successfully');
      createPharmaLinkNotification(NotificationTypes.SYSTEM_UPDATE, {
        message: 'PharmaLink has been installed successfully! You can now access it from your home screen.'
      });
    };

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('💾 App can be installed');
      // The PWAInstallPrompt component will handle this
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const checkForPendingSync = async () => {
    if (!navigator.onLine) return;

    try {
      const request = indexedDB.open('PharmaLinkOffline', 1);
      request.onsuccess = () => {
        const db = request.result;

        // Check if the object store exists
        if (!db.objectStoreNames.contains('syncData')) {
          console.log('📦 IndexedDB syncData store not yet created');
          return;
        }

        const transaction = db.transaction(['syncData'], 'readonly');
        const store = transaction.objectStore('syncData');
        const countRequest = store.count();

        countRequest.onsuccess = () => {
          const count = countRequest.result;
          if (count > 0 && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
              if ('sync' in registration) {
                return (registration as any).sync.register('pharmalink-sync-pending');
              }
            });
          }
        };

        countRequest.onerror = () => {
          console.error('Failed to count pending sync items:', countRequest.error);
        };
      };

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
      };
    } catch (error) {
      console.error('Failed to check pending sync:', error);
    }
  };
}
