// src/app/write-for-us/formatting/page.tsx
import Link from 'next/link';

export default function GuidelinesAndRulesPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-black text-[#b5ff42] uppercase tracking-wider">
            Guidelines &amp; Rules to Write
          </h1>
          <Link
            href="/write-for-us"
            className="text-xs font-bold text-zinc-300 hover:text-[#b5ff42]"
          >
            ← Back to Editor
          </Link>
        </div>

        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#b5ff42] mb-1">
            Writer Motivation
          </p>
          <p className="text-sm text-zinc-200 italic leading-relaxed">
            Your voice, breakdown, and perspective are what make readers stay—write with honesty,
            curiosity, and care, and every article you publish builds something real.
          </p>
        </div>

        <ol className="space-y-4 text-sm text-zinc-300 leading-relaxed list-decimal list-inside">
          <li>
            <strong className="text-white">No AI Text or Plagiarism:</strong> Write every article
            yourself in your own voice. Do not paste AI-generated drafts or copy paragraphs from
            other blogs, wikis, or articles.
          </li>
          <li>
            <strong className="text-white">Safe &amp; Allowed Images Only:</strong> Do not pull
            random copyrighted images from Google search. Use your own custom artwork/edits,
            commercial-use images, or standard official/press visuals already widely shared across
            coverage, and fill in accurate Image Credit.
          </li>
          <li>
            <strong className="text-white">How to Structure Your Article:</strong> Start with a clear,
            specific title, break sections into readable paragraphs and Headings (H2), use Spoiler
            Warnings before major twists, and use Tables or Neon Quotes only where they add real value
            to readers.
          </li>
          <li>
            <strong className="text-white">Monetization &amp; Policy Safety:</strong> Keep content
            original, helpful, and free of scraped material, excessive clickbait, or
            harmful/unlawful material so the site stays eligible for ad monetization.
          </li>
        </ol>

        <p className="text-sm font-bold text-[#b5ff42] pt-2">#behappy ✌️</p>
      </div>
    </div>
  );
}