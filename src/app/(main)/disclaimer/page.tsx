// src/app/disclaimer/page.tsx
'use client';

import React from 'react';

// NOTE: The 'export default' is mandatory for Next.js App Router pages.
export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-zinc-300 space-y-12 leading-relaxed">
      
      {/* Header Section */}
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#b5ff42] font-bold">
          Legal
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="text-lg text-zinc-400 pt-2">
          Last Updated: October 26, 2023
        </p>
      </header>

      <section className="space-y-6 text-zinc-400 border-t border-zinc-800 pt-12">
        <h2 className="text-2xl font-bold text-white">
          Introduction
        </h2>
        <p>
          The information provided by Comicspell ("we," "our," or "us") on comicspell.com 
          (the "Site") and our services is for general informational purposes only. 
          All information on the Site and our services is provided in good faith, however, 
          we make no representation or warranty of any kind, express or implied, regarding 
          the accuracy, adequacy, validity, reliability, availability, or completeness of 
          any information on the Site or our services.
        </p>
        <p className="font-semibold text-zinc-100">
          UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE 
          OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR SERVICES OR 
          RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND OUR SERVICES. YOUR USE OF 
          THE SITE AND OUR SERVICES AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND 
          OUR SERVICES IS SOLELY AT YOUR OWN RISK.
        </p>
      </section>

      {/* Content Sections */}
      <section className="space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            External Links Disclaimer
          </h2>
          <p>
            The Site may contain (or you may be sent through the Site) links to other 
            websites or content belonging to or originating from third parties or links 
            to websites and features in banners or other advertising. Such external links 
            are not investigated, monitored, or checked for accuracy, adequacy, validity, 
            reliability, availability, or completeness by us.
          </p>
          <p>
            WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE 
            ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES 
            LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR 
            OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE 
            FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF 
            PRODUCTS OR SERVICES.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Errors and Omissions Disclaimer
          </h2>
          <p>
            While we have made every attempt to ensure that the information contained 
            in this site has been obtained from reliable sources, Comicspell is not 
            responsible for any errors or omissions, or for the results obtained from 
            the use of this information. All information in this site is provided "as is", 
            with no guarantee of completeness, accuracy, timeliness or of the results 
            obtained from the use of this information, and without warranty of any kind, 
            express or implied, including, but not limited to warranties of performance, 
            merchantability and fitness for a particular purpose.
          </p>
          <p>
            In no event will Comicspell, its related partnerships or corporations, or the 
            partners, agents or employees thereof be liable to you or anyone else for any 
            decision made or action taken in reliance on the information in this Site or 
            for any consequential, special or similar damages, even if advised of the 
            possibility of such damages.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Fair Use Disclaimer
          </h2>
          <p>
            This Site may contain copyrighted material the use of which has not always 
            been specifically authorized by the copyright owner. We are making such 
            material available for criticism, comment, news reporting, teaching, 
            scholarship, or research.
          </p>
          <p>
            We believe this constitutes a "fair use" of any such copyrighted material 
            as provided for in section 107 of the United States Copyright Law. If you 
            wish to use copyrighted material from this Site for your own purposes that 
            go beyond fair use, you must obtain permission from the copyright owner.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Affiliate Disclaimer
          </h2>
          <p>
            The Site may contain links to affiliate websites, and we may receive an 
            affiliate commission for any purchases made by you on the affiliate website 
            using such links. We are a participant in the Amazon Services LLC Associates 
            Program, an affiliate advertising program designed to provide a means for 
            us to earn advertising fees by linking to Amazon.com and affiliated websites.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Testimonials Disclaimer
          </h2>
          <p>
            The Site may contain testimonials by users of our products and/or services. 
            These testimonials reflect the real-life experiences and opinions of such 
            users. However, the experiences are personal to those particular users, and 
            may not necessarily be representative of all users of our products and/or 
            services. We do not claim, and you should not assume, that all users will 
            have the same experiences. YOUR INDIVIDUAL RESULTS MAY VARY.
          </p>
          <p>
            The testimonials on the Site are submitted in various forms such as text, 
            audio and/or video, and are reviewed by us before being posted. They appear 
            on the Site verbatim as given by the users, except for the correction of 
            grammar or typing errors. Some testimonials may have been shortened for the 
            sake of brevity where the full testimonial contained extraneous information 
            not relevant to the general public.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Changes and Amendments
          </h2>
          <p>
            We reserve the right to modify this Disclaimer or its terms relating to the 
            Website and Services at any time, effective upon posting of an updated version 
            of this Disclaimer on the Website. When we do, we will revise the updated 
            date at the bottom of this page.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Acceptance of This Disclaimer
          </h2>
          <p>
            You acknowledge that you have read this Disclaimer and agree to all its terms 
            and conditions. By accessing and using the Website and Services you agree to 
            be bound by this Disclaimer. If you do not agree to abide by the terms of 
            this Disclaimer, you are not authorized to access or use the Website and 
            Services.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#b5ff42] pl-4">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Disclaimer, please contact us at{' '}
            <a href="mailto:comicspell97inbox@gmail.com" className="text-[#b5ff42] hover:underline">
              comicspell97inbox@gmail.com
            </a>.
          </p>
        </div>
      </section>

    </main>
  );
}