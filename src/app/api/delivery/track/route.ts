// Delivery Tracking API - Real-time tracking and location updates
import { NextRequest, NextResponse } from 'next/server';
import DeliveryService from '@/services/DeliveryService';

// GET - Track delivery by tracking number
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');
    const deliveryId = searchParams.get('deliveryId');

    if (!trackingNumber && !deliveryId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Either trackingNumber or deliveryId is required' 
        },
        { status: 400 }
      );
    }

    const deliveryService = DeliveryService.getInstance();

    let delivery;
    if (deliveryId) {
      delivery = deliveryService.getDelivery(deliveryId);
    } else {
      // Find delivery by tracking number (mock implementation)
      const allDeliveries = deliveryService.getCustomerDeliveries('demo-user');
      delivery = allDeliveries.find(d => d.trackingNumber === trackingNumber);
    }

    if (!delivery) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Delivery not found' 
        },
        { status: 404 }
      );
    }

    const trackingUpdates = deliveryService.getDeliveryTracking(delivery.id);

    // Calculate estimated delivery time based on current status
    const estimatedDelivery = calculateEstimatedDelivery(delivery, trackingUpdates);

    return NextResponse.json({
      success: true,
      data: {
        delivery: {
          id: delivery.id,
          trackingNumber: delivery.trackingNumber,
          orderId: delivery.orderId,
          status: delivery.status,
          priority: delivery.priority,
          estimatedDeliveryTime: estimatedDelivery,
          actualDeliveryTime: delivery.actualDelivery,
          deliveryAddress: delivery.deliveryAddress,
          currentLocation: delivery.currentLocation,
          proofOfDelivery: delivery.proofOfDelivery,
          partnerId: delivery.partnerId
        },
        tracking: trackingUpdates.map(update => ({
          id: update.id,
          status: update.status,
          message: update.message,
          location: update.location,
          timestamp: update.timestamp,
          photoUrl: update.photoUrl
        })),
        partner: delivery.partnerId ? getPartnerInfo(delivery.partnerId) : null
      }
    });

  } catch (error) {
    console.error('Delivery tracking API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tracking information',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Update delivery location (for delivery partners)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      deliveryId,
      location,
      status,
      message,
      photoUrl
    } = body;

    if (!deliveryId || !location) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: deliveryId, location' 
        },
        { status: 400 }
      );
    }

    const deliveryService = DeliveryService.getInstance();

    // Update delivery location and status
    if (status) {
      await deliveryService.updateDeliveryStatus(
        deliveryId, 
        status, 
        location, 
        message || `Location updated: ${status}`
      );
    }

    // Get updated delivery info
    const delivery = deliveryService.getDelivery(deliveryId);
    const trackingUpdates = deliveryService.getDeliveryTracking(deliveryId);

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        delivery,
        latestUpdate: trackingUpdates[trackingUpdates.length - 1]
      }
    });

  } catch (error) {
    console.error('Delivery location update API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update delivery location',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate estimated delivery time
function calculateEstimatedDelivery(delivery: any, trackingUpdates: any[]): Date {
  const now = new Date();
  
  switch (delivery.status) {
    case 'pending':
      // Add 2-4 hours for assignment and pickup
      return new Date(now.getTime() + (3 * 60 * 60 * 1000));
    
    case 'assigned':
      // Add 1-2 hours for pickup and delivery
      return new Date(now.getTime() + (1.5 * 60 * 60 * 1000));
    
    case 'picked_up':
      // Add 30-60 minutes for delivery
      return new Date(now.getTime() + (45 * 60 * 1000));
    
    case 'in_transit':
      // Add 15-30 minutes based on distance
      const estimatedMinutes = Math.random() * 15 + 15;
      return new Date(now.getTime() + (estimatedMinutes * 60 * 1000));
    
    case 'delivered':
      return delivery.actualDelivery || now;
    
    default:
      return new Date(now.getTime() + (2 * 60 * 60 * 1000));
  }
}

// Helper function to get partner information
function getPartnerInfo(partnerId: string) {
  // Mock partner data - in production, fetch from database
  const partners = {
    'partner_001': {
      id: 'partner_001',
      name: 'Jean-Claude Mbarga',
      phone: '+237 6XX XXX 001',
      whatsapp: '+237 6XX XXX 001',
      vehicleType: 'motorcycle',
      plateNumber: 'YA-2024-MC',
      rating: 4.8,
      currentLocation: {
        latitude: 3.8460,
        longitude: 11.5001,
        timestamp: new Date()
      }
    },
    'partner_002': {
      id: 'partner_002',
      name: 'Marie Nguema',
      phone: '+237 6XX XXX 002',
      whatsapp: '+237 6XX XXX 002',
      vehicleType: 'car',
      plateNumber: 'YA-2024-CAR',
      rating: 4.9,
      currentLocation: {
        latitude: 3.8500,
        longitude: 11.5050,
        timestamp: new Date()
      }
    },
    'partner_003': {
      id: 'partner_003',
      name: 'Express Delivery Team',
      phone: '+237 6XX XXX 100',
      vehicleType: 'van',
      plateNumber: 'YA-2024-VAN',
      rating: 4.6,
      currentLocation: {
        latitude: 3.8520,
        longitude: 11.5080,
        timestamp: new Date()
      }
    }
  };

  return partners[partnerId] || null;
}
