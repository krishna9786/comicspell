// src/app/about/page.tsx
'use client';

import React, { useState } from 'react';

export default function AboutPage() {
  const [clickCount, setClickCount] = useState(0);
  const [powerLevel, setPowerLevel] = useState(9000);
  const [stageMessage, setStageMessage] = useState("It's over 9,000?!");
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const stages = [
    { count: 1, msg: "Stage 1: Anime Vibe - Luffy Gear Spark! 🍖✨", effect: "luffy" },
    { count: 2, msg: "Stage 2: Superhero Vibe - Batman Signal Pop! 🦇💥", effect: "batman" },
    { count: 3, msg: "Stage 3: Comic Vibe - Spider-Man Web Splash! 🕸️⚡", effect: "spider" },
    { count: 4, msg: "Stage 4: K-Drama Vibe - Romantic Hearts & Coffee! 💖☕", effect: "kdrama" },
    { count: 5, msg: "STAGE 5: MULTIVERSE GOD MODE UNLOCKED! 🌌🔥", effect: "godmode" }
  ];

  const handlePowerUp = () => {
    if (clickCount >= 5) return;
    
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    setPowerLevel((prev) => prev + 50000);

    const currentStage = stages.find(s => s.count === nextCount);
    if (currentStage) {
      setStageMessage(currentStage.msg);
      setActiveEffect(currentStage.effect);
    }
  };

  const resetPower = () => {
    setClickCount(0);
    setPowerLevel(9000);
    setStageMessage("It's over 9,000?!");
    setActiveEffect(null);
  };

  const stageThemes = [
    "bg-zinc-950/90 shadow-[0_0_30px_rgba(255,255,255,0.05)] border-zinc-900",
    "bg-amber-950/20 shadow-[0_0_50px_rgba(245,158,11,0.25)] border-amber-500/30",   
    "bg-blue-950/20 shadow-[0_0_50px_rgba(59,130,246,0.3)] border-blue-500/30",     
    "bg-red-950/20 shadow-[0_0_50px_rgba(239,68,68,0.3)] border-red-500/30",       
    "bg-pink-950/20 shadow-[0_0_50px_rgba(236,72,153,0.3)] border-pink-500/30",    
    "bg-emerald-950/30 shadow-[0_0_70px_rgba(181,255,66,0.4)] border-[#b5ff42]/40" 
  ];

  return (
    <div className="relative min-h-screen py-16 px-6 flex items-center justify-center overflow-hidden">
      
      {/* FLOATING EMOJIS DIRECTLY IN FRONT OF THE MAIN BOX (HIGHER Z-INDEX) */}
      
      {/* Stage 1: Luffy Pop In Front */}
      {activeEffect === 'luffy' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 md:px-16 z-30">
          <div className="text-7xl animate-bounce drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">👒🍖</div>
          <div className="text-7xl animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">🍖✨</div>
        </div>
      )}

      {/* Stage 2: Batman Pop In Front */}
      {activeEffect === 'batman' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-around px-8 z-30">
          <div className="text-8xl animate-bounce drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]">🦇</div>
          <div className="text-8xl animate-ping opacity-90">⚡</div>
          <div className="text-8xl animate-bounce delay-150 drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]">🦇</div>
        </div>
      )}

      {/* Stage 3: Spider-Man Pop In Front */}
      {activeEffect === 'spider' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-16 px-8 md:px-20 z-30">
          <div className="flex justify-between w-full">
            <span className="text-7xl animate-ping drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]">🕸️</span>
            <span className="text-7xl animate-bounce drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]">🕷️</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="text-7xl animate-bounce drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]">🕷️</span>
            <span className="text-7xl animate-ping drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]">🕸️</span>
          </div>
        </div>
      )}

      {/* Stage 4: K-Drama Hearts Pop In Front */}
      {activeEffect === 'kdrama' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-around px-4 z-30">
          <div className="text-8xl animate-bounce drop-shadow-[0_0_25px_rgba(236,72,153,0.9)]">💖</div>
          <div className="text-8xl animate-pulse delay-200 drop-shadow-[0_0_25px_rgba(236,72,153,0.9)]">💌</div>
          <div className="text-8xl animate-bounce delay-300 drop-shadow-[0_0_25px_rgba(236,72,153,0.9)]">🌸☕</div>
          <div className="text-8xl animate-pulse drop-shadow-[0_0_25px_rgba(236,72,153,0.9)]">💖</div>
        </div>
      )}

      {/* Stage 5: God Mode Pop In Front */}
      {activeEffect === 'godmode' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-around px-4 z-30">
          <div className="text-9xl animate-spin drop-shadow-[0_0_30px_rgba(181,255,66,0.9)]">✨</div>
          <div className="text-9xl animate-bounce drop-shadow-[0_0_30px_rgba(181,255,66,0.9)]">🔥</div>
          <div className="text-9xl animate-spin drop-shadow-[0_0_30px_rgba(181,255,66,0.9)]">✨</div>
        </div>
      )}

      {/* MAIN CONTENT BOX */}
      <main className={`max-w-4xl w-full mx-auto px-6 py-12 text-zinc-300 space-y-16 transition-all duration-700 rounded-3xl relative z-10 border ${stageThemes[clickCount]}`}>
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">About Comicspell</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Where Fandoms Collide
          </h1>
          <p className="text-lg text-zinc-400">
            Your ultimate multiversal hub for anime breakdowns, manga theories, superhero lore, and K-Drama obsessions.
          </p>
        </div>

        {/* Interactive Power Meter Section */}
        <section className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 rounded-3xl space-y-6 relative z-20">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#b5ff42] bg-[#b5ff42]/10 px-3 py-1 rounded-full">
              Power Meter ({clickCount}/5 Stages)
            </span>
            <h2 className="text-2xl font-bold text-white">Test Your Fandom Energy</h2>
            <p className="text-xs text-zinc-400">Click 5 times to pop animated emojis directly in front of the box!</p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase text-zinc-400">Current Power Level</span>
              <div className={`text-3xl font-black tracking-wider ${clickCount === 5 ? 'text-[#b5ff42] animate-pulse scale-105' : 'text-white'}`}>
                {powerLevel.toLocaleString()} {clickCount === 5 ? '🔥' : '⚡'}
              </div>
              <p className="text-xs text-[#b5ff42] font-medium transition-all">
                {stageMessage}
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {clickCount < 5 ? (
                <button 
                  onClick={handlePowerUp}
                  className="flex-1 sm:flex-none bg-[#b5ff42] text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:opacity-90 transition cursor-pointer active:scale-95 shadow-lg relative z-30"
                >
                  Power Up! ({clickCount}/5) 💥
                </button>
              ) : (
                <button 
                  onClick={resetPower}
                  className="flex-1 sm:flex-none bg-red-500/20 border border-red-500 text-red-400 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-red-500/30 transition cursor-pointer shadow-lg relative z-30"
                >
                  Reset Energy 🔄
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="space-y-4 border-t border-zinc-900 pt-8">
          <h2 className="text-2xl font-bold text-white">Our Origin Story</h2>
          <p className="leading-relaxed">
            Comicspell was born out of late-night manga chapters debates, cinematic universe timeline tracking, and a relentless passion for storytelling. We realized that true fans do not just want surface-level recaps—they want deep dives, hidden easter eggs, and a community that shares the exact same hype.
          </p>
        </section>

        {/* What We Focus On */}
        <section className="space-y-4 border-t border-zinc-900 pt-8">
          <h2 className="text-2xl font-bold text-white">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-2">
              <h3 className="text-white font-bold text-base">Anime & Manga</h3>
              <p className="text-xs text-zinc-400">Deep chapter breakdowns, power scaling debates, and plot theories.</p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-2">
              <h3 className="text-white font-bold text-base">Multiverse Lore</h3>
              <p className="text-xs text-zinc-400">Comic book histories, cinematic connections, and hidden details.</p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-2">
              <h3 className="text-white font-bold text-base">K-Drama Vibes</h3>
              <p className="text-xs text-zinc-400">Iconic scene analysis, emotional OST highlights, and trending releases.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}