import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// GET /api/beta/programs/[id] - Get a specific beta program
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await query(
      `SELECT 
        bp.*,
        p.name as product_name,
        p.tagline as product_tagline,
        p.description as product_description,
        p.logo_url as product_logo,
        p.cover_image_url as product_cover,
        p.website_url as product_website,
        p.category as product_category,
        p.tags as product_tags,
        u.username as builder_username,
        u.display_name as builder_name,
        u.avatar_url as builder_avatar,
        u.bio as builder_bio,
        COUNT(DISTINCT bt.id) FILTER (WHERE bt.status = 'approved') as tester_count,
        COUNT(DISTINCT bf.id) as feedback_count,
        AVG(bf.rating)::numeric(3,2) as avg_rating,
        COUNT(DISTINCT fr.id) as feature_request_count
      FROM beta_programs bp
      JOIN products p ON bp.product_id = p.id
      JOIN users u ON bp.builder_id = u.id
      LEFT JOIN beta_testers bt ON bp.id = bt.beta_program_id
      LEFT JOIN beta_feedback bf ON bp.id = bf.beta_program_id
      LEFT JOIN feature_requests fr ON bp.id = fr.beta_program_id
      WHERE bp.id = $1
      GROUP BY bp.id, p.id, u.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Beta program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      program: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching beta program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch beta program' },
      { status: 500 }
    );
  }
}

// PATCH /api/beta/programs/[id] - Update a beta program
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Verify ownership
    const programResult = await query(
      'SELECT builder_id FROM beta_programs WHERE id = $1',
      [id]
    );

    if (programResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Beta program not found' },
        { status: 404 }
      );
    }

    if (programResult.rows[0].builder_id !== dbUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = [
      'title', 'description', 'test_url', 'access_type',
      'test_credentials', 'test_instructions', 'feedback_categories',
      'reward_type', 'reward_value', 'max_testers', 'status',
      'start_date', 'end_date'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'test_credentials' || field === 'reward_value') {
          updates.push(`${field} = $${paramIndex}::jsonb`);
          values.push(JSON.stringify(body[field]));
        } else {
          updates.push(`${field} = $${paramIndex}`);
          values.push(body[field]);
        }
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    const result = await query(
      `UPDATE beta_programs 
       SET ${updates.join(', ')} 
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return NextResponse.json({
      success: true,
      program: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating beta program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update beta program' },
      { status: 500 }
    );
  }
}

// DELETE /api/beta/programs/[id] - Delete a beta program
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Verify ownership
    const programResult = await query(
      'SELECT builder_id FROM beta_programs WHERE id = $1',
      [id]
    );

    if (programResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Beta program not found' },
        { status: 404 }
      );
    }

    if (programResult.rows[0].builder_id !== dbUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await query('DELETE FROM beta_programs WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Beta program deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting beta program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete beta program' },
      { status: 500 }
    );
  }
}

