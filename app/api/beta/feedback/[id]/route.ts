import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// PATCH /api/beta/feedback/[id] - Update feedback (for builder response)
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
    const body = await request.json();

    // Get feedback with program info
    const feedbackResult = await query(
      `SELECT bf.*, bp.builder_id, bf.user_id as feedback_user_id
       FROM beta_feedback bf
       JOIN beta_programs bp ON bf.beta_program_id = bp.id
       WHERE bf.id = $1`,
      [id]
    );

    if (feedbackResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    const feedback = feedbackResult.rows[0];

    // Check permissions: builder can respond, user can update their own
    const isBuilder = feedback.builder_id === dbUser.id;
    const isAuthor = feedback.feedback_user_id === dbUser.id;

    if (!isBuilder && !isAuthor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Builders can add response and mark as resolved
    if (isBuilder) {
      if (body.builder_response !== undefined) {
        updates.push(`builder_response = $${paramIndex}`);
        values.push(body.builder_response);
        paramIndex++;
        updates.push(`responded_at = NOW()`);
      }
      if (body.is_resolved !== undefined) {
        updates.push(`is_resolved = $${paramIndex}`);
        values.push(body.is_resolved);
        paramIndex++;
      }
    }

    // Authors can update their feedback
    if (isAuthor) {
      const editableFields = ['title', 'content', 'rating', 'screenshots'];
      for (const field of editableFields) {
        if (body[field] !== undefined) {
          updates.push(`${field} = $${paramIndex}`);
          values.push(body[field]);
          paramIndex++;
        }
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
      `UPDATE beta_feedback 
       SET ${updates.join(', ')} 
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return NextResponse.json({
      success: true,
      feedback: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}

// DELETE /api/beta/feedback/[id] - Delete feedback (author only)
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
    const feedbackResult = await query(
      'SELECT user_id FROM beta_feedback WHERE id = $1',
      [id]
    );

    if (feedbackResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    if (feedbackResult.rows[0].user_id !== dbUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await query('DELETE FROM beta_feedback WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}

