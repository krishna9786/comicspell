// src/app/posts/[slug]/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import React from 'react';

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const formattedTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const lowerSlug = slug.toLowerCase();
  const isDC = lowerSlug.includes('batman') || lowerSlug.includes('dc') || lowerSlug.includes('superman');
  const isAnime = lowerSlug.includes('anime') || lowerSlug.includes('one-piece') || lowerSlug.includes('naruto') || lowerSlug.includes('jujutsu');
  const isKDrama = lowerSlug.includes('kdrama') || lowerSlug.includes('k-drama') || lowerSlug.includes('oppa');

  let categoryName = 'Marvel';
  let categoryHref = '/category/marvel';
  let badgeColorStyle = 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20';

  if (isDC) {
    categoryName = 'DC';
    categoryHref = '/category/dc';
    badgeColorStyle = 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/20';
  } else if (isAnime) {
    categoryName = 'Anime';
    categoryHref = '/category/anime';
    badgeColorStyle = 'text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20';
  } else if (isKDrama) {
    categoryName = 'K-Drama';
    categoryHref = '/category/kdrama';
    badgeColorStyle = 'text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/20';
  }

  // New interactive states for Views, Likes, and Bookmarks (Save)
  const [views, setViews] = useState(1248);
  const [likes, setLikes] = useState(142);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const vibeOptions = [
    { key: 'kdrama', label: 'Finger Heart', icon: '🫰', subtitle: 'K-Drama' },
    { key: 'anime', label: 'Straw Hat', icon: '👒', subtitle: 'Anime' },
    { key: 'marvel', label: 'Web Shooter', icon: '🕸️', subtitle: 'Marvel' },
    { key: 'dc', label: 'Bat-Signal', icon: '🦇', subtitle: 'DC Comics' },
    { key: 'handheart', label: 'Hand Heart', icon: '🫶', subtitle: 'Love' },
    { key: 'redheart', label: 'Red Heart', icon: '❤️', subtitle: 'Classic' },
    { key: 'angry', label: 'Angry', icon: '😤', subtitle: 'Angry' }
  ];

  type ReplyType = {
    id: number;
    author: string;
    avatar: string;
    text: string;
    time: string;
    vibes: Record<string, number>;
    userVotedType: string | null;
    parentId: number;
    replyingToAuthor: string;
  };

  type CommentType = {
    id: number;
    author: string;
    avatar: string;
    text: string;
    time: string;
    vibes: Record<string, number>;
    userVotedType: string | null;
    replies: ReplyType[];
  };

  const [comments, setComments] = useState<CommentType[]>([
    {
      id: 1,
      author: 'WebHead99',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      text: 'Absolute peak fiction! Can’t wait to see how this multiverse arc unfolds 🔥',
      time: '2 hours ago',
      vibes: { kdrama: 8, anime: 24, marvel: 42, dc: 15, handheart: 12, redheart: 30, angry: 3 },
      userVotedType: null,
      replies: [
        {
          id: 11,
          author: 'GothamKnight',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          text: 'Totally agree, the pacing feels just like the classic runs.',
          time: '1 hour ago',
          vibes: { kdrama: 2, anime: 5, marvel: 8, dc: 20, handheart: 4, redheart: 10, angry: 1 },
          userVotedType: null,
          parentId: 1,
          replyingToAuthor: 'WebHead99',
        }
      ]
    },
    {
      id: 2,
      author: 'OtakuKing',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      text: 'The atmosphere and background lore drops here are incredible.',
      time: '5 hours ago',
      vibes: { kdrama: 5, anime: 38, marvel: 12, dc: 6, handheart: 8, redheart: 19, angry: 2 },
      userVotedType: null,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  
  const [activeReplyTarget, setActiveReplyTarget] = useState<{ commentId: number; targetAuthor: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const initialVibes = vibeOptions.reduce((acc, vibe) => {
      acc[vibe.key] = 0;
      return acc;
    }, {} as Record<string, number>);

    initialVibes['marvel'] = 1;

    const commentObj: CommentType = {
      id: Date.now(),
      author: authorName.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${authorName.trim()}`,
      text: newComment.trim(),
      time: 'Just now',
      vibes: initialVibes,
      userVotedType: 'marvel',
      replies: []
    };

    setComments([commentObj, ...comments]);
    setNewComment('');
    setAuthorName('');
  };

  const handleAddReply = (commentId: number, targetAuthor: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyAuthor.trim()) return;

    const initialVibes = vibeOptions.reduce((acc, vibe) => {
      acc[vibe.key] = 0;
      return acc;
    }, {} as Record<string, number>);

    initialVibes['marvel'] = 1;

    const newReply: ReplyType = {
      id: Date.now(),
      author: replyAuthor.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${replyAuthor.trim()}`,
      text: replyText.trim(),
      time: 'Just now',
      vibes: initialVibes,
      userVotedType: 'marvel',
      parentId: commentId,
      replyingToAuthor: targetAuthor,
    };

    setComments(comments.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...c.replies, newReply] };
      }
      return c;
    }));

    setReplyText('');
    setReplyAuthor('');
    setActiveReplyTarget(null);
  };

  const handleVibeVote = (commentId: number, vibeKey: string, replyId?: number) => {
    setComments(comments.map(c => {
      if (!replyId && c.id === commentId) {
        const prevVoted = c.userVotedType;
        const newVibes: Record<string, number> = { ...c.vibes };

        if (prevVoted === vibeKey) {
          newVibes[vibeKey] = (newVibes[vibeKey] || 0) - 1;
          return { ...c, userVotedType: null, vibes: newVibes };
        } else {
          if (prevVoted) {
            newVibes[prevVoted] = (newVibes[prevVoted] || 0) - 1;
          }
          newVibes[vibeKey] = (newVibes[vibeKey] || 0) + 1;
          return { ...c, userVotedType: vibeKey, vibes: newVibes };
        }
      }

      if (replyId && c.id === commentId) {
        const updatedReplies = c.replies.map(r => {
          if (r.id === replyId) {
            const prevVoted = r.userVotedType;
            const newVibes: Record<string, number> = { ...r.vibes };

            if (prevVoted === vibeKey) {
              newVibes[vibeKey] = (newVibes[vibeKey] || 0) - 1;
              return { ...r, userVotedType: null, vibes: newVibes };
            } else {
              if (prevVoted) {
                newVibes[prevVoted] = (newVibes[prevVoted] || 0) - 1;
              }
              newVibes[vibeKey] = (newVibes[vibeKey] || 0) + 1;
              return { ...r, userVotedType: vibeKey, vibes: newVibes };
            }
          }
          return r;
        });
        return { ...c, replies: updatedReplies };
      }

      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
        <div className="space-y-8">
          <div className="w-[130%] -ml-[15%] space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <Link 
                  href={categoryHref} 
                  className={`font-bold uppercase tracking-wider px-3 py-1 rounded-full border hover:underline ${badgeColorStyle}`}
                >
                  {categoryName}
                </Link>
                <span className="text-zinc-400">4 August 2026</span>
              </div>

              {/* Engagement Stats Bar (Views, Likes, Save Button) */}
              <div className="flex items-center space-x-4 text-zinc-400">
                <div className="flex items-center space-x-1.5 bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">
                  <span>👁️</span>
                  <span className="font-semibold text-zinc-300">{views}</span>
                  <span className="text-[10px] hidden sm:inline">Views</span>
                </div>

                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition cursor-pointer ${
                    isLiked 
                      ? 'bg-red-500/10 border-red-500/40 text-red-400' 
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{isLiked ? '❤️' : '🤍'}</span>
                  <span className="font-semibold">{likes}</span>
                  <span className="text-[10px] hidden sm:inline">Likes</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition cursor-pointer ${
                    isSaved 
                      ? 'bg-[#b5ff42]/10 border-[#b5ff42]/50 text-[#b5ff42]' 
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                  title={isSaved ? 'Saved to bookmarks' : 'Save article'}
                >
                  <span>{isSaved ? '🔖' : '📌'}</span>
                  <span className="font-semibold text-xs">{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white capitalize">
              {formattedTitle || "Spider-Man: Brand New Day May Have Already Revealed Peter Parker's Future"}
            </h1>

            <div className="flex items-center space-x-2 pt-2 text-sm text-zinc-400 border-t border-zinc-900">
              <span>Authored By:</span>
              <Link href="/author/jane-smith" className="text-white font-medium hover:text-[#b5ff42] transition">
                Jane Smith
              </Link>
            </div>
          </div>

          <div className="w-[130%] -ml-[15%] h-[336px] md:h-[472px] rounded-2xl overflow-hidden relative border border-zinc-800 shadow-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1635863138275-d9b33297680b?q=80&w=1600&auto=format&fit=crop')` }}
            ></div>
            <div className="absolute bottom-3 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs text-zinc-300 border border-zinc-700/50">
              Image Credit: Studios / Editorial
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] lg:gap-36 pt-4">
          <div className="w-[182%] -ml-[25%] space-y-8">
            <div className="bg-black border border-zinc-900 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="prose prose-invert max-w-none text-zinc-300 space-y-6 text-base md:text-lg leading-relaxed">
                <p className="font-medium text-white text-lg md:text-xl">
                  {formattedTitle} is making waves across fandoms everywhere, representing a massive shift in how modern storytelling handles legacy characters and high-stakes cinematic universes.
                </p>

                <h2 className="text-2xl font-bold text-white pt-4">Origins and Narrative Impact</h2>
                <p>
                  When analyzing the core premise, creators have consistently pushed boundaries to redefine what fans expect. By introducing subtle narrative cues, storytellers lay down foundational elements that impact the entire franchise landscape.
                </p>

                <div className="bg-[#121212] border-l-4 border-[#b5ff42] p-6 rounded-r-xl my-6 text-zinc-300 italic text-base">
                  &quot;Every choice echoes across multiple timelines, creating ripples that change the direction of the entire universe.&quot;
                </div>

                <h2 className="text-2xl font-bold text-white pt-4">What Comes Next</h2>
                <p>
                  As new details emerge, keeping track of background lore and hidden clues will be essential for fans looking to stay ahead of upcoming releases and narrative shifts.
                </p>
              </div>
            </div>

            {/* Fancy Separator / Section Divider before Comments */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gradient-to-r from-transparent via-[#b5ff42]/40 to-transparent border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#121212] px-6 text-xs uppercase tracking-widest font-extrabold text-[#b5ff42] border border-zinc-800 rounded-full py-1.5 shadow-lg">
                  💬 Discussion & Theories Hub
                </span>
              </div>
            </div>

            <div className="bg-black border border-zinc-900 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-wide flex items-center gap-2 text-white">
                  <span>🌌 Multiverse Fandom Hub</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)}
                  </span>
                </h3>
              </div>

              <form onSubmit={handleAddComment} className="space-y-4 bg-[#0a0a0a] p-5 rounded-2xl border border-zinc-900">
                <input
                  type="text"
                  placeholder="Your Fandom Handle / Name..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full md:w-1/2 bg-black border border-zinc-800 focus:border-[#22c55e] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition"
                  required
                />
                <textarea
                  placeholder="Drop your theory or thoughts here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-zinc-800 focus:border-[#22c55e] rounded-xl p-4 text-sm text-white placeholder-zinc-600 outline-none transition resize-none"
                  required
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-white hover:bg-zinc-200 text-black font-semibold px-6 py-2 rounded-xl text-sm transition shadow-lg cursor-pointer"
                  >
                    Publish Theory
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author} 
                          className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 object-cover" 
                        />
                        <div>
                          <span className="font-bold text-sm text-white">{comment.author}</span>
                          <span className="text-xs text-zinc-500 block">{comment.time}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed pl-13">
                      {comment.text}
                    </p>

                    <div className="space-y-2 pl-13 pt-1">
                      <div className="flex flex-wrap items-center gap-2 py-1">
                        {vibeOptions.map((vibe) => {
                          const count = comment.vibes[vibe.key] || 0;
                          const isSelected = comment.userVotedType === vibe.key;

                          return (
                            <button
                              key={vibe.key}
                              onClick={() => handleVibeVote(comment.id, vibe.key)}
                              title={`React with ${vibe.label} (${vibe.subtitle})`}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition cursor-pointer ${
                                isSelected
                                  ? 'bg-[#b5ff42]/10 border-[#b5ff42]/50 text-[#b5ff42]'
                                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                              }`}
                            >
                              <span>{vibe.icon}</span>
                              <span className="font-semibold">{count}</span>
                              <span className="text-[10px] text-zinc-500 hidden sm:inline">({vibe.subtitle})</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button 
                          onClick={() => setActiveReplyTarget(
                            activeReplyTarget?.commentId === comment.id && activeReplyTarget?.targetAuthor === comment.author
                              ? null 
                              : { commentId: comment.id, targetAuthor: comment.author }
                          )}
                          className="text-zinc-400 hover:text-white transition font-medium text-xs cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    {activeReplyTarget?.commentId === comment.id && activeReplyTarget?.targetAuthor === comment.author && (
                      <form onSubmit={(e) => handleAddReply(comment.id, comment.author, e)} className="ml-8 mt-4 space-y-3 bg-black p-4 rounded-xl border border-zinc-800">
                        <div className="text-xs text-zinc-400">
                          Replying to <span className="text-[#b5ff42] font-semibold">@{comment.author}</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Your Fandom Handle..."
                          value={replyAuthor}
                          onChange={(e) => setReplyAuthor(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none"
                          required
                        />
                        <textarea
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder-zinc-600 outline-none resize-none"
                          required
                        ></textarea>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyTarget(null)}
                            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-white hover:bg-zinc-200 text-black font-semibold px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                          >
                            Send Reply
                          </button>
                        </div>
                      </form>
                    )}

                    {comment.replies.length > 0 && (
                      <div className="ml-8 border-l-2 border-zinc-800/80 pl-4 space-y-4 pt-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="space-y-3 bg-black/40 p-4 rounded-xl border border-zinc-900/50">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={reply.avatar} 
                                alt={reply.author} 
                                className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 object-cover" 
                              />
                              <div>
                                <span className="font-bold text-xs text-white">{reply.author}</span>
                                <span className="text-[10px] text-zinc-500 block">{reply.time}</span>
                              </div>
                            </div>
                            
                            <div className="text-zinc-300 text-xs leading-relaxed pl-11 space-y-1">
                              <span className="inline-block text-[#b5ff42] font-medium mr-1.5">
                                @{reply.replyingToAuthor}
                              </span>
                              <span>{reply.text}</span>
                            </div>
                            
                            <div className="flex items-center justify-between pl-11 pt-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {vibeOptions.map((vibe) => {
                                  const count = reply.vibes[vibe.key] || 0;
                                  const isSelected = reply.userVotedType === vibe.key;

                                  return (
                                    <button
                                      key={vibe.key}
                                      onClick={() => handleVibeVote(comment.id, vibe.key, reply.id)}
                                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] transition cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#b5ff42]/10 border-[#b5ff42]/50 text-[#b5ff42]'
                                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                      }`}
                                    >
                                      <span>{vibe.icon}</span>
                                      <span className="font-semibold">{count}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              <button 
                                onClick={() => setActiveReplyTarget(
                                  activeReplyTarget?.commentId === comment.id && activeReplyTarget?.targetAuthor === reply.author
                                    ? null 
                                    : { commentId: comment.id, targetAuthor: reply.author }
                                )}
                                className="text-zinc-400 hover:text-white transition font-medium text-xs cursor-pointer"
                              >
                                Reply
                              </button>
                            </div>

                            {activeReplyTarget?.commentId === comment.id && activeReplyTarget?.targetAuthor === reply.author && (
                              <form onSubmit={(e) => handleAddReply(comment.id, reply.author, e)} className="ml-4 mt-3 space-y-3 bg-black p-3 rounded-xl border border-zinc-800">
                                <div className="text-xs text-zinc-400">
                                  Replying to <span className="text-[#b5ff42] font-semibold">@{reply.author}</span>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Your Fandom Handle..."
                                  value={replyAuthor}
                                  onChange={(e) => setReplyAuthor(e.target.value)}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none"
                                  required
                                />
                                <textarea
                                  placeholder="Write your reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={2}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder-zinc-600 outline-none resize-none"
                                  required
                                ></textarea>
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setActiveReplyTarget(null)}
                                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-white hover:bg-zinc-200 text-black font-semibold px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                                  >
                                    Send Reply
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="hidden lg:block ml-8 -mr-36 opacity-0 pointer-events-none">
            <div className="sticky top-28 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 min-h-[600px] flex flex-col items-center justify-center text-center text-zinc-600">
              <span className="text-xs uppercase tracking-widest font-bold">Advertisement</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}