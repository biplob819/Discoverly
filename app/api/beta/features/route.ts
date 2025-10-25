import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// POST /api/beta/features - Create a new feature request
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userResult = await query(
      'SELECT id FROM users WHERE stack_user_id = $1',
      [user.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const dbUser = userResult.rows[0];
    const body = await request.json();
    const {
      beta_program_id,
      product_id,
      title,
      description,
      category = 'Feature',
      priority = 'medium'
    } = body;

    // Validate required fields
    if (!beta_program_id || !product_id || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify beta program exists
    const programResult = await query(
      'SELECT id FROM beta_programs WHERE id = $1',
      [beta_program_id]
    );

    if (programResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Beta program not found' },
        { status: 404 }
      );
    }

    // Create feature request
    const result = await query(
      `INSERT INTO feature_requests (
        beta_program_id, product_id, created_by, title, 
        description, category, priority, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        beta_program_id,
        product_id,
        dbUser.id,
        title,
        description,
        category,
        priority,
        'proposed'
      ]
    );

    return NextResponse.json({
      success: true,
      feature: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating feature request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create feature request' },
      { status: 500 }
    );
  }
}

// GET /api/beta/features?beta_program_id=xxx - Get feature requests for a beta program
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const beta_program_id = searchParams.get('beta_program_id');
    const product_id = searchParams.get('product_id');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'votes'; // votes, recent, status

    if (!beta_program_id && !product_id) {
      return NextResponse.json(
        { success: false, error: 'beta_program_id or product_id required' },
        { status: 400 }
      );
    }

    let sql = `
      SELECT 
        fr.*,
        u.username as creator_username,
        u.display_name as creator_name,
        u.avatar_url as creator_avatar,
        (fr.upvotes - fr.downvotes) as score
      FROM feature_requests fr
      JOIN users u ON fr.created_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (beta_program_id) {
      sql += ` AND fr.beta_program_id = $${paramIndex}`;
      params.push(beta_program_id);
      paramIndex++;
    }

    if (product_id) {
      sql += ` AND fr.product_id = $${paramIndex}`;
      params.push(product_id);
      paramIndex++;
    }

    if (status) {
      sql += ` AND fr.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Sorting
    switch (sort) {
      case 'recent':
        sql += ` ORDER BY fr.created_at DESC`;
        break;
      case 'status':
        sql += ` ORDER BY 
          CASE fr.status 
            WHEN 'in_progress' THEN 1
            WHEN 'planned' THEN 2
            WHEN 'proposed' THEN 3
            WHEN 'shipped' THEN 4
            WHEN 'declined' THEN 5
          END,
          score DESC`;
        break;
      default: // votes
        sql += ` ORDER BY score DESC, fr.created_at DESC`;
    }

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      features: result.rows
    });

  } catch (error) {
    console.error('Error fetching feature requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feature requests' },
      { status: 500 }
    );
  }
}

