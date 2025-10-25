import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stackServerApp } from '@/stack';
import { POINTS_REWARDS } from '@/lib/constants';

// POST /api/beta/join - Join a beta test program
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
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
    const body = await request.json();
    const {
      beta_program_id,
      product_id,
      skillset = [],
      device_type = 'All Devices',
      experience_level = 'intermediate'
    } = body;

    // Validate required fields
    if (!beta_program_id || !product_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if beta program exists and is active
    const programResult = await query(
      `SELECT bp.*, 
        COUNT(bt.id) FILTER (WHERE bt.status = 'approved') as current_testers
       FROM beta_programs bp
       LEFT JOIN beta_testers bt ON bp.id = bt.beta_program_id
       WHERE bp.id = $1 AND bp.status = 'active'
       GROUP BY bp.id`,
      [beta_program_id]
    );

    if (programResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Beta program not found or not active' },
        { status: 404 }
      );
    }

    const program = programResult.rows[0];

    // Check if max testers limit reached
    if (program.max_testers && program.current_testers >= program.max_testers) {
      return NextResponse.json(
        { success: false, error: 'Beta program is full' },
        { status: 400 }
      );
    }

    // Check if user already joined
    const existingTester = await query(
      'SELECT id FROM beta_testers WHERE user_id = $1 AND beta_program_id = $2',
      [dbUser.id, beta_program_id]
    );

    if (existingTester.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'You have already joined this beta program' },
        { status: 409 }
      );
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Create beta tester entry
      const testerResult = await query(
        `INSERT INTO beta_testers (
          user_id, beta_program_id, product_id, skillset, 
          device_type, experience_level, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          dbUser.id,
          beta_program_id,
          product_id,
          skillset,
          device_type,
          experience_level,
          program.access_type === 'open' ? 'approved' : 'pending'
        ]
      );

      // Award points for joining beta (only if auto-approved)
      if (program.access_type === 'open') {
        await query(
          `INSERT INTO tester_points (user_id, beta_program_id, action_type, points, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            dbUser.id,
            beta_program_id,
            'joined_beta',
            POINTS_REWARDS.JOINED_BETA,
            `Joined beta test for ${program.title}`
          ]
        );
      }

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        tester: testerResult.rows[0],
        message: program.access_type === 'open' 
          ? 'Successfully joined beta test!' 
          : 'Application submitted! Waiting for builder approval.'
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Error joining beta test:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'You have already joined this beta program' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to join beta test' },
      { status: 500 }
    );
  }
}

// GET /api/beta/join?user_id=xxx - Get user's beta test participations
export async function GET(request: NextRequest) {
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

    const result = await query(
      `SELECT 
        bt.*,
        bp.title as program_title,
        bp.description as program_description,
        bp.reward_type,
        bp.reward_value,
        p.name as product_name,
        p.logo_url as product_logo,
        p.tagline as product_tagline,
        u.username as builder_username,
        u.display_name as builder_name,
        COUNT(bf.id) as feedback_submitted
      FROM beta_testers bt
      JOIN beta_programs bp ON bt.beta_program_id = bp.id
      JOIN products p ON bt.product_id = p.id
      JOIN users u ON bp.builder_id = u.id
      LEFT JOIN beta_feedback bf ON bt.id = bf.beta_tester_id
      WHERE bt.user_id = $1
      GROUP BY bt.id, bp.id, p.id, u.id
      ORDER BY bt.applied_at DESC`,
      [dbUser.id]
    );

    return NextResponse.json({
      success: true,
      beta_tests: result.rows
    });

  } catch (error) {
    console.error('Error fetching beta tests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch beta tests' },
      { status: 500 }
    );
  }
}

