// src/app/dmca/page.tsx
'use client';

import React from 'react';

export default function DmcaPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-zinc-300 space-y-12 leading-relaxed">
      
      {/* Header Section */}
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">
          Legal
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
          DMCA Policy
        </h1>
        <p className="text-lg text-zinc-400 pt-2">
          Last Updated: October 26, 2023
        </p>
      </header>

      <section className="space-y-6 text-zinc-400 border-t border-zinc-800 pt-12">
        <p>
          Comicspell ("we," "our," or "us") respects the intellectual property rights 
          of others and expects our users to do the same. It is our policy to respond 
          to clear notices of alleged copyright infringement that comply with the 
          United States Digital Millennium Copyright Act ("DMCA") of 1998, the text 
          of which can be found on the U.S. Copyright Office website at 
          <a href="https://www.copyright.gov" target="_blank" rel="noopener noreferrer" className="text-[#b5ff42] hover:underline ml-1">
            https://www.copyright.gov
          </a>.
        </p>
        <p>
          This DMCA Policy describes how we handle copyright infringement notifications 
          and the procedure for submitting a takedown request.
        </p>
        <p className="font-semibold text-zinc-100">
          Designated Copyright Agent
        </p>
        <p>
          We have registered a Designated Copyright Agent with the United States Copyright 
          Office. If you believe that your work has been copied in a way that constitutes 
          copyright infringement, please submit your Notification of Alleged Infringement 
          to our Designated Copyright Agent at:
        </p>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-sm text-zinc-300 max-w-lg">
          <p className="font-bold text-white">Comicspell Legal Department</p>
          <p>Attn: DMCA Copyright Agent</p>
          <p>[Insert Physical Address Line 1]</p>
          <p>[Insert City, State, Zip Code]</p>
          <p>Email: <a href="mailto:legal@comicspell.com" className="text-[#b5ff42] hover:underline">legal@comicspell.com</a></p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            1. Notice of Infringement
          </h2>
          <p>
            If you are a copyright owner, or authorized to act on behalf of one, and 
            you believe that content residing on or accessible through the Site infringes 
            your copyright, please send a written notice of infringement ("DMCA Notice") 
            to our Designated Agent (contact information provided above).
          </p>
          <p>
            To be effective, your DMCA Notice must include the following:
          </p>
          <ul className="list-decimal list-inside pl-2 space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-100">A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</span>
            </li>
            <li>
              <span className="text-zinc-100">Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.</span>
            </li>
            <li>
              <span className="text-zinc-100">Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material (e.g., a specific URL).</span>
            </li>
            <li>
              <span className="text-zinc-100">Information reasonably sufficient to permit us to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</span>
            </li>
            <li>
              <span className="text-zinc-100">A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</span>
            </li>
            <li>
              <span className="text-zinc-100">A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</span>
            </li>
          </ul>
          <p className="pt-4">
            Please note that under Section 512(f) of the DMCA, any person who knowingly 
            materially misrepresents that material or activity is infringing may be subject 
            to liability.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            2. Counter-Notification
          </h2>
          <p>
            If you believe that your content was removed (or to which access was disabled) 
            as a result of a mistake or misidentification of the material, you may submit 
            a counter-notification to our Designated Agent.
          </p>
          <p>
            To be effective, your Counter-Notification must be in writing and include 
            the following:
          </p>
          <ul className="list-decimal list-inside pl-2 space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-100">Your physical or electronic signature.</span>
            </li>
            <li>
              <span className="text-zinc-100">Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to was disabled.</span>
            </li>
            <li>
              <span className="text-zinc-100">A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled.</span>
            </li>
            <li>
              <span className="text-zinc-100">Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which the service provider may be found, and that you will accept service of process from the person who provided notification under subsection (c)(1)(C) or an agent of such person.</span>
            </li>
          </ul>
          <p className="pt-4">
            If we receive a counter-notification, we may send a copy of the counter-notification 
            to the original complaining party informing them that we may replace the removed 
            material or cease disabling it in 10 business days. Unless the copyright owner files 
            an action seeking a court order against the content provider, the removed material 
            may be replaced, or access to it restored, in 10 to 14 business days or more after 
            receipt of the counter-notification, at our sole discretion.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            3. Repeat Infringers
          </h2>
          <p>
            It is our policy, in appropriate circumstances and at our discretion, to 
            terminate the accounts of users who are deemed to be repeat infringers.
          </p>
        </div>
      </section>

    </main>
  );
}