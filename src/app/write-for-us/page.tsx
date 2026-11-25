// src/components/WriteForUsSubmitWrapper.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import WriteForUsClient from '@/components/WriteForUsClient';

export default function WriteForUsSubmitWrapper({
  authorName,
  initialPost,
}: {
  authorName: string;
  initialPost?: any;
}) {
  const router = useRouter();

  const handleSubmitAction = async (formData: FormData) => {
    const postId = String(formData.get('postId') || '').trim();
    const title = String(formData.get('title') || '').trim();
    const content = String(formData.get('content') || '');
    const shortDescription = String(formData.get('short_description') || '');
    const category = String(formData.get('category') || 'Marvel');
    const imageUrl = String(formData.get('image_url') || '');
    const imageCredit = String(formData.get('image_credit') || '');
    const status = String(formData.get('status') || 'published');

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const isEditing = Boolean(postId);
    const method = isEditing ? 'PUT' : 'POST';

    const payload: Record<string, any> = {
      title,
      slug,
      short_description: shortDescription,
      content,
      category,
      image_url: imageUrl,
      image_credit: imageCredit,
      status,
      is_published: status === 'published',
    };

    if (isEditing) {
      payload.id = Number(postId);
    } else {
      payload.author = authorName;
    }

    const res = await fetch('/api/posts', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      alert(errData.error || 'Failed to save article.');
      return;
    }

    const data = await res.json();
    const savedSlug = data?.post?.slug || slug;

    if (status === 'published' && savedSlug) {
      router.push(`/posts/${savedSlug}`);
    } else {
      alert('Draft saved!');
    }
  };

  return <WriteForUsClient initialPost={initialPost} onSubmitAction={handleSubmitAction} />;
}