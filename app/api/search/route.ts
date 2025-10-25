import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const searchTerm = `%${query.toLowerCase()}%`;

    const products = await sql`
      SELECT 
        p.*,
        u.username,
        u.display_name,
        u.avatar_url,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT b.id) as bookmark_count,
        COUNT(DISTINCT pv.id) as view_count
      FROM products p
      LEFT JOIN users u ON p.maker_id = u.id
      LEFT JOIN comments c ON p.id = c.product_id
      LEFT JOIN bookmarks b ON p.id = b.product_id
      LEFT JOIN product_views pv ON p.id = pv.product_id
      WHERE p.status = 'live'
        AND (
          LOWER(p.name) LIKE ${searchTerm}
          OR LOWER(p.tagline) LIKE ${searchTerm}
          OR LOWER(p.description) LIKE ${searchTerm}
          OR LOWER(p.category) LIKE ${searchTerm}
          OR EXISTS (
            SELECT 1 FROM unnest(p.tags) tag
            WHERE LOWER(tag) LIKE ${searchTerm}
          )
        )
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `;

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}

