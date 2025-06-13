'use client';

// pages/pharmacy/orders.js
import {
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Filter,
    PackageOpen,
    Search,
    Truck,
    X
} from 'lucide-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

// Mock data - in a real application, this would come from an API
const mockOrders: Order[] = [
  {
    id: "ORD-5731",
    patientName: "Sarah Johnson",
    patientId: "P-1042",
    items: [
      { name: "Amoxicillin 500mg", quantity: 30, price: 15.99 },
      { name: "Ibuprofen 200mg", quantity: 60, price: 8.50 }
    ],
    totalPrice: 24.49,
    status: "pending",
    priority: "high",
    createdAt: "2025-05-20T15:30:00Z",
    deliveryMethod: "pickup",
    pickupTime: "2025-05-21T18:00:00Z",
    prescription: true,
    notes: "Patient needs this ASAP for post-surgery care"
  },
  {
    id: "ORD-5732",
    patientName: "Michael Brown",
    patientId: "P-0872",
    items: [
      { name: "Lisinopril 10mg", quantity: 90, price: 22.75 },
      { name: "Metformin 500mg", quantity: 60, price: 15.25 },
      { name: "Vitamin D3 1000IU", quantity: 100, price: 12.00 }
    ],
    totalPrice: 50.00,
    status: "processing",
    priority: "medium",
    createdAt: "2025-05-20T14:45:00Z",
    deliveryMethod: "delivery",
    deliveryAddress: "123 Oak St, Anytown, ST 12345",
    prescription: true,
    notes: ""
  },
  {
    id: "ORD-5733",
    patientName: "Emily Wilson",
    patientId: "P-2156",
    items: [
      { name: "Cetirizine 10mg", quantity: 30, price: 14.99 },
      { name: "Nasal Spray", quantity: 1, price: 9.95 }
    ],
    totalPrice: 24.94,
    status: "ready",
    priority: "low",
    createdAt: "2025-05-20T11:15:00Z",
    deliveryMethod: "pickup",
    pickupTime: "2025-05-21T12:00:00Z",
    prescription: false,
    notes: "Customer prefers generic brands when available"
  },
  {
    id: "ORD-5734",
    patientName: "David Lee",
    patientId: "P-3098",
    items: [
      { name: "Losartan 50mg", quantity: 30, price: 18.50 },
      { name: "Simvastatin 20mg", quantity: 30, price: 12.75 },
      { name: "Aspirin 81mg", quantity: 90, price: 7.99 }
    ],
    totalPrice: 39.24,
    status: "completed",
    priority: "medium",
    createdAt: "2025-05-19T16:30:00Z",
    deliveryMethod: "delivery",
    deliveryAddress: "456 Pine Ave, Anytown, ST 12345",
    deliveredAt: "2025-05-20T14:23:00Z",
    prescription: true,
    notes: ""
  },
  {
    id: "ORD-5735",
    patientName: "Jessica Martinez",
    patientId: "P-0435",
    items: [
      { name: "Prenatal Vitamins", quantity: 60, price: 24.99 },
      { name: "Folic Acid 400mcg", quantity: 90, price: 11.25 }
    ],
    totalPrice: 36.24,
    status: "cancelled",
    priority: "low",
    createdAt: "2025-05-19T13:45:00Z",
    deliveryMethod: "pickup",
    cancellationReason: "Customer found better pricing elsewhere",
    prescription: false,
    notes: ""
  },
  {
    id: "ORD-5736",
    patientName: "Robert Garcia",
    patientId: "P-7621",
    items: [
      { name: "Insulin Vials", quantity: 3, price: 89.99 },
      { name: "Blood Glucose Test Strips", quantity: 100, price: 45.50 },
      { name: "Alcohol Swabs", quantity: 100, price: 8.25 }
    ],
    totalPrice: 143.74,
    status: "pending",
    priority: "critical",
    createdAt: "2025-05-20T16:10:00Z",
    deliveryMethod: "delivery",
    deliveryAddress: "789 Maple Dr, Anytown, ST 12345",
    prescription: true,
    notes: "Patient is low on insulin - expedite delivery"
  },
  {
    id: "ORD-5737",
    patientName: "Jennifer Smith",
    patientId: "P-5392",
    items: [
      { name: "Multivitamin Women's", quantity: 90, price: 19.99 },
      { name: "Calcium Supplement", quantity: 60, price: 14.75 },
      { name: "Fish Oil 1000mg", quantity: 120, price: 22.50 }
    ],
    totalPrice: 57.24,
    status: "ready",
    priority: "low",
    createdAt: "2025-05-20T09:30:00Z",
    deliveryMethod: "pickup",
    pickupTime: "2025-05-21T17:30:00Z",
    prescription: false,
    notes: ""
  },
  {
    id: "ORD-5738",
    patientName: "Thomas Wilson",
    patientId: "P-4271",
    items: [
      { name: "Antibacterial Ointment", quantity: 1, price: 6.99 },
      { name: "Bandages Variety Pack", quantity: 1, price: 8.50 },
      { name: "Pain Relief Cream", quantity: 1, price: 12.75 }
    ],
    totalPrice: 28.24,
    status: "processing",
    priority: "medium",
    createdAt: "2025-05-20T13:15:00Z",
    deliveryMethod: "pickup",
    pickupTime: "2025-05-21T15:00:00Z",
    prescription: false,
    notes: "Customer requested generic options"
  }
];

// Define TypeScript interfaces
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  patientName: string;
  patientId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  deliveryMethod: 'pickup' | 'delivery';
  pickupTime?: string;
  deliveryAddress?: string;
  deliveredAt?: string;
  cancellationReason?: string;
  prescription: boolean;
  notes: string;
}

export default function PharmacyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDelivery, setFilterDelivery] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isPriorityFilterOpen, setIsPriorityFilterOpen] = useState(false);
  const [isDeliveryFilterOpen, setIsDeliveryFilterOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Simulating fetching orders from an API
  useEffect(() => {
    // In a real application, this would be an API call
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders based on current filter settings
  useEffect(() => {
    let result = [...orders];

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(order => order.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== "all") {
      result = result.filter(order => order.priority === filterPriority);
    }

    // Filter by delivery method
    if (filterDelivery !== "all") {
      result = result.filter(order => order.deliveryMethod === filterDelivery);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.patientName.toLowerCase().includes(searchLower) ||
        order.patientId.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    }

    setFilteredOrders(result);
  }, [orders, filterStatus, filterPriority, filterDelivery, searchTerm]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleOrderAction = (orderId: string, action: 'process' | 'ready' | 'complete' | 'cancel') => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        let newStatus: Order['status'];
        switch (action) {
          case 'process':
            newStatus = 'processing';
            break;
          case 'ready':
            newStatus = 'ready';
            break;
          case 'complete':
            newStatus = 'completed';
            break;
          case 'cancel':
            newStatus = 'cancelled';
            break;
          default:
            newStatus = order.status;
        }
        return { ...order, status: newStatus };
      }
      return order;
    });

    setOrders(updatedOrders);
  };

  const handleBulkAction = (action: 'process' | 'ready' | 'complete') => {
    setIsProcessingBulk(true);

    // Simulate processing delay
    setTimeout(() => {
      const updatedOrders = orders.map(order => {
        if (selectedOrders.includes(order.id)) {
          let newStatus: Order['status'];
          switch (action) {
            case 'process':
              newStatus = 'processing';
              break;
            case 'ready':
              newStatus = 'ready';
              break;
            case 'complete':
              newStatus = 'completed';
              break;
            default:
              newStatus = order.status;
          }
          return { ...order, status: newStatus };
        }
        return order;
      });

      setOrders(updatedOrders);
      setSelectedOrders([]);
      setIsProcessingBulk(false);
    }, 1000);
  };

  const toggleOrderSelection = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: Order['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'processing':
        return <PackageOpen className="w-5 h-5 text-blue-600" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getNextActionButton = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return (
          <button
            onClick={() => handleOrderAction(order.id, 'process')}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Processing
          </button>
        );
      case 'processing':
        return (
          <button
            onClick={() => handleOrderAction(order.id, 'ready')}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Mark Ready
          </button>
        );
      case 'ready':
        return (
          <button
            onClick={() => handleOrderAction(order.id, 'complete')}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Complete Order
          </button>
        );
      case 'completed':
        return null;
      case 'cancelled':
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Pharmacy Orders | MedSync Dashboard</title>
        <meta name="description" content="Manage your pharmacy orders efficiently" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Sidebar would be here in a complete app */}

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600 mt-1">View and manage all incoming customer orders</p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="flex flex-col lg:flex-row p-4 gap-4 border-b border-gray-100">
              {/* Search */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search orders by ID, patient name, or medication..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-40 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                  >
                    <span>Status: {filterStatus === 'all' ? 'All' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
                    {isStatusFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isStatusFilterOpen && (
                    <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                      <ul className="py-1 max-h-60 overflow-auto">
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterStatus('all'); setIsStatusFilterOpen(false); }}>All</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterStatus('pending'); setIsStatusFilterOpen(false); }}>Pending</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterStatus('processing'); setIsStatusFilterOpen(false); }}>Processing</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterStatus('ready'); setIsStatusFilterOpen(false); }}>Ready</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterStatus('completed'); setIsStatusFilterOpen(false); }}>Completed</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterStatus('cancelled'); setIsStatusFilterOpen(false); }}>Cancelled</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Priority Filter */}
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-40 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsPriorityFilterOpen(!isPriorityFilterOpen)}
                  >
                    <span>Priority: {filterPriority === 'all' ? 'All' : filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}</span>
                    {isPriorityFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isPriorityFilterOpen && (
                    <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                      <ul className="py-1 max-h-60 overflow-auto">
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterPriority('all'); setIsPriorityFilterOpen(false); }}>All</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterPriority('low'); setIsPriorityFilterOpen(false); }}>Low</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterPriority('medium'); setIsPriorityFilterOpen(false); }}>Medium</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterPriority('high'); setIsPriorityFilterOpen(false); }}>High</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterPriority('critical'); setIsPriorityFilterOpen(false); }}>Critical</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Delivery Method Filter */}
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-40 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsDeliveryFilterOpen(!isDeliveryFilterOpen)}
                  >
                    <span>Delivery: {filterDelivery === 'all' ? 'All' : filterDelivery.charAt(0).toUpperCase() + filterDelivery.slice(1)}</span>
                    {isDeliveryFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isDeliveryFilterOpen && (
                    <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                      <ul className="py-1 max-h-60 overflow-auto">
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterDelivery('all'); setIsDeliveryFilterOpen(false); }}>All</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterDelivery('pickup'); setIsDeliveryFilterOpen(false); }}>Pickup</li>
                        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setFilterDelivery('delivery'); setIsDeliveryFilterOpen(false); }}>Delivery</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="p-4 bg-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-800">{selectedOrders.length} orders selected</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('process')}
                    disabled={isProcessingBulk}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  >
                    {isProcessingBulk ? 'Processing...' : 'Start Processing'}
                  </button>
                  <button
                    onClick={() => handleBulkAction('ready')}
                    disabled={isProcessingBulk}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
                  >
                    {isProcessingBulk ? 'Processing...' : 'Mark Ready'}
                  </button>
                  <button
                    onClick={() => handleBulkAction('complete')}
                    disabled={isProcessingBulk}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
                  >
                    {isProcessingBulk ? 'Processing...' : 'Complete Orders'}
                  </button>
                  <button
                    onClick={() => setSelectedOrders([])}
                    disabled={isProcessingBulk}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-300"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* Order Statistics */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4 border-b border-gray-100">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Processing</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Ready</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'ready').length}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Completed</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</p>
              </div>
            </div>

            {/* Orders List */}
            <div className="overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                    <Filter className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <li key={order.id} className="transition-colors hover:bg-gray-50">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => toggleOrderSelection(order.id)}
                            />

                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                              {getStatusIcon(order.status)}
                            </div>

                            {/* Order Info */}
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getPriorityBadgeClass(order.priority)}`}>
                                  {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                                </span>
                                {order.prescription && (
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                    Prescription
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{order.patientName} ({order.patientId})</p>
                              <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Order Value */}
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">${order.totalPrice.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </p>
                            </div>

                            {/* Delivery Method */}
                            <div className="flex items-center">
                              {order.deliveryMethod === 'pickup' ? (
                                <span className="text-sm text-gray-600 flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                  Pickup: {order.pickupTime ? formatDate(order.pickupTime) : 'Not scheduled'}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-600 flex items-center">
                                  <Truck className="h-4 w-4 mr-1 text-gray-500" />
                                  Delivery
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <div>
                              {getNextActionButton(order)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}