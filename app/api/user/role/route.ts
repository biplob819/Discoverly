import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      console.error("No user found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User ID:", user.id);

    const body = await request.json();
    const { role } = body;

    console.log("Requested role:", role);

    if (!role || !["user", "builder"].includes(role)) {
      console.error("Invalid role:", role);
      return NextResponse.json(
        { error: "Invalid role. Must be 'user' or 'builder'" },
        { status: 400 }
      );
    }

    // Check if user exists in database
    const existingUser = await sql`
      SELECT id, role FROM users WHERE stack_user_id = ${user.id}
    `;

    console.log("Existing user:", existingUser);

    if (existingUser.length === 0) {
      console.error("User not found in database");
      return NextResponse.json(
        { error: "User profile not found. Please complete onboarding first." },
        { status: 404 }
      );
    }

    // Update user role
    const result = await sql`
      UPDATE users
      SET role = ${role}, updated_at = NOW()
      WHERE stack_user_id = ${user.id}
      RETURNING id, role
    `;

    console.log("Update result:", result);

    return NextResponse.json({ success: true, role: result[0].role });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: `Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

