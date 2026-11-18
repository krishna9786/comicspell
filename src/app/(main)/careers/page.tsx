// src/app/careers/page.tsx 
'use client';

import React from 'react';

// Define structure for a role
interface Role {
  id: string;
  title: string;
  type: string; // e.g., "Remote / Part-Time"
  description: string;
  category: 'Editorial' | 'Engineering' | 'Creative' | 'Internship';
}

// Centralized data for open roles
const openRoles: Role[] = [
  { id: 'ed-marvel', title: 'Staff Writer (Marvel Focus)', type: 'Remote / Part-Time', description: 'Covering MCU lore, comic deep-dives, and breaking news.', category: 'Editorial' },
  { id: 'ed-dc', title: 'Staff Writer (DC Focus)', type: 'Remote / Part-Time', description: 'Analyzing Elseworlds, DCEU, and classic comic storylines.', category: 'Editorial' },
  { id: 'ed-anime', title: 'Staff Writer (Anime & Manga)', type: 'Remote / Part-Time', description: 'Episode reviews, character analysis, and industry updates.', category: 'Editorial' },
  { id: 'ed-kdrama', title: 'Staff Writer (K-Drama Focus)', type: 'Remote / Part-Time', description: 'Deep-dive analyses, reviews, and trend pieces.', category: 'Editorial' },
  { id: 'ed-movies', title: 'Staff Writer (General Movies & TV)', type: 'Remote / Part-Time', description: 'Covering sci-fi, fantasy, and blockbuster hits.', category: 'Editorial' },
  { id: 'ed-senior', title: 'Senior Editor (Comics)', type: 'Remote / Contract', description: 'Reviewing pitches, polishing features, and maintaining standards.', category: 'Editorial' },
  { id: 'eng-soft', title: 'Software Engineer', type: 'Remote / Full-Time', description: 'Build and scale Next.js platform, interactive features.', category: 'Engineering' },
  { id: 'eng-cloud', title: 'Cloud Infrastructure Engineer', type: 'Remote / Contract', description: 'Manage AWS/Vercel hosting and CI/CD pipelines.', category: 'Engineering' },
  { id: 'soc-strat', title: 'Social Media Strategist', type: 'Remote / Full-Time', description: 'Drive engagement across X, IG, TikTok with creative campaigns.', category: 'Creative' },
  { id: 'soc-vis', title: 'Visual Content Editor (Photo focus)', type: 'Remote / Part-Time', description: 'Curate, edit, and create stunning imagery and graphics.', category: 'Creative' },
  { id: 'soc-vid', title: 'Video Editor', type: 'Remote / Contract', description: 'Edit long-form video essays and short-form social clips.', category: 'Creative' },
  { id: 'int-writer', title: 'Content Writer Intern', type: 'Remote / Stipend', description: '3-month program for aspiring writers to get published.', category: 'Internship' },
];

// Helper to filter roles by category
const getRolesByCategory = (category: Role['category']) => 
  openRoles.filter(role => role.category === category);

// Reusable component for a role card
const RoleCard = ({ title, type, description }: Omit<Role, 'id' | 'category'>) => (
  <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-3 hover:border-[#b5ff42]/30 transition group">
    <div className="flex justify-between items-start gap-4">
      <h3 className="text-xl font-semibold text-white group-hover:text-[#b5ff42] transition">{title}</h3>
      <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 whitespace-nowrap">{type}</span>
    </div>
    <p className="text-sm text-zinc-400">{description}</p>
  </div>
);

export default function CareersPage() {
  const editorialRoles = getRolesByCategory('Editorial');
  const engineeringRoles = getRolesByCategory('Engineering');
  const creativeRoles = getRolesByCategory('Creative');
  const internships = getRolesByCategory('Internship');

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 text-zinc-300 space-y-20">
      
      {/* Header Section */}
      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">
          Join the Crew
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
          Shape the Future of Fandom
        </h1>
        <p className="text-xl text-zinc-400 pt-4 leading-relaxed">
          Comicspell is building the ultimate nexus for genre entertainment. 
          We are looking for passionate, talented individuals to help us dive deeper 
          into the stories that connect us.
        </p>
      </header>

      {/* Open Roles Section Grid */}
      <section className="grid md:grid-cols-3 gap-10 items-start">
        <div className="md:col-span-2 space-y-10">
          
          {/* Editorial Roles Category */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">Editorial & Content</h2>
            {editorialRoles.map(role => <RoleCard key={role.id} {...role} />)}
          </div>

          {/* Engineering Roles Category */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">Engineering & Tech</h2>
            {engineeringRoles.map(role => <RoleCard key={role.id} {...role} />)}
          </div>

          {/* Creative Roles Category */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">Creative & Social</h2>
            {creativeRoles.map(role => <RoleCard key={role.id} {...role} />)}
          </div>

          {/* Internships Category */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">Internships</h2>
            {internships.map(role => <RoleCard key={role.id} {...role} />)}
          </div>

          {/* And More / General App */}
          <div className="text-center pt-8 border-t border-zinc-900">
            <p className="text-zinc-500 italic">Don't see the perfect fit but know you belong at Comicspell?<br /> We're always looking for exceptional talent.</p>
            <a href="#apply" className="text-[#b5ff42] font-bold hover:underline mt-2 inline-block">Send us a general application →</a>
          </div>

        </div>

        {/* Application Sidebar */}
        <div id="apply" className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-6 sticky top-24 shadow-xl">
          <h3 className="text-2xl font-bold text-white">Quick Apply</h3>
          <p className="text-xs text-zinc-400">
            Passionate about lore? Send us your details. If you have a resume or portfolio link, please include it.
          </p>
          
          <form className="space-y-5">
            {/* Name - Required */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs text-zinc-300 font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b5ff42] transition placeholder:text-zinc-600"
                placeholder="John Doe"
              />
            </div>

            {/* Email - Required */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs text-zinc-300 font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b5ff42] transition placeholder:text-zinc-600"
                placeholder="john@example.com"
              />
            </div>

            {/* Role Interest - Dynamically populated from Part 1 data */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs text-zinc-300 font-medium">Role You're Interested In</label>
              <select 
                id="role" 
                name="role" 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b5ff42] transition"
              >
                <option value="">Select a role...</option>
                {openRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.title}</option>
                ))}
                <option value="general">General Application</option>
              </select>
            </div>

            {/* Portfolio/Resume - Required */}
            <div className="space-y-1.5">
              <label htmlFor="portfolio" className="text-xs text-zinc-300 font-medium">
                Portfolio or Resume Link <span className="text-red-500">*</span>
              </label>
              <input 
                type="url" 
                id="portfolio" 
                name="portfolio" 
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b5ff42] transition placeholder:text-zinc-600"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs text-zinc-300 font-medium">Why Comicspell? (Optional)</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b5ff42] transition resize-none"
                placeholder="Tell us about your favorite fandoms and why you want to write/work for us..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#b5ff42] text-black font-bold text-sm py-3 rounded-xl hover:opacity-90 transition cursor-pointer active:scale-95"
            >
              Submit Application
            </button>
            <p className="text-[10px] text-zinc-600 text-center">Powered by Tally.so / Google Forms</p>
          </form>
        </div>
      </section>

      {/* Values/Culture Section */}
      <section className="border-t border-zinc-900 pt-20 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-white">How We Work</h2>
            <p className="text-zinc-400">It's not just about what you know, but how you contribute to our growing nexus.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl space-y-3">
            <span className="text-4xl">🌎</span>
            <h4 className="font-bold text-white">100% Remote First</h4>
            <p className="text-zinc-400">Work from anywhere. We value asynchronous communication and output over hours spent at a desk.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl space-y-3">
            <span className="text-4xl">🚀</span>
            <h4 className="font-bold text-white">Ownership & Impact</h4>
            <p className="text-zinc-400">Every team member has a direct line to leadership and the ability to shape the direction of the platform.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl space-y-3">
            <span className="text-4xl">🤓</span>
            <h4 className="font-bold text-white">For Fans, By Fans</h4>
            <p className="text-zinc-400">Our shared passion for anime, K-Dramas, and comics is the foundation of everything we build.</p>
          </div>
        </div>
      </section>

       {/* Final Direct Contact */}
      <section className="border-t border-zinc-900 pt-20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Still have questions?</h3>
        <p className="text-sm text-zinc-400">
          Feel free to reach out to our hiring team directly regarding the status of your application or specific role requirements.<br />
          Email us at: <a href="mailto:comicspell97inbox@gmail.com" className="text-[#b5ff42] hover:underline">comicspell97inbox@gmail.com</a>
        </p>
      </section>

    </main>
  );
}