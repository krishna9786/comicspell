// src/app/terms-of-service/page.tsx
'use client';

import React from 'react';

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-zinc-300 space-y-12 leading-relaxed">
      
      {/* Header Section */}
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">
          Legal
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-lg text-zinc-400 pt-2">
          Last Updated: October 26, 2023
        </p>
      </header>

      <section className="space-y-6 text-zinc-400 border-t border-zinc-800 pt-12">
        <p>
          Welcome to Comicspell ("we," "our," or "us"). These Terms of Service ("Terms," 
          "Agreement") govern your use of our website located at comicspell.com (the 
          "Site") and our services (collectively, the "Service").
        </p>
        <p>
          Please read these Terms carefully before using our Service. By accessing or 
          using the Service, you agree to be bound by these Terms. If you disagree with 
          any part of the terms, you may not access the Service.
        </p>
        <p className="font-semibold text-zinc-100">
          1. Use of the Service
        </p>
        <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400">
          <li>
            <strong className="text-zinc-100">Eligibility:</strong> You must be at least 13 
            years of age to use the Service. By using the Service, you represent and 
            warrant that you have the right, authority, and capacity to enter into this 
            Agreement and to abide by all of these Terms.
          </li>
          <li>
            <strong className="text-zinc-100">User Accounts:</strong> To access certain 
            features of the Service, you may be required to create an account. You are 
            responsible for maintaining the confidentiality of your account password and 
            for all activities that occur under your account.
          </li>
          <li>
            <strong className="text-zinc-100">Prohibited Conduct:</strong> You agree not to 
            use the Service for any unlawful or prohibited activities, including but not 
            limited to violating intellectual property rights, transmitting spam, or 
            engaging in any conduct that disrupts or interferes with the Service.
          </li>
        </ul>
      </section>

      {/* Policy Content Sections */}
      <section className="space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            2. Intellectual Property Rights
          </h2>
          <p>
            Unless otherwise indicated, the Service is our proprietary property and all 
            source code, databases, functionality, software, website designs, audio, 
            video, text, photographs, and graphics on the Site (collectively, the "Content") 
            and the trademarks, service marks, and logos contained therein (the "Marks") 
            are owned or controlled by us or licensed to us, and are protected by copyright 
            and trademark laws and various other intellectual property rights and unfair 
            competition laws of the United States, foreign jurisdictions, and international 
            conventions.
          </p>
          <p>
            The Content and the Marks are provided on the Site "AS IS" for your information 
            and personal use only. Except as expressly provided in these Terms of Service, 
            no part of the Service and no Content or Marks may be copied, reproduced, 
            aggregated, republished, uploaded, posted, publicly displayed, encoded, 
            translated, transmitted, distributed, sold, licensed, or otherwise exploited 
            for any commercial purpose whatsoever, without our express prior written 
            permission.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            3. User Contributions
          </h2>
          <p>
            The Service may invite you to chat, contribute to, or participate in blogs, 
            message boards, online forums, and other functionality, and may provide you 
            with the opportunity to create, submit, post, display, transmit, perform, 
            publish, distribute, or broadcast content and materials to us or on the Service, 
            including but not limited to text, writings, video, audio, photographs, graphics, 
            comments, suggestions, or personal information or other material (collectively, 
            "Contributions"). Contributions may be viewable by other users of the Service and 
            through third-party websites.
          </p>
          <p>
            By posting any Contributions, you grant us an unrestricted, irrevocable, 
            perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide 
            right, and license to use, copy, reproduce, modify, adapt, publish, translate, 
            create derivative works from, distribute, perform, and display such 
            Contributions for any purpose, commercial, advertising, or otherwise.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall Comicspell, nor its directors, employees, partners, agents, 
            suppliers, or affiliates, be liable for any indirect, incidental, special, 
            consequential, or punitive damages, including without limitation, loss of profits, 
            data, use, goodwill, or other intangible losses, resulting from (i) your access 
            to or use of or inability to access or use the Service; (ii) any conduct or 
            content of any third party on the Service; (iii) any content obtained from the 
            Service; and (iv) unauthorized access, use, or alteration of your transmissions 
            or content, whether based on warranty, contract, tort (including negligence) or 
            any other legal theory, whether or not we have been informed of the possibility 
            of such damage, and even if a remedy set forth herein is found to have failed of 
            its essential purpose.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            5. Changes to Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms 
            at any time. If a revision is material we will try to provide at least 30 days' 
            notice prior to any new terms taking effect. What constitutes a material change 
            will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after those revisions become effective, 
            you agree to be bound by the revised terms. If you do not agree to the new terms, 
            please stop using the Service.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            6. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:comicspell97inbox@gmail.com" className="text-[#b5ff42] hover:underline">
              comicspell97inbox@gmail.com
            </a>.
          </p>
        </div>
      </section>

    </main>
  );
}