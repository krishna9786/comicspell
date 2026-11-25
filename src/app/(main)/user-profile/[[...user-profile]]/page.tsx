// src/app/user-profile/[[...user-profile]]/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function nameToSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugToTitle(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function UserProfilePage() {
  const { user, isLoaded } = useUser();
  const params = useParams<{ 'user-profile'?: string[] }>();

  const routeSlug = useMemo(() => {
    const segs = params?.['user-profile'];
    if (Array.isArray(segs) && segs.length > 0) {
      return decodeURIComponent(segs[0]).toLowerCase().trim();
    }
    return '';
  }, [params]);

  const loggedInName = useMemo(() => {
    return user?.fullName || user?.username || user?.firstName || '';
  }, [user]);

  const loggedInSlug = useMemo(() => {
    return loggedInName ? nameToSlug(loggedInName) : '';
  }, [loggedInName]);

  const targetSlug = useMemo(() => {
    return routeSlug || loggedInSlug || 'krishna-nand';
  }, [routeSlug, loggedInSlug]);

  const isOwner = useMemo(() => {
    if (!user) return false;
    if (!routeSlug) return true;
    return routeSlug === loggedInSlug;
  }, [user, routeSlug, loggedInSlug]);

  const initialName = useMemo(() => {
    return (isOwner && loggedInName) || slugToTitle(targetSlug) || 'Krishna Nand';
  }, [isOwner, loggedInName, targetSlug]);

  const [displayName, setDisplayName] = useState(initialName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(initialName);

  const [bio, setBio] = useState('Comic book enthusiast & anime writer.');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const [profileCoverUrl, setProfileCoverUrl] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'saved'>('articles');

  // Custom Message Link State
  const [messageInstaLink, setMessageInstaLink] = useState('https://instagram.com/krishna_writer');
  const [isEditingMessageLink, setIsEditingMessageLink] = useState(false);
  const [tempMessageLink, setTempMessageLink] = useState('https://instagram.com/krishna_writer');

  // "Which Fan Are You?" State
  const [fandom, setFandom] = useState<{ name: string; emoji: string } | null>({ name: 'Anime', emoji: '🍥' });
  const [isChoosingFandom, setIsChoosingFandom] = useState(false);

  const fandomOptions = [
    { name: 'Marvel', emoji: '🦸‍♂️' },
    { name: 'DC', emoji: '🦇' },
    { name: 'KDrama', emoji: '🎬' },
    { name: 'Anime', emoji: '🍥' },
  ];

  // Followers / Following Live State
  const [followersCount, setFollowersCount] = useState(342);
  const [followingCount, setFollowingCount] = useState(128);
  const [isFollowing, setIsFollowing] = useState(false);

  // Modals for listing Followers and Following
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([
    { id: 1, name: 'Alex Rivera', handle: '@alex_comics', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { id: 2, name: 'Sarah Chen', handle: '@schen_art', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  ]);
  const [followingList, setFollowingList] = useState<any[]>([
    { id: 1, name: 'Marvel Insider', handle: '@marvel_insider', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  ]);

  // Live database states
  const [writtenArticles, setWrittenArticles] = useState<any[]>([]);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to save profile fields to Neon via /api/profiles/[slug]
  async function persistProfile(payload: {
    displayName?: string | null;
    bio?: string | null;
    fandom?: string | null;
    avatarUrl?: string | null;
    coverUrl?: string | null;
  }) {
    if (!targetSlug) return;
    try {
      await fetch(`/api/profiles/${encodeURIComponent(targetSlug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Failed to persist profile:', err);
    }
  }

  // Helper to upload image file to /api/upload and return public URL
  async function uploadImageFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.url || data.fileUrl || data.imageUrl || null;
  }

  // Load public profile (avatarUrl, coverUrl, bio, fandom, displayName) for everyone (logged in or out)
  useEffect(() => {
    let active = true;
    const fallbackName = (isOwner && loggedInName) || slugToTitle(targetSlug) || 'Krishna Nand';

    setDisplayName(fallbackName);
    setTempName(fallbackName);

    async function fetchPublicProfile() {
      try {
        const res = await fetch(`/api/profiles/${encodeURIComponent(targetSlug)}`, {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!active || !data) return;

        if (data.displayName) {
          setDisplayName(data.displayName);
          setTempName(data.displayName);
        } else {
          setDisplayName(fallbackName);
          setTempName(fallbackName);
        }

        if (data.bio) {
          setBio(data.bio);
        }
        if (data.fandom) {
          const matched = fandomOptions.find(
            (opt) => opt.name.toLowerCase() === String(data.fandom).toLowerCase()
          );
          if (matched) {
            setFandom(matched);
          } else {
            setFandom({ name: data.fandom, emoji: '🍥' });
          }
        }
        if (data.avatarUrl) {
          setProfileAvatarUrl(data.avatarUrl);
        }
        if (data.coverUrl) {
          setProfileCoverUrl(data.coverUrl);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    }

    fetchPublicProfile();
    return () => {
      active = false;
    };
  }, [targetSlug, isOwner, loggedInName]);

  // Fetch live articles from backend API
  useEffect(() => {
    async function fetchUserData() {
      try {
        const postsRes = await fetch('/api/posts');
        if (postsRes.ok) {
          const data = await postsRes.json();
          const allPosts = Array.isArray(data) ? data : data.posts || [];
          const filtered = allPosts.filter((post: any) => {
            const authorField = post.author || post.author_name || '';
            return !authorField || nameToSlug(authorField) === targetSlug;
          });
          setWrittenArticles(filtered.length > 0 ? filtered : allPosts);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [targetSlug]);

  // Gamification & Custom Ranks System
  const points = 1450;

  const levels = [
    { level: 1, name: 'Newbie', minXP: 0, perk: 'Basic posting rights' },
    { level: 2, name: 'Expert', minXP: 500, perk: 'Custom profile bio styling' },
    { level: 3, name: 'Scholar', minXP: 1200, perk: 'Priority article indexing' },
    { level: 4, name: 'Master', minXP: 2500, perk: 'Featured author badge' },
    { level: 5, name: 'Grandmaster', minXP: 5000, perk: 'Monetization booster (+20% earnings)' },
    { level: 6, name: 'Legendary Grandmaster', minXP: 10000, perk: 'Direct editor review status' },
    { level: 7, name: 'Ace', minXP: 20000, perk: 'Platform Legend status & VIP lounge' },
  ];

  const currentLevelObj = levels.slice().reverse().find((l) => points >= l.minXP) || levels[0];
  const nextLevelObj = levels.find((l) => l.level === currentLevelObj.level + 1);

  const progressPercent = nextLevelObj
    ? Math.min(100, Math.floor(((points - currentLevelObj.minXP) / (nextLevelObj.minXP - currentLevelObj.minXP)) * 100))
    : 100;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      if (user) {
        await user.setProfileImage({ file });
      }
      const uploadedUrl = await uploadImageFile(file);
      const finalUrl = uploadedUrl || user?.imageUrl || null;
      if (finalUrl) {
        setProfileAvatarUrl(finalUrl);
        await persistProfile({ avatarUrl: finalUrl });
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setCoverPhoto(localUrl);
    setIsUploadingCover(true);

    try {
      const uploadedUrl = await uploadImageFile(file);
      if (uploadedUrl) {
        setProfileCoverUrl(uploadedUrl);
        await persistProfile({ coverUrl: uploadedUrl });
      }
    } catch (err) {
      console.error('Cover upload failed:', err);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSaveName = async () => {
    if (!isOwner) return;
    if (tempName.trim()) {
      const cleaned = tempName.trim();
      setDisplayName(cleaned);
      await persistProfile({ displayName: cleaned });
    }
    setIsEditingName(false);
  };

  const handleBioBlur = async () => {
    if (!isOwner) return;
    await persistProfile({ bio });
  };

  const handleSaveMessageLink = () => {
    setMessageInstaLink(tempMessageLink.trim());
    setIsEditingMessageLink(false);
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  const resolvedCoverSrc = profileCoverUrl || coverPhoto;
  const resolvedAvatarSrc = profileAvatarUrl || (isOwner ? user?.imageUrl : null);

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Cover Photo (visible to everyone, including logged-out visitors) */}
      <div className="relative h-48 md:h-64 w-full bg-zinc-900 border-b border-zinc-800 overflow-hidden">
        {resolvedCoverSrc ? (
          <Image src={resolvedCoverSrc} alt="Cover" fill unoptimized className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-black opacity-60"></div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none"></div>

        {isOwner && (
          <label className="absolute bottom-4 right-4 bg-black/80 hover:bg-black text-[#b5ff42] border border-[#b5ff42]/30 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition z-10">
            {isUploadingCover ? 'Uploading...' : 'Change Cover'}
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-6 relative -mt-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 z-20">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left w-full">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-[#b5ff42] overflow-hidden bg-black shadow-xl relative flex items-center justify-center">
              {resolvedAvatarSrc ? (
                <Image src={resolvedAvatarSrc} alt="Avatar" fill unoptimized className="object-cover" />
              ) : (
                <span className="text-3xl font-black text-[#b5ff42]">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isOwner && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-[#b5ff42] opacity-0 group-hover:opacity-100 transition rounded-full text-xs font-bold cursor-pointer">
                {isUploadingAvatar ? 'Saving...' : 'Change'}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  {isEditingName && isOwner ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-black border border-[#b5ff42] rounded px-2 py-1 text-lg font-black text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="bg-[#b5ff42] text-black text-xs font-bold px-3 py-1.5 rounded cursor-pointer hover:bg-[#a2ef2d]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setTempName(displayName);
                          setIsEditingName(false);
                        }}
                        className="text-zinc-400 text-xs hover:text-white px-2 py-1 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-black">{displayName}</h1>
                      {isOwner && (
                        <button
                          onClick={() => {
                            setTempName(displayName);
                            setIsEditingName(true);
                          }}
                          className="text-xs text-[#b5ff42] border border-[#b5ff42]/30 px-2 py-0.5 rounded hover:bg-[#b5ff42]/10 transition cursor-pointer"
                        >
                          Edit Name
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Follower & Following Stats */}
              <div className="flex items-center gap-4 justify-center md:justify-end">
                <button
                  onClick={() => setShowFollowersModal(true)}
                  className="text-center cursor-pointer hover:opacity-80 transition group"
                >
                  <span className="block text-sm font-black text-white group-hover:text-[#b5ff42]">{followersCount}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Followers</span>
                </button>
                <button
                  onClick={() => setShowFollowingModal(true)}
                  className="text-center cursor-pointer hover:opacity-80 transition group"
                >
                  <span className="block text-sm font-black text-white group-hover:text-[#b5ff42]">{followingCount}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Following</span>
                </button>
                <div className="flex items-center gap-2 pl-2">
                  <button
                    onClick={handleFollowToggle}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isFollowing
                        ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                        : 'bg-[#b5ff42] text-black hover:bg-[#a2ef2d]'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <div className="relative flex items-center">
                    <a
                      href={messageInstaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#b5ff42]/50 text-white px-3 py-2 rounded-l-lg text-xs font-bold transition cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-current text-[#b5ff42]" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Message
                    </a>

                    {isOwner && (
                      <button
                        onClick={() => {
                          setTempMessageLink(messageInstaLink);
                          setIsEditingMessageLink(!isEditingMessageLink);
                        }}
                        title="Edit Message Link"
                        className="bg-zinc-900 border-t border-b border-r border-zinc-800 hover:border-[#b5ff42]/50 text-zinc-400 hover:text-[#b5ff42] px-2 py-2 rounded-r-lg text-xs transition cursor-pointer flex items-center justify-center h-full"
                      >
                        ✏️
                      </button>
                    )}

                    {isEditingMessageLink && isOwner && (
                      <div className="absolute right-0 top-12 z-50 bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-2xl w-72 text-left space-y-2 animate-in fade-in zoom-in duration-200">
                        <p className="text-xs font-bold text-[#b5ff42] uppercase">Edit Message Instagram Link</p>
                        <input
                          type="text"
                          value={tempMessageLink}
                          onChange={(e) => setTempMessageLink(e.target.value)}
                          placeholder="https://instagram.com/your_username"
                          className="w-full bg-black border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#b5ff42]"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={handleSaveMessageLink}
                            className="bg-[#b5ff42] text-black text-xs font-bold px-3 py-1 rounded cursor-pointer hover:bg-[#a2ef2d]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingMessageLink(false)}
                            className="text-zinc-400 text-xs hover:text-white px-2 py-1 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges & Fandom Row */}
            <div className="flex flex-wrap items-center gap-2 mt-3 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a2e05] border border-[#b5ff42]/40 rounded-full text-[#b5ff42] text-xs font-bold">
                <span>🏆</span> Rank: {currentLevelObj.name}
              </div>

              <div className="relative">
                <button
                  onClick={() => isOwner && setIsChoosingFandom(!isChoosingFandom)}
                  className={`inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-200 text-xs font-bold transition duration-300 shadow-md group ${
                    isOwner ? 'hover:border-[#b5ff42] hover:text-white transform hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span className="animate-bounce">{fandom ? fandom.emoji : '🎯'}</span>
                  <span>{fandom ? `Fan of: ${fandom.name}` : 'Which Fan Are You?'}</span>
                  {isOwner && (
                    <span className="text-[10px] text-[#b5ff42] group-hover:rotate-180 transition-transform duration-300">▼</span>
                  )}
                </button>

                {isChoosingFandom && isOwner && (
                  <div className="absolute left-0 md:left-auto md:right-0 top-10 z-50 bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-2xl w-56 text-left space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[10px] font-extrabold uppercase text-[#b5ff42] tracking-wider px-2 pb-1">Select Your Fandom</p>
                    {fandomOptions.map((opt) => (
                      <button
                        key={opt.name}
                        onClick={async () => {
                          setFandom(opt);
                          setIsChoosingFandom(false);
                          await persistProfile({ fandom: opt.name });
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition duration-200 cursor-pointer ${
                          fandom?.name === opt.name
                            ? 'bg-[#1a2e05] text-[#b5ff42] border border-[#b5ff42]/40'
                            : 'bg-black/40 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        <span className="text-base">{opt.emoji}</span>
                        <span>{opt.name}</span>
                        {fandom?.name === opt.name && <span className="ml-auto text-[#b5ff42] text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-lg">
            <h2 className="text-sm font-extrabold uppercase text-[#b5ff42] tracking-wider mb-3">Bio</h2>
            {isOwner ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={handleBioBlur}
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-[#b5ff42] resize-none h-24"
              ></textarea>
            ) : (
              <p className="text-sm text-zinc-300 leading-relaxed">{bio}</p>
            )}
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-lg">
            <h2 className="text-sm font-extrabold uppercase text-[#b5ff42] tracking-wider mb-4">Battle Pass Rank</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-300">Total XP</span>
              <span className="text-lg font-black text-[#b5ff42]">{points} XP</span>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>{currentLevelObj.name}</span>
                <span>{nextLevelObj ? nextLevelObj.name : 'Max Tier'}</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#b5ff42] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="text-[11px] text-zinc-500 text-right mt-1">
                {nextLevelObj ? `${nextLevelObj.minXP - points} XP to ${nextLevelObj.name}` : 'Max Level Reached!'}
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3">
              <span className="text-[10px] text-[#b5ff42] uppercase font-bold tracking-wider block mb-1">Active Perk</span>
              <p className="text-xs text-zinc-300 font-medium">{currentLevelObj.perk}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex bg-zinc-950 p-1.5 border border-zinc-900 rounded-xl gap-2">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase rounded-lg transition cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-[#b5ff42] text-black shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Articles ({writtenArticles.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase rounded-lg transition cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-[#b5ff42] text-black shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Saved Articles ({savedArticles.length})
            </button>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-lg min-h-[320px]">
            {/* Panel 1: Written Articles (Live from DB) */}
            {activeTab === 'articles' && (
              <div>
                <h2 className="text-sm font-extrabold uppercase text-[#b5ff42] tracking-wider mb-4">Articles Written</h2>
                {isLoading ? (
                  <p className="text-sm text-zinc-500">Loading articles...</p>
                ) : writtenArticles.length === 0 ? (
                  <p className="text-sm text-zinc-500">No published articles yet.</p>
                ) : (
                  <div className="space-y-3">
                    {writtenArticles.map((art) => (
                      <Link
                        key={art.id || art._id}
                        href={art.slug ? `/posts/${art.slug}` : `/posts/${art.id}`}
                        className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition block"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#1a2e05] text-[#b5ff42] px-2 py-0.5 rounded font-bold uppercase">{art.category}</span>
                            <span className="text-[11px] text-zinc-400">
                              {art.date || (art.created_at ? new Date(art.created_at).toLocaleDateString() : '')}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-zinc-200 mt-1">{art.title}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[#b5ff42] font-semibold">{art.views || '0'} Views</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Panel 2: Saved Articles */}
            {activeTab === 'saved' && (
              <div>
                <h2 className="text-sm font-extrabold uppercase text-[#b5ff42] tracking-wider mb-4">Saved Articles</h2>
                {savedArticles.length === 0 ? (
                  <p className="text-sm text-zinc-500">No saved articles yet.</p>
                ) : (
                  <div className="space-y-3">
                    {savedArticles.map((art) => (
                      <div key={art.id} className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                        <div>
                          <span className="text-[10px] bg-[#1a2e05] text-[#b5ff42] px-2 py-0.5 rounded font-bold uppercase">{art.category}</span>
                          <h3 className="text-sm font-bold text-zinc-200 mt-1">{art.title}</h3>
                        </div>
                        <button
                          onClick={() => setSavedArticles(savedArticles.filter((a) => a.id !== art.id))}
                          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Followers Modal Popup */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-extrabold uppercase text-[#b5ff42] tracking-wider">Followers ({followersList.length})</h3>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-zinc-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {followersList.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <img src={follower.avatar} alt={follower.name} className="w-9 h-9 rounded-full object-cover border border-[#b5ff42]/40" />
                    <div>
                      <p className="text-xs font-bold text-white">{follower.name}</p>
                      <p className="text-[10px] text-zinc-400">{follower.handle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-black text-[#b5ff42] border border-[#b5ff42]/30 px-2.5 py-1 rounded-md font-semibold">Follower</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal Popup */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-extrabold uppercase text-[#b5ff42] tracking-wider">Following ({followingList.length})</h3>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-zinc-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {followingList.map((followedUser) => (
                <div key={followedUser.id} className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <img src={followedUser.avatar} alt={followedUser.name} className="w-9 h-9 rounded-full object-cover border border-[#b5ff42]/40" />
                    <div>
                      <p className="text-xs font-bold text-white">{followedUser.name}</p>
                      <p className="text-[10px] text-zinc-400">{followedUser.handle}</p>
                    </div>
                  </div>
                  <button className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-2.5 py-1 rounded-md font-semibold cursor-pointer">
                    Following
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}