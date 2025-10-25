import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's products with stats
    const products = await sql`
      SELECT 
        p.*,
        COUNT(DISTINCT pv.id) as view_count,
        COUNT(DISTINCT b.id) as bookmark_count,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT pc.id) as click_count
      FROM products p
      LEFT JOIN users u ON p.maker_id = u.id
      LEFT JOIN product_views pv ON p.id = pv.product_id
      LEFT JOIN bookmarks b ON p.id = b.product_id
      LEFT JOIN comments c ON p.id = c.product_id
      LEFT JOIN product_clicks pc ON p.id = pc.product_id
      WHERE u.stack_user_id = ${user.id}
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching dashboard products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

