import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get user from database
    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = dbUsers[0].id;

    // Check if already bookmarked
    const existing = await sql`
      SELECT id FROM bookmarks 
      WHERE user_id = ${userId} AND product_id = ${id}
    `;

    if (existing.length > 0) {
      // Remove bookmark
      await sql`
        DELETE FROM bookmarks 
        WHERE user_id = ${userId} AND product_id = ${id}
      `;
      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await sql`
        INSERT INTO bookmarks (user_id, product_id)
        VALUES (${userId}, ${id})
      `;
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { error: "Failed to toggle bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get user from database
    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = dbUsers[0].id;

    // Remove bookmark
    await sql`
      DELETE FROM bookmarks 
      WHERE user_id = ${userId} AND product_id = ${id}
    `;

    return NextResponse.json({ bookmarked: false });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ bookmarked: false });
    }

    const { id } = await params;

    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (dbUsers.length === 0) {
      return NextResponse.json({ bookmarked: false });
    }

    const userId = dbUsers[0].id;

    const bookmarks = await sql`
      SELECT id FROM bookmarks 
      WHERE user_id = ${userId} AND product_id = ${id}
    `;

    return NextResponse.json({ bookmarked: bookmarks.length > 0 });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json({ bookmarked: false });
  }
}

