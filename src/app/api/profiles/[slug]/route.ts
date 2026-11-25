// src/app/api/profiles/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function ensureProfilesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS author_profiles (
      slug TEXT PRIMARY KEY,
      display_name TEXT,
      bio TEXT,
      fandom TEXT,
      avatar_url TEXT,
      cover_url TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureProfilesTable();
    const { slug } = await context.params;
    const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();

    const rows = await sql`
      SELECT slug, display_name, bio, fandom, avatar_url, cover_url
      FROM author_profiles
      WHERE slug = ${cleanSlug}
      LIMIT 1
    `;

    const profile = rows[0] || null;

    return NextResponse.json({
      slug: cleanSlug,
      displayName: profile?.display_name || null,
      bio: profile?.bio || null,
      fandom: profile?.fandom || null,
      avatarUrl: profile?.avatar_url || null,
      coverUrl: profile?.cover_url || null,
    });
  } catch (error) {
    console.error('GET /api/profiles/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureProfilesTable();
    const { slug } = await context.params;
    const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
    const body = await req.json();

    const rows = await sql`
      INSERT INTO author_profiles (slug, display_name, bio, fandom, avatar_url, cover_url, updated_at)
      VALUES (
        ${cleanSlug},
        ${body.displayName ?? null},
        ${body.bio ?? null},
        ${body.fandom ?? null},
        ${body.avatarUrl ?? null},
        ${body.coverUrl ?? null},
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        display_name = COALESCE(${body.displayName ?? null}, author_profiles.display_name),
        bio = COALESCE(${body.bio ?? null}, author_profiles.bio),
        fandom = COALESCE(${body.fandom ?? null}, author_profiles.fandom),
        avatar_url = COALESCE(${body.avatarUrl ?? null}, author_profiles.avatar_url),
        cover_url = COALESCE(${body.coverUrl ?? null}, author_profiles.cover_url),
        updated_at = NOW()
      RETURNING slug, display_name, bio, fandom, avatar_url, cover_url
    `;

    const saved = rows[0];

    return NextResponse.json({
      slug: saved.slug,
      displayName: saved.display_name,
      bio: saved.bio,
      fandom: saved.fandom,
      avatarUrl: saved.avatar_url,
      coverUrl: saved.cover_url,
    });
  } catch (error) {
    console.error('POST /api/profiles/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}