// src/app/privacy-policy/page.tsx
'use client';

import React from 'react';

// This 'export default' is mandatory for Next.js App Router pages.
export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-zinc-300 space-y-12 leading-relaxed">
      
      {/* Header Section */}
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">
          Legal
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-lg text-zinc-400 pt-2">
          Last Updated: October 26, 2023
        </p>
      </header>

      <section className="space-y-6 text-zinc-400 border-t border-zinc-800 pt-12">
        <p>
          Welcome to Comicspell ("we," "our," or "us"). We are committed to protecting your 
          personal information and your right to privacy. If you have any questions or 
          concerns about this policy or our practices with regard to your personal 
          information, please contact us at{' '}
          <a href="mailto:comicspell97inbox@gmail.com" className="text-[#b5ff42] hover:underline">
            comicspell97inbox@gmail.com
          </a>.
        </p>
        <p>
          When you visit our website comicspell.com (the "Site"), and use our services, 
          you trust us with your personal information. We take your privacy very seriously. 
          In this privacy policy, we describe how we collect, use, and disclose information 
          that we obtain about visitors to our Site and users of our services.
        </p>
        <p className="font-semibold text-zinc-100">
          Please read this privacy policy carefully. If you do not agree with any terms 
          of this privacy policy, please do not access the Site or use our services.
        </p>
      </section>

      {/* Policy Content Sections */}
      <section className="space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            1. Information We Collect Automatically
          </h2>
          <p>
            When you visit, navigate, and interact with the Site, we may automatically 
            collect certain information about your device and usage of the Site. This 
            information does not reveal your specific identity (like your name or contact 
            information) but may include device and usage information, such as your IP 
            address, browser and device characteristics, operating system, language 
            preferences, referring URLs, device name, country, location, information about 
            how and when you use our Site, and other technical information.
          </p>
          <p>
            This information is primarily needed to maintain the security and operation 
            of our Site, and for our internal analytics and reporting purposes.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            2. How We Use Your Information
          </h2>
          <p>
            We use personal information collected via our Site for a variety of business 
            purposes described below. We process your personal information for these 
            purposes in reliance on our legitimate business interests, in order to enter 
            into or perform a contract with you, with your consent, and/or for compliance 
            with our legal obligations.
          </p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-100">To facilitate account creation and logon process.</span>
            </li>
            <li>
              <span className="text-zinc-100">To send you marketing and promotional communications.</span>
            </li>
            <li>
              <span className="text-zinc-100">To deliver targeted advertising to you.</span>
            </li>
            <li>
              <span className="text-zinc-100">To request feedback and to contact you about your use of our Site.</span>
            </li>
            <li>
              <span className="text-zinc-100">To protect our Site (e.g., for fraud monitoring and prevention).</span>
            </li>
            <li>
              <span className="text-zinc-100">To enforce our terms, conditions, and policies.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            3. Will Your Information Be Shared With Anyone?
          </h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you 
            with services, to protect your rights, or to fulfill business obligations.
          </p>
          <p>
            We may process or share data based on the following legal basis:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-2 text-zinc-400">
            <li>
              <strong className="text-zinc-100">Consent:</strong> We may use your data if you have 
              given us specific consent to use your personal information for a specific purpose.
            </li>
            <li>
              <strong className="text-zinc-100">Legitimate Interests:</strong> We may process your 
              data when it is reasonably necessary to achieve our legitimate business interests.
            </li>
            <li>
              <strong className="text-zinc-100">Legal Obligations:</strong> We may disclose your 
              data where we are legally required to do so in order to comply with applicable law, 
              governmental requests, a judicial proceeding, court order, or legal process.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            4. Do We Use Cookies and Other Tracking Technologies?
          </h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) 
            to access or store information. Specific information about how we use such 
            technologies and how you can refuse certain cookies is set out in our Cookie Policy.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            5. Updates to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. The updated version will be 
            indicated by an updated "Revised" date and the updated version will be effective 
            as soon as it is accessible. We encourage you to review this privacy policy 
            frequently to be informed of how we are protecting your information.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            6. Contact Us
          </h2>
          <p>
            If you have questions or comments about this policy, you may email us at{' '}
            <a href="mailto:comicspell97inbox@gmail.com" className="text-[#b5ff42] hover:underline">
              comicspell97inbox@gmail.com
            </a>{' '}
            or by post at:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-sm text-zinc-300 max-w-lg">
            <p>Comicspell Legal Department</p>
            <p>[Insert Physical Address Line 1]</p>
            <p>[Insert City, State, Zip Code]</p>
            <p>[Insert Country]</p>
          </div>
        </div>
      </section>

    </main>
  );
}