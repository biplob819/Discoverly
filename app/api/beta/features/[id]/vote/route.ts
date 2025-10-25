import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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
    const featureResult = await query(
      'SELECT id, beta_program_id FROM feature_requests WHERE id = $1',
      [feature_request_id]
    );

    if (featureResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feature request not found' },
        { status: 404 }
      );
    }

    const feature = featureResult.rows[0];

    // Start transaction
    await query('BEGIN');

    try {
      // Check for existing vote
      const existingVote = await query(
        'SELECT id, vote_type FROM feature_votes WHERE feature_request_id = $1 AND user_id = $2',
        [feature_request_id, dbUser.id]
      );

      if (existingVote.rows.length > 0) {
        const currentVote = existingVote.rows[0];
        
        if (currentVote.vote_type === vote_type) {
          // Remove vote (toggle off)
          await query(
            'DELETE FROM feature_votes WHERE id = $1',
            [currentVote.id]
          );
          
          await query('COMMIT');
          
          return NextResponse.json({
            success: true,
            action: 'removed',
            message: 'Vote removed'
          });
        } else {
          // Change vote
          await query(
            'UPDATE feature_votes SET vote_type = $1 WHERE id = $2',
            [vote_type, currentVote.id]
          );
          
          await query('COMMIT');
          
          return NextResponse.json({
            success: true,
            action: 'changed',
            message: 'Vote changed'
          });
        }
      } else {
        // New vote
        await query(
          'INSERT INTO feature_votes (feature_request_id, user_id, vote_type) VALUES ($1, $2, $3)',
          [feature_request_id, dbUser.id, vote_type]
        );

        // Award points for voting
        await query(
          `INSERT INTO tester_points (user_id, beta_program_id, action_type, points, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            dbUser.id,
            feature.beta_program_id,
            'feature_vote',
            POINTS_REWARDS.FEATURE_VOTE,
            'Voted on a feature request'
          ]
        );

        await query('COMMIT');

        return NextResponse.json({
          success: true,
          action: 'added',
          message: 'Vote recorded',
          points_earned: POINTS_REWARDS.FEATURE_VOTE
        });
      }

    } catch (error) {
      await query('ROLLBACK');
      throw error;
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

    const userResult = await query(
      'SELECT id FROM users WHERE stack_user_id = $1',
      [user.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: true,
        vote: null
      });
    }

    const dbUser = userResult.rows[0];
    const { id: feature_request_id } = await params;

    const result = await query(
      'SELECT vote_type FROM feature_votes WHERE feature_request_id = $1 AND user_id = $2',
      [feature_request_id, dbUser.id]
    );

    return NextResponse.json({
      success: true,
      vote: result.rows[0]?.vote_type || null
    });

  } catch (error) {
    console.error('Error fetching vote:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vote' },
      { status: 500 }
    );
  }
}

