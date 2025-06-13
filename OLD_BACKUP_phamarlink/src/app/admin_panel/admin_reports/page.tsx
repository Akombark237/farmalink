'use client'; 
import {
    AlertTriangle,
    Bug,
    Building2,
    CheckCircle,
    Clock,
    Download,
    Eye,
    Filter,
    Flag,
    MessageSquare,
    MoreVertical,
    RefreshCw,
    Search,
    Shield,
    TrendingDown,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [reportFilter, setReportFilter] = useState('all');

  // Mock data for charts
  const reportsOverTime = [
    { date: '2024-05-17', feedback: 12, technical: 8, misuse: 3 },
    { date: '2024-05-18', feedback: 15, technical: 6, misuse: 5 },
    { date: '2024-05-19', feedback: 9, technical: 12, misuse: 2 },
    { date: '2024-05-20', feedback: 18, technical: 4, misuse: 7 },
    { date: '2024-05-21', feedback: 22, technical: 9, misuse: 4 },
    { date: '2024-05-22', feedback: 16, technical: 11, misuse: 6 },
    { date: '2024-05-23', feedback: 20, technical: 7, misuse: 3 }
  ];

  const reportTypes = [
    { name: 'User Feedback', value: 112, color: '#3B82F6' },
    { name: 'Technical Issues', value: 57, color: '#EF4444' },
    { name: 'Misuse Reports', value: 30, color: '#F59E0B' },
    { name: 'Content Violations', value: 18, color: '#8B5CF6' }
  ];

  const priorityData = [
    { priority: 'Critical', count: 23, color: '#DC2626' },
    { priority: 'High', count: 45, color: '#EA580C' },
    { priority: 'Medium', count: 89, color: '#CA8A04' },
    { priority: 'Low', count: 60, color: '#16A34A' }
  ];

  // Mock reports data
  const reports = [
    {
      id: 1,
      type: 'feedback',
      title: 'App crashes when searching for specific drugs',
      description: 'Multiple users reported app crashes when searching for insulin products',
      reporter: 'john.doe@email.com',
      reporterType: 'Patient',
      priority: 'Critical',
      status: 'In Progress',
      createdAt: '2024-05-23T10:30:00Z',
      assignedTo: 'Tech Team',
      category: 'Technical Issue',
      tags: ['crash', 'search', 'insulin']
    },
    {
      id: 2,
      type: 'misuse',
      title: 'Suspicious bulk ordering activity',
      description: 'PharmaCare Plus has been flagged for unusual ordering patterns of controlled substances',
      reporter: 'system.monitor@platform.com',
      reporterType: 'System',
      priority: 'High',
      status: 'Under Review',
      createdAt: '2024-05-23T09:15:00Z',
      assignedTo: 'Compliance Team',
      category: 'Misuse Report',
      tags: ['bulk-order', 'controlled-substances', 'suspicious']
    },
    {
      id: 3,
      type: 'feedback',
      title: 'Delivery tracking not updating',
      description: 'Order #12345 delivery status stuck at "Processing" for 3 days',
      reporter: 'sarah.wilson@email.com',
      reporterType: 'Patient',
      priority: 'Medium',
      status: 'Resolved',
      createdAt: '2024-05-22T16:45:00Z',
      assignedTo: 'Operations Team',
      category: 'User Feedback',
      tags: ['delivery', 'tracking', 'order-status']
    },
    {
      id: 4,
      type: 'technical',
      title: 'Payment gateway timeout issues',
      description: 'Increased timeout errors during peak hours affecting checkout process',
      reporter: 'monitor.system@platform.com',
      reporterType: 'System',
      priority: 'High',
      status: 'Open',
      createdAt: '2024-05-22T14:20:00Z',
      assignedTo: 'DevOps Team',
      category: 'Technical Issue',
      tags: ['payment', 'timeout', 'checkout']
    },
    {
      id: 5,
      type: 'content',
      title: 'Inappropriate pharmacy review content',
      description: 'Review contains offensive language and false medical claims',
      reporter: 'community.mod@platform.com',
      reporterType: 'Moderator',
      priority: 'Medium',
      status: 'Resolved',
      createdAt: '2024-05-21T11:30:00Z',
      assignedTo: 'Content Team',
      category: 'Content Violation',
      tags: ['review', 'inappropriate', 'medical-claims']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-50 border-red-200';
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Under Review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Resolved': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-700 bg-red-100';
      case 'High': return 'text-orange-700 bg-orange-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feedback': return <MessageSquare className="w-4 h-4" />;
      case 'technical': return <Bug className="w-4 h-4" />;
      case 'misuse': return <Shield className="w-4 h-4" />;
      case 'content': return <Flag className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: {
    title: string;
    value: string | number;
    change: number | string;
    icon: any;
    trend: 'up' | 'down';
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Reports Dashboard
              </h1>
              <div className="hidden sm:flex items-center space-x-2 bg-white/60 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'overview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'details'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Report Details
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button className="bg-white/80 border border-gray-200 rounded-lg p-2 hover:bg-white transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2 inline" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Reports"
                value="217"
                change="+12.5%"
                trend="up"
                icon={AlertTriangle}
              />
              <StatCard
                title="Open Issues"
                value="68"
                change="-8.2%"
                trend="down"
                icon={Clock}
              />
              <StatCard
                title="Resolved This Week"
                value="45"
                change="+22.1%"
                trend="up"
                icon={CheckCircle}
              />
              <StatCard
                title="Average Resolution"
                value="2.4 days"
                change="-15.3%"
                trend="down"
                icon={TrendingUp}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reports Over Time */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Reports Trend</h3>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Feedback</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Technical</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Misuse</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="feedback" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="technical" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="misuse" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Report Types Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Distribution</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {reportTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {reportTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                        <span className="text-sm font-medium text-gray-700">{type.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{type.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Priority Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Priority Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="priority" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={reportFilter}
                    onChange={(e) => setReportFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Reports</option>
                    <option value="feedback">User Feedback</option>
                    <option value="technical">Technical Issues</option>
                    <option value="misuse">Misuse Reports</option>
                    <option value="content">Content Violations</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Filter className="w-4 h-4 mr-2 inline" />
                    Filter
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Export Selected
                  </button>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {getTypeIcon(report.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 truncate">{report.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                              {report.priority}
                            </span>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{report.reporter} ({report.reporterType})</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building2 className="w-4 h-4" />
                              <span>Assigned to: {report.assignedTo}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            {report.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing 1-5 of 217 reports</p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    1
                  </button>
                  <button className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <button className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Next
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

export default AdminReportsPage;