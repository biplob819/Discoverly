import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const filter = searchParams.get("filter"); // trending, recent, featured
    const sortBy = searchParams.get("sortBy") || "recent"; // recent, relevance, date
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = `
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
    `;

    if (category && category !== "all") {
      query += ` AND p.category = '${category}'`;
    }

    if (filter === "featured") {
      query += ` AND p.is_featured = true`;
    }

    query += `
      GROUP BY p.id, u.id
    `;

    // Sorting logic
    if (filter === "trending" || sortBy === "relevance") {
      // Trending/Relevance: Sort by engagement (comments + bookmarks * 2 + views * 0.1)
      query += ` ORDER BY (COUNT(DISTINCT c.id) * 3 + COUNT(DISTINCT b.id) * 2 + COUNT(DISTINCT pv.id) * 0.1) DESC, p.created_at DESC`;
    } else if (sortBy === "date") {
      // Date: Sort by launch date (oldest first)
      query += ` ORDER BY p.launch_date ASC, p.created_at ASC`;
    } else {
      // Recent (default): Sort by creation date (newest first)
      query += ` ORDER BY p.created_at DESC`;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const products = await sql(query);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
    const {
      name,
      tagline,
      description,
      website_url,
      video_url,
      category,
      tags,
      status,
      launch_date,
    } = body;

    // Validate required fields
    if (!name || !tagline || !description || !website_url || !category || !tags || tags.length < 3) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create user in our database
    const dbUsers = await sql`
      SELECT id FROM users WHERE stack_user_id = ${user.id}
    `;

    let userId;
    if (dbUsers.length === 0) {
      // Create user
      const newUser = await sql`
        INSERT INTO users (stack_user_id, email, username, display_name, avatar_url)
        VALUES (
          ${user.id},
          ${user.primaryEmail || ""},
          ${user.primaryEmail?.split("@")[0] || user.id},
          ${user.displayName || ""},
          ${user.profileImageUrl || null}
        )
        RETURNING id
      `;
      userId = newUser[0].id;
    } else {
      userId = dbUsers[0].id;
    }

    // Create product
    const product = await sql`
      INSERT INTO products (
        maker_id,
        name,
        tagline,
        description,
        website_url,
        video_url,
        category,
        tags,
        status,
        launch_date
      )
      VALUES (
        ${userId},
        ${name},
        ${tagline},
        ${description},
        ${website_url},
        ${video_url || null},
        ${category},
        ${tags},
        ${status},
        ${launch_date || null}
      )
      RETURNING *
    `;

    return NextResponse.json(product[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

