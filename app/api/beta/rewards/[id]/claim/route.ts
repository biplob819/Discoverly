import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// POST /api/beta/rewards/[id]/claim - Claim a reward
export async function POST(
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

    // Get reward
    const rewardResult = await query(
      'SELECT * FROM beta_rewards WHERE id = $1',
      [id]
    );

    if (rewardResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Reward not found' },
        { status: 404 }
      );
    }

    const reward = rewardResult.rows[0];

    // Verify ownership
    if (reward.user_id !== dbUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if already claimed
    if (reward.status === 'claimed') {
      return NextResponse.json(
        { success: false, error: 'Reward already claimed' },
        { status: 400 }
      );
    }

    // Check if expired
    if (reward.expires_at && new Date(reward.expires_at) < new Date()) {
      await query(
        'UPDATE beta_rewards SET status = $1 WHERE id = $2',
        ['expired', id]
      );
      
      return NextResponse.json(
        { success: false, error: 'Reward has expired' },
        { status: 400 }
      );
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Update reward status
      const result = await query(
        `UPDATE beta_rewards 
         SET status = 'claimed', claimed_at = NOW() 
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      // Update beta tester record
      await query(
        `UPDATE beta_testers 
         SET reward_claimed = TRUE, reward_claimed_at = NOW()
         WHERE id = $1`,
        [reward.beta_tester_id]
      );

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        reward: result.rows[0],
        message: 'Reward claimed successfully!'
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error claiming reward:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim reward' },
      { status: 500 }
    );
  }
}

