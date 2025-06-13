'use client';

// pages/pharmacy/payments.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card, CardContent, CardDescription,
    CardHeader, CardTitle
} from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
    DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlarmClock,
    ArrowUpRight,
    Calendar,
    CheckCircle,
    ChevronDown, ChevronUp,
    CreditCard, DollarSign,
    Download,
    FileText,
    Filter,
    PieChart,
    Search,
    TrendingUp
} from 'lucide-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

// Interfaces
interface Vendor {
  id: string;
  name: string;
  logo: string;
  initials: string;
}

interface Payment {
  id: string;
  vendor: Vendor;
  amount: number;
  status: 'pending' | 'completed' | 'overdue' | 'scheduled';
  date: string;
  dueDate?: string;
  invoiceNumber: string;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'check';
}

interface PaymentAnalytics {
  totalPaid: number;
  pending: number;
  overdue: number;
  monthlyExpenses: {
    month: string;
    amount: number;
  }[];
  vendorDistribution: {
    vendor: string;
    amount: number;
  }[];
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Mock data
  useEffect(() => {
    // This would normally be an API call
    const mockVendors: Vendor[] = [
      { id: 'v1', name: 'MediPharm Supplies', logo: '/vendors/medipharm.png', initials: 'MS' },
      { id: 'v2', name: 'PharmaTech Solutions', logo: '/vendors/pharmatech.png', initials: 'PT' },
      { id: 'v3', name: 'GlobalMed Distributors', logo: '/vendors/globalmed.png', initials: 'GD' },
      { id: 'v4', name: 'BioScience Labs', logo: '/vendors/bioscience.png', initials: 'BL' },
      { id: 'v5', name: 'HealthCare Logistics', logo: '/vendors/healthcare.png', initials: 'HL' },
    ];

    const mockPayments: Payment[] = [
      {
        id: 'p1',
        vendor: mockVendors[0],
        amount: 2750.50,
        status: 'completed',
        date: '2025-05-15',
        invoiceNumber: 'INV-20250515-001',
        paymentMethod: 'bank_transfer'
      },
      {
        id: 'p2',
        vendor: mockVendors[1],
        amount: 1250.75,
        status: 'pending',
        date: '2025-05-18',
        dueDate: '2025-05-25',
        invoiceNumber: 'INV-20250518-002',
        paymentMethod: 'credit_card'
      },
      {
        id: 'p3',
        vendor: mockVendors[2],
        amount: 3500.00,
        status: 'overdue',
        date: '2025-05-10',
        dueDate: '2025-05-17',
        invoiceNumber: 'INV-20250510-003',
        paymentMethod: 'bank_transfer'
      },
      {
        id: 'p4',
        vendor: mockVendors[3],
        amount: 950.25,
        status: 'scheduled',
        date: '2025-05-30',
        invoiceNumber: 'INV-20250530-004',
        paymentMethod: 'bank_transfer'
      },
      {
        id: 'p5',
        vendor: mockVendors[4],
        amount: 1875.60,
        status: 'completed',
        date: '2025-05-12',
        invoiceNumber: 'INV-20250512-005',
        paymentMethod: 'check'
      },
      {
        id: 'p6',
        vendor: mockVendors[0],
        amount: 2100.00,
        status: 'pending',
        date: '2025-05-20',
        dueDate: '2025-05-27',
        invoiceNumber: 'INV-20250520-006',
        paymentMethod: 'credit_card'
      },
      {
        id: 'p7',
        vendor: mockVendors[2],
        amount: 1550.75,
        status: 'completed',
        date: '2025-05-14',
        invoiceNumber: 'INV-20250514-007',
        paymentMethod: 'bank_transfer'
      },
    ];

    const mockAnalytics: PaymentAnalytics = {
      totalPaid: 8176.85,
      pending: 3350.75,
      overdue: 3500.00,
      monthlyExpenses: [
        { month: 'Jan', amount: 11500 },
        { month: 'Feb', amount: 9800 },
        { month: 'Mar', amount: 12500 },
        { month: 'Apr', amount: 10200 },
        { month: 'May', amount: 15027.60 },
      ],
      vendorDistribution: [
        { vendor: 'MediPharm Supplies', amount: 4850.50 },
        { vendor: 'PharmaTech Solutions', amount: 1250.75 },
        { vendor: 'GlobalMed Distributors', amount: 5050.75 },
        { vendor: 'BioScience Labs', amount: 950.25 },
        { vendor: 'HealthCare Logistics', amount: 1875.60 },
      ]
    };

    setPayments(mockPayments);
    setAnalytics(mockAnalytics);
  }, []);

  // Filter and sort payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStatus || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Payment status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <AlarmClock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  // Payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer': return <ArrowUpRight className="h-4 w-4" />;
      case 'credit_card': return <CreditCard className="h-4 w-4" />;
      case 'check': return <FileText className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <>
      <Head>
        <title>Pharmacy Payments | Vendor Management</title>
        <meta name="description" content="Manage and track vendor payments for your pharmacy" />
      </Head>

      <div className="flex flex-col space-y-6 p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Payments</h1>
            <p className="text-gray-500 mt-1">Manage and track payments to your pharmacy suppliers</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => {}}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isNewPaymentDialogOpen} onOpenChange={setIsNewPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <DollarSign className="h-4 w-4 mr-2" />
                  New Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Payment</DialogTitle>
                  <DialogDescription>
                    Enter the details to schedule or record a new vendor payment.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Vendor</label>
                    <div className="col-span-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Vendors</SelectLabel>
                            {payments.map(payment => (
                              <SelectItem key={payment.vendor.id} value={payment.vendor.id}>
                                {payment.vendor.name}
                              </SelectItem>
                            )).filter((item, index, self) =>
                              self.findIndex(t => (t.key === item.key)) === index
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Amount</label>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input className="pl-6" placeholder="0.00" type="number" step="0.01" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Invoice #</label>
                    <div className="col-span-3">
                      <Input placeholder="INV-00000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Payment Date</label>
                    <div className="col-span-3">
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Payment Method</label>
                    <div className="col-span-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Status</label>
                    <div className="col-span-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewPaymentDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsNewPaymentDialogOpen(false)}>Save Payment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Paid (May)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{formatCurrency(analytics?.totalPaid || 0)}</div>
                <div className="ml-2 text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{formatCurrency(analytics?.pending || 0)}</div>
                <div className="ml-2 text-sm text-yellow-600 flex items-center">
                  <span>Due soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Overdue Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{formatCurrency(analytics?.overdue || 0)}</div>
                <div className="ml-2 text-sm text-red-600 flex items-center">
                  <span>Action needed</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Payment Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-blue-700">Good</div>
                <div className="w-1/2">
                  <Progress value={75} className="h-2 bg-blue-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search vendors or invoices..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {filterStatus ? `Status: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}` : "All Statuses"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                      <AlarmClock className="h-4 w-4 text-yellow-600 mr-2" />
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('overdue')}>
                      <ArrowUpRight className="h-4 w-4 text-red-600 mr-2" />
                      Overdue
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('scheduled')}>
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      Scheduled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="h-10 w-10"
                  >
                    {sortOrder === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <span className="text-sm text-gray-500">Sort by date</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full md:w-auto"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full md:w-auto"
                />
              </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={payment.vendor.logo} alt={payment.vendor.name} />
                                <AvatarFallback>{payment.vendor.initials}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium text-gray-900">{payment.vendor.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.invoiceNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(payment.date).toLocaleDateString()}
                              {payment.dueDate && payment.status !== 'completed' && (
                                <div className="text-xs text-gray-500">
                                  Due: {new Date(payment.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              <span className="ml-1.5">
                                {payment.paymentMethod === 'bank_transfer'
                                  ? 'Bank Transfer'
                                  : payment.paymentMethod === 'credit_card'
                                  ? 'Credit Card'
                                  : 'Check'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(payment.status)}
                              <span className={`ml-1.5 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <span className="sr-only">Open menu</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {payment.status !== 'completed' && (
                                  <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cancel Payment</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No payments found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Expenses Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Expenses</CardTitle>
                  <CardDescription>Payment trends over the past 5 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {/* This would be your actual chart component */}
                    <div className="bg-slate-50 h-full rounded-md flex items-center justify-center">
                      {/* In a real implementation, this would be replaced with a proper chart */}
                      <div className="text-center text-gray-500">
                        <PieChart className="h-6 w-6 mx-auto mb-2" />
                        <p>Monthly expense chart would render here</p>
                        <p className="text-sm">Data visualization using a chart library</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment by Vendor</CardTitle>
                  <CardDescription>Distribution of payments across vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {/* This would be your actual chart component */}
                    <div className="bg-slate-50 h-full rounded-md flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <PieChart className="h-6 w-6 mx-auto mb-2" />
                        <p>Vendor distribution chart would render here</p>
                        <p className="text-sm">Data visualization using a chart library</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}