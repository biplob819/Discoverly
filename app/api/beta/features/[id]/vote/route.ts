import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { stackServerApp } from '@/stack';
import { POINTS_REWARDS } from '@/lib/constants';

// POST /api/beta/features/[id]/vote - Vote on a feature request
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
    const { id: feature_request_id } = await params;
    const body = await request.json();
    const { vote_type } = body; // 'upvote' or 'downvote'

    if (!vote_type || !['upvote', 'downvote'].includes(vote_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vote_type' },
        { status: 400 }
      );
    }

    // Check if feature request exists
    const featureResult = await sql`
      SELECT id, beta_program_id FROM feature_requests WHERE id = ${feature_request_id}
    `;

    if (featureResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feature request not found' },
        { status: 404 }
      );
    }

    const feature = featureResult[0];

    // Check if user has already voted
    const existingVote = await sql`
      SELECT id, vote_type FROM feature_votes 
      WHERE feature_request_id = ${feature_request_id} AND user_id = ${dbUser.id}
    `;

    if (existingVote.length > 0) {
      const currentVote = existingVote[0];
      if (currentVote.vote_type === vote_type) {
        // Remove vote if clicking same type
        await sql`
          DELETE FROM feature_votes 
          WHERE feature_request_id = ${feature_request_id} AND user_id = ${dbUser.id}
        `;

        return NextResponse.json({
          success: true,
          message: 'Vote removed',
          vote: null
        });
      } else {
        // Update vote type
        await sql`
          UPDATE feature_votes 
          SET vote_type = ${vote_type}, updated_at = NOW()
          WHERE feature_request_id = ${feature_request_id} AND user_id = ${dbUser.id}
        `;

        return NextResponse.json({
          success: true,
          message: 'Vote updated',
          vote: { vote_type }
        });
      }
    } else {
      // Create new vote
      await sql`
        INSERT INTO feature_votes (feature_request_id, user_id, vote_type)
        VALUES (${feature_request_id}, ${dbUser.id}, ${vote_type})
      `;

      // Award points for voting
      try {
        await sql`
          INSERT INTO user_points (user_id, points_earned, reason, beta_program_id)
          VALUES (${dbUser.id}, ${POINTS_REWARDS.FEATURE_VOTE}, 'feature_vote', ${feature.beta_program_id})
        `;
      } catch (pointsError) {
        console.error('Error awarding vote points:', pointsError);
        // Continue even if points fail
      }

      return NextResponse.json({
        success: true,
        message: 'Vote recorded',
        vote: { vote_type }
      });
    }

  } catch (error) {
    console.error('Error voting on feature:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to vote on feature' },
      { status: 500 }
    );
  }
}

// GET /api/beta/features/[id]/vote - Get user's vote for a feature
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({
        success: true,
        vote: null
      });
    }

    const userResult = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (userResult.length === 0) {
      return NextResponse.json({
        success: true,
        vote: null
      });
    }

    const dbUser = userResult[0];
    const { id: feature_request_id } = await params;

    const voteResult = await sql`
      SELECT vote_type FROM feature_votes 
      WHERE feature_request_id = ${feature_request_id} AND user_id = ${dbUser.id}
    `;

    return NextResponse.json({
      success: true,
      vote: voteResult.length > 0 ? { vote_type: voteResult[0].vote_type } : null
    });

  } catch (error) {
    console.error('Error getting user vote:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user vote' },
      { status: 500 }
    );
  }
}