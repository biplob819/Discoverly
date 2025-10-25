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

    const { id: productId } = await params;

    // Get or create user in database
    const dbUsers = await sql`
      SELECT id, role FROM users WHERE stack_user_id = ${user.id}
    `;

    let userId;
    let userRole;
    
    if (dbUsers.length === 0) {
      const newUser = await sql`
        INSERT INTO users (stack_user_id, email, username, display_name, avatar_url)
        VALUES (
          ${user.id},
          ${user.primaryEmail || ""},
          ${user.primaryEmail?.split("@")[0] || user.id},
          ${user.displayName || ""},
          ${user.profileImageUrl || null}
        )
        RETURNING id, role
      `;
      userId = newUser[0].id;
      userRole = newUser[0].role;
    } else {
      userId = dbUsers[0].id;
      userRole = dbUsers[0].role;
    }

    // Check if product exists
    const products = await sql`
      SELECT id FROM products WHERE id = ${productId} AND status = 'live'
    `;

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if already signed up
    const existing = await sql`
      SELECT id FROM beta_testers 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Already signed up for beta testing" },
        { status: 400 }
      );
    }

    // Create beta tester signup
    const betaTester = await sql`
      INSERT INTO beta_testers (user_id, product_id, status)
      VALUES (${userId}, ${productId}, 'pending')
      RETURNING *
    `;

    return NextResponse.json(betaTester[0], { status: 201 });
  } catch (error) {
    console.error("Error signing up for beta test:", error);
    return NextResponse.json(
      { error: "Failed to sign up for beta test" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;

    // Get user from database
    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (dbUsers.length === 0) {
      return NextResponse.json({ signedUp: false, status: null });
    }

    const userId = dbUsers[0].id;

    // Check if user is signed up for beta testing
    const betaTester = await sql`
      SELECT * FROM beta_testers 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    if (betaTester.length === 0) {
      return NextResponse.json({ signedUp: false, status: null });
    }

    return NextResponse.json({
      signedUp: true,
      status: betaTester[0].status,
      feedback: betaTester[0].feedback,
      created_at: betaTester[0].created_at,
    });
  } catch (error) {
    console.error("Error checking beta test status:", error);
    return NextResponse.json(
      { error: "Failed to check beta test status" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;
    const body = await request.json();
    const { feedback, status } = body;

    // Get user from database
    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = dbUsers[0].id;

    // Update beta tester
    const updated = await sql`
      UPDATE beta_testers 
      SET 
        feedback = COALESCE(${feedback}, feedback),
        status = COALESCE(${status}, status)
      WHERE user_id = ${userId} AND product_id = ${productId}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Beta test signup not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating beta test:", error);
    return NextResponse.json(
      { error: "Failed to update beta test" },
      { status: 500 }
    );
  }
}

