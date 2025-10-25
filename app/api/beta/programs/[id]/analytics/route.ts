import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// GET /api/beta/programs/[id]/analytics - Get analytics for a beta program
export async function GET(
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

    // Get comprehensive analytics
    const analytics = await query(
      `SELECT 
        COUNT(DISTINCT bt.id) as total_testers,
        COUNT(DISTINCT CASE WHEN bt.status = 'pending' THEN bt.id END) as pending_testers,
        COUNT(DISTINCT CASE WHEN bt.status = 'approved' THEN bt.id END) as approved_testers,
        COUNT(DISTINCT CASE WHEN bt.status = 'active' THEN bt.id END) as active_testers,
        COUNT(DISTINCT CASE WHEN bt.status = 'completed' THEN bt.id END) as completed_testers,
        COUNT(DISTINCT bf.id) as total_feedback,
        COUNT(DISTINCT CASE WHEN bf.is_critical = true THEN bf.id END) as critical_feedback,
        COUNT(DISTINCT CASE WHEN bf.is_resolved = true THEN bf.id END) as resolved_feedback,
        AVG(bf.rating)::numeric(3,2) as avg_rating,
        COUNT(DISTINCT fr.id) as feature_requests,
        AVG(bt.progress)::numeric(5,2) as avg_progress,
        SUM(bt.hours_spent)::numeric(10,2) as total_hours
      FROM beta_programs bp
      LEFT JOIN beta_testers bt ON bp.id = bt.beta_program_id
      LEFT JOIN beta_feedback bf ON bp.id = bf.beta_program_id
      LEFT JOIN feature_requests fr ON bp.id = fr.beta_program_id
      WHERE bp.id = $1
      GROUP BY bp.id`,
      [id]
    );

    // Get feedback by category
    const feedbackByCategory = await query(
      `SELECT category, COUNT(*) as count
       FROM beta_feedback
       WHERE beta_program_id = $1
       GROUP BY category
       ORDER BY count DESC`,
      [id]
    );

    // Get daily activity (last 30 days)
    const dailyActivity = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as feedback_count
       FROM beta_feedback
       WHERE beta_program_id = $1
         AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics.rows[0],
        feedback_by_category: feedbackByCategory.rows,
        daily_activity: dailyActivity.rows
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

