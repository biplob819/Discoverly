import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// POST /api/beta/testers/[id]/approve - Approve a beta tester
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

    // Get tester with program info
    const testerResult = await query(
      `SELECT bt.*, bp.builder_id
       FROM beta_testers bt
       JOIN beta_programs bp ON bt.beta_program_id = bp.id
       WHERE bt.id = $1`,
      [id]
    );

    if (testerResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tester not found' },
        { status: 404 }
      );
    }

    const tester = testerResult.rows[0];

    // Verify ownership
    if (tester.builder_id !== dbUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Approve tester
    const result = await query(
      `UPDATE beta_testers 
       SET status = 'approved', approved_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return NextResponse.json({
      success: true,
      tester: result.rows[0],
      message: 'Tester approved successfully'
    });

  } catch (error) {
    console.error('Error approving tester:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve tester' },
      { status: 500 }
    );
  }
}

