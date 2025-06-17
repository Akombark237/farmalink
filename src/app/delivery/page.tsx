'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Search, 
  Plus,
  BarChart3,
  Users,
  Route,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import DeliveryDashboard from '@/components/DeliveryDashboard';
import DeliveryTracking from '@/components/DeliveryTracking';
import ClientOnly from '@/components/ClientOnly';

export default function DeliveryManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'tracking' | 'create'>('dashboard');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleTrackDelivery = () => {
    if (trackingNumber.trim()) {
      setActiveView('tracking');
    }
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Truck className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Delivery Management</h1>
                  <p className="text-sm text-gray-600">Track and manage all deliveries</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-4">
                {/* Quick Track */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter tracking number..."
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTrackDelivery()}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                  <button
                    onClick={handleTrackDelivery}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Track
                  </button>
                </div>

                <button
                  onClick={() => setActiveView('create')}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Delivery</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'tracking', label: 'Track Delivery', icon: MapPin },
                { id: 'create', label: 'Create Delivery', icon: Plus }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeView === tab.id
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
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeView === 'dashboard' && (
            <DeliveryDashboard />
          )}

          {activeView === 'tracking' && (
            <div className="space-y-6">
              {trackingNumber ? (
                <DeliveryTracking 
                  deliveryId="demo-delivery-001"
                  trackingNumber={trackingNumber}
                  showMap={true}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Track Your Delivery</h3>
                    <p className="text-gray-600 mb-6">Enter a tracking number to see real-time delivery status</p>
                    
                    <div className="max-w-md mx-auto">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="e.g., PL20241234ABCD"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleTrackDelivery()}
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={handleTrackDelivery}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Track
                        </button>
                      </div>
                    </div>

                    {/* Demo tracking numbers */}
                    <div className="mt-8">
                      <p className="text-sm text-gray-500 mb-3">Try these demo tracking numbers:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['PL20241234ABCD', 'PL20241234EFGH', 'PL20241234IJKL'].map(demo => (
                          <button
                            key={demo}
                            onClick={() => setTrackingNumber(demo)}
                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {demo}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'create' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Create New Delivery</h2>
                <p className="text-gray-600">Schedule a new delivery for medication orders</p>
              </div>

              <form className="space-y-6">
                {/* Order Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      placeholder="ORD-2024-001"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Address (Pharmacy)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter pharmacy address"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter delivery address"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Package Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="1.0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Value (XAF)
                    </label>
                    <input
                      type="number"
                      placeholder="25000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requirements
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 mr-2" />
                      <span className="text-sm text-gray-700">Fragile</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 mr-2" />
                      <span className="text-sm text-gray-700">Cold Chain Required</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 mr-2" />
                      <span className="text-sm text-gray-700">Signature Required</span>
                    </label>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any special delivery instructions..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Delivery
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                  <Package className="h-5 w-5" />
                  <span className="text-2xl font-bold">156</span>
                </div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-orange-600 mb-2">
                  <Truck className="h-5 w-5" />
                  <span className="text-2xl font-bold">45</span>
                </div>
                <p className="text-sm text-gray-600">In Transit</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-2xl font-bold">94.2%</span>
                </div>
                <p className="text-sm text-gray-600">On-Time Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-purple-600 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">12</span>
                </div>
                <p className="text-sm text-gray-600">Active Partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
