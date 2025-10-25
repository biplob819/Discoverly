import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

// GET /api/user/beta-programs - Get beta programs user is participating in
export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's beta test participations with stats and earnings
    const betaParticipations = await sql`
      SELECT 
        bt.*,
        bp.title as beta_title,
        bp.description as beta_description,
        bp.reward_type,
        bp.reward_value,
        bp.status as beta_status,
        bp.start_date,
        bp.end_date,
        p.name as product_name,
        p.tagline as product_tagline,
        p.logo_url as product_logo,
        p.category as product_category,
        u.username as builder_username,
        u.display_name as builder_name,
        COUNT(DISTINCT bf.id) as feedback_submitted,
        COALESCE(SUM(tp.points), 0) as total_points,
        COALESCE(SUM(CASE 
          WHEN bp.reward_type = 'cash' AND bf.id IS NOT NULL 
          THEN CAST(bp.reward_value->>'cash_prize' AS INTEGER)
          ELSE 0 
        END), 0) as cash_earned
      FROM beta_testers bt
      JOIN beta_programs bp ON bt.beta_program_id = bp.id
      JOIN products p ON bp.product_id = p.id
      JOIN users u ON bp.builder_id = u.id
      LEFT JOIN beta_feedback bf ON bt.beta_program_id = bf.beta_program_id AND bt.user_id = bf.user_id
      LEFT JOIN tester_points tp ON bt.user_id = tp.user_id AND bt.beta_program_id = tp.beta_program_id
      WHERE bt.user_id = (
        SELECT id FROM users WHERE stack_user_id = ${user.id}
      )
      GROUP BY bt.id, bp.id, p.id, u.id
      ORDER BY bt.created_at DESC
    `;

    // Calculate total rewards earned
    let totalCashEarned = 0;
    let totalPoints = 0;

    betaParticipations.forEach((participation: any) => {
      totalCashEarned += parseInt(participation.cash_earned) || 0;
      totalPoints += parseInt(participation.total_points) || 0;
    });

    return NextResponse.json({
      participations: betaParticipations,
      summary: {
        total_programs: betaParticipations.length,
        total_cash_earned: totalCashEarned,
        total_points: totalPoints,
        active_programs: betaParticipations.filter((p: any) => p.beta_status === 'active').length,
        completed_programs: betaParticipations.filter((p: any) => p.status === 'completed').length
      }
    });
  } catch (error) {
    console.error("Error fetching user beta programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch beta programs" },
      { status: 500 }
    );
  }
}
