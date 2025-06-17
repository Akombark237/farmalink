'use client';

import { AlertTriangle, CheckCircle, Clock, Download, Eye, Filter, MoreVertical, Package, RefreshCw, Search, Trash2, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface Drug {
  id: number;
  name: string;
  genericName: string;
  category: string;
  totalStock: number;
  pharmaciesCount: number;
  avgPrice: number;
  status: 'active' | 'inactive' | 'pending' | 'flagged';
  flagged: boolean;
  reports: number;
  lastUpdated: string;
  image: string;
}

const AdminDrugsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDrugs, setSelectedDrugs] = useState<number[]>([]);

  // Mock data for drugs
  const drugs: Drug[] = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Pain Relief',
      totalStock: 15420,
      pharmaciesCount: 24,
      avgPrice: 12.50,
      status: 'active',
      flagged: false,
      lastUpdated: '2 hours ago',
      reports: 0,
      image: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotics',
      totalStock: 8900,
      pharmaciesCount: 18,
      avgPrice: 35.75,
      status: 'flagged',
      flagged: true,
      lastUpdated: '1 day ago',
      reports: 3,
      image: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'Lisinopril 10mg',
      genericName: 'Lisinopril',
      category: 'Cardiovascular',
      totalStock: 12200,
      pharmaciesCount: 31,
      avgPrice: 28.90,
      status: 'active',
      flagged: false,
      lastUpdated: '5 hours ago',
      reports: 0,
      image: '/api/placeholder/40/40'
    },
    {
      id: 4,
      name: 'Metformin 850mg',
      genericName: 'Metformin HCl',
      category: 'Diabetes',
      totalStock: 6780,
      pharmaciesCount: 22,
      avgPrice: 22.30,
      status: 'inactive',
      flagged: false,
      lastUpdated: '3 days ago',
      reports: 1,
      image: '/api/placeholder/40/40'
    },
    {
      id: 5,
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      category: 'Gastrointestinal',
      totalStock: 9450,
      pharmaciesCount: 27,
      avgPrice: 18.60,
      status: 'pending',
      flagged: true,
      lastUpdated: '6 hours ago',
      reports: 2,
      image: '/api/placeholder/40/40'
    }
  ];

  const handleSelectDrug = (drugId: number) => {
    setSelectedDrugs(prev =>
      prev.includes(drugId)
        ? prev.filter(id => id !== drugId)
        : [...prev, drugId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDrugs.length === filteredDrugs.length) {
      setSelectedDrugs([]);
    } else {
      setSelectedDrugs(filteredDrugs.map(drug => drug.id));
    }
  };

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || drug.status === filterStatus || 
                         (filterStatus === 'flagged' && drug.flagged);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, flagged: boolean) => {
    if (flagged) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Flagged
      </span>;
    }

    const statusStyles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
  };

  const stats = [
    { label: 'Total Drugs', value: '1,247', icon: Package, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Drugs', value: '1,089', icon: CheckCircle, color: 'bg-green-500', change: '+5%' },
    { label: 'Flagged Items', value: '23', icon: AlertTriangle, color: 'bg-red-500', change: '-8%' },
    { label: 'Pending Review', value: '135', icon: Clock, color: 'bg-yellow-500', change: '+15%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Drug Management
              </h1>
              <p className="text-gray-600 mt-1">Monitor drug data consistency and manage flagged items</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
                <RefreshCw className="w-4 h-4" />
                Sync Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs mt-2 flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search drugs by name, generic name, or category..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                className="px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>

          {selectedDrugs.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedDrugs.length} drug{selectedDrugs.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                    Remove
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                    Bulk Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drugs Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200/50">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDrugs.length === filteredDrugs.length && filteredDrugs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Drug Information</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Stock & Availability</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Pricing</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredDrugs.map((drug) => (
                  <tr key={drug.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedDrugs.includes(drug.id)}
                        onChange={() => handleSelectDrug(drug.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{drug.name}</p>
                          <p className="text-sm text-gray-600">{drug.genericName}</p>
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mt-1">
                            {drug.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{drug.totalStock.toLocaleString()} units</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {drug.pharmaciesCount} pharmacies
                        </p>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">${drug.avgPrice}</p>
                      <p className="text-sm text-gray-600">Avg. price</p>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-2">
                        {getStatusBadge(drug.status, drug.flagged)}
                        {drug.reports > 0 && (
                          <p className="text-xs text-red-600">{drug.reports} report{drug.reports !== 1 ? 's' : ''}</p>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <p className="text-sm text-gray-600">{drug.lastUpdated}</p>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-200/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredDrugs.length} of {drugs.length} drugs
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">2</button>
                <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">3</button>
                <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDrugsPage;
