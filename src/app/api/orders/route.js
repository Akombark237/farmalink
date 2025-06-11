// Orders API - Complete order management system (Mock Data Version)
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock orders data
const MOCK_ORDERS = [
  {
    id: '1',
    user_id: '1',
    order_number: 'ORD-2024-001',
    status: 'completed',
    total_amount: 15000,
    currency: 'XAF',
    delivery_address: '123 Main St, Yaoundé',
    delivery_method: 'pickup',
    payment_status: 'paid',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    pharmacy_name: 'PHARMACIE FRANCAISE',
    pharmacy_address: '178, avenue Ahmadou AHIDJO, Yaoundé Centre ville',
    pharmacy_phone: '+237 2 22 22 14 76',
    item_count: 2
  },
  {
    id: '2',
    user_id: '1',
    order_number: 'ORD-2024-002',
    status: 'pending',
    total_amount: 8500,
    currency: 'XAF',
    delivery_address: '123 Main St, Yaoundé',
    delivery_method: 'delivery',
    payment_status: 'pending',
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-20T09:15:00Z',
    pharmacy_name: 'PHARMACIE DU CENTRE',
    pharmacy_address: 'Immeuble T Bella, BP 7061, Yaoundé',
    pharmacy_phone: '+237 22 22 11 80',
    item_count: 1
  }
];

// Helper function to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization token provided');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'pharmalink-jwt-secret-2024');
}

// GET - Fetch user's orders
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const status = searchParams.get('status');

    // Verify user authentication
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    // Filter orders by user ID and status (using mock data)
    let userOrders = MOCK_ORDERS.filter(order => order.user_id === userId);

    if (status) {
      userOrders = userOrders.filter(order => order.status === status);
    }

    // Get total count for pagination
    const total = userOrders.length;

    // Apply pagination
    const paginatedOrders = userOrders.slice(offset, offset + limit);

    // Format orders
    const orders = paginatedOrders.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      totalAmount: order.total_amount,
      currency: order.currency,
      deliveryAddress: order.delivery_address,
      deliveryMethod: order.delivery_method,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      pharmacy: {
        name: order.pharmacy_name,
        address: order.pharmacy_address,
        phone: order.pharmacy_phone
      },
      itemCount: order.item_count
    }));

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Orders GET API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      pharmacyId, 
      items, 
      deliveryAddress, 
      deliveryMethod = 'pickup',
      paymentMethod = 'cash'
    } = body;

    // Verify user authentication
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    // Validate required fields
    if (!pharmacyId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: pharmacyId, items' 
        },
        { status: 400 }
      );
    }

    // Start transaction
    const result = await Database.transaction(async (client) => {
      // Verify pharmacy exists and is active
      const pharmacyResult = await client.query(
        'SELECT id, name FROM pharmacy_profiles WHERE id = $1 AND status = $2',
        [pharmacyId, 'active']
      );
      
      if (pharmacyResult.rows.length === 0) {
        throw new Error('Pharmacy not found or inactive');
      }

      // Verify all medications exist and calculate total
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const { medicationId, quantity } = item;
        
        if (!medicationId || !quantity || quantity <= 0) {
          throw new Error('Invalid item: medicationId and positive quantity required');
        }

        // Check inventory
        const inventoryResult = await client.query(`
          SELECT 
            pi.unit_price, 
            pi.quantity_available, 
            pi.currency,
            m.name as medication_name
          FROM pharmacy_inventory pi
          JOIN medications m ON pi.medication_id = m.id
          WHERE pi.pharmacy_id = $1 AND pi.medication_id = $2
        `, [pharmacyId, medicationId]);

        if (inventoryResult.rows.length === 0) {
          throw new Error(`Medication ${medicationId} not available at this pharmacy`);
        }

        const inventory = inventoryResult.rows[0];
        
        if (inventory.quantity_available < quantity) {
          throw new Error(`Insufficient stock for ${inventory.medication_name}. Available: ${inventory.quantity_available}, Requested: ${quantity}`);
        }

        const itemTotal = parseFloat(inventory.unit_price) * quantity;
        totalAmount += itemTotal;

        validatedItems.push({
          medicationId,
          medicationName: inventory.medication_name,
          quantity,
          unitPrice: parseFloat(inventory.unit_price),
          totalPrice: itemTotal,
          currency: inventory.currency
        });
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order
      const orderResult = await client.query(`
        INSERT INTO orders (
          user_id, pharmacy_id, order_number, status, 
          total_amount, currency, delivery_address, 
          delivery_method, payment_method, payment_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, created_at
      `, [
        userId, pharmacyId, orderNumber, 'pending',
        totalAmount, validatedItems[0].currency, deliveryAddress,
        deliveryMethod, paymentMethod, 'pending'
      ]);

      const orderId = orderResult.rows[0].id;
      const createdAt = orderResult.rows[0].created_at;

      // Create order items
      for (const item of validatedItems) {
        await client.query(`
          INSERT INTO order_items (
            order_id, medication_id, quantity, 
            unit_price, total_price, currency
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          orderId, item.medicationId, item.quantity,
          item.unitPrice, item.totalPrice, item.currency
        ]);

        // Update inventory
        await client.query(`
          UPDATE pharmacy_inventory 
          SET quantity_available = quantity_available - $1,
              last_updated = CURRENT_TIMESTAMP
          WHERE pharmacy_id = $2 AND medication_id = $3
        `, [item.quantity, pharmacyId, item.medicationId]);
      }

      return {
        orderId,
        orderNumber,
        totalAmount,
        currency: validatedItems[0].currency,
        createdAt,
        items: validatedItems
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: result
    });

  } catch (error) {
    console.error('Orders POST API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
