// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// GET: Fetch posts for admin, spotlight, categories, or homepage repeater
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');
    const spotlight = searchParams.get('spotlight');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    let result;

    if (all === 'true') {
      // Admin dashboard fetches all drafts + published posts
      result = await pool.query(`SELECT * FROM posts ORDER BY id DESC`);
    } else if (spotlight === 'true') {
      // Spotlight fetches latest published posts
      result = await pool.query(`
        SELECT * FROM posts 
        WHERE is_published = TRUE 
        ORDER BY published_on DESC, id DESC 
        LIMIT 7
      `);
    } else if (category) {
      // Category filter (case-insensitive)
      result = await pool.query(
        `
        SELECT * FROM posts 
        WHERE is_published = TRUE AND LOWER(category) = LOWER($1)
        ORDER BY published_on DESC, id DESC
      `,
        [category]
      );
    } else {
      // Default homepage feed
      const limitVal = limit ? parseInt(limit, 10) : 10;
      result = await pool.query(
        `
        SELECT * FROM posts 
        WHERE is_published = TRUE 
        ORDER BY published_on DESC, id DESC 
        LIMIT $1
      `,
        [limitVal]
      );
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST: Create/Publish a new article (from Admin Writer or Write For Us)
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      short_description,
      description,
      image_url,
      image,
      image_credit,
      category,
      author,
      content,
      is_published,
      status,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const publishedFlag =
      typeof is_published === 'boolean' ? is_published : status === 'published';

  const query = `
      INSERT INTO posts (
        title, slug, short_description, author, published_on,
        image_url, image_credit, category, content, is_published, safety_status, clerk_id
      )
      VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      title,
      finalSlug,
      short_description || description || '',
      author || 'Admin',
      image_url || image || '',
      image_credit || '',
      category || 'Marvel',
      content || short_description || description || '',
      publishedFlag,
      publishedFlag ? 'Approved' : 'Pending',
      userId,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, post: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update Publish / Draft status when clicking "Publish Article" in Admin
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, is_published } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const query = `
      UPDATE posts
      SET is_published = $1,
          published_on = CASE WHEN $1 = TRUE THEN CURRENT_DATE ELSE published_on END,
          safety_status = CASE WHEN $1 = TRUE THEN 'Approved' ELSE 'Pending' END
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [is_published, id]);

    return NextResponse.json({ success: true, post: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}