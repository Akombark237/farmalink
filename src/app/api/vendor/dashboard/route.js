// Vendor Dashboard API - Analytics and overview for pharmacy vendors (Mock Data Version)
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization token provided');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'pharmalink-jwt-secret-2024');
}

// Mock dashboard data
const MOCK_DASHBOARD_DATA = {
  pharmacy: {
    id: '1',
    name: 'PHARMACIE FRANCAISE',
    address: '178, avenue Ahmadou AHIDJO, Yaoundé Centre ville',
    phone: '+237 2 22 22 14 76',
    email: 'contact@pharmaciefrancaise.cm',
    rating: 4.7,
    totalReviews: 156,
    isOpenNow: true,
    status: 'active'
  },
  statistics: {
    orders: {
      total: 245,
      pending: 12,
      confirmed: 8,
      preparing: 5,
      ready: 3,
      completed: 210,
      cancelled: 7,
      totalRevenue: 8750000,
      averageOrderValue: 35714
    },
    inventory: {
      totalMedications: 156,
      inStock: 142,
      outOfStock: 8,
      lowStock: 6,
      inventoryValue: 12500000
    }
  },
  recentOrders: [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      status: 'completed',
      totalAmount: 25000,
      currency: 'XAF',
      createdAt: '2024-01-20T10:30:00Z',
      paymentStatus: 'paid',
      customer: { name: 'John Doe', phone: '+237 6 12 34 56 78' },
      itemCount: 3
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      status: 'pending',
      totalAmount: 15000,
      currency: 'XAF',
      createdAt: '2024-01-20T14:15:00Z',
      paymentStatus: 'pending',
      customer: { name: 'Marie Dubois', phone: '+237 6 98 76 54 32' },
      itemCount: 2
    }
  ],
  topMedications: [
    { name: 'Paracetamol', totalSold: 45, totalRevenue: 22500, orderCount: 23 },
    { name: 'Amoxicillin', totalSold: 28, totalRevenue: 70000, orderCount: 18 },
    { name: 'Ibuprofen', totalSold: 35, totalRevenue: 26250, orderCount: 20 }
  ],
  dailyRevenue: [
    { date: '2024-01-20', orderCount: 8, revenue: 125000 },
    { date: '2024-01-19', orderCount: 12, revenue: 180000 },
    { date: '2024-01-18', orderCount: 6, revenue: 95000 }
  ],
  lowStockAlerts: [
    { medicationName: 'Insulin', quantityAvailable: 3, unitPrice: 8500, currency: 'XAF', category: 'Diabetes' },
    { medicationName: 'Morphine', quantityAvailable: 2, unitPrice: 5500, currency: 'XAF', category: 'Pain Relief' }
  ]
};

// GET - Fetch vendor dashboard data
export async function GET(request) {
  try {
    // Authenticate and authorize pharmacy vendor
    const decoded = verifyToken(request);

    if (!['pharmacy', 'admin'].includes(decoded.userType)) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Pharmacy or admin role required.' },
        { status: 403 }
      );
    }

    const userId = decoded.userId;
    const pharmacyId = decoded.pharmacyId || '1'; // Default to pharmacy 1 for demo

    console.log('Vendor dashboard request:', { userId, pharmacyId, userType: decoded.userType });

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days')) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Use mock data for dashboard
    const dashboardData = {
      ...MOCK_DASHBOARD_DATA,
      meta: {
        dateRange: {
          start: startDate.toISOString(),
          end: new Date().toISOString(),
          days: days
        },
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Vendor Dashboard API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
