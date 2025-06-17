'use client';

import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    Download,
    Package,
    Pill,
    RefreshCw,
    Search,
    Star
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { formatCfa, convertUsdToCfa } from '@/utils/currency';

// Define types for our data
type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  prescription: boolean;
};

type Order = {
  id: string;
  date: string;
  status: string;
  pharmacy: string;
  pharmacyRating: number;
  total: number;
  items: OrderItem[];
  address: string;
  deliveryMethod: string;
  tracking: string;
};

// Mock data - In a real app, this would come from an API (prices in CFA)
const mockOrders: Order[] = [
  {
    id: 'ORD-25102',
    date: '2025-05-15',
    status: 'Delivered',
    pharmacy: 'MediCare Pharmacy',
    pharmacyRating: 4.8,
    total: convertUsdToCfa(68.50), // 41,100 CFA
    items: [
      { id: 'MED-123', name: 'Amoxicillin 500mg', quantity: 2, price: convertUsdToCfa(12.50), prescription: true },
      { id: 'MED-456', name: 'Vitamin D3 5000IU', quantity: 1, price: convertUsdToCfa(8.99), prescription: false },
      { id: 'MED-789', name: 'Ibuprofen 200mg', quantity: 1, price: convertUsdToCfa(5.49), prescription: false },
    ],
    address: 'Quartier Bastos, Yaoundé, Cameroon',
    deliveryMethod: 'Express Delivery',
    tracking: 'TRK-987654321'
  },
  {
    id: 'ORD-24991',
    date: '2025-05-01',
    status: 'Delivered',
    pharmacy: 'HealthFirst Pharmacy',
    pharmacyRating: 4.5,
    total: convertUsdToCfa(42.99), // 25,794 CFA
    items: [
      { id: 'MED-234', name: 'Atorvastatin 20mg', quantity: 1, price: convertUsdToCfa(15.99), prescription: true },
      { id: 'MED-567', name: 'Acetaminophen 500mg', quantity: 2, price: convertUsdToCfa(6.25), prescription: false },
    ],
    address: 'Quartier Melen, Yaoundé, Cameroon',
    deliveryMethod: 'Standard Delivery',
    tracking: 'TRK-876543210'
  },
  {
    id: 'ORD-24875',
    date: '2025-04-18',
    status: 'Delivered',
    pharmacy: 'Community Care Pharmacy',
    pharmacyRating: 4.9,
    total: convertUsdToCfa(103.75), // 62,250 CFA
    items: [
      { id: 'MED-345', name: 'Lisinopril 10mg', quantity: 1, price: convertUsdToCfa(22.50), prescription: true },
      { id: 'MED-678', name: 'Multivitamin Complex', quantity: 1, price: convertUsdToCfa(14.75), prescription: false },
      { id: 'MED-901', name: 'Loratadine 10mg', quantity: 1, price: convertUsdToCfa(8.99), prescription: false },
      { id: 'MED-112', name: 'Probiotic 50B CFU', quantity: 1, price: convertUsdToCfa(32.99), prescription: false },
    ],
    address: 'Quartier Obili, Yaoundé, Cameroon',
    deliveryMethod: 'Standard Delivery',
    tracking: 'TRK-765432109'
  }
];

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'prescription' | 'non-prescription'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter orders based on search term and filter selection
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pharmacy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item: OrderItem) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'prescription') {
      return matchesSearch && order.items.some((item: OrderItem) => item.prescription);
    }
    if (selectedFilter === 'non-prescription') {
      return matchesSearch && order.items.every((item: OrderItem) => !item.prescription);
    }

    return matchesSearch;
  });

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleOrderClick = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleFilterChange = (filter: 'all' | 'prescription' | 'non-prescription') => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleReorder = (orderId: string) => {
    // In a real app, this would handle re-ordering logic
    alert(`Reordering items from order ${orderId}`);
  };

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search orders, medications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-3">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedFilter === 'all'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleFilterChange('all')}
                >
                  All Orders
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedFilter === 'prescription'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleFilterChange('prescription')}
                >
                  Prescription
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedFilter === 'non-prescription'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleFilterChange('non-prescription')}
                >
                  Non-Prescription
                </button>
              </div>

              {/* Date Filter - Simplified for now */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Time</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="180">Last 6 Months</option>
                  <option value="365">Last Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-gray-600">Loading your order history...</p>
            </div>
          ) : currentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm
                  ? `No orders match your search for "${searchTerm}"`
                  : "You haven't placed any orders yet"}
              </p>
              {searchTerm && (
                <button
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
              <Link
                href="/use-pages/pharmacy/1"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Medications
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pharmacy
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrders.map((order) => (
                      <React.Fragment key={order.id}>
                        <tr
                          className={`${expandedOrder === order.id ? 'bg-indigo-50' : 'hover:bg-gray-50'} cursor-pointer transition duration-150`}
                          onClick={() => handleOrderClick(order.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.id}</div>
                            <div className="text-sm text-gray-500">{order.items.length} items</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(order.date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.pharmacy}</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="h-4 w-4 text-yellow-400 inline" />
                              <span className="ml-1">{order.pharmacyRating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCfa(order.total)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(order.id);
                              }}
                            >
                              <RefreshCw className="h-5 w-5 inline" />
                              <span className="ml-1">Reorder</span>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {expandedOrder === order.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </td>
                        </tr>
                        {expandedOrder === order.id && (
                          <tr className="bg-indigo-50">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="border-t border-gray-200 pt-4">
                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-4 mb-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">Delivery Information</h4>
                                    <p className="mt-1 text-sm text-gray-500">{order.address}</p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      <span className="font-medium">Method:</span> {order.deliveryMethod}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      <span className="font-medium">Tracking:</span> {order.tracking}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">Order Timeline</h4>
                                    <div className="mt-2 flex items-center space-x-2">
                                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                      <p className="text-sm text-gray-500">Ordered: {formatDate(order.date)}</p>
                                    </div>
                                    <div className="mt-2 flex items-center space-x-2">
                                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                      <p className="text-sm text-gray-500">Processed: {formatDate(new Date(new Date(order.date).getTime() + 86400000).toISOString())}</p>
                                    </div>
                                    <div className="mt-2 flex items-center space-x-2">
                                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                      <p className="text-sm text-gray-500">Delivered: {formatDate(new Date(new Date(order.date).getTime() + 259200000).toISOString())}</p>
                                    </div>
                                  </div>
                                </div>

                                <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Item
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Qty
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Price
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Type
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {order.items.map((item: OrderItem) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.name}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {item.quantity}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {formatCfa(item.price)}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {item.prescription ? (
                                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                <Pill className="h-3 w-3 mr-1" />
                                                Prescription
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                OTC
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot>
                                      <tr className="border-t-2 border-gray-200">
                                        <td colSpan={2} className="px-4 py-2 text-sm font-medium text-gray-900">
                                          Total
                                        </td>
                                        <td colSpan={2} className="px-4 py-2 text-sm font-medium text-gray-900">
                                          {formatCfa(order.total)}
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>

                                <div className="mt-4 flex justify-end space-x-3">
                                  <button
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // In a real app, this would handle receipt download
                                      alert(`Downloading receipt for order ${order.id}`);
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Receipt
                                  </button>
                                  <button
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReorder(order.id);
                                    }}
                                  >
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Reorder All
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(indexOfLastOrder, filteredOrders.length)}</span> of{" "}
                        <span className="font-medium">{filteredOrders.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Previous Page */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                            currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              page === currentPage
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } text-sm font-medium`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Next Page */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                            currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Quick Refill Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-indigo-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10 sm:pb-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-center">
              <div className="md:col-span-2">
                <h3 className="text-xl font-medium text-white">Need a quick refill?</h3>
                <p className="mt-2 text-indigo-100">
                  Save time by setting up automatic refills for your regular medications.
                  Our system will notify you when it's time to renew your prescriptions.
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/prescriptions"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Set Up Auto-Refills
                </Link>
              </div>
            </div>
          </div>
          <div className="px-6 pt-6 pb-8 bg-indigo-800 sm:p-10 sm:pt-6">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-white">Never miss a dose</h4>
                  <p className="mt-1 text-sm text-indigo-100">Get timely reminders</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-white">Save time</h4>
                  <p className="mt-1 text-sm text-indigo-100">Automatic refills</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-white">Easy payment</h4>
                  <p className="mt-1 text-sm text-indigo-100">Secure transactions</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}