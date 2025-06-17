'use client';

import {
    AlertTriangle,
    ArrowUpDown,
    BarChart3,
    CheckCircle,
    Download,
    Edit,
    Filter,
    Package,
    Plus,
    RefreshCw,
    Search,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PharmacyInventory() {
  // Define types for our data
  type InventoryItem = {
    id: number;
    name: string;
    category: string;
    manufacturer: string;
    stock: number;
    price: number;
    minStock: number;
    expiryDate: string;
    sku: string;
    description: string;
    lastUpdated: string;
    image: string;
  };

  type AlertMessage = {
    message: string;
    type: 'success' | 'error' | 'info';
  };

  type Stats = {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    recentlyAdded: number;
    expiringItems: number;
  };

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDrug, setCurrentDrug] = useState<InventoryItem | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    recentlyAdded: 0,
    expiringItems: 0
  });

  // Mock categories for filter dropdown
  const categories = [
    'All Categories',
    'Antibiotics',
    'Analgesics',
    'Antihypertensives',
    'Antidiabetics',
    'Antihistamines',
    'Vitamins & Supplements',
    'Dermatologicals',
    'Gastrointestinals',
    'Respiratory',
    'Cardiovascular',
    'CNS Medications'
  ];

  // Mock data for inventory
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: 'Amoxicillin',
          category: 'Antibiotics',
          manufacturer: 'PharmaCo',
          stock: 145,
          price: 12.99,
          minStock: 30,
          expiryDate: '2025-12-01',
          sku: 'AMX-500-123',
          description: '500mg capsules, box of 20',
          lastUpdated: '2025-05-15',
          image: '/api/placeholder/60/60'
        },
        {
          id: 2,
          name: 'Lisinopril',
          category: 'Antihypertensives',
          manufacturer: 'MediPharm',
          stock: 78,
          price: 15.49,
          minStock: 25,
          expiryDate: '2026-03-15',
          sku: 'LSN-10-456',
          description: '10mg tablets, bottle of 30',
          lastUpdated: '2025-05-12',
          image: '/api/placeholder/60/60'
        },
        {
          id: 3,
          name: 'Ibuprofen',
          category: 'Analgesics',
          manufacturer: 'PainRelief Inc',
          stock: 212,
          price: 8.99,
          minStock: 50,
          expiryDate: '2026-08-22',
          sku: 'IBU-200-789',
          description: '200mg tablets, bottle of 50',
          lastUpdated: '2025-05-10',
          image: '/api/placeholder/60/60'
        },
        {
          id: 4,
          name: 'Loratadine',
          category: 'Antihistamines',
          manufacturer: 'AllerCare',
          stock: 18,
          price: 11.25,
          minStock: 20,
          expiryDate: '2025-11-30',
          sku: 'LOR-10-101',
          description: '10mg tablets, pack of 30',
          lastUpdated: '2025-05-08',
          image: '/api/placeholder/60/60'
        },
        {
          id: 5,
          name: 'Metformin',
          category: 'Antidiabetics',
          manufacturer: 'DiabeCare',
          stock: 0,
          price: 13.75,
          minStock: 15,
          expiryDate: '2026-04-17',
          sku: 'MET-500-202',
          description: '500mg tablets, bottle of 60',
          lastUpdated: '2025-05-01',
          image: '/api/placeholder/60/60'
        },
        {
          id: 6,
          name: 'Omeprazole',
          category: 'Gastrointestinals',
          manufacturer: 'GastroHealth',
          stock: 95,
          price: 17.99,
          minStock: 25,
          expiryDate: '2025-09-10',
          sku: 'OMP-20-303',
          description: '20mg capsules, box of 14',
          lastUpdated: '2025-05-18',
          image: '/api/placeholder/60/60'
        },
        {
          id: 7,
          name: 'Vitamin D3',
          category: 'Vitamins & Supplements',
          manufacturer: 'VitaWell',
          stock: 167,
          price: 9.50,
          minStock: 30,
          expiryDate: '2027-01-25',
          sku: 'VTD-1000-404',
          description: '1000IU tablets, bottle of 90',
          lastUpdated: '2025-05-17',
          image: '/api/placeholder/60/60'
        },
        {
          id: 8,
          name: 'Atorvastatin',
          category: 'Cardiovascular',
          manufacturer: 'CardioPharm',
          stock: 12,
          price: 22.99,
          minStock: 20,
          expiryDate: '2025-10-05',
          sku: 'ATR-40-505',
          description: '40mg tablets, box of 28',
          lastUpdated: '2025-05-09',
          image: '/api/placeholder/60/60'
        }
      ];

      setInventory(mockData);
      setLoading(false);

      // Calculate inventory stats
      setStats({
        totalItems: mockData.length,
        lowStock: mockData.filter(item => item.stock > 0 && item.stock < item.minStock).length,
        outOfStock: mockData.filter(item => item.stock === 0).length,
        recentlyAdded: mockData.filter(item => {
          const lastUpdated = new Date(item.lastUpdated);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return lastUpdated > weekAgo;
        }).length,
        expiringItems: mockData.filter(item => {
          const expiry = new Date(item.expiryDate);
          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
          return expiry < threeMonthsLater;
        }).length
      });
    }, 1000);
  }, []);

  // Function to handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Function to handle filtering
  const getFilteredInventory = () => {
    return inventory
      .filter(item => {
        // Search term filter
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.sku.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchesCategory = filterCategory === 'all' ||
                               item.category === filterCategory;

        // Stock status filter
        let matchesStock = true;
        if (filterStock === 'low') {
          matchesStock = item.stock > 0 && item.stock < item.minStock;
        } else if (filterStock === 'out') {
          matchesStock = item.stock === 0;
        } else if (filterStock === 'available') {
          matchesStock = item.stock > 0;
        }

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        // Handle sorting
        if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === 'price') {
          return sortOrder === 'asc'
            ? a.price - b.price
            : b.price - a.price;
        } else if (sortBy === 'stock') {
          return sortOrder === 'asc'
            ? a.stock - b.stock
            : b.stock - a.stock;
        } else if (sortBy === 'expiry') {
          return sortOrder === 'asc'
            ? new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
            : new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
        }
        return 0;
      });
  };

  // Function to delete a drug
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this item from inventory?')) {
      setInventory(inventory.filter(item => item.id !== id));
      showAlert('Item removed successfully', 'success');
    }
  };

  // Function to show alert
  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Function to add a new drug
  const handleAddDrug = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mock adding a drug (in real app, this would send data to an API)
    const newDrug: InventoryItem = {
      id: inventory.length + 1,
      name: (e.target as any).drugName.value,
      category: (e.target as any).category.value,
      manufacturer: (e.target as any).manufacturer.value,
      stock: parseInt((e.target as any).stock.value, 10),
      price: parseFloat((e.target as any).price.value),
      minStock: parseInt((e.target as any).minStock.value, 10),
      expiryDate: (e.target as any).expiryDate.value,
      sku: (e.target as any).sku.value,
      description: (e.target as any).description.value,
      lastUpdated: new Date().toISOString().split('T')[0],
      image: '/api/placeholder/60/60'
    };

    setInventory([...inventory, newDrug]);
    setShowAddModal(false);
    showAlert('New drug added to inventory', 'success');

    // Update stats
    setStats({
      ...stats,
      totalItems: stats.totalItems + 1,
      recentlyAdded: stats.recentlyAdded + 1
    });
  };

  // Function to edit a drug
  const handleEditDrug = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentDrug) return;

    const updatedDrug: InventoryItem = {
      ...currentDrug,
      name: (e.target as any).drugName.value,
      category: (e.target as any).category.value,
      manufacturer: (e.target as any).manufacturer.value,
      stock: parseInt((e.target as any).stock.value, 10),
      price: parseFloat((e.target as any).price.value),
      minStock: parseInt((e.target as any).minStock.value, 10),
      expiryDate: (e.target as any).expiryDate.value,
      sku: (e.target as any).sku.value,
      description: (e.target as any).description.value,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setInventory(inventory.map(item =>
      item.id === currentDrug.id ? updatedDrug : item
    ));

    setShowEditModal(false);
    showAlert('Drug information updated', 'success');
  };

  // Function to edit a drug (open modal with current data)
  const openEditModal = (drug: InventoryItem) => {
    setCurrentDrug(drug);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <nav className="bg-indigo-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">MedInventory Pro</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, Sunshine Pharmacy</span>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              SP
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-600">Manage your pharmacy's drug inventory</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Drug
            </button>
          </div>
        </div>

        {/* Alert message */}
        {alertMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            alertMessage.type === 'success' ? 'bg-green-100 text-green-800' :
            alertMessage.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          } flex items-center`}>
            {alertMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : alertMessage.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 mr-2" />
            ) : (
              <RefreshCw className="w-5 h-5 mr-2" />
            )}
            {alertMessage.message}
          </div>
        )}

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
            <div className="flex items-center">
              <Package className="text-indigo-500 w-10 h-10 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500">
            <div className="flex items-center">
              <AlertTriangle className="text-amber-500 w-10 h-10 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 w-10 h-10 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 w-10 h-10 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Recently Added</p>
                <p className="text-2xl font-bold">{stats.recentlyAdded}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center">
              <AlertTriangle className="text-purple-500 w-10 h-10 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-lg py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-lg py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="all">All Stock Status</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
                <option value="available">In Stock</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 py-2 px-4 rounded-lg flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <Link href="/pharmacy/analytics" className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center">
                <BarChart3 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Inventory table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading inventory data...</p>
              </div>
            </div>
          ) : getFilteredInventory().length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
              <button
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterStock('all');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center"
                        onClick={() => handleSort('name')}
                      >
                        Product
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center"
                        onClick={() => handleSort('stock')}
                      >
                        Stock
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center"
                        onClick={() => handleSort('price')}
                      >
                        Price
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center"
                        onClick={() => handleSort('expiry')}
                      >
                        Expiry Date
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredInventory().map((drug) => (
                    <tr key={drug.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full border border-gray-200"
                              src={drug.image}
                              alt={drug.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{drug.name}</div>
                            <div className="text-sm text-gray-500">{drug.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {drug.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {drug.stock === 0 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Out of stock
                          </span>
                        ) : drug.stock < drug.minStock ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Low stock ({drug.stock})
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In stock ({drug.stock})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${drug.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const expiryDate = new Date(drug.expiryDate);
                          const today = new Date();
                          const monthsLeft = (expiryDate - today) / (1000 * 60 * 60 * 24 * 30);

                          if (monthsLeft < 1) {
                            return (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                {drug.expiryDate} (Expiring soon)
                              </span>
                            );
                          } else if (monthsLeft < 3) {
                            return (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {drug.expiryDate}
                              </span>
                            );
                          } else {
                            return drug.expiryDate;
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(drug)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(drug.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">
                      {getFilteredInventory().length}
                    </span>{" "}
                    of <span className="font-medium">{getFilteredInventory().length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      1
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      2
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium">
                      3
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      8
                    </a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Drug Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Add New Drug</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleAddDrug} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                  <input
                    type="text"
                    name="drugName"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.slice(1).map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level</label>
                  <input
                    type="number"
                    name="minStock"
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add Drug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Drug Modal */}
      {showEditModal && currentDrug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Edit Drug</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleEditDrug} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                  <input
                    type="text"
                    name="drugName"
                    defaultValue={currentDrug.name}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={currentDrug.category}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.slice(1).map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    defaultValue={currentDrug.manufacturer}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    defaultValue={currentDrug.sku}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={currentDrug.stock}
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level</label>
                  <input
                    type="number"
                    name="minStock"
                    defaultValue={currentDrug.minStock}
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={currentDrug.price}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    defaultValue={currentDrug.expiryDate}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={currentDrug.description}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}