import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (dbUsers.length === 0) {
      return NextResponse.json([]);
    }

    const userId = dbUsers[0].id;

    // Get user's bookmarks
    const bookmarks = await sql`
      SELECT 
        p.id,
        p.name,
        p.tagline,
        p.logo_url,
        p.category,
        b.created_at as bookmarked_at
      FROM bookmarks b
      JOIN products p ON b.product_id = p.id
      WHERE b.user_id = ${userId}
      ORDER BY b.created_at DESC
    `;

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

