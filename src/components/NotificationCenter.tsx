'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  BellRing, 
  X, 
  Check, 
  CheckCheck, 
  Clock, 
  AlertCircle,
  Package,
  Pill,
  Heart,
  Gift,
  Settings
} from 'lucide-react';
import ClientOnly from './ClientOnly';
import { WebSocketClient, getWebSocketClient } from '@/utils/websocketClient';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  readAt?: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  userId?: string;
  className?: string;
}

// Custom hook for WebSocket connection
export function useWebSocket(userId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<WebSocketClient | null>(null);

  useEffect(() => {
    if (!userId || typeof window === 'undefined') {
      console.warn('WebSocket not available or user not provided');
      return;
    }

    try {
      const wsClient = getWebSocketClient();
      setClient(wsClient);

      const handleConnect = () => {
        console.log('🔌 WebSocket connected');
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
      };

      wsClient.on('connect', handleConnect);
      wsClient.on('disconnect', handleDisconnect);

      // Connect with authentication token
      const token = localStorage.getItem('authToken');
      wsClient.connect(token).catch(console.error);

      return () => {
        wsClient.off('connect', handleConnect);
        wsClient.off('disconnect', handleDisconnect);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket in hook:', error);
      setIsConnected(false);
    }
  }, [userId]);

  return { client, isConnected };
}

export default function NotificationCenter({ userId, className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize WebSocket connection
    initializeWebSocket();
    
    // Fetch initial notifications
    fetchNotifications();

    return () => {
      if (wsClient) {
        wsClient.disconnect();
      }
    };
  }, [userId]);

  const initializeWebSocket = () => {
    if (!userId || typeof window === 'undefined') {
      console.warn('WebSocket not available or user not provided');
      return;
    }

    try {
      const client = getWebSocketClient();
      setWsClient(client);

      const handleConnect = () => {
        console.log('🔌 Connected to WebSocket');
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        console.log('🔌 Disconnected from WebSocket');
        setIsConnected(false);
      };

      const handleNotification = (data: any) => {
        console.log('🔔 New notification received:', data);
        handleNewNotification(data);
      };

      const handleOrderUpdate = (data: any) => {
        console.log('📦 Order update received:', data);
        // Handle order-specific updates
      };

      const handlePrescriptionUpdate = (data: any) => {
        console.log('💊 Prescription update received:', data);
        // Handle prescription-specific updates
      };

      client.on('connect', handleConnect);
      client.on('disconnect', handleDisconnect);
      client.on('notification', handleNotification);
      client.on('order_update', handleOrderUpdate);
      client.on('prescription_update', handlePrescriptionUpdate);

      // Connect with authentication token
      const token = localStorage.getItem('authToken');
      client.connect(token).catch(console.error);

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      setIsConnected(false);
    }
  };

  const fetchNotifications = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewNotification = (notification: any) => {
    const newNotification: Notification = {
      id: notification.id || `notif_${Date.now()}`,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      priority: notification.priority || 'normal',
      createdAt: notification.timestamp || new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/icons/icon-192x192.png',
        tag: newNotification.id
      });
    }

    // Play notification sound
    playNotificationSound();
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notificationIds.includes(notif.id) 
              ? { ...notif, isRead: true, readAt: new Date().toISOString() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ markAll: true })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ 
            ...notif, 
            isRead: true, 
            readAt: new Date().toISOString() 
          }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors (user interaction required)
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      order_confirmed: Package,
      order_ready: Package,
      order_delivered: Package,
      prescription_ready: Pill,
      medication_reminder: Heart,
      pharmacy_promotion: Gift,
      security_alert: AlertCircle,
      system_update: Settings
    };
    
    const IconComponent = icons[type as keyof typeof icons] || Bell;
    return <IconComponent className="h-5 w-5" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-500',
      normal: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <ClientOnly>
      <div className={`relative ${className}`}>
        {/* Notification Bell */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-6 w-6" />
          ) : (
            <Bell className="h-6 w-6" />
          )}
          
          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          
          {/* Connection Status */}
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </button>

        {/* Notification Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${getPriorityColor(notification.priority)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead([notification.id])}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(notification.createdAt)}
                          </span>
                          
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page
                    window.location.href = '/notifications';
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
