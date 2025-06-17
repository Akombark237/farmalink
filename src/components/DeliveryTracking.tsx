'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  Navigation,
  Camera,
  User,
  Star,
  Route,
  Timer
} from 'lucide-react';
import ClientOnly from './ClientOnly';

interface TrackingUpdate {
  id: string;
  status: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: Date;
  message: string;
  partnerId?: string;
  photoUrl?: string;
}

interface DeliveryPartner {
  id: string;
  name: string;
  contactInfo: {
    phone: string;
    whatsapp?: string;
  };
  vehicleInfo: {
    type: string;
    plateNumber: string;
  };
  rating: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface Delivery {
  id: string;
  trackingNumber: string;
  status: string;
  priority: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  deliveryAddress: {
    street: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  partner?: DeliveryPartner;
  proofOfDelivery?: {
    recipientName: string;
    deliveryPhoto: string;
    deliveryTime: Date;
    notes?: string;
  };
}

interface DeliveryTrackingProps {
  deliveryId: string;
  trackingNumber?: string;
  showMap?: boolean;
  className?: string;
}

export default function DeliveryTracking({ 
  deliveryId, 
  trackingNumber, 
  showMap = true, 
  className = '' 
}: DeliveryTrackingProps) {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);

  useEffect(() => {
    fetchDeliveryData();
    
    // Set up real-time tracking updates (polling every 30 seconds)
    const interval = setInterval(fetchDeliveryData, 30000);
    
    return () => clearInterval(interval);
  }, [deliveryId]);

  const fetchDeliveryData = async () => {
    try {
      setLoading(true);
      
      // Mock API call - in production, this would fetch from your backend
      const mockDelivery: Delivery = {
        id: deliveryId,
        trackingNumber: trackingNumber || 'PL20241234ABCD',
        status: 'in_transit',
        priority: 'normal',
        estimatedDeliveryTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        deliveryAddress: {
          street: 'Rue de la Réunification, Bastos',
          city: 'Yaoundé',
          coordinates: {
            latitude: 3.8480,
            longitude: 11.5021
          }
        },
        partner: {
          id: 'partner_001',
          name: 'Jean-Claude Mbarga',
          contactInfo: {
            phone: '+237 6XX XXX 001',
            whatsapp: '+237 6XX XXX 001'
          },
          vehicleInfo: {
            type: 'motorcycle',
            plateNumber: 'YA-2024-MC'
          },
          rating: 4.8,
          currentLocation: {
            latitude: 3.8460,
            longitude: 11.5001
          }
        }
      };

      const mockUpdates: TrackingUpdate[] = [
        {
          id: '1',
          status: 'pending',
          location: { latitude: 3.8480, longitude: 11.5021 },
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          message: 'Order received and being prepared for delivery'
        },
        {
          id: '2',
          status: 'assigned',
          location: { latitude: 3.8480, longitude: 11.5021 },
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          message: 'Assigned to delivery partner Jean-Claude Mbarga',
          partnerId: 'partner_001'
        },
        {
          id: '3',
          status: 'picked_up',
          location: { latitude: 3.8480, longitude: 11.5021, address: 'PHARMACIE CENTRALE, Yaoundé' },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          message: 'Package picked up from pharmacy'
        },
        {
          id: '4',
          status: 'in_transit',
          location: { latitude: 3.8460, longitude: 11.5001, address: 'Avenue Kennedy, Yaoundé' },
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          message: 'Package is on the way to destination'
        }
      ];

      setDelivery(mockDelivery);
      setTrackingUpdates(mockUpdates);
      setError(null);
    } catch (err) {
      setError('Failed to load delivery information');
      console.error('Error fetching delivery data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'assigned':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'picked_up':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'in_transit':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  const handleContactPartner = (type: 'call' | 'whatsapp') => {
    if (!delivery?.partner) return;
    
    const phone = delivery.partner.contactInfo.phone;
    if (type === 'call') {
      window.open(`tel:${phone}`);
    } else {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}`);
    }
  };

  const openDirections = () => {
    if (!delivery?.partner?.currentLocation || !delivery?.deliveryAddress) return;
    
    const { latitude: lat, longitude: lng } = delivery.partner.currentLocation;
    const { latitude: destLat, longitude: destLng } = delivery.deliveryAddress.coordinates;
    
    // Open Google Maps with directions
    window.open(
      `https://www.google.com/maps/dir/${lat},${lng}/${destLat},${destLng}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tracking Error</h3>
          <p className="text-gray-600">{error || 'Delivery not found'}</p>
          <button
            onClick={fetchDeliveryData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Delivery Tracking</h2>
              <p className="text-sm text-gray-600">Tracking #{delivery.trackingNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
              {delivery.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
              <p className="text-sm text-gray-600">{delivery.deliveryAddress.street}</p>
              <p className="text-sm text-gray-600">{delivery.deliveryAddress.city}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Estimated Delivery</h4>
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {delivery.estimatedDeliveryTime ? formatTime(delivery.estimatedDeliveryTime) : 'Calculating...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Partner Info */}
        {delivery.partner && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">Delivery Partner</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {delivery.partner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{delivery.partner.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{delivery.partner.vehicleInfo.type}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{delivery.partner.vehicleInfo.plateNumber}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{delivery.partner.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleContactPartner('call')}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Call partner"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleContactPartner('whatsapp')}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button
                  onClick={openDirections}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Get directions"
                >
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Timeline */}
        <div className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Tracking History</h4>
          <div className="space-y-4">
            {trackingUpdates.map((update, index) => (
              <div key={update.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(update.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{update.message}</p>
                    <span className="text-xs text-gray-500">{formatTime(update.timestamp)}</span>
                  </div>
                  {update.location.address && (
                    <p className="text-xs text-gray-600 mt-1">📍 {update.location.address}</p>
                  )}
                </div>
                {index < trackingUpdates.length - 1 && (
                  <div className="absolute left-[22px] mt-8 w-0.5 h-8 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Proof of Delivery */}
        {delivery.proofOfDelivery && (
          <div className="p-6 border-t border-gray-200 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-900">Delivery Completed</h4>
              <button
                onClick={() => setShowProofModal(true)}
                className="flex items-center space-x-2 text-green-700 hover:text-green-800"
              >
                <Camera className="h-4 w-4" />
                <span className="text-sm">View Proof</span>
              </button>
            </div>
            <div className="text-sm text-green-800">
              <p>Delivered to: {delivery.proofOfDelivery.recipientName}</p>
              <p>Time: {formatTime(delivery.proofOfDelivery.deliveryTime)}</p>
              {delivery.proofOfDelivery.notes && (
                <p>Notes: {delivery.proofOfDelivery.notes}</p>
              )}
            </div>
          </div>
        )}

        {/* Map placeholder */}
        {showMap && (
          <div className="p-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Live Location</h4>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive map would be displayed here</p>
                <p className="text-sm text-gray-500">Showing real-time delivery partner location</p>
              </div>
            </div>
          </div>
        )}

        {/* Proof of Delivery Modal */}
        {showProofModal && delivery.proofOfDelivery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Proof of Delivery</h3>
                  <button
                    onClick={() => setShowProofModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recipient</label>
                    <p className="text-sm text-gray-900">{delivery.proofOfDelivery.recipientName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Photo</label>
                    <div className="mt-2 bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Time</label>
                    <p className="text-sm text-gray-900">{formatTime(delivery.proofOfDelivery.deliveryTime)}</p>
                  </div>
                  
                  {delivery.proofOfDelivery.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="text-sm text-gray-900">{delivery.proofOfDelivery.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
