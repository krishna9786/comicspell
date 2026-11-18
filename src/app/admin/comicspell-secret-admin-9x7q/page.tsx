// src/app/admin/comicspell-secret-admin-9x7q/page.tsx
import { Pool } from 'pg';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import WriteForUsClient from '@/components/WriteForUsClient';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; editId?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (primaryEmail !== 'krishna97inbox@gmail.com') {
    redirect('/');
  }

  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab || 'pending';
  const editId = resolvedSearchParams.editId;

  // Fetch specific post if editing
  let editingPost = null;
  if (editId) {
    const editRes = await pool.query('SELECT * FROM posts WHERE id = $1', [editId]);
    editingPost = editRes.rows[0] || null;
  }

  // Fetch posts based on status column
  let query = 'SELECT * FROM posts';
  if (activeTab === 'pending') {
    query += " WHERE status = 'draft' ORDER BY id DESC;";
  } else if (activeTab === 'published') {
    query += " WHERE status = 'published' ORDER BY id DESC;";
  } else {
    query += ' ORDER BY id DESC;';
  }

  const result = await pool.query(query);
  const posts = result.rows;

  // Server Action: Toggle Publish / Draft directly on `is_published`
  async function handleUpdateStatus(formData: FormData) {
    'use server';
    const postId = formData.get('postId');
    const shouldPublish = formData.get('isPublished') === 'true';

    await pool.query(
      `UPDATE posts 
       SET is_published = $1, 
           published_on = CASE WHEN $1 = TRUE THEN CURRENT_DATE ELSE published_on END,
           safety_status = CASE WHEN $1 = TRUE THEN 'Approved' ELSE 'Pending' END
       WHERE id = $2`,
      [shouldPublish, postId]
    );

    revalidatePath('/admin/comicspell-secret-admin-9x7q');
    revalidatePath('/');
  }

  // Server Action: Create or Edit & Publish from your embedded editor
  async function handleSavePost(formData: FormData) {
    'use server';
    const postId = formData.get('postId') as string;
    const title = formData.get('title') as string;
    const slug = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : `post-${Date.now()}`;
    const shortDescription = (formData.get('short_description') as string) || (formData.get('description') as string) || '';
    const author = (formData.get('author') as string) || user.fullName || 'Krishna Nand';
    const category = (formData.get('category') as string) || 'Marvel';
    const imageUrl = (formData.get('image_url') as string) || (formData.get('image') as string) || '';
    const imageCredit = (formData.get('image_credit') as string) || '';
    const content = formData.get('content') as string;
    const statusVal = formData.get('status') as string;
    const isPublished = statusVal === 'draft' ? false : true;

    if (postId) {
      await pool.query(
        `UPDATE posts 
         SET title = $1, slug = $2, short_description = $3, author = $4, category = $5, 
             image_url = $6, image_credit = $7, content = $8, is_published = $9,
             published_on = CASE WHEN $9 = TRUE THEN CURRENT_DATE ELSE published_on END,
             safety_status = CASE WHEN $9 = TRUE THEN 'Approved' ELSE 'Pending' END
         WHERE id = $10`,
        [title, slug, shortDescription, author, category, imageUrl, imageCredit, content, isPublished, postId]
      );
    } else {
      await pool.query(
        `INSERT INTO posts (
           title, slug, short_description, author, published_on, image_url, image_credit, category, content, is_published, safety_status
         ) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8, $9, $10)`,
        [
          title,
          slug,
          shortDescription,
          author,
          imageUrl,
          imageCredit,
          category,
          content,
          isPublished,
          isPublished ? 'Approved' : 'Pending',
        ]
      );
    }

    revalidatePath('/admin/comicspell-secret-admin-9x7q');
    revalidatePath('/');
    redirect('/admin/comicspell-secret-admin-9x7q?tab=all');
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Left Sidebar Navigation */}
      <aside className="w-60 bg-[#0e0e0e] border-r border-zinc-900/80 p-4 flex flex-col justify-between space-y-4 shrink-0 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-zinc-800/80">
            <div className="w-8 h-8 rounded-full bg-[#b5ff42]/15 border border-[#b5ff42]/50 flex items-center justify-center text-[#b5ff42] font-bold text-xs">
              CS
            </div>
            <div>
              <p className="font-bold text-xs text-white">Owner Admin</p>
              <p className="text-[10px] text-[#b5ff42] font-mono">full access</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium text-zinc-400">
            <a
              href="?tab=pending"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                activeTab === 'pending'
                  ? 'bg-[#b5ff42]/10 text-[#b5ff42] border border-[#b5ff42]/20 font-semibold'
                  : 'hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span>⏳</span> Pending Articles
            </a>
            <a
              href="?tab=write"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                activeTab === 'write'
                  ? 'bg-[#b5ff42]/10 text-[#b5ff42] border border-[#b5ff42]/20 font-semibold'
                  : 'hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span>✨</span> {editingPost ? 'Edit Article' : 'Write / Create Article'}
            </a>
            <a
              href="?tab=all"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-[#b5ff42]/10 text-[#b5ff42] border border-[#b5ff42]/20 font-semibold'
                  : 'hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span>📚</span> All Posts
            </a>
          </nav>
        </div>

        <div className="pt-3 border-t border-zinc-800/80">
          <div className="bg-[#141414] border border-zinc-800/60 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#b5ff42] font-bold text-[11px]">
              <span>💡</span> Security Active
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono truncate">
              {primaryEmail}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
        {activeTab === 'write' ? (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {editingPost ? 'Edit Article & Publish' : 'Create & Publish New Article'}
              </h1>
              {editingPost && (
                <a href="?tab=write" className="text-xs text-[#b5ff42] hover:underline">
                  + Create New Instead
                </a>
              )}
            </div>

            <div className="[&_aside]:hidden [&_nav]:hidden bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-6">
              <WriteForUsClient 
                initialPost={editingPost} 
                onSubmitAction={handleSavePost} 
              />
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold capitalize">{activeTab} Articles</h1>
              <span className="text-xs text-zinc-400 font-mono">{posts.length} entries found</span>
            </div>

            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="p-12 text-center bg-[#141414] border border-zinc-800 rounded-xl text-zinc-500">
                  No articles found in this section.
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="p-5 bg-[#141414] border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-white">{post.title}</h3>
                      <p className="text-xs text-zinc-400 font-mono">
                        Slug: /{post.slug} | Author: {post.author} | Category: {post.category} | Status:{' '}
                        <span className={`uppercase font-bold ${post.is_published ? 'text-[#b5ff42]' : 'text-yellow-400'}`}>
                          {post.is_published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`?tab=write&editId=${post.id}`}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        ✏️ Edit Article
                      </a>

                      <form action={handleUpdateStatus}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input
                          type="hidden"
                          name="isPublished"
                          value={post.is_published ? 'false' : 'true'}
                        />
                        <button
                          type="submit"
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                            post.is_published
                              ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                              : 'bg-[#b5ff42] text-black hover:opacity-90'
                          }`}
                        >
                          {post.is_published ? 'Move to Draft' : 'Publish Article'}
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Right Metadata Panel */}
      <aside className="w-64 bg-[#0e0e0e] border-l border-zinc-900/80 p-4 space-y-4 shrink-0 overflow-y-auto hidden xl:block">
        <div className="bg-[#141414] border border-zinc-800/80 rounded-2xl p-3.5 space-y-2">
          <h4 className="text-[10px] font-black tracking-widest text-[#b5ff42] uppercase">Quick Statistics</h4>
          <p className="text-xs text-zinc-400">Total Database Records: <span className="text-white font-mono">{posts.length}</span></p>
        </div>
      </aside>
    </div>
  );
}