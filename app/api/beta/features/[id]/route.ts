import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';

// PATCH /api/beta/features/[id] - Update feature request (builder only for status/notes)
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

    // Get feature with program info
    const featureResult = await query(
      `SELECT fr.*, bp.builder_id
       FROM feature_requests fr
       JOIN beta_programs bp ON fr.beta_program_id = bp.id
       WHERE fr.id = $1`,
      [id]
    );

    if (featureResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feature request not found' },
        { status: 404 }
      );
    }

    const feature = featureResult.rows[0];
    const isBuilder = feature.builder_id === dbUser.id;
    const isCreator = feature.created_by === dbUser.id;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Builders can update status, priority, and notes
    if (isBuilder) {
      const builderFields = ['status', 'priority', 'builder_notes', 'estimated_date', 'shipped_date'];
      for (const field of builderFields) {
        if (body[field] !== undefined) {
          updates.push(`${field} = $${paramIndex}`);
          values.push(body[field]);
          paramIndex++;
        }
      }
    }

    // Creators can update title, description, category
    if (isCreator) {
      const creatorFields = ['title', 'description', 'category'];
      for (const field of creatorFields) {
        if (body[field] !== undefined) {
          updates.push(`${field} = $${paramIndex}`);
          values.push(body[field]);
          paramIndex++;
        }
      }
    }

    if (!isBuilder && !isCreator) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    const result = await query(
      `UPDATE feature_requests 
       SET ${updates.join(', ')} 
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return NextResponse.json({
      success: true,
      feature: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating feature request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update feature request' },
      { status: 500 }
    );
  }
}

// DELETE /api/beta/features/[id] - Delete feature request (creator only)
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
    const featureResult = await query(
      'SELECT created_by FROM feature_requests WHERE id = $1',
      [id]
    );

    if (featureResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feature request not found' },
        { status: 404 }
      );
    }

    if (featureResult.rows[0].created_by !== dbUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await query('DELETE FROM feature_requests WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Feature request deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting feature request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete feature request' },
      { status: 500 }
    );
  }
}

