import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// GET /api/beta/stats - Get user's beta testing stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    let userId: string;

    if (user_id) {
      userId = user_id;
    } else {
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

      userId = userResult.rows[0].id;
    }

    // Get comprehensive stats
    const stats = await query(
      `SELECT 
        COUNT(DISTINCT bt.beta_program_id) as beta_tests_joined,
        COUNT(DISTINCT CASE WHEN bt.status = 'completed' THEN bt.id END) as beta_tests_completed,
        COUNT(DISTINCT bf.id) as feedback_submitted,
        COUNT(DISTINCT CASE WHEN bf.is_critical = true THEN bf.id END) as critical_bugs_found,
        COUNT(DISTINCT fv.id) as feature_votes,
        COALESCE(SUM(tp.points), 0) as total_points,
        COUNT(DISTINCT br.id) FILTER (WHERE br.status = 'claimed') as rewards_claimed,
        AVG(bf.rating)::numeric(3,2) as avg_rating_given
      FROM users u
      LEFT JOIN beta_testers bt ON u.id = bt.user_id
      LEFT JOIN beta_feedback bf ON u.id = bf.user_id
      LEFT JOIN feature_votes fv ON u.id = fv.user_id
      LEFT JOIN tester_points tp ON u.id = tp.user_id
      LEFT JOIN beta_rewards br ON u.id = br.user_id
      WHERE u.id = $1
      GROUP BY u.id`,
      [userId]
    );

    // Get recent activity
    const recentActivity = await query(
      `SELECT 
        action_type,
        points,
        description,
        created_at
      FROM tester_points
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10`,
      [userId]
    );

    // Get leaderboard rank
    const rankResult = await query(
      `SELECT 
        COUNT(*) + 1 as rank
      FROM tester_leaderboard
      WHERE total_points > (
        SELECT COALESCE(total_points, 0)
        FROM tester_leaderboard
        WHERE user_id = $1
      )`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      stats: stats.rows[0],
      recent_activity: recentActivity.rows,
      rank: rankResult.rows[0]?.rank || null
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

