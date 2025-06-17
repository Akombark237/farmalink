// Delivery Partners API - Manage delivery partners and their assignments
import { NextRequest, NextResponse } from 'next/server';
import DeliveryService from '@/services/DeliveryService';

// GET - Fetch available delivery partners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active', 'inactive', 'busy'
    const vehicleType = searchParams.get('vehicleType');
    const location = searchParams.get('location');

    const deliveryService = DeliveryService.getInstance();
    let partners = deliveryService.getAvailablePartners();

    // Filter by status
    if (status) {
      partners = partners.filter(partner => {
        if (status === 'busy') {
          // Check if partner has active deliveries
          const activeDeliveries = deliveryService.getPartnerDeliveries(partner.id)
            .filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status));
          return activeDeliveries.length > 0;
        }
        return partner.isActive === (status === 'active');
      });
    }

    // Add current delivery count and performance metrics
    const partnersWithStats = partners.map(partner => {
      const deliveries = deliveryService.getPartnerDeliveries(partner.id);
      const activeDeliveries = deliveries.filter(d => 
        ['assigned', 'picked_up', 'in_transit'].includes(d.status)
      );
      const completedDeliveries = deliveries.filter(d => d.status === 'delivered');
      const failedDeliveries = deliveries.filter(d => d.status === 'failed');

      return {
        ...partner,
        stats: {
          activeDeliveries: activeDeliveries.length,
          completedToday: completedDeliveries.length,
          failedToday: failedDeliveries.length,
          successRate: deliveries.length > 0 ? 
            (completedDeliveries.length / deliveries.length * 100).toFixed(1) : '100.0'
        },
        availability: activeDeliveries.length === 0 ? 'available' : 
                    activeDeliveries.length < 3 ? 'busy' : 'unavailable'
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        partners: partnersWithStats,
        total: partnersWithStats.length,
        available: partnersWithStats.filter(p => p.availability === 'available').length,
        busy: partnersWithStats.filter(p => p.availability === 'busy').length
      }
    });

  } catch (error) {
    console.error('Delivery partners GET API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch delivery partners',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Assign delivery to partner or update partner status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // 'assign_delivery', 'update_status', 'update_location'
      partnerId,
      deliveryId,
      deliveryIds, // for bulk assignment
      status,
      location
    } = body;

    if (!action || !partnerId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: action, partnerId' 
        },
        { status: 400 }
      );
    }

    const deliveryService = DeliveryService.getInstance();

    switch (action) {
      case 'assign_delivery':
        if (!deliveryId) {
          return NextResponse.json(
            { success: false, error: 'deliveryId required for assign_delivery action' },
            { status: 400 }
          );
        }
        
        await deliveryService.assignDelivery(deliveryId, partnerId);
        
        return NextResponse.json({
          success: true,
          message: 'Delivery assigned successfully',
          data: {
            deliveryId,
            partnerId,
            assignedAt: new Date().toISOString()
          }
        });

      case 'assign_multiple':
        if (!deliveryIds || !Array.isArray(deliveryIds)) {
          return NextResponse.json(
            { success: false, error: 'deliveryIds array required for assign_multiple action' },
            { status: 400 }
          );
        }

        const assignments = [];
        for (const delId of deliveryIds) {
          try {
            await deliveryService.assignDelivery(delId, partnerId);
            assignments.push({ deliveryId: delId, status: 'assigned' });
          } catch (error) {
            assignments.push({ deliveryId: delId, status: 'failed', error: error.message });
          }
        }

        return NextResponse.json({
          success: true,
          message: `Assigned ${assignments.filter(a => a.status === 'assigned').length} of ${deliveryIds.length} deliveries`,
          data: { assignments }
        });

      case 'optimize_route':
        if (!deliveryIds || !Array.isArray(deliveryIds)) {
          return NextResponse.json(
            { success: false, error: 'deliveryIds array required for optimize_route action' },
            { status: 400 }
          );
        }

        const route = await deliveryService.optimizeRoute(deliveryIds);
        
        return NextResponse.json({
          success: true,
          message: 'Route optimized successfully',
          data: {
            route,
            optimizedOrder: route.optimizedOrder,
            totalDistance: route.totalDistance,
            estimatedDuration: route.estimatedDuration
          }
        });

      case 'update_location':
        if (!location) {
          return NextResponse.json(
            { success: false, error: 'location required for update_location action' },
            { status: 400 }
          );
        }

        // Mock partner location update
        console.log(`📍 Partner ${partnerId} location updated:`, location);
        
        return NextResponse.json({
          success: true,
          message: 'Partner location updated successfully',
          data: {
            partnerId,
            location,
            updatedAt: new Date().toISOString()
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Delivery partners POST API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to ${body.action}`,
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update partner information
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      partnerId,
      isActive,
      workingHours,
      vehicleInfo,
      contactInfo
    } = body;

    if (!partnerId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'partnerId is required' 
        },
        { status: 400 }
      );
    }

    // Mock partner update - in production, update database
    console.log(`👤 Partner ${partnerId} updated:`, {
      isActive,
      workingHours,
      vehicleInfo,
      contactInfo
    });

    return NextResponse.json({
      success: true,
      message: 'Partner updated successfully',
      data: {
        partnerId,
        updatedAt: new Date().toISOString(),
        changes: {
          isActive,
          workingHours,
          vehicleInfo,
          contactInfo
        }
      }
    });

  } catch (error) {
    console.error('Delivery partners PUT API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update partner',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
