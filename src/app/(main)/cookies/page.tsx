// src/app/cookies/page.tsx
'use client';

import React from 'react';

// This 'export default' is REQUIRED for Next.js App Router.
export default function CookiesPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-zinc-300 space-y-12 leading-relaxed">
      
      {/* Header Section */}
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">
          Legal
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
          Cookies Policy
        </h1>
        <p className="text-lg text-zinc-400 pt-2">
          Last Updated: October 26, 2023
        </p>
      </header>

      <section className="space-y-6 text-zinc-400 border-t border-zinc-800 pt-12">
        <p>
          This Cookies Policy explains how Comicspell ("we," "our," or "us") uses 
          cookies and similar technologies to recognize you when you visit our website 
          at comicspell.com (the "Site"). It explains what these technologies are and 
          why we use them, as well as your rights to control our use of them.
        </p>
        <p>
          In some cases, we may use cookies to collect personal information, or that 
          becomes personal information if we combine it with other information.
        </p>
      </section>

      {/* Content Sections */}
      <section className="space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            What are cookies?
          </h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile 
            device when you visit a website. Cookies are widely used by website owners 
            in order to make their websites work, or to work more efficiently, as 
            well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, Comicspell) are called 
            "first-party cookies." Cookies set by parties other than the website owner 
            are called "third-party cookies." Third-party cookies enable third-party 
            features or functionality to be provided on or through the website (e.g., 
            like advertising, interactive content, and analytics).
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Why do we use cookies?
          </h2>
          <p>
            We use first- and third-party cookies for several reasons. Some cookies 
            are required for technical reasons in order for our Site to operate, and 
            we refer to these as "essential" or "strictly necessary" cookies. Other 
            cookies also enable us to track and target the interests of our users to 
            enhance the experience on our Online Properties. Third parties serve 
            cookies through our Site for advertising, analytics, and other purposes. 
            This is described in more detail below.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Types of Cookies We Use
          </h2>
          <p>
            The specific types of first- and third-party cookies served through our 
            Site and the purposes they perform are described below (please note that 
            the specific cookies served may vary depending on the specific Online 
            Properties you visit):
          </p>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Essential Website Cookies
            </h3>
            <p className="text-sm text-zinc-400">
              These cookies are strictly necessary to provide you with services 
              available through our Site and to use some of its features, such as 
              access to secure areas.
            </p>
            <ul className="list-disc list-inside pl-2 text-sm text-zinc-300 space-y-1">
                <li><strong className='text-zinc-100'>Purpose:</strong> Authentication, security, load balancing.</li>
                <li><strong className='text-zinc-100'>Who serves them:</strong> Comicspell, Auth0 (if applicable).</li>
            </ul>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Analytics and Performance Cookies
            </h3>
            <p className="text-sm text-zinc-400">
              These cookies are used to collect information about traffic to our 
              Site and how users use the Site. The information gathered does not 
              identify any individual visitor. It includes the number of visitors 
              to the Site, the websites that referred them to the Site, the pages 
              they visited on the Site, what time of day they visited, whether they 
              have visited before, and other similar information.
            </p>
            <ul className="list-disc list-inside pl-2 text-sm text-zinc-300 space-y-1">
                <li><strong className='text-zinc-100'>Purpose:</strong> Improving site performance and user experience.</li>
                <li><strong className='text-zinc-100'>Who serves them:</strong> Google Analytics.</li>
            </ul>
          </div>

        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            How can I control cookies?
          </h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You 
            can exercise your cookie preferences by visiting the Cookie Settings 
            Panel (if you have implemented one) or by modifying your browser 
            settings.
          </p>
          <p>
            Most web browsers allow you to manage your cookie preferences. You can 
            set your browser to refuse cookies or delete certain cookies. Generally 
            you should also be able to manage similar technologies by using your 
            browser’s email preferences.
          </p>
          <p className="font-semibold text-zinc-100">
            Please be aware that if you choose to reject cookies, you may not be 
            able to use the full functionality of our Site.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Updates to This Cookies Policy
          </h2>
          <p>
            We may update this Cookies Policy from time to time in order to reflect, 
            for example, changes to the cookies we use or for other operational, 
            legal, or regulatory reasons. Please therefore re-visit this Cookies 
            Policy regularly to stay informed about our use of cookies and related 
            technologies.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Contact Us
          </h2>
          <p>
            If you have any questions about our use of cookies or other 
            technologies, please contact us at{' '}
            <a href="mailto:comicspell97inbox@gmail.com" className="text-[#b5ff42] hover:underline">
              comicspell97inbox@gmail.com
            </a>.
          </p>
        </div>
      </section>

    </main>
  );
}