import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/beta/leaderboard - Get top testers leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Refresh materialized view (if needed - you can do this periodically via cron)
    // await query('REFRESH MATERIALIZED VIEW CONCURRENTLY tester_leaderboard');

    const result = await query(
      `SELECT * FROM tester_leaderboard
       ORDER BY total_points DESC, completed_tests DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Get total count
    const countResult = await query('SELECT COUNT(*) as total FROM tester_leaderboard');
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      success: true,
      leaderboard: result.rows,
      pagination: {
        limit,
        offset,
        total
      }
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

