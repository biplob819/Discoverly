import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// GET /api/beta/rewards - Get user's rewards
export async function GET(request: NextRequest) {
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

    const result = await query(
      `SELECT 
        br.*,
        bp.title as program_title,
        p.name as product_name,
        p.logo_url as product_logo
      FROM beta_rewards br
      JOIN beta_programs bp ON br.beta_program_id = bp.id
      JOIN products p ON bp.product_id = p.id
      WHERE br.user_id = $1
      ORDER BY br.created_at DESC`,
      [dbUser.id]
    );

    return NextResponse.json({
      success: true,
      rewards: result.rows
    });

  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

// POST /api/beta/rewards - Create/claim reward (builder creates, user claims)
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
    const body = await request.json();
    const { beta_tester_id, beta_program_id, reward_type, reward_details, expires_at } = body;

    // Only builders can create rewards for their programs
    if (dbUser.role === 'builder' || dbUser.role === 'admin') {
      // Verify ownership of beta program
      const programResult = await query(
        'SELECT builder_id FROM beta_programs WHERE id = $1',
        [beta_program_id]
      );

      if (programResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Beta program not found' },
          { status: 404 }
        );
      }

      if (programResult.rows[0].builder_id !== dbUser.id && dbUser.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      // Get tester's user_id
      const testerResult = await query(
        'SELECT user_id FROM beta_testers WHERE id = $1',
        [beta_tester_id]
      );

      if (testerResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Beta tester not found' },
          { status: 404 }
        );
      }

      const testerUserId = testerResult.rows[0].user_id;

      // Create reward
      const result = await query(
        `INSERT INTO beta_rewards (
          beta_tester_id, beta_program_id, user_id, 
          reward_type, reward_details, expires_at, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          beta_tester_id,
          beta_program_id,
          testerUserId,
          reward_type,
          JSON.stringify(reward_details),
          expires_at,
          'pending'
        ]
      );

      return NextResponse.json({
        success: true,
        reward: result.rows[0]
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 403 }
    );

  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create reward' },
      { status: 500 }
    );
  }
}

