import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's beta programs with stats
    const betaPrograms = await sql`
      SELECT 
        bp.*,
        p.name as product_name,
        p.tagline as product_tagline,
        p.logo_url as product_logo,
        p.category as product_category,
        COUNT(DISTINCT bt.id) FILTER (WHERE bt.status = 'approved') as tester_count,
        COUNT(DISTINCT bf.id) as feedback_count,
        AVG(bf.rating) as avg_rating,
        COUNT(DISTINCT btc.id) as completed_testers
      FROM beta_programs bp
      JOIN products p ON bp.product_id = p.id
      LEFT JOIN users u ON bp.builder_id = u.id
      LEFT JOIN beta_testers bt ON bp.id = bt.beta_program_id
      LEFT JOIN beta_feedback bf ON bp.id = bf.beta_program_id
      LEFT JOIN beta_testers btc ON bp.id = btc.beta_program_id AND btc.status = 'completed'
      WHERE u.stack_user_id = ${user.id}
      GROUP BY bp.id, p.id
      ORDER BY bp.created_at DESC
    `;

    return NextResponse.json(betaPrograms);
  } catch (error) {
    console.error("Error fetching dashboard beta programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch beta programs" },
      { status: 500 }
    );
  }
}
