import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';
import { POINTS_REWARDS } from '@/lib/constants';

// POST /api/beta/feedback - Submit feedback for a beta test
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
      category,
      rating,
      title,
      content,
      screenshots = [],
      is_critical = false
    } = body;

    // Validate required fields
    if (!beta_program_id || !product_id || !category || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user is a beta tester for this program
    const testerResult = await query(
      `SELECT id FROM beta_testers 
       WHERE user_id = $1 AND beta_program_id = $2 AND status IN ('approved', 'active', 'completed')`,
      [dbUser.id, beta_program_id]
    );

    if (testerResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'You are not an approved tester for this program' },
        { status: 403 }
      );
    }

    const betaTester = testerResult.rows[0];

    // Start transaction
    await query('BEGIN');

    try {
      // Insert feedback
      const feedbackResult = await query(
        `INSERT INTO beta_feedback (
          beta_tester_id, beta_program_id, user_id, product_id,
          category, rating, title, content, screenshots, is_critical
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          betaTester.id,
          beta_program_id,
          dbUser.id,
          product_id,
          category,
          rating,
          title,
          content,
          screenshots,
          is_critical
        ]
      );

      // Award points
      const points = is_critical ? POINTS_REWARDS.CRITICAL_BUG : POINTS_REWARDS.SUBMITTED_FEEDBACK;
      await query(
        `INSERT INTO tester_points (user_id, beta_program_id, action_type, points, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          dbUser.id,
          beta_program_id,
          is_critical ? 'critical_bug' : 'submitted_feedback',
          points,
          `${is_critical ? 'Critical feedback' : 'Feedback'} submitted for ${category}`
        ]
      );

      // Update tester progress
      await query(
        `UPDATE beta_testers 
         SET status = 'active', progress = LEAST(progress + 10, 100)
         WHERE id = $1`,
        [betaTester.id]
      );

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        feedback: feedbackResult.rows[0],
        points_earned: points
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

// GET /api/beta/feedback?beta_program_id=xxx - Get feedback for a beta program
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const beta_program_id = searchParams.get('beta_program_id');
    const product_id = searchParams.get('product_id');
    const category = searchParams.get('category');
    const user_id = searchParams.get('user_id');

    if (!beta_program_id && !product_id) {
      return NextResponse.json(
        { success: false, error: 'beta_program_id or product_id required' },
        { status: 400 }
      );
    }

    let sql = `
      SELECT 
        bf.*,
        u.username,
        u.display_name,
        u.avatar_url,
        bt.skillset
      FROM beta_feedback bf
      JOIN users u ON bf.user_id = u.id
      JOIN beta_testers bt ON bf.beta_tester_id = bt.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (beta_program_id) {
      sql += ` AND bf.beta_program_id = $${paramIndex}`;
      params.push(beta_program_id);
      paramIndex++;
    }

    if (product_id) {
      sql += ` AND bf.product_id = $${paramIndex}`;
      params.push(product_id);
      paramIndex++;
    }

    if (category) {
      sql += ` AND bf.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (user_id) {
      sql += ` AND bf.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    }

    sql += ` ORDER BY bf.is_critical DESC, bf.created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      feedback: result.rows
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

