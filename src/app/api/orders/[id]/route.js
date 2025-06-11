// Individual Order API - Get, update, and cancel specific orders
import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database.js';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization token provided');
  }
  
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

// GET - Fetch specific order details
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Verify user authentication
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    // Get order details
    const orderQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.total_amount,
        o.currency,
        o.delivery_address,
        o.delivery_method,
        o.payment_method,
        o.payment_status,
        o.created_at,
        o.updated_at,
        o.notes,
        p.id as pharmacy_id,
        p.name as pharmacy_name,
        p.address as pharmacy_address,
        p.phone as pharmacy_phone,
        p.email as pharmacy_email,
        p.latitude,
        p.longitude
      FROM orders o
      JOIN pharmacy_profiles p ON o.pharmacy_id = p.id
      WHERE o.id = $1 AND o.user_id = $2
    `;

    const orderResult = await Database.query(orderQuery, [id, userId]);
    
    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsQuery = `
      SELECT 
        oi.id,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        oi.currency,
        m.id as medication_id,
        m.name as medication_name,
        m.description,
        m.dosage_form,
        m.strength,
        mc.name as category
      FROM order_items oi
      JOIN medications m ON oi.medication_id = m.id
      JOIN medication_categories mc ON m.category_id = mc.id
      WHERE oi.order_id = $1
      ORDER BY m.name
    `;

    const itemsResult = await Database.query(itemsQuery, [id]);

    // Format response
    const orderDetails = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      totalAmount: parseFloat(order.total_amount),
      currency: order.currency,
      deliveryAddress: order.delivery_address,
      deliveryMethod: order.delivery_method,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      notes: order.notes,
      pharmacy: {
        id: order.pharmacy_id,
        name: order.pharmacy_name,
        address: order.pharmacy_address,
        phone: order.pharmacy_phone,
        email: order.pharmacy_email,
        location: {
          lat: parseFloat(order.latitude),
          lng: parseFloat(order.longitude)
        }
      },
      items: itemsResult.rows.map(item => ({
        id: item.id,
        medication: {
          id: item.medication_id,
          name: item.medication_name,
          description: item.description,
          dosageForm: item.dosage_form,
          strength: item.strength,
          category: item.category
        },
        quantity: item.quantity,
        unitPrice: parseFloat(item.unit_price),
        totalPrice: parseFloat(item.total_price),
        currency: item.currency
      }))
    };

    return NextResponse.json({
      success: true,
      data: orderDetails
    });

  } catch (error) {
    console.error('Order GET API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order details',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;
    
    // Verify user authentication
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Check if order exists and belongs to user
    const checkResult = await Database.query(
      'SELECT id, status FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const currentStatus = checkResult.rows[0].status;

    // Prevent certain status changes
    if (currentStatus === 'completed' || currentStatus === 'cancelled') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot modify order with status: ${currentStatus}` 
        },
        { status: 400 }
      );
    }

    // Update order
    const updateQuery = `
      UPDATE orders 
      SET status = COALESCE($1, status),
          notes = COALESCE($2, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND user_id = $4
      RETURNING id, order_number, status, updated_at
    `;

    const updateResult = await Database.query(updateQuery, [status, notes, id, userId]);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: {
        id: updateResult.rows[0].id,
        orderNumber: updateResult.rows[0].order_number,
        status: updateResult.rows[0].status,
        updatedAt: updateResult.rows[0].updated_at
      }
    });

  } catch (error) {
    console.error('Order PUT API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Cancel order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Verify user authentication
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    // Start transaction to cancel order and restore inventory
    const result = await Database.transaction(async (client) => {
      // Check if order exists and can be cancelled
      const orderResult = await client.query(
        'SELECT id, status, pharmacy_id FROM orders WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderResult.rows[0];

      if (order.status === 'completed' || order.status === 'cancelled') {
        throw new Error(`Cannot cancel order with status: ${order.status}`);
      }

      // Get order items to restore inventory
      const itemsResult = await client.query(
        'SELECT medication_id, quantity FROM order_items WHERE order_id = $1',
        [id]
      );

      // Restore inventory for each item
      for (const item of itemsResult.rows) {
        await client.query(`
          UPDATE pharmacy_inventory 
          SET quantity_available = quantity_available + $1,
              last_updated = CURRENT_TIMESTAMP
          WHERE pharmacy_id = $2 AND medication_id = $3
        `, [item.quantity, order.pharmacy_id, item.medication_id]);
      }

      // Update order status to cancelled
      await client.query(
        'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['cancelled', id]
      );

      return { orderId: id, itemsRestored: itemsResult.rows.length };
    });

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      data: result
    });

  } catch (error) {
    console.error('Order DELETE API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cancel order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
