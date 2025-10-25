import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, interests } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const user = await stackServerApp.getUser();
    let userId = null;

    if (user) {
      const dbUsers = await sql`
        SELECT id FROM users WHERE stack_user_id = ${user.id}
      `;
      if (dbUsers.length > 0) {
        userId = dbUsers[0].id;
      }
    }

    // Check if already subscribed
    const existing = await sql`
      SELECT id FROM newsletter_subscriptions WHERE email = ${email}
    `;

    if (existing.length > 0) {
      // Update subscription
      await sql`
        UPDATE newsletter_subscriptions
        SET interests = ${interests || []}, is_active = true, updated_at = NOW()
        WHERE email = ${email}
      `;
    } else {
      // Create new subscription
      await sql`
        INSERT INTO newsletter_subscriptions (email, user_id, interests)
        VALUES (${email}, ${userId}, ${interests || []})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

