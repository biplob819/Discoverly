import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const products = await sql`
      SELECT 
        p.*,
        u.username,
        u.display_name,
        u.avatar_url,
        u.bio,
        u.website_url as builder_website,
        u.twitter_handle
      FROM products p
      LEFT JOIN users u ON p.maker_id = u.id
      WHERE p.id = ${id}
    `;

    if (products.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Track view
    const user = await stackServerApp.getUser();
    const userAgent = request.headers.get("user-agent");
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";

    await sql`
      INSERT INTO product_views (product_id, user_id, ip_address, user_agent)
      VALUES (
        ${id},
        ${user?.id || null},
        ${ip || null},
        ${userAgent || null}
      )
    `;

    return NextResponse.json(products[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

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

    // Update product
    const updated = await sql`
      UPDATE products
      SET
        name = ${body.name || products[0].name},
        tagline = ${body.tagline || products[0].tagline},
        description = ${body.description || products[0].description},
        website_url = ${body.website_url || products[0].website_url},
        video_url = ${body.video_url || products[0].video_url},
        category = ${body.category || products[0].category},
        tags = ${body.tags || products[0].tags},
        status = ${body.status || products[0].status},
        launch_date = ${body.launch_date || products[0].launch_date},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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

    await sql`DELETE FROM products WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

