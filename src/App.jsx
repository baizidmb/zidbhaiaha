import React, { useState } from 'react';
import Header from './components/Header.jsx';
import BirthdayParadox from './components/BirthdayParadox.jsx';
import MontyHall from './components/MontyHall.jsx';
import InfiniteHotel from './components/InfiniteHotel.jsx';
import AnchoringBias from './components/AnchoringBias.jsx';
import SimpsonsParadox from './components/SimpsonsParadox.jsx';
import ParrondosParadox from './components/ParrondosParadox.jsx';
import Footer from './components/Footer.jsx';
import { Play, Sparkles, Flame, Brain, BarChart2 } from 'lucide-react';
import { playClickSound } from './utils/sound.js';

export default function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lang, setLang] = useState('bn');
  const [searchQuery, setSearchQuery] = useState('');

  const isBn = lang === 'bn';

  const handleHeroPlay = () => {
    playClickSound();
    setActiveFilter('monty');
    const el = document.getElementById('monty');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const matchesSearch = (id, title, desc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return id.toLowerCase().includes(q) || title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-red-600 selection:text-white flex flex-col justify-between font-sans">
      
      {/* StreamMind Top Header */}
      <Header
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        lang={lang}
        setLang={setLang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Streaming Platform Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-12">
        
        {/* Full-Width Cinematic Hero Banner (Netflix Style) */}
        {!searchQuery && activeFilter === 'all' && (
          <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-gradient-to-r from-neutral-950 via-purple-950/60 to-neutral-950 min-h-[320px] sm:min-h-[380px] flex items-center p-6 sm:p-12">
            
            {/* Background Glow */}
            <div className="absolute right-0 top-0 w-full sm:w-1/2 h-full bg-gradient-to-l from-purple-600/20 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider shadow-glow-purple">
                  #1 Trending Today
                </span>
                <span className="text-xs text-neutral-400 font-mono flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isBn ? '৯৯.৮% ইউজার রেটিং' : '99.8% User Rating'}</span>
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {isBn ? '🚗 গেম শো ফাঁদ (The Game Show Trap)' : '🚗 The Game Show Trap'}
              </h2>

              <p className="text-xs sm:text-base text-neutral-300 font-medium leading-relaxed">
                {isBn 
                  ? '৩টি দরজার পেছনে ১টি দামি স্পোর্টস কার এবং ২টি ছাগল লুকিয়ে আছে! হোস্ট ছাগল প্রকাশের পর দরজা সুইচ করলে আপনার জেতার সম্ভাবনা দ্বিগুণ হয়ে যায়!' 
                  : 'Behind 3 doors lies a luxury sports car and 2 goats. Switching doors after the host reveals a goat DOUBLES your winning chances!'}
              </p>

              <div className="pt-2 flex items-center space-x-4">
                <button
                  onClick={handleHeroPlay}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-glow-purple transition-all transform hover:scale-105 touch-manipulation"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isBn ? '▶ লাইভ গেম সিমুলেশন খেলুন' : '▶ Play Interactive Simulation'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Row 1: 🔥 Trending Mind-Benders */}
        {(activeFilter === 'all' || activeFilter === 'birthday' || activeFilter === 'monty') && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-neutral-800 pb-2">
              <Flame className="w-5 h-5 text-red-500" />
              <h3 className="text-lg sm:text-xl font-black text-neutral-100 uppercase tracking-wider">
                {isBn ? '🔥 ট্রেন্ডিং প্যারাডক্স (Trending Mind-Benders)' : '🔥 Trending Mind-Benders'}
              </h3>
            </div>

            <div className="space-y-8">
              {(activeFilter === 'all' || activeFilter === 'birthday') && matchesSearch('birthday', 'party coincidence', 'birthday paradox') && (
                <BirthdayParadox lang={lang} />
              )}
              {(activeFilter === 'all' || activeFilter === 'monty') && matchesSearch('monty', 'game show trap', 'monty hall') && (
                <MontyHall lang={lang} />
              )}
            </div>
          </div>
        )}

        {/* Category Row 2: 🧠 Mind & Logic Traps */}
        {(activeFilter === 'all' || activeFilter === 'hotel' || activeFilter === 'anchoring') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2 border-b border-neutral-800 pb-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg sm:text-xl font-black text-neutral-100 uppercase tracking-wider">
                {isBn ? '🧠 লজিক ও ব্রেন ট্র্যাপ (Mind & Logic Traps)' : '🧠 Mind & Logic Traps'}
              </h3>
            </div>

            <div className="space-y-8">
              {(activeFilter === 'all' || activeFilter === 'hotel') && matchesSearch('hotel', 'hilbert infinite hotel', 'infinity') && (
                <InfiniteHotel lang={lang} />
              )}
              {(activeFilter === 'all' || activeFilter === 'anchoring') && matchesSearch('anchoring', 'anchoring trick', 'cognitive bias') && (
                <AnchoringBias lang={lang} />
              )}
            </div>
          </div>
        )}

        {/* Category Row 3: 📊 Data & Math Magic */}
        {(activeFilter === 'all' || activeFilter === 'simpsons' || activeFilter === 'parrondo') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2 border-b border-neutral-800 pb-2">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg sm:text-xl font-black text-neutral-100 uppercase tracking-wider">
                {isBn ? '📊 ডেটা ও গণিতের ম্যাজিক (Data & Math Magic)' : '📊 Data & Math Magic'}
              </h3>
            </div>

            <div className="space-y-8">
              {(activeFilter === 'all' || activeFilter === 'simpsons') && matchesSearch('simpsons', 'data flip', 'simpsons paradox') && (
                <SimpsonsParadox lang={lang} />
              )}
              {(activeFilter === 'all' || activeFilter === 'parrondo') && matchesSearch('parrondo', 'winning loss trick', 'parrondos paradox') && (
                <ParrondosParadox lang={lang} />
              )}
            </div>
          </div>
        )}

      </main>

      {/* StreamMind Footer */}
      <Footer lang={lang} />

    </div>
  );
}
