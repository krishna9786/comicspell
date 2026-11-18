// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleReload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <header className="flex justify-between items-center px-6 py-0 relative bg-black/95 backdrop-blur border-b border-zinc-900 shadow-md w-full">
          <div className="absolute inset-0 flex -z-10">
            <div className="w-1/2 bg-[#b5ff42]"></div>
            <div className="w-1/2 bg-black"></div>
          </div>

          <div className="relative z-10 flex items-center py-2">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-black text-2xl focus:outline-none cursor-pointer p-1 rounded hover:bg-black/10 transition"
            >
              &#9776;
            </button>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 z-10 h-full flex items-center">
            <Link href="/" onClick={handleReload} className="cursor-pointer block h-full flex items-center">
              <span className="font-black tracking-wider text-5xl uppercase bg-black text-[#b5ff42] px-5 h-full flex items-center justify-center leading-none">
                CS
              </span>
            </Link>
          </div>

          <div className="relative z-10 flex items-center h-full py-2" ref={dropdownRef}>
            <div className="absolute -top-1 left-1 z-25 pointer-events-none transition-transform duration-500 hover:scale-110 -rotate-12">
              <svg viewBox="0 0 512 512" className="w-7 h-7 fill-[#ffcc00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-bounce">
                <ellipse cx="256" cy="300" rx="220" ry="60" fill="#f4d03f" stroke="#d4ac0d" strokeWidth="12" />
                <path d="M136 280 C136 150, 376 150, 376 280 Z" fill="#f9e79f" stroke="#d4ac0d" strokeWidth="10" />
                <path d="M120 290 Q256 330 392 290 Q392 320 256 340 Q120 320 120 290 Z" fill="#cb4335" />
              </svg>
            </div>

            {isSignedIn && user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none cursor-pointer"
                >
                  <Image 
                    src={user.imageUrl} 
                    alt="Profile" 
                    width={36} 
                    height={36} 
                    unoptimized
                    className="rounded-full border-2 border-[#b5ff42] object-cover hover:scale-105 transition-all shadow-[0_0_10px_rgba(181,255,66,0.4)]"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#121212] border border-[#b5ff42]/30 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-zinc-800 bg-black/40">
                      <p className="text-[10px] text-[#b5ff42] font-extrabold uppercase tracking-widest">Account</p>
                      <p className="text-xs text-gray-300 truncate font-mono mt-0.5">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/user-profile" 
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-[#1a2e05] hover:text-[#b5ff42] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>⚙️</span> My Profile
                      </Link>
                      <Link 
                        href="/bookmarks" 
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-[#1a2e05] hover:text-[#b5ff42] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>🔖</span> Saved Articles
                      </Link>
                    </div>

                    <div className="border-t border-zinc-800 pt-1">
                      <button 
                        onClick={() => signOut()} 
                        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer font-semibold"
                      >
                        <span>🚪</span> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="group relative inline-flex items-center justify-center bg-black text-[#b5ff42] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg border border-[#b5ff42]/30 overflow-visible transition-all duration-300 hover:border-[#b5ff42] hover:shadow-[0_0_20px_rgba(181,255,66,0.4)] hover:scale-105"
              >
                <span className="tracking-wide leading-tight">Login / Register</span>
              </Link>
            )}
          </div>
        </header>

        <nav className="bg-black border-b border-zinc-900 py-3 flex justify-center space-x-8 text-sm font-medium text-zinc-300">
          <Link href="/category/marvel" className="transition hover:text-white hover:text-[#b5ff42]">Marvel</Link>
          <Link href="/category/dc-comics" className="transition hover:text-white hover:text-[#b5ff42]">DC Comics</Link>
          <Link href="/category/anime" className="transition hover:text-white hover:text-[#b5ff42]">Anime</Link>
          <Link href="/category/movies-series" className="transition hover:text-white hover:text-[#b5ff42]">Movies/Series</Link>
          <Link href="/category/k-drama" className="transition hover:text-white hover:text-[#b5ff42]">K-Drama</Link>
        </nav>
      </div>

      {/* Slide-out Left Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          <div className="relative w-80 max-w-full bg-[#121212] border-r border-zinc-800 text-white h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <span className="font-black tracking-wider text-xl uppercase bg-black text-[#b5ff42] px-2.5 py-1 rounded">
                  CS
                </span>
                <span className="font-extrabold text-sm tracking-widest text-[#b5ff42] uppercase">
                  Comicspell
                </span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-zinc-400 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
              >
                &#x2715;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Categories</p>
                <nav className="flex flex-col space-y-2 text-sm font-medium">
                  <Link href="/category/marvel" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-[#b5ff42] hover:translate-x-1 transition duration-200 py-1.5 flex items-center justify-between">
                    <span>Marvel</span>
                    <span className="text-xs text-zinc-600">&rarr;</span>
                  </Link>
                  <Link href="/category/dc-comics" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-[#b5ff42] hover:translate-x-1 transition duration-200 py-1.5 flex items-center justify-between">
                    <span>DC Comics</span>
                    <span className="text-xs text-zinc-600">&rarr;</span>
                  </Link>
                  <Link href="/category/anime" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-[#b5ff42] hover:translate-x-1 transition duration-200 py-1.5 flex items-center justify-between">
                    <span>Anime</span>
                    <span className="text-xs text-zinc-600">&rarr;</span>
                  </Link>
                  <Link href="/category/movies-series" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-[#b5ff42] hover:translate-x-1 transition duration-200 py-1.5 flex items-center justify-between">
                    <span>Movies/Series</span>
                    <span className="text-xs text-zinc-600">&rarr;</span>
                  </Link>
                  <Link href="/category/k-drama" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-[#b5ff42] hover:translate-x-1 transition duration-200 py-1.5 flex items-center justify-between">
                    <span>K-Drama</span>
                    <span className="text-xs text-zinc-600">&rarr;</span>
                  </Link>
                </nav>
              </div>

              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Quick Links</p>
                <nav className="flex flex-col space-y-2 text-sm font-medium">
                  <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-[#b5ff42] transition py-1">About Us</Link>
                  <Link 
                    href="/write-for-us" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-[#b5ff42] font-semibold transition py-1 flex items-center justify-between"
                  >
                    <span>Write For Us</span>
                    <span className="text-xs bg-[#b5ff42]/10 px-2 py-0.5 rounded border border-[#b5ff42]/30 text-[#b5ff42]">Portal &rarr;</span>
                  </Link>
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-[#b5ff42] transition py-1">Contact Us</Link>
                  <Link href="/disclaimer" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-[#b5ff42] transition py-1">Disclaimer</Link>
                </nav>
              </div>

              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Follow Us</p>
                <div className="flex space-x-3 text-white">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-2.5 rounded-full hover:bg-[#b5ff42] hover:text-black transition">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-2.5 rounded-full hover:bg-[#b5ff42] hover:text-black transition">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-2.5 rounded-full hover:bg-[#b5ff42] hover:text-black transition">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-2.5 rounded-full hover:bg-[#b5ff42] hover:text-black transition">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 bg-black/40">
              <Link
                href="/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-[#b5ff42] text-black font-bold text-xs py-3 rounded-xl flex items-center justify-center hover:opacity-90 transition shadow-lg"
              >
                Login / Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}