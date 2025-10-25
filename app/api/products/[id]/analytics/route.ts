import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const products = await sql`
      SELECT p.* FROM products p
      LEFT JOIN users u ON p.maker_id = u.id
      WHERE p.id = ${id} AND u.stack_user_id = ${user.id}
    `;

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get analytics data
    const [views, clicks, bookmarks, comments, viewsByDay, topCountries] = await Promise.all([
      // Total views
      sql`SELECT COUNT(*) as count FROM product_views WHERE product_id = ${id}`,
      
      // Total clicks
      sql`SELECT COUNT(*) as count FROM product_clicks WHERE product_id = ${id}`,
      
      // Total bookmarks
      sql`SELECT COUNT(*) as count FROM bookmarks WHERE product_id = ${id}`,
      
      // Total comments
      sql`SELECT COUNT(*) as count FROM comments WHERE product_id = ${id}`,
      
      // Views by day (last 30 days)
      sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM product_views
        WHERE product_id = ${id}
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `,
      
      // Top countries
      sql`
        SELECT 
          country,
          COUNT(*) as count
        FROM product_views
        WHERE product_id = ${id} AND country IS NOT NULL
        GROUP BY country
        ORDER BY count DESC
        LIMIT 10
      `,
    ]);

    return NextResponse.json({
      views: parseInt(views[0].count),
      clicks: parseInt(clicks[0].count),
      bookmarks: parseInt(bookmarks[0].count),
      comments: parseInt(comments[0].count),
      viewsByDay,
      topCountries,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

