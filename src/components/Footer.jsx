import React, { useState } from 'react';
import { Sparkles, HelpCircle, X, Award } from 'lucide-react';
import { playClickSound } from '../utils/sound.js';

export default function Footer() {
  const [showTrivia, setShowTrivia] = useState(false);
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);

  const triviaList = [
    {
      title: "হিলবার্টের গ্র্যান্ড হোটেল প্যারাডক্স",
      fact: "একটি সম্পূর্ণ পূর্ণ অনন্ত (Infinite) রুম থাকা হোটেলে অসীমসংখ্যক নতুন অতিথি আসলেও সবাইকে জায়গা দেওয়া সম্ভব! শুধু ১ নম্বর রুমের অতিথিকে ২ নম্বরে, ২ নম্বরকে ৪ নম্বরে পাঠালে সব বিজোড় রুম ফাঁকা হয়ে যাবে!",
      category: "ইনফিনিটি ও সেট থিওরি"
    },
    {
      title: "গ্যাব্রিয়েল হর্ন (Gabriel's Horn)",
      fact: "এই বিশেষ জ্যামিতিক শিঙ্গার আকৃতির বস্তুটির উপরিভাগের ক্ষেত্রফল অসীম, কিন্তু ভেতরটির আয়তন সসীম! অর্থাৎ এটি রঙ দিয়ে পূর্ণ করা সম্ভব, কিন্তু বাইরের দেয়াল কখনোই রঙ করে শেষ করা সম্ভব নয়!",
      category: "ক্যালকুলাস ও জ্যামিতি"
    },
    {
      title: "বানাখ-তার্স্কি প্যারাডক্স (Banach-Tarski)",
      fact: "একটি কঠিন ত্রিমাত্রিক গোলককে কেটে মাত্র ৫টি টুকরো করে সেই টুকরোগুলো দিয়ে হুবহু একই আকারের দুটি সম্পূর্ণ নিরেট গোলক বানিয়ে ফেলা গাণিতিকভাবে সম্ভব!",
      category: "মেজার থিওরি"
    }
  ];

  const handleTriviaNext = () => {
    playClickSound();
    setCurrentTriviaIdx((prev) => (prev + 1) % triviaList.length);
  };

  return (
    <footer className="bg-[#030305] border-t border-white/10 py-8 sm:py-12 relative overflow-hidden text-white/50">
      
      {/* Cosmic Orange background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-[#ff7a00]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Quote */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Sparkles className="w-4 h-4 text-[#ff7a00]" />
              <span className="font-black text-white tracking-wider text-xs sm:text-sm">
                STREAM // MIND — COSMIC LIQUID GLOSS
              </span>
            </div>
            <p className="text-xs italic text-white/50 max-w-md">
              "সম্ভাব্যতা হলো সাধারণ জ্ঞানকে গণিতে রূপান্তর করার শিল্প।" — পিয়েরে-সিমন লাপ্লাস
            </p>
          </div>

          {/* Action Button: Bonus Trivia */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => { playClickSound(); setShowTrivia(true); }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-[#ff7a00] font-bold text-xs border border-[#ff7a00]/40 shadow-glow-amber transition-all touch-manipulation glossy-shine"
            >
              <Award className="w-4 h-4" />
              <span>বোনাস প্যারাডক্স ট্র্যাভিয়া এক্সপ্লোর করুন</span>
            </button>
          </div>

          {/* Credits */}
          <div className="text-xs text-white/40 text-center md:text-right font-mono">
            <span>React + Vite + Cosmic Liquid Gloss Design</span>
          </div>

        </div>
      </div>

      {/* Trivia Modal */}
      {showTrivia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030305]/85 backdrop-blur-2xl p-4">
          <div className="liquid-glass-card rounded-3xl p-5 sm:p-8 max-w-lg w-full border border-[#ff7a00]/40 shadow-2xl relative">
            
            <button
              onClick={() => setShowTrivia(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] flex-shrink-0">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff7a00] font-bold">
                  {triviaList[currentTriviaIdx].category}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {triviaList[currentTriviaIdx].title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed bg-[#030305] p-4 rounded-2xl border border-white/10 my-4">
              {triviaList[currentTriviaIdx].fact}
            </p>

            <div className="flex items-center justify-between mt-6">
              <span className="text-xs font-mono text-white/40">
                তথ্য {currentTriviaIdx + 1} / {triviaList.length}
              </span>
              <button
                onClick={handleTriviaNext}
                className="btn-cosmic px-4 py-2 rounded-2xl text-xs glossy-shine"
              >
                পরবর্তী প্যারাডক্স →
              </button>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
}
