import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
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

    const userResult = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const dbUser = userResult[0];
    const { id } = await params;
    const body = await request.json();

    // Get feature with program info
    const featureResult = await sql`
      SELECT fr.*, bp.builder_id
      FROM feature_requests fr
      JOIN beta_programs bp ON fr.beta_program_id = bp.id
      WHERE fr.id = ${id}
    `;

    if (featureResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feature request not found' },
        { status: 404 }
      );
    }

    const feature = featureResult[0];
    const isBuilder = feature.builder_id === dbUser.id;
    const isCreator = feature.created_by === dbUser.id;

    if (!isBuilder && !isCreator) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Build update query dynamically
    const updateFields: any = {};
    
    // Builders can update status, priority, and notes
    if (isBuilder) {
      const builderFields = ['status', 'priority', 'builder_notes', 'estimated_date', 'shipped_date'];
      for (const field of builderFields) {
        if (body[field] !== undefined) {
          updateFields[field] = body[field];
        }
      }
    }

    // Creators can update title, description, category
    if (isCreator) {
      const creatorFields = ['title', 'description', 'category'];
      for (const field of creatorFields) {
        if (body[field] !== undefined) {
          updateFields[field] = body[field];
        }
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Perform selective updates based on what fields are provided
    let result;
    if (updateFields.status !== undefined) {
      result = await sql`
        UPDATE feature_requests 
        SET status = ${updateFields.status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (updateFields.title !== undefined) {
      result = await sql`
        UPDATE feature_requests 
        SET title = ${updateFields.title}, 
            description = ${updateFields.description || feature.description}, 
            category = ${updateFields.category || feature.category},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      // Update other fields
      result = await sql`
        UPDATE feature_requests 
        SET 
          priority = ${updateFields.priority || feature.priority},
          builder_notes = ${updateFields.builder_notes || feature.builder_notes},
          estimated_date = ${updateFields.estimated_date || feature.estimated_date},
          shipped_date = ${updateFields.shipped_date || feature.shipped_date},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    }

    return NextResponse.json({
      success: true,
      feature: result[0]
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

    const userResult = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const dbUser = userResult[0];
    const { id } = await params;

    // Verify ownership
    const featureResult = await sql`
      SELECT created_by FROM feature_requests WHERE id = ${id}
    `;

    if (featureResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feature request not found' },
        { status: 404 }
      );
    }

    if (featureResult[0].created_by !== dbUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await sql`DELETE FROM feature_requests WHERE id = ${id}`;

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