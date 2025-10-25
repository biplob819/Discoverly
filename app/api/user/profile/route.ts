import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile from database
    const profile = await sql`
      SELECT * FROM users WHERE stack_user_id = ${user.id}
    `;

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, display_name, bio, role, interests } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (existing.length > 0) {
      // Update existing user
      await sql`
        UPDATE users
        SET
          username = ${username},
          display_name = ${display_name || null},
          bio = ${bio || null},
          role = ${role || "user"},
          interests = ${interests || []},
          updated_at = NOW()
        WHERE stack_user_id = ${user.id}
      `;
    } else {
      // Create new user
      await sql`
        INSERT INTO users (
          stack_user_id,
          email,
          username,
          display_name,
          bio,
          avatar_url,
          role,
          interests
        )
        VALUES (
          ${user.id},
          ${user.primaryEmail || ""},
          ${username},
          ${display_name || null},
          ${bio || null},
          ${user.profileImageUrl || null},
          ${role || "user"},
          ${interests || []}
        )
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

