'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Route,
  BarChart3,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Phone,
  Navigation,
  Star,
  Timer
} from 'lucide-react';
import ClientOnly from './ClientOnly';

interface DeliveryStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  failed: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
}

interface DeliveryItem {
  id: string;
  trackingNumber: string;
  orderId: string;
  customerName: string;
  pharmacyName: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  partnerName?: string;
  partnerPhone?: string;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  deliveryAddress: string;
  value: number;
  distance: number;
  createdAt: Date;
}

interface DeliveryPartner {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'busy';
  currentDeliveries: number;
  rating: number;
  vehicleType: string;
  location: string;
  phone: string;
}

interface ProofOfDeliveryProps {
  deliveryId: string;
  onSubmit: (proof: any) => void;
  onCancel: () => void;
}

function ProofOfDeliveryModal({ deliveryId, onSubmit, onCancel }: ProofOfDeliveryProps) {
  const [recipientName, setRecipientName] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!recipientName || !photo || !location) {
      alert('Please fill in all required fields');
      return;
    }

    const proof = {
      recipientName,
      deliveryPhoto: photo,
      deliveryTime: new Date(),
      notes,
      gpsLocation: location
    };

    onSubmit(proof);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Proof of Delivery</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter recipient's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Photo *
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {photo && (
                <div className="mt-2">
                  <img src={photo} alt="Delivery proof" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional notes..."
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {location
                    ? `Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                    : 'Getting location...'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'deliveries' | 'partners' | 'routes'>('deliveries');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      const mockStats: DeliveryStats = {
        total: 156,
        pending: 23,
        inTransit: 45,
        delivered: 82,
        failed: 6,
        averageDeliveryTime: 45, // minutes
        onTimeDeliveryRate: 94.2 // percentage
      };

      const mockDeliveries: DeliveryItem[] = [
        {
          id: 'del_001',
          trackingNumber: 'PL20241234ABCD',
          orderId: 'ORD-2024-001',
          customerName: 'Marie Dubois',
          pharmacyName: 'PHARMACIE CENTRALE',
          status: 'in_transit',
          priority: 'high',
          partnerName: 'Jean-Claude Mbarga',
          partnerPhone: '+237 6XX XXX 001',
          estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
          deliveryAddress: 'Rue de la Réunification, Bastos, Yaoundé',
          value: 25000,
          distance: 8.5,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 'del_002',
          trackingNumber: 'PL20241234EFGH',
          orderId: 'ORD-2024-002',
          customerName: 'Paul Nguema',
          pharmacyName: 'PHARMACIE MODERNE',
          status: 'pending',
          priority: 'normal',
          estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000),
          deliveryAddress: 'Avenue Kennedy, Melen, Yaoundé',
          value: 15000,
          distance: 12.3,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'del_003',
          trackingNumber: 'PL20241234IJKL',
          orderId: 'ORD-2024-003',
          customerName: 'Sophie Kamga',
          pharmacyName: 'PHARMACIE FRANCAISE',
          status: 'delivered',
          priority: 'normal',
          partnerName: 'Marie Nguema',
          partnerPhone: '+237 6XX XXX 002',
          estimatedDelivery: new Date(Date.now() - 30 * 60 * 1000),
          actualDelivery: new Date(Date.now() - 15 * 60 * 1000),
          deliveryAddress: 'Quartier Nlongkak, Yaoundé',
          value: 35000,
          distance: 6.8,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ];

      const mockPartners: DeliveryPartner[] = [
        {
          id: 'partner_001',
          name: 'Jean-Claude Mbarga',
          status: 'busy',
          currentDeliveries: 3,
          rating: 4.8,
          vehicleType: 'Motorcycle',
          location: 'Bastos, Yaoundé',
          phone: '+237 6XX XXX 001'
        },
        {
          id: 'partner_002',
          name: 'Marie Nguema',
          status: 'active',
          currentDeliveries: 1,
          rating: 4.9,
          vehicleType: 'Car',
          location: 'Melen, Yaoundé',
          phone: '+237 6XX XXX 002'
        },
        {
          id: 'partner_003',
          name: 'Express Delivery Team',
          status: 'active',
          currentDeliveries: 0,
          rating: 4.6,
          vehicleType: 'Van',
          location: 'Centre-ville, Yaoundé',
          phone: '+237 6XX XXX 100'
        }
      ];

      setStats(mockStats);
      setDeliveries(mockDeliveries);
      setPartners(mockPartners);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'assigned':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'picked_up':
        return <Package className="h-4 w-4 text-purple-500" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'normal':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleSelectDelivery = (deliveryId: string) => {
    setSelectedDeliveries(prev => 
      prev.includes(deliveryId) 
        ? prev.filter(id => id !== deliveryId)
        : [...prev, deliveryId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on deliveries:`, selectedDeliveries);
    // Implement bulk actions
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
            <p className="text-gray-600">Monitor and manage all deliveries in real-time</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchDashboardData}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>New Delivery</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.inTransit}</p>
                </div>
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.onTimeDeliveryRate}%</p>
                </div>
                <Timer className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'deliveries', label: 'Deliveries', icon: Package },
                { id: 'partners', label: 'Partners', icon: Users },
                { id: 'routes', label: 'Routes', icon: Route }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Deliveries Tab */}
          {selectedTab === 'deliveries' && (
            <div className="p-6">
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by tracking number, customer, or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {selectedDeliveries.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBulkAction('assign')}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Assign ({selectedDeliveries.length})
                    </button>
                    <button
                      onClick={() => handleBulkAction('optimize')}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Optimize Route
                    </button>
                  </div>
                )}
              </div>

              {/* Deliveries Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDeliveries(filteredDeliveries.map(d => d.id));
                            } else {
                              setSelectedDeliveries([]);
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ETA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDeliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedDeliveries.includes(delivery.id)}
                            onChange={() => handleSelectDelivery(delivery.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{delivery.trackingNumber}</div>
                            <div className="text-sm text-gray-500">{delivery.orderId}</div>
                            <div className={`text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                              {delivery.priority.toUpperCase()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{delivery.customerName}</div>
                            <div className="text-sm text-gray-500">{delivery.pharmacyName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(delivery.status)}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                              {delivery.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {delivery.partnerName ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">{delivery.partnerName}</div>
                              <div className="text-sm text-gray-500">{delivery.partnerPhone}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatTime(delivery.estimatedDelivery)}</div>
                          {delivery.actualDelivery && (
                            <div className="text-sm text-green-600">✓ {formatTime(delivery.actualDelivery)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(delivery.value)}</div>
                          <div className="text-sm text-gray-500">{delivery.distance} km</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            {delivery.partnerPhone && (
                              <button 
                                onClick={() => window.open(`tel:${delivery.partnerPhone}`)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Phone className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {selectedTab === 'partners' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <div key={partner.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{partner.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        partner.status === 'active' ? 'bg-green-100 text-green-800' :
                        partner.status === 'busy' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {partner.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4" />
                        <span>{partner.vehicleType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{partner.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span>{partner.currentDeliveries} active deliveries</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{partner.rating} rating</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => window.open(`tel:${partner.phone}`)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call</span>
                      </button>
                      <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1">
                        <Navigation className="h-3 w-3" />
                        <span>Track</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Routes Tab */}
          {selectedTab === 'routes' && (
            <div className="p-6">
              <div className="text-center py-12">
                <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Route Optimization</h3>
                <p className="text-gray-600 mb-4">Optimize delivery routes for maximum efficiency</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Create Optimized Route
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
