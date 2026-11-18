// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen py-16 px-6 flex items-center justify-center overflow-hidden">
      
      {/* STATIC SPIDER WEB AT THE TOP-LEFT CORNER (ROTATING SLOWLY) */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none text-7xl animate-[spin_20s_linear_infinite] opacity-60 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
        🕸️
      </div>

      {/* MAIN CONTENT BOX */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 text-zinc-300 space-y-12 transition-all duration-700 rounded-3xl relative z-10 border bg-zinc-950/90 shadow-[0_0_30px_rgba(255,255,255,0.05)] border-zinc-900">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Contact Comicspell
          </h1>
          <p className="text-lg text-zinc-400">
            Have a theory to share, a bug to report, or want to collaborate? Send us a signal across the multiverse.
          </p>
        </div>

        {/* Contact Form & Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
          
          {/* Form */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-white">Send a Message</h2>
            
            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-2">
                <div className="text-4xl">💌✨</div>
                <h3 className="text-white font-bold text-base">Transmission Received!</h3>
                <p className="text-xs text-zinc-400">Thanks for reaching out. Our team will review your message across dimensions shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Your Name / Hero Alias</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g., Monkey D. Luffy" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b5ff42] transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="hero@comicspell.com" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b5ff42] transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Message / Theory</label>
                  <textarea 
                    required 
                    rows={4}
                    placeholder="Tell us what's on your mind..." 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b5ff42] transition resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-white text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-[#b5ff42] transition cursor-pointer"
                >
                  Transmit Message 🚀
                </button>
              </form>
            )}
          </div>

          {/* Direct Info */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-white">Direct Channels</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Prefer direct communication? Reach out to us via our primary frequencies or social dimensions.
              </p>
              
              <div className="space-y-3 pt-2 text-sm">
                <div className="flex items-center gap-3 text-zinc-300">
                  <span className="text-lg">📧</span>
                  <span>comicspell97inbox@gmial.com</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <span className="text-lg">💬</span>
                  <span>Discord Community (Coming Soon)</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <span className="text-lg">🌍</span>
                  <span>Global Multiverse Network</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-3xl text-center">
              <p className="text-xs text-zinc-500 font-medium">
                Comicspell • Powered by Fandom Energy ⚡
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}