import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// POST /api/beta/programs - Create a new beta program
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const userResult = await query(
      'SELECT id, role FROM users WHERE stack_user_id = $1',
      [user.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const dbUser = userResult.rows[0];
    
    // Check if user is a builder
    if (dbUser.role !== 'builder') {
      return NextResponse.json(
        { success: false, error: 'Only builders can create beta programs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      product_id,
      title,
      description,
      max_testers,
      reward_type,
      reward_value,
      requirements,
      evaluation_criteria,
      start_date,
      end_date,
      access_type,
      target_audience,
      experience_level
    } = body;

    // Validate required fields
    if (!product_id || !title || !description || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Create beta program
      const programResult = await query(
        `INSERT INTO beta_programs (
          product_id, builder_id, title, description, max_testers,
          reward_type, reward_value, requirements, evaluation_criteria,
          start_date, end_date, access_type, target_audience, experience_level,
          status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        RETURNING *`,
        [
          product_id,
          dbUser.id,
          title,
          description,
          max_testers,
          reward_type,
          JSON.stringify(reward_value),
          JSON.stringify(requirements),
          JSON.stringify(evaluation_criteria),
          start_date,
          end_date,
          access_type || 'open',
          target_audience,
          experience_level || 'all',
          'active'
        ]
      );

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        program: programResult.rows[0],
        message: 'Beta program created successfully!'
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Error creating beta program:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to create beta program' },
      { status: 500 }
    );
  }
}

// GET /api/beta/programs - Get beta programs with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const sort = searchParams.get('sort') || 'recent';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let orderBy = 'bp.created_at DESC';
    if (sort === 'popular') {
      orderBy = 'tester_count DESC, bp.created_at DESC';
    } else if (sort === 'ending_soon') {
      orderBy = 'bp.end_date ASC, bp.created_at DESC';
    }

    let categoryFilter = '';
    const params: any[] = [status, limit, offset];
    
    if (category) {
      categoryFilter = 'AND p.category = $4';
      params.push(category);
    }

    const result = await query(
      `SELECT 
        bp.id,
        bp.title,
        bp.description,
        bp.reward_type,
        bp.reward_value,
        bp.max_testers,
        bp.start_date,
        bp.end_date,
        bp.status,
        bp.created_at,
        p.name as product_name,
        p.tagline as product_tagline,
        p.logo_url as product_logo,
        p.category as product_category,
        u.username as builder_username,
        u.display_name as builder_name,
        u.avatar_url as builder_avatar,
        COUNT(bt.id) FILTER (WHERE bt.status = 'approved') as tester_count,
        COUNT(bf.id) as feedback_count,
        AVG(bf.rating) as avg_rating
       FROM beta_programs bp
       JOIN products p ON bp.product_id = p.id
       JOIN users u ON bp.builder_id = u.id
       LEFT JOIN beta_testers bt ON bp.id = bt.beta_program_id
       LEFT JOIN beta_feedback bf ON bp.id = bf.beta_program_id
       WHERE bp.status = $1 ${categoryFilter}
       GROUP BY bp.id, p.id, u.id
       ORDER BY ${orderBy}
       LIMIT $2 OFFSET $3`,
      params
    );

    return NextResponse.json({
      success: true,
      programs: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching beta programs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch beta programs' },
      { status: 500 }
    );
  }
}