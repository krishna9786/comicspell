'use client';

import React, { useEffect, useState } from 'react';
import { getEmbedVideoUrl } from '@/components/WriteForUsClient';

interface PreviewData {
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  imageCredit: string;
  videoUrl: string;
  collageImages: string[];
  createdAt: string;
}

const ENDING_TAG = '#behappy ✌️';

function parsePreviewPayload(): PreviewData | null {
  try {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#data=')) {
      const encoded = decodeURIComponent(window.location.hash.slice(6));
      const jsonStr = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(jsonStr);
    }
  } catch {
    // fallback to storage
  }

  try {
    const raw =
      localStorage.getItem('comicspell_preview_post') ||
      sessionStorage.getItem('comicspell_preview_post');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore parse errors
  }

  return null;
}

function prepareHtmlForPreview(rawContent: string): string {
  // If old markdown/plain text was passed, convert cleanly; otherwise keep HTML
  let html = /<[a-z][\s\S]*>/i.test(rawContent)
    ? rawContent
    : rawContent
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
        .join('');

  // Strip duplicate trailing #behappy tags, then append once at the very end
  const plainCheck = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();

  if (!/#behappy\s*✌️\s*$/i.test(plainCheck)) {
    html = `${html}<p class="pt-3 font-semibold text-[#b5ff42]">${ENDING_TAG}</p>`;
  }

  return html;
}

export default function ArticlePreviewPage() {
  const [post, setPost] = useState<PreviewData | null>(null);

  useEffect(() => {
    setPost(parsePreviewPayload());
    const onHashChange = () => setPost(parsePreviewPayload());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 flex items-center justify-center p-6">
        <p className="text-sm">No preview article found. Click Preview in the editor first.</p>
      </div>
    );
  }

  const embedSrc = getEmbedVideoUrl(post.videoUrl || '');
  const formattedHtml = prepareHtmlForPreview(post.content || '');

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-zinc-200 py-10 px-5">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-3 border-b border-zinc-800 pb-6">
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1a2e05] text-[#b5ff42] border border-[#b5ff42]/30">
            {post.category || 'Article'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {post.title}
          </h1>
          <p className="text-xs text-zinc-400">
            Preview · {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>

        {post.imageUrl && (
          <div className="space-y-1.5">
            <div className="w-full max-h-[440px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            {post.imageCredit && (
              <p className="text-[11px] text-zinc-500">{post.imageCredit}</p>
            )}
          </div>
        )}

        <div
          className="space-y-4 text-base leading-relaxed [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:pt-4 [&_h2]:pb-1 [&_p]:mb-3 [&_b]:font-bold [&_b]:text-white [&_strong]:font-bold [&_strong]:text-white [&_i]:italic [&_em]:italic [&_u]:underline [&_a]:text-orange-400 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: formattedHtml }}
        />

        {post.collageImages && post.collageImages.length > 0 && (
          <div className="my-5 p-4 rounded-2xl bg-[#141414] border border-zinc-800 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
              Collage ({post.collageImages.length}/7)
            </p>
            <div
              className={`grid ${
                post.collageImages.length === 1
                  ? 'grid-cols-1'
                  : post.collageImages.length === 2 || post.collageImages.length === 4
                  ? 'grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3'
              } gap-3`}
            >
              {post.collageImages.slice(0, 7).map((src, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video"
                >
                  <img
                    src={src}
                    alt={`Collage ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {embedSrc && (
          <div className="pt-4 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#b5ff42]">
              Trailer / Video
            </h3>
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black">
              <iframe
                src={embedSrc}
                title="Article video trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}