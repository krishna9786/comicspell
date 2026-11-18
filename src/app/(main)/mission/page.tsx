// src/app/mission/page.tsx
'use client';

import React, { useState } from 'react';

export default function MissionPage() {
  // State for Luffy Card - cycles through 3 messages/emojis
  const [luffyState, setLuffyState] = useState(0);
  // State for Spider-Man Card - toggles webbed state
  const [spideyWebbed, setSpideyWebbed] = useState(false);
  // State for Batman Card - toggles between visible and "vanished"
  const [batmanTriggered, setBatmanTriggered] = useState(false);
  // State for K-Drama Card - toggles between crying and heart pose
  const [kdHeart, setKdHeart] = useState(false);

  const luffyMessages = [
    "Luffy is searching for meat on the Grand Line.",
    "He is picking his nose while ignoring Zoro's directions!",
    "Gomu Gomu no... Nose Picker activated! 🍖✨"
  ];

  const handleLuffyClick = () => {
    setLuffyState((prev) => (prev + 1) % luffyMessages.length);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-zinc-300 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">Our Mission</span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Driving Fandom Culture Forward
        </h1>
        <p className="text-lg text-zinc-400">
          Empowering fans, theorists, and creators with deep insights and an unmatched community platform.
        </p>
      </div>

      {/* Interactive Fandom Zone */}
      <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6 relative overflow-hidden">
        {/* Background decorative blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#b5ff42]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#b5ff42] bg-[#b5ff42]/10 px-3 py-1 rounded-full">
            Interactive Zone
          </span>
          <h2 className="text-2xl font-bold text-white">The Multiverse Hub</h2>
          <p className="text-xs text-zinc-400">Click buttons to trigger live animations with your favorite characters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 relative z-10">
          
          {/* Luffy Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-[#b5ff42]/50 transition duration-300 group">
            <div className="space-y-3 text-center">
              {/* Animated Emoji */}
              <div className={`text-5xl inline-block ${luffyState === 2 ? 'animate-ping' : 'animate-bounce'}`}>
                {luffyState === 2 ? '🏴‍☠️🍖' : '🏴‍☠️'}
              </div>
              <span className="text-xs font-bold text-white block group-hover:text-[#b5ff42] transition">Monkey D. Luffy</span>
              <p className="text-xs text-zinc-400 min-h-[40px] transition-opacity duration-500">
                {luffyMessages[luffyState]}
              </p>
            </div>
            <button 
              onClick={handleLuffyClick}
              className="w-full bg-zinc-800 hover:bg-[#b5ff42] hover:text-black text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer active:scale-95 mt-4"
            >
              {luffyState === 0 ? "Poke Luffy" : luffyState === 1 ? "Keep Poking" : "Reset Luffy"}
            </button>
          </div>

          {/* Spider-Man Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-[#b5ff42]/50 transition duration-300 group">
            <div className="space-y-3 text-center">
              {/* Conditional Animation */}
              <div className={`text-5xl inline-block ${spideyWebbed ? 'animate-spin' : 'animate-pulse'}`}>
                🕷️🕸️
              </div>
              <span className="text-xs font-bold text-white block group-hover:text-[#b5ff42] transition">Spider-Man</span>
              <p className="text-xs text-zinc-400 min-h-[40px]">
                {spideyWebbed ? "Thwip! Trapped in a sticky web of multiverse lore!" : "Swinging through New York skyscrapers."}
              </p>
            </div>
            <button 
              onClick={() => setSpideyWebbed(!spideyWebbed)}
              className="w-full bg-zinc-800 hover:bg-[#b5ff42] hover:text-black text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer active:scale-95 mt-4"
            >
              {spideyWebbed ? "Break Web" : "Shoot Web!"}
            </button>
          </div>

          {/* Batman Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-[#b5ff42]/50 transition duration-300 group">
            <div className="space-y-3 text-center">
              {/* Transition and Transform animation */}
              <div className={`text-5xl inline-block transition-all duration-700 ease-in-out ${batmanTriggered ? 'opacity-10 scale-50 rotate-180' : 'opacity-100 scale-100 rotate-0 animate-pulse'}`}>
                🦇⚡
              </div>
              <span className="text-xs font-bold text-white block group-hover:text-[#b5ff42] transition">Batman</span>
              <p className="text-xs text-zinc-400 min-h-[40px]">
                {batmanTriggered ? "*Disappears into shadows* 'I am vengeance.'" : "Staring menacingly from a Gotham gargoyle."}
              </p>
            </div>
            <button 
              onClick={() => setBatmanTriggered(!batmanTriggered)}
              className="w-full bg-zinc-800 hover:bg-[#b5ff42] hover:text-black text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer active:scale-95 mt-4"
            >
              {batmanTriggered ? "Turn on Bat-Signal" : "Turn off Lights"}
            </button>
          </div>

          {/* K-Drama Vibe Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-[#b5ff42]/50 transition duration-300 group">
            <div className="space-y-3 text-center">
              {/* Color change and bounce */}
              <div className={`text-5xl inline-block ${kdHeart ? 'animate-bounce text-pink-500' : 'animate-pulse'}`}>
                {kdHeart ? '💖✨☕' : '🌧️🚶‍♂️'}
              </div>
              <span className="text-xs font-bold text-white block group-hover:text-[#b5ff42] transition">K-Drama Vibe</span>
              <p className="text-xs text-zinc-400 min-h-[40px]">
                {kdHeart ? "Finger Heart! Romantic plot twist unlocked under the neon lights!" : "Waiting for the dramatic rain scene under a streetlamp."}
              </p>
            </div>
            <button 
              onClick={() => setKdHeart(!kdHeart)}
              className="w-full bg-zinc-800 hover:bg-[#b5ff42] hover:text-black text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer active:scale-95 mt-4"
            >
              {kdHeart ? "Reset Scene" : "Send Finger Heart 🫰"}
            </button>
          </div>

        </div>
      </section>

      {/* Why Comicspell Exists */}
      <section className="space-y-4 border-t border-zinc-900 pt-8">
        <h2 className="text-2xl font-bold text-white">Why Comicspell Exists</h2>
        <p className="leading-relaxed text-zinc-300">
          The internet is full of surface-level summaries, but true fans crave depth. Comicspell was built to provide a dedicated space where complex lore, detailed character breakdowns, and multiverse theories are met with the passion they deserve.
        </p>
      </section>

      {/* Our Core Pillars */}
      <section className="space-y-4 border-t border-zinc-900 pt-8">
        <h2 className="text-2xl font-bold text-white">Our Core Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-base">Uncompromising Quality</h3>
            <p className="text-xs text-zinc-400">Every breakdown and article is rigorously researched and crafted for true enthusiasts.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-base">Community First</h3>
            <p className="text-xs text-zinc-400">Fandoms thrive on discussion. Our interactive features ensure every voice adds to the story.</p>
          </div>
        </div>
      </section>
    </main>
  );
}