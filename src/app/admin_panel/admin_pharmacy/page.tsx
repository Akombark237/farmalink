'use client';

import {
    Check,
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    Eye,
    Filter,
    Mail,
    MapPin,
    MoreVertical,
    Package,
    Pause,
    Phone,
    Search,
    Star,
    Store,
    Upload,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Pharmacy {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  registrationDate: string;
  revenue: number;
  orders: number;
  rating: number;
  inventory: number;
  hours: string;
  license: string;
  documents: string[];
}

const AdminPharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  // Sample pharmacy data
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        name: "MediCare Plus Pharmacy",
        email: "contact@medicareplus.com",
        phone: "+1 (555) 123-4567",
        address: "1234 Health Street, Medical District, NY 10001",
        status: "pending",
        registrationDate: "2024-05-20",
        revenue: 45680,
        orders: 234,
        rating: 4.8,
        inventory: 1250,
        hours: "8:00 AM - 10:00 PM",
        license: "PH-NY-2024-001234",
        documents: ["license.pdf", "insurance.pdf", "certification.pdf"]
      },
      {
        id: 2,
        name: "QuickDrug Dispensary",
        email: "admin@quickdrug.com",
        phone: "+1 (555) 987-6543",
        address: "5678 Remedy Ave, Healthcare Plaza, CA 90210",
        status: "approved",
        registrationDate: "2024-03-15",
        revenue: 78920,
        orders: 456,
        rating: 4.6,
        inventory: 2100,
        hours: "24/7",
        license: "PH-CA-2024-005678",
        documents: ["license.pdf", "insurance.pdf"]
      },
      {
        id: 3,
        name: "Community Health Pharmacy",
        email: "info@communityhealth.org",
        phone: "+1 (555) 456-7890",
        address: "9012 Wellness Blvd, Community Center, TX 75001",
        status: "rejected",
        registrationDate: "2024-05-18",
        revenue: 0,
        orders: 0,
        rating: 0,
        inventory: 0,
        hours: "9:00 AM - 6:00 PM",
        license: "PH-TX-2024-009012",
        documents: ["license.pdf"]
      },
      {
        id: 4,
        name: "PharmaMax Solutions",
        email: "support@pharmamax.net",
        phone: "+1 (555) 321-0987",
        address: "3456 Medicine Way, Drug District, FL 33101",
        status: "approved",
        registrationDate: "2024-02-10",
        revenue: 125340,
        orders: 789,
        rating: 4.9,
        inventory: 3200,
        hours: "7:00 AM - 11:00 PM",
        license: "PH-FL-2024-003456",
        documents: ["license.pdf", "insurance.pdf", "certification.pdf", "inspection.pdf"]
      },
      {
        id: 5,
        name: "NeighborRx Pharmacy",
        email: "hello@neighborrx.com",
        phone: "+1 (555) 654-3210",
        address: "7890 Local Street, Suburb Area, WA 98101",
        status: "suspended",
        registrationDate: "2024-04-05",
        revenue: 23450,
        orders: 123,
        rating: 3.8,
        inventory: 890,
        hours: "10:00 AM - 8:00 PM",
        license: "PH-WA-2024-007890",
        documents: ["license.pdf", "insurance.pdf"]
      }
    ];
    
    setPharmacies(sampleData);
    setFilteredPharmacies(sampleData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = pharmacies;
    
    if (searchTerm) {
      filtered = filtered.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(pharmacy => pharmacy.status === statusFilter);
    }
    
    setFilteredPharmacies(filtered);
  }, [searchTerm, statusFilter, pharmacies]);

  const getStatusColor = (status: string) => {
    const colors: {[key: string]: string} = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      suspended: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleStatusChange = async (pharmacyId: number, newStatus: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPharmacies(prev => prev.map(pharmacy =>
      pharmacy.id === pharmacyId ? { ...pharmacy, status: newStatus } : pharmacy
    ));
    setLoading(false);
  };

  const stats = {
    total: pharmacies.length,
    pending: pharmacies.filter(p => p.status === 'pending').length,
    approved: pharmacies.filter(p => p.status === 'approved').length,
    rejected: pharmacies.filter(p => p.status === 'rejected').length,
    suspended: pharmacies.filter(p => p.status === 'suspended').length,
    totalRevenue: pharmacies.reduce((sum, p) => sum + p.revenue, 0),
    totalOrders: pharmacies.reduce((sum, p) => sum + p.orders, 0)
  };

  const paginatedPharmacies = filteredPharmacies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Pharmacy Management</h1>
              <p className="text-gray-600">Monitor and manage registered pharmacies on your platform</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors">
                <Download size={18} />
                Export
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 hover:bg-indigo-700 transition-colors">
                <Upload size={18} />
                Import
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Store className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-xl">
                  <Clock className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-xl">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                  <p className="text-xs text-gray-600">Approved</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <XCircle className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                  <p className="text-xs text-gray-600">Rejected</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-xl">
                  <Pause className="text-orange-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.suspended}</p>
                  <p className="text-xs text-gray-600">Suspended</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-xl">
                  <DollarSign className="text-emerald-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-600">Revenue</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-xl">
                  <Package className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-xs text-gray-600">Orders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search pharmacies by name, email, or address..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <select
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <Filter size={18} />
                  More Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {paginatedPharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl text-white">
                        <Store size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{pharmacy.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pharmacy.status)}`}>
                          {pharmacy.status.charAt(0).toUpperCase() + pharmacy.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={16} />
                    <span className="text-sm">{pharmacy.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={16} />
                    <span className="text-sm">{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={16} />
                    <span className="text-sm">{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={16} />
                    <span className="text-sm">{pharmacy.hours}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{pharmacy.rating}</p>
                    <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                      <Star size={12} className="text-yellow-500" />
                      Rating
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{pharmacy.orders}</p>
                    <p className="text-xs text-gray-600">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">${(pharmacy.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{pharmacy.inventory}</p>
                    <p className="text-xs text-gray-600">Stock</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPharmacy(pharmacy);
                      setShowModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  
                  {pharmacy.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(pharmacy.id, 'approved')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(pharmacy.id, 'rejected')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(filteredPharmacies.length / itemsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {showModal && selectedPharmacy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Pharmacy Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Pharmacy Name</label>
                        <p className="text-gray-900">{selectedPharmacy.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedPharmacy.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{selectedPharmacy.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">License Number</label>
                        <p className="text-gray-900">{selectedPharmacy.license}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">{selectedPharmacy.rating}</p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">{selectedPharmacy.orders}</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">${selectedPharmacy.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Revenue</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">{selectedPharmacy.inventory}</p>
                        <p className="text-sm text-gray-600">Inventory Items</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Documents</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPharmacy.documents.map((doc, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {selectedPharmacy.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusChange(selectedPharmacy.id, 'approved');
                          setShowModal(false);
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleStatusChange(selectedPharmacy.id, 'rejected');
                          setShowModal(false);
                        }}
                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPharmacies;
