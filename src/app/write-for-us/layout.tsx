// src/app/write-for-us/layout.tsx
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Link from 'next/link';

export default function WriteForUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="h-screen bg-black text-white antialiased flex flex-col overflow-hidden">
        {/* Full-width Top Navigation for Writer Workspace */}
        <header className="flex items-center justify-between px-6 py-3 bg-black border-b border-zinc-900 w-full shrink-0 text-xs">
          <div className="flex items-center space-x-3">
            <Link href="/" className="font-black tracking-wider text-base uppercase bg-black text-[#b5ff42] px-2 py-0.5 rounded border border-zinc-800">
              CS
            </Link>
            <span className="font-extrabold tracking-widest text-[#b5ff42] uppercase">
              Comicspell Writer Portal
            </span>
          </div>
          
          <div className="flex items-center space-x-4 font-medium text-zinc-400">
            <Link href="/write-for-us/formatting" target="_blank" rel="noopener noreferrer" className="hover:text-[#b5ff42] transition hidden md:inline">
              Guidelines & Rules to Write
            </Link>
            <Link
              href="/"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold px-3 py-1.5 rounded-lg transition border border-zinc-800"
            >
              Back to Main Site
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-black flex flex-col overflow-hidden">{children}</main>
      </div>
    </ClerkProvider>
  );
}