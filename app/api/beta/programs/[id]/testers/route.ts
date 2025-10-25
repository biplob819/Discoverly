import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// GET /api/beta/programs/[id]/testers - Get testers for a beta program
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

    // Get testers
    const result = await query(
      `SELECT 
        bt.*,
        u.username,
        u.display_name,
        u.avatar_url,
        COUNT(bf.id) as feedback_count
      FROM beta_testers bt
      JOIN users u ON bt.user_id = u.id
      LEFT JOIN beta_feedback bf ON bt.id = bf.beta_tester_id
      WHERE bt.beta_program_id = $1
      GROUP BY bt.id, u.id
      ORDER BY bt.applied_at DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      testers: result.rows
    });

  } catch (error) {
    console.error('Error fetching testers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testers' },
      { status: 500 }
    );
  }
}

