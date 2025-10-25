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

    const productId = (await params).id;

    // Get user from database
    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = dbUsers[0].id;

    // Check if user owns the product
    const products = await sql`
      SELECT id FROM products WHERE id = ${productId} AND maker_id = ${userId}
    `;

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Not authorized to view beta testers for this product" },
        { status: 403 }
      );
    }

    // Get beta testers
    const betaTesters = await sql`
      SELECT 
        bt.*,
        u.username,
        u.display_name,
        u.avatar_url,
        u.email,
        u.role
      FROM beta_testers bt
      JOIN users u ON bt.user_id = u.id
      WHERE bt.product_id = ${productId}
      ORDER BY bt.created_at DESC
    `;

    return NextResponse.json(betaTesters);
  } catch (error) {
    console.error("Error fetching beta testers:", error);
    return NextResponse.json(
      { error: "Failed to fetch beta testers" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = (await params).id;
    const body = await request.json();
    const { betaTesterId, status } = body;

    if (!betaTesterId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user from database
    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = dbUsers[0].id;

    // Check if user owns the product
    const products = await sql`
      SELECT id FROM products WHERE id = ${productId} AND maker_id = ${userId}
    `;

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Not authorized to manage beta testers for this product" },
        { status: 403 }
      );
    }

    // Update beta tester status
    const updated = await sql`
      UPDATE beta_testers 
      SET status = ${status}
      WHERE id = ${betaTesterId} AND product_id = ${productId}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Beta tester not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating beta tester status:", error);
    return NextResponse.json(
      { error: "Failed to update beta tester status" },
      { status: 500 }
    );
  }
}

