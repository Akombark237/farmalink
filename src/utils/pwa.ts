// PWA Utilities for PharmaLink

// Helper function to safely initialize IndexedDB
const initializeIndexedDB = (): Promise<IDBDatabase> => {
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

      // Create syncData object store if it doesn't exist
      if (!db.objectStoreNames.contains('syncData')) {
        const store = db.createObjectStore('syncData', { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('📦 Created IndexedDB syncData object store');
      }
    };
  });
};

// Helper function to safely execute IndexedDB operations
const safeIndexedDBOperation = async <T>(
  operation: (db: IDBDatabase) => Promise<T>,
  fallbackValue?: T
): Promise<T> => {
  try {
    const db = await initializeIndexedDB();
    return await operation(db);
  } catch (error) {
    console.error('IndexedDB operation failed:', error);
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    throw error;
  }
};

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
}

export interface BackgroundSyncData {
  type: 'order' | 'cart' | 'prescription' | 'message';
  data: any;
  timestamp: number;
}

// Check if service worker is supported
export const isServiceWorkerSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
};

// Check if push notifications are supported
export const isPushNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'PushManager' in window && 'Notification' in window;
};

// Register service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushNotificationSupported()) {
    console.warn('Push notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
};

// Show local notification
export const showNotification = async (payload: NotificationPayload): Promise<void> => {
  const permission = await requestNotificationPermission();
  
  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  
  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: payload.badge || '/icons/icon-72x72.png',
    tag: payload.tag || 'pharmalink-notification',
    data: payload.data,
    actions: payload.actions || [],
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  await registration.showNotification(payload.title, options);
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  const permission = await requestNotificationPermission();
  
  if (permission !== 'granted') {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      // Notify server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    return false;
  }
};

// Background sync for offline actions
export const scheduleBackgroundSync = async (data: BackgroundSyncData): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Worker not supported for background sync');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Store data for sync
    const syncData = {
      ...data,
      id: `${data.type}-${Date.now()}`,
      timestamp: Date.now(),
    };
    
    // Store in IndexedDB for persistence
    await storeOfflineData(syncData);
    
    // Register background sync
    if ('sync' in registration) {
      await (registration as any).sync.register(`pharmalink-sync-${data.type}`);
    }
  } catch (error) {
    console.error('Failed to schedule background sync:', error);
  }
};

// Store data offline using IndexedDB
export const storeOfflineData = async (data: any): Promise<void> => {
  return safeIndexedDBOperation(async (db) => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(['syncData'], 'readwrite');
      const store = transaction.objectStore('syncData');

      const addRequest = store.add(data);

      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);

      transaction.onerror = () => reject(transaction.error);
    });
  });
};

// Get offline data
export const getOfflineData = async (type?: string): Promise<any[]> => {
  return safeIndexedDBOperation(async (db) => {
    return new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction(['syncData'], 'readonly');
      const store = transaction.objectStore('syncData');

      let query: IDBRequest;
      if (type && store.indexNames.contains('type')) {
        const index = store.index('type');
        query = index.getAll(type);
      } else {
        query = store.getAll();
      }

      query.onsuccess = () => resolve(query.result || []);
      query.onerror = () => reject(query.error);

      transaction.onerror = () => reject(transaction.error);
    });
  }, []); // Return empty array as fallback
};

// Clear offline data
export const clearOfflineData = async (id?: string): Promise<void> => {
  return safeIndexedDBOperation(async (db) => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(['syncData'], 'readwrite');
      const store = transaction.objectStore('syncData');

      let deleteRequest: IDBRequest;
      if (id) {
        deleteRequest = store.delete(id);
      } else {
        deleteRequest = store.clear();
      }

      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);

      transaction.onerror = () => reject(transaction.error);
    });
  });
};

// Check if app is running in standalone mode (installed as PWA)
export const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Get app installation status
export const getInstallationStatus = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isInstalled: false,
      canInstall: false,
      isIOS: false,
      supportsServiceWorker: false,
      supportsPushNotifications: false,
    };
  }

  return {
    isInstalled: isStandalone(),
    canInstall: 'beforeinstallprompt' in window,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    supportsServiceWorker: isServiceWorkerSupported(),
    supportsPushNotifications: isPushNotificationSupported(),
  };
};

// PWA notification types for PharmaLink
export const NotificationTypes = {
  ORDER_CONFIRMED: 'order_confirmed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  PRESCRIPTION_READY: 'prescription_ready',
  MEDICATION_REMINDER: 'medication_reminder',
  PHARMACY_PROMOTION: 'pharmacy_promotion',
  SYSTEM_UPDATE: 'system_update',
} as const;

// Create notification for specific PharmaLink events
export const createPharmaLinkNotification = async (
  type: keyof typeof NotificationTypes,
  data: any
): Promise<void> => {
  const notifications = {
    [NotificationTypes.ORDER_CONFIRMED]: {
      title: '🛒 Order Confirmed',
      body: `Your order #${data.orderId} has been confirmed and is being prepared.`,
      tag: 'order-update',
      actions: [
        { action: 'view', title: 'View Order' },
        { action: 'track', title: 'Track Package' },
      ],
    },
    [NotificationTypes.ORDER_SHIPPED]: {
      title: '📦 Order Shipped',
      body: `Your order #${data.orderId} is on its way! Expected delivery: ${data.deliveryDate}`,
      tag: 'order-update',
      actions: [
        { action: 'track', title: 'Track Package' },
      ],
    },
    [NotificationTypes.ORDER_DELIVERED]: {
      title: '✅ Order Delivered',
      body: `Your order #${data.orderId} has been delivered. Thank you for choosing PharmaLink!`,
      tag: 'order-update',
      actions: [
        { action: 'rate', title: 'Rate Experience' },
      ],
    },
    [NotificationTypes.PRESCRIPTION_READY]: {
      title: '💊 Prescription Ready',
      body: `Your prescription for ${data.medicationName} is ready for pickup at ${data.pharmacyName}.`,
      tag: 'prescription',
      actions: [
        { action: 'directions', title: 'Get Directions' },
        { action: 'call', title: 'Call Pharmacy' },
      ],
    },
    [NotificationTypes.MEDICATION_REMINDER]: {
      title: '⏰ Medication Reminder',
      body: `Time to take your ${data.medicationName}. Don't forget your health routine!`,
      tag: 'reminder',
      actions: [
        { action: 'taken', title: 'Mark as Taken' },
        { action: 'snooze', title: 'Remind Later' },
      ],
    },
    [NotificationTypes.PHARMACY_PROMOTION]: {
      title: '🎉 Special Offer',
      body: `${data.pharmacyName} has a special offer: ${data.offerDescription}`,
      tag: 'promotion',
      actions: [
        { action: 'view', title: 'View Offer' },
      ],
    },
    [NotificationTypes.SYSTEM_UPDATE]: {
      title: '🔄 App Update Available',
      body: 'A new version of PharmaLink is available with improved features.',
      tag: 'update',
      actions: [
        { action: 'update', title: 'Update Now' },
      ],
    },
  };

  const notification = notifications[type];
  if (notification) {
    await showNotification({
      ...notification,
      data: { type, ...data },
    });
  }
};
