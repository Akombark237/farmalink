'use client';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    Eye,
    MapPin,
    Pill,
    ShoppingCart,
    Star,
    TrendingUp,
    Users,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import { formatCfa } from '@/utils/currency';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const stats = {
    totalUsers: 12547,
    activePharmacies: 324,
    totalDrugs: 8964,
    todayOrders: 189,
    totalRevenue: 234567,
    pendingApprovals: 23,
    userGrowth: 12.5,
    revenueGrowth: 8.3
  };

  const recentOrders = [
    { id: '#ORD-001', patient: 'John Doe', pharmacy: 'MedPlus Pharmacy', amount: 25000, status: 'completed', time: '2 hours ago' },
    { id: '#ORD-002', patient: 'Sarah Wilson', pharmacy: 'HealthCare Central', amount: 48500, status: 'processing', time: '4 hours ago' },
    { id: '#ORD-003', patient: 'Mike Johnson', pharmacy: 'City Pharmacy', amount: 12750, status: 'pending', time: '6 hours ago' }
  ];

  const pendingPharmacies = [
    { name: 'Green Valley Pharmacy', location: 'Downtown', submitted: '2 days ago', documents: 4 },
    { name: 'Quick Care Meds', location: 'Uptown', submitted: '1 day ago', documents: 3 },
    { name: 'Family Health Store', location: 'Suburbs', submitted: '3 hours ago', documents: 5 }
  ];

  interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    change?: number;
    changeType?: 'positive' | 'negative';
  }

  const StatCard = ({ title, value, icon: Icon, change, changeType = 'positive' }: StatCardProps) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`w-4 h-4 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ml-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {change}% from last month
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  interface OrderRowProps {
    order: {
      id: string;
      patient: string;
      pharmacy: string;
      amount: number;
      status: string;
      time: string;
    };
  }

  const OrderRow = ({ order }: OrderRowProps) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div>
            <p className="font-medium text-gray-900">{order.id}</p>
            <p className="text-sm text-gray-600">{order.patient}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 text-center">
        <p className="text-sm text-gray-900">{order.pharmacy}</p>
      </div>
      <div className="flex-1 text-center">
        <p className="font-medium text-gray-900">{formatCfa(order.amount)}</p>
      </div>
      <div className="flex-1 text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          order.status === 'completed' ? 'bg-green-100 text-green-800' :
          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {order.status}
        </span>
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm text-gray-600">{order.time}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Pharmacy Platform Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <a href="/admin_panel/admin_pharmacy" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors mb-3">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Pharmacies</span>
          </a>
          <a href="/admin_panel/admin_user" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Users</span>
          </a>
          <a href="/admin_panel/admin_drogs" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors mb-3">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Medications</span>
          </a>
          <a href="/admin_panel/admin_reports" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors mb-3">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Reports</span>
          </a>
          <a href="/admin_panel/admin_setting" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors mb-3">
              <Activity className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Settings</span>
          </a>
          <a href="/use-pages/dashboard" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors mb-3">
              <Eye className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">User View</span>
          </a>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers.toLocaleString()} 
            icon={Users} 
            change={stats.userGrowth}
          />
          <StatCard
            title="Active Pharmacies"
            value={stats.activePharmacies.toString()}
            icon={Building2}
            change={5.2}
          />
          <StatCard
            title="Total Drugs Listed"
            value={stats.totalDrugs.toLocaleString()}
            icon={Pill}
            change={3.7}
          />
          <StatCard
            title="Today's Orders"
            value={stats.todayOrders.toString()}
            icon={ShoppingCart}
            change={15.4}
          />
        </div>

        {/* Revenue and Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">{formatCfa(stats.totalRevenue * 600)}</span>
                <span className="text-sm text-green-600 font-medium">+{stats.revenueGrowth}%</span>
              </div>
            </div>
            <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600">Revenue Chart Visualization</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              <a href="/admin_panel/admin_pharmacy" className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <span className="text-sm font-medium text-gray-900">Manage Pharmacies</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {stats.pendingApprovals}
                </span>
              </a>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Active Reports</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">7</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">System Status</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'orders', 'approvals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Platform Analytics</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-gray-900">Daily Active Users</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">3,247</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-gray-900">Page Views</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">45,678</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium text-gray-900">Avg Rating</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">4.8/5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Pharmacies</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'MedPlus Pharmacy', revenue: 2850000 },
                      { name: 'HealthCare Central', revenue: 2340000 },
                      { name: 'City Pharmacy', revenue: 1890000 },
                      { name: 'Quick Meds', revenue: 1650000 }
                    ].map((pharmacy, index) => (
                      <div key={pharmacy.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900">{pharmacy.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatCfa(pharmacy.revenue)}</p>
                          <p className="text-xs text-gray-500">This month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Recent Orders</h4>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View All Orders</button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-3 text-sm font-medium text-gray-500 border-b border-gray-200">
                    <div className="flex-1">Order ID & Patient</div>
                    <div className="flex-1 text-center">Pharmacy</div>
                    <div className="flex-1 text-center">Amount</div>
                    <div className="flex-1 text-center">Status</div>
                    <div className="flex-1 text-right">Time</div>
                  </div>
                  {recentOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Pending Pharmacy Approvals</h4>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingPharmacies.length} Pending
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingPharmacies.map((pharmacy, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">{pharmacy.name}</h5>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{pharmacy.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Submitted {pharmacy.submitted}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{pharmacy.documents} documents</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

