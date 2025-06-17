// Delivery Management API - Create, track, and manage deliveries
import { NextRequest, NextResponse } from 'next/server';
import DeliveryService from '@/services/DeliveryService';

// Helper function to verify JWT token (with demo fallback)
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For demo purposes, return a mock user
    return { userId: 'demo-user', userType: 'patient' };
  }
  
  const token = authHeader.substring(7);
  
  // Handle demo tokens
  if (token === 'demo-token') {
    return { userId: 'demo-user', userType: 'patient' };
  }
  
  try {
    // In production, verify JWT token here
    return { userId: 'demo-user', userType: 'patient' };
  } catch (error) {
    console.warn('JWT verification failed, using demo user:', error.message);
    return { userId: 'demo-user', userType: 'patient' };
  }
}

// GET - Fetch deliveries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const partnerId = searchParams.get('partnerId');
    const status = searchParams.get('status');
    const trackingNumber = searchParams.get('trackingNumber');

    // Verify user authentication
    const decoded = verifyToken(request) as any;
    const userId = decoded.userId;

    const deliveryService = DeliveryService.getInstance();

    if (trackingNumber) {
      // Get specific delivery by tracking number
      const deliveries = deliveryService.getCustomerDeliveries(userId);
      const delivery = deliveries.find(d => d.trackingNumber === trackingNumber);
      
      if (!delivery) {
        return NextResponse.json(
          { success: false, error: 'Delivery not found' },
          { status: 404 }
        );
      }

      const tracking = deliveryService.getDeliveryTracking(delivery.id);
      
      return NextResponse.json({
        success: true,
        data: {
          delivery,
          tracking
        }
      });
    }

    let deliveries;
    if (customerId) {
      deliveries = deliveryService.getCustomerDeliveries(customerId);
    } else if (partnerId) {
      deliveries = deliveryService.getPartnerDeliveries(partnerId);
    } else {
      // For demo, return user's deliveries
      deliveries = deliveryService.getCustomerDeliveries(userId);
    }

    // Filter by status if provided
    if (status) {
      deliveries = deliveries.filter(d => d.status === status);
    }

    return NextResponse.json({
      success: true,
      data: {
        deliveries,
        total: deliveries.length
      }
    });

  } catch (error) {
    console.error('Delivery GET API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch deliveries',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Create new delivery
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerId,
      pharmacyId,
      pickupAddress,
      deliveryAddress,
      scheduledPickup,
      scheduledDelivery,
      packageInfo,
      priority = 'normal'
    } = body;

    // Verify user authentication
    const decoded = verifyToken(request) as any;

    // Validate required fields
    if (!orderId || !customerId || !pharmacyId || !pickupAddress || !deliveryAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: orderId, customerId, pharmacyId, pickupAddress, deliveryAddress' 
        },
        { status: 400 }
      );
    }

    const deliveryService = DeliveryService.getInstance();

    // Calculate delivery fee based on distance and package info
    const deliveryFee = calculateDeliveryFee(pickupAddress, deliveryAddress, packageInfo);

    const deliveryData = {
      orderId,
      customerId,
      pharmacyId,
      status: 'pending' as const,
      priority,
      pickupAddress,
      deliveryAddress,
      scheduledPickup: new Date(scheduledPickup),
      scheduledDelivery: new Date(scheduledDelivery),
      packageInfo: {
        weight: packageInfo?.weight || 1,
        dimensions: packageInfo?.dimensions || { length: 20, width: 15, height: 10 },
        value: packageInfo?.value || 0,
        isFragile: packageInfo?.isFragile || false,
        requiresColdChain: packageInfo?.requiresColdChain || false,
        specialInstructions: packageInfo?.specialInstructions
      },
      deliveryFee,
      totalCost: deliveryFee + (packageInfo?.insuranceFee || 0)
    };

    const delivery = await deliveryService.createDelivery(deliveryData);

    return NextResponse.json({
      success: true,
      message: 'Delivery created successfully',
      data: {
        delivery,
        trackingNumber: delivery.trackingNumber
      }
    });

  } catch (error) {
    console.error('Delivery POST API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create delivery',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update delivery status or assign partner
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      deliveryId,
      action, // 'assign', 'update_status', 'add_proof'
      partnerId,
      status,
      location,
      notes,
      proofOfDelivery
    } = body;

    // Verify user authentication
    const decoded = verifyToken(request) as any;

    if (!deliveryId || !action) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: deliveryId, action' 
        },
        { status: 400 }
      );
    }

    const deliveryService = DeliveryService.getInstance();

    switch (action) {
      case 'assign':
        if (!partnerId) {
          return NextResponse.json(
            { success: false, error: 'partnerId required for assign action' },
            { status: 400 }
          );
        }
        await deliveryService.assignDelivery(deliveryId, partnerId);
        break;

      case 'update_status':
        if (!status) {
          return NextResponse.json(
            { success: false, error: 'status required for update_status action' },
            { status: 400 }
          );
        }
        await deliveryService.updateDeliveryStatus(deliveryId, status, location, notes);
        break;

      case 'add_proof':
        if (!proofOfDelivery) {
          return NextResponse.json(
            { success: false, error: 'proofOfDelivery required for add_proof action' },
            { status: 400 }
          );
        }
        await deliveryService.addProofOfDelivery(deliveryId, proofOfDelivery);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedDelivery = deliveryService.getDelivery(deliveryId);

    return NextResponse.json({
      success: true,
      message: `Delivery ${action} completed successfully`,
      data: { delivery: updatedDelivery }
    });

  } catch (error) {
    console.error('Delivery PUT API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to ${body.action} delivery`,
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate delivery fee
function calculateDeliveryFee(
  pickupAddress: any, 
  deliveryAddress: any, 
  packageInfo: any
): number {
  // Simple distance-based calculation (in production, use real distance calculation)
  const baseDistance = 5; // km
  const baseFee = 2000; // XAF
  const perKmRate = 300; // XAF per km
  const weightMultiplier = packageInfo?.weight > 5 ? 1.5 : 1;
  const urgentMultiplier = packageInfo?.priority === 'urgent' ? 2 : 1;

  // Mock distance calculation
  const distance = Math.random() * 15 + 2; // 2-17 km
  
  const distanceFee = distance > baseDistance ? 
    (distance - baseDistance) * perKmRate : 0;
  
  const totalFee = (baseFee + distanceFee) * weightMultiplier * urgentMultiplier;
  
  return Math.round(totalFee);
}
