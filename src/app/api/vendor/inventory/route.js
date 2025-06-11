// Vendor Inventory Management API
import { NextResponse } from 'next/server';
import Database from '../../../../../lib/database.js';
import { authenticateRequest, authorizeRole, validateRequired } from '../../../../middleware/auth.js';

// GET - Fetch pharmacy inventory
export async function GET(request) {
  try {
    // Authenticate and authorize pharmacy vendor
    const decoded = authenticateRequest(request);
    authorizeRole(decoded, ['pharmacy', 'admin']);
    
    const pharmacyId = decoded.pharmacyId;

    if (!pharmacyId) {
      return NextResponse.json(
        { success: false, error: 'No pharmacy associated with this account' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const stockStatus = searchParams.get('stockStatus'); // 'inStock', 'lowStock', 'outOfStock'
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    // Build the query
    let query = `
      SELECT 
        pi.id as inventory_id,
        pi.quantity_available,
        pi.unit_price,
        pi.currency,
        pi.last_updated,
        m.id as medication_id,
        m.name as medication_name,
        m.description,
        m.dosage_form,
        m.strength,
        m.manufacturer,
        m.requires_prescription,
        mc.name as category,
        mc.id as category_id
      FROM pharmacy_inventory pi
      JOIN medications m ON pi.medication_id = m.id
      JOIN medication_categories mc ON m.category_id = mc.id
      WHERE pi.pharmacy_id = $1
    `;
    
    const queryParams = [pharmacyId];
    let paramIndex = 2;

    // Apply search filter
    if (search) {
      query += ` AND LOWER(m.name) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Apply category filter
    if (category) {
      query += ` AND LOWER(mc.name) = LOWER($${paramIndex})`;
      queryParams.push(category);
      paramIndex++;
    }

    // Apply stock status filter
    if (stockStatus) {
      switch (stockStatus) {
        case 'inStock':
          query += ` AND pi.quantity_available > 10`;
          break;
        case 'lowStock':
          query += ` AND pi.quantity_available > 0 AND pi.quantity_available <= 10`;
          break;
        case 'outOfStock':
          query += ` AND pi.quantity_available = 0`;
          break;
      }
    }

    // Add ordering and pagination
    query += ` ORDER BY m.name ASC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await Database.query(query, queryParams);
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM pharmacy_inventory pi
      JOIN medications m ON pi.medication_id = m.id
      JOIN medication_categories mc ON m.category_id = mc.id
      WHERE pi.pharmacy_id = $1
    `;
    
    const countParams = [pharmacyId];
    let countParamIndex = 2;
    
    if (search) {
      countQuery += ` AND LOWER(m.name) LIKE LOWER($${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    if (category) {
      countQuery += ` AND LOWER(mc.name) = LOWER($${countParamIndex})`;
      countParams.push(category);
      countParamIndex++;
    }
    
    if (stockStatus) {
      switch (stockStatus) {
        case 'inStock':
          countQuery += ` AND pi.quantity_available > 10`;
          break;
        case 'lowStock':
          countQuery += ` AND pi.quantity_available > 0 AND pi.quantity_available <= 10`;
          break;
        case 'outOfStock':
          countQuery += ` AND pi.quantity_available = 0`;
          break;
      }
    }
    
    const countResult = await Database.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Format inventory data
    const inventory = result.rows.map(row => ({
      inventoryId: row.inventory_id,
      medication: {
        id: row.medication_id,
        name: row.medication_name,
        description: row.description,
        dosageForm: row.dosage_form,
        strength: row.strength,
        manufacturer: row.manufacturer,
        requiresPrescription: row.requires_prescription,
        category: row.category,
        categoryId: row.category_id
      },
      quantityAvailable: row.quantity_available,
      unitPrice: parseFloat(row.unit_price),
      currency: row.currency,
      lastUpdated: row.last_updated,
      stockStatus: row.quantity_available === 0 ? 'outOfStock' : 
                   row.quantity_available <= 10 ? 'lowStock' : 'inStock'
    }));

    return NextResponse.json({
      success: true,
      data: inventory,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit)
      },
      meta: {
        searchTerm: search,
        category,
        stockStatus,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Inventory GET API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch inventory',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Add new medication to inventory
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Authenticate and authorize pharmacy vendor
    const decoded = authenticateRequest(request);
    authorizeRole(decoded, ['pharmacy', 'admin']);
    
    const pharmacyId = decoded.pharmacyId;

    if (!pharmacyId) {
      return NextResponse.json(
        { success: false, error: 'No pharmacy associated with this account' },
        { status: 400 }
      );
    }

    const { medicationId, quantity, unitPrice, currency = 'XAF' } = body;

    // Validate required fields
    validateRequired(body, ['medicationId', 'quantity', 'unitPrice']);

    if (quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    if (unitPrice < 0) {
      return NextResponse.json(
        { success: false, error: 'Unit price cannot be negative' },
        { status: 400 }
      );
    }

    // Check if medication exists
    const medicationResult = await Database.query(
      'SELECT id, name FROM medications WHERE id = $1',
      [medicationId]
    );

    if (medicationResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Medication not found' },
        { status: 404 }
      );
    }

    const medication = medicationResult.rows[0];

    // Insert or update inventory
    const inventoryResult = await Database.query(`
      INSERT INTO pharmacy_inventory (
        pharmacy_id, medication_id, quantity_available, 
        unit_price, currency, last_updated
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (pharmacy_id, medication_id) 
      DO UPDATE SET
        quantity_available = EXCLUDED.quantity_available,
        unit_price = EXCLUDED.unit_price,
        currency = EXCLUDED.currency,
        last_updated = CURRENT_TIMESTAMP
      RETURNING id, quantity_available, unit_price, last_updated
    `, [pharmacyId, medicationId, quantity, unitPrice, currency]);

    const inventory = inventoryResult.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Inventory updated successfully',
      data: {
        inventoryId: inventory.id,
        medication: {
          id: medicationId,
          name: medication.name
        },
        quantityAvailable: inventory.quantity_available,
        unitPrice: parseFloat(inventory.unit_price),
        currency: currency,
        lastUpdated: inventory.last_updated
      }
    });

  } catch (error) {
    console.error('Inventory POST API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add/update inventory',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update inventory quantities (bulk update)
export async function PUT(request) {
  try {
    const body = await request.json();
    
    // Authenticate and authorize pharmacy vendor
    const decoded = authenticateRequest(request);
    authorizeRole(decoded, ['pharmacy', 'admin']);
    
    const pharmacyId = decoded.pharmacyId;

    if (!pharmacyId) {
      return NextResponse.json(
        { success: false, error: 'No pharmacy associated with this account' },
        { status: 400 }
      );
    }

    const { updates } = body;

    // Validate input
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Updates array is required' },
        { status: 400 }
      );
    }

    // Validate each update
    for (const update of updates) {
      validateRequired(update, ['inventoryId']);
      
      if (update.quantity !== undefined && update.quantity < 0) {
        return NextResponse.json(
          { success: false, error: 'Quantity cannot be negative' },
          { status: 400 }
        );
      }
      
      if (update.unitPrice !== undefined && update.unitPrice < 0) {
        return NextResponse.json(
          { success: false, error: 'Unit price cannot be negative' },
          { status: 400 }
        );
      }
    }

    // Perform bulk update in transaction
    const results = await Database.transaction(async (client) => {
      const updateResults = [];

      for (const update of updates) {
        const { inventoryId, quantity, unitPrice } = update;

        // Build dynamic update query
        const setParts = [];
        const params = [inventoryId, pharmacyId];
        let paramIndex = 3;

        if (quantity !== undefined) {
          setParts.push(`quantity_available = $${paramIndex}`);
          params.push(quantity);
          paramIndex++;
        }

        if (unitPrice !== undefined) {
          setParts.push(`unit_price = $${paramIndex}`);
          params.push(unitPrice);
          paramIndex++;
        }

        if (setParts.length === 0) {
          continue; // Skip if no updates
        }

        setParts.push('last_updated = CURRENT_TIMESTAMP');

        const updateQuery = `
          UPDATE pharmacy_inventory 
          SET ${setParts.join(', ')}
          WHERE id = $1 AND pharmacy_id = $2
          RETURNING id, quantity_available, unit_price, last_updated
        `;

        const result = await client.query(updateQuery, params);
        
        if (result.rows.length > 0) {
          updateResults.push({
            inventoryId: result.rows[0].id,
            quantityAvailable: result.rows[0].quantity_available,
            unitPrice: parseFloat(result.rows[0].unit_price),
            lastUpdated: result.rows[0].last_updated
          });
        }
      }

      return updateResults;
    });

    return NextResponse.json({
      success: true,
      message: `${results.length} inventory items updated successfully`,
      data: results
    });

  } catch (error) {
    console.error('Inventory PUT API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update inventory',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
