// src/app/sign-up/[[...sign-up]]/page.tsx
'use client';

import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-12 bg-black overflow-hidden">
      {/* Spinning Spider Net Emoji in Top-Left Corner */}
      <div className="absolute top-6 left-6 text-[4.5rem] animate-[spin_10s_linear_infinite] drop-shadow-[0_0_15px_rgba(181,255,66,0.6)] select-none">
        🕸️
      </div>

      {/* Zig-Zag Crawling Spider Emoji */}
      <div className="absolute top-20 text-3xl animate-[zigzagCrawler_12s_ease-in-out_infinite] z-30 select-none drop-shadow-[0_0_10px_rgba(181,255,66,0.8)]">
        🕷️
      </div>

      <style jsx global>{`
        @keyframes neonBlink {
          0%, 100% {
            box-shadow: 0 0 20px rgba(181, 255, 66, 0.2), inset 0 0 15px rgba(181, 255, 66, 0.1);
          }
          50% {
            box-shadow: 0 0 50px rgba(181, 255, 66, 0.6), inset 0 0 25px rgba(181, 255, 66, 0.3);
          }
        }
        @keyframes zigzagCrawler {
          0% {
            left: 0%;
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(60px) rotate(15deg);
          }
          50% {
            left: 90%;
            transform: translateY(0px) rotate(-15deg);
          }
          75% {
            transform: translateY(80px) rotate(10deg);
          }
          100% {
            left: 0%;
            transform: translateY(0px) rotate(0deg);
          }
        }
        .book-container {
          animation: neonBlink 3s ease-in-out infinite;
        }
        .cl-headerTitle, .cl-headerSubtitle, .cl-socialButtonsBlockButtonText, .cl-formFieldLabel, .cl-dividerText, .cl-footerActionText, .cl-identityPreviewText {
          color: #d1d5db !important;
        }
        .cl-formFieldFeedback__warning, .cl-formFieldFeedback__error, .cl-formFieldFeedbackText, .cl-formFieldInfoText, .cl-formFieldSuccessText {
          color: #ffffff !important;
        }
        .cl-headerTitle {
          color: #ffffff !important;
        }
        .cl-formButtonPrimary, .cl-formButtonPrimary * {
          color: #000000 !important;
        }
        .cl-footerAction, .cl-main .cl-text, .cl-otpCodeFieldInput {
          color: #ffffff !important;
        }
        .cl-otpCodeFieldInput {
          background-color: #1c1c1c !important;
          border: 2px solid #374151 !important;
          color: #ffffff !important;
        }
        .cl-otpCodeFieldInput:focus {
          border-color: #b5ff42 !important;
        }
        .cl-footerActionLink, 
        .cl-footerActionLink:hover, 
        .cl-footerActionLink:active, 
        .cl-footerActionLink:focus,
        .cl-footerActionLink * {
          color: #b5ff42 !important;
          padding: 4px 8px;
          border-radius: 4px;
          text-decoration: none !important;
          box-shadow: none !important;
          outline: none !important;
          border-bottom: none !important;
          background-image: none !important;
        }
        .cl-footerActionLink:hover,
        .cl-footerActionLink:hover * {
          background-color: #b5ff42 !important;
          color: #000000 !important;
          text-decoration: none !important;
          border-bottom: none !important;
        }
        .cl-dividerLine {
          background: linear-gradient(to right, transparent, #b5ff42, transparent) !important;
          height: 2px !important;
        }
      `}</style>

      {/* Animated Comic Quote */}
      <div className="mb-8 overflow-hidden whitespace-nowrap">
        <p className="text-sm md:text-base font-bold text-[#b5ff42] tracking-wider uppercase animate-pulse drop-shadow-[0_0_10px_rgba(181,255,66,0.5)]">
          "Join the League of Readers..." — Create your ComicSpell Account
        </p>
      </div>

      {/* Book-Shaped Signup Container with Blinking Neon Shadow & Center Spine Crease */}
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="book-container relative p-[3px] rounded-r-2xl rounded-l-md bg-gradient-to-r from-[#b5ff42] via-emerald-500 to-[#b5ff42] w-full flex justify-center border-l-8 border-[#3a630c]">
          
          {/* Subtle Open Book Center Spine Crease Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-black/50 z-20 pointer-events-none"></div>

          <SignUp 
            appearance={{
              variables: {
                colorPrimary: '#b5ff42',
                colorBackground: '#121212',
                borderRadius: '0.75rem',
                fontFamily: 'inherit',
              },
              elements: {
                card: 'bg-[#121212] border border-gray-800 shadow-2xl w-full',
                socialButtonsBlockButton: 'bg-black border border-[#b5ff42]/40 hover:border-[#b5ff42] hover:bg-[#1a2e05] hover:shadow-[0_0_15px_rgba(181,255,66,0.3)] transition-all',
                formButtonPrimary: 'bg-[#b5ff42] text-black font-extrabold hover:bg-[#a2ef2d] transition-all shadow-[0_0_15px_rgba(181,255,66,0.4)]',
                formFieldInput: 'bg-[#1c1c1c] border-2 border-gray-700 text-gray-200 focus:border-[#b5ff42]',
                dividerText: 'text-[#b5ff42] font-bold tracking-widest px-4 uppercase text-xs bg-[#121212]',
                footerActionLink: 'no-underline shadow-none border-none outline-none hover:no-underline font-bold',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}