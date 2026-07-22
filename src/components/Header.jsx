import React, { useState } from 'react';
import { Play, Sparkles, Volume2, VolumeX, Languages, Search, Flame, DoorClosed, Hotel, Anchor, BarChart2 } from 'lucide-react';
import { toggleMute, playClickSound } from '../utils/sound.js';

export default function Header({ activeFilter, setActiveFilter, lang, setLang, searchQuery, setSearchQuery }) {
  const [muted, setMuted] = useState(false);
  const isBn = lang === 'bn';

  const handleMuteToggle = () => {
    const nextMute = toggleMute();
    setMuted(nextMute);
    if (!nextMute) playClickSound();
  };

  const handleLangToggle = () => {
    playClickSound();
    setLang(prev => prev === 'bn' ? 'en' : 'bn');
  };

  const navItems = [
    { id: 'all', label: isBn ? 'সকল সমাহার' : 'Featured', icon: Sparkles },
    { id: 'birthday', label: isBn ? 'বার্থডে মিল' : 'Probability', icon: Flame },
    { id: 'monty', label: isBn ? 'গেম শো ট্র্যাপ' : 'Game Shows', icon: DoorClosed },
    { id: 'hotel', label: isBn ? 'অসীম হোটেল' : 'Infinity', icon: Hotel },
    { id: 'anchoring', label: isBn ? 'অ্যাংকরিং ধাঁধা' : 'Cognitive Bias', icon: Anchor },
    { id: 'simpsons', label: isBn ? 'ডেটা টুইস্ট' : 'Data Flips', icon: BarChart2 },
  ];

  const handleNavClick = (id) => {
    playClickSound();
    setActiveFilter(id);
    if (id !== 'all') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#030305]/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Cosmic Orange Brand Badge */}
          <div className="flex items-center space-x-3 cursor-pointer w-full md:w-auto justify-between md:justify-start group" onClick={() => handleNavClick('all')}>
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff3c00] p-0.5 shadow-glow-amber transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#030305] rounded-[14px] flex items-center justify-center">
                  <Play className="w-5 h-5 text-[#ff7a00] fill-current ml-0.5" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white">
                    STREAM <span className="text-[#ff7a00] font-mono text-xs font-normal">//</span> MIND
                  </h1>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#ff7a00]/15 border border-[#ff7a00]/40 text-[#ff7a00] font-black uppercase">
                    COSMIC GLOSS
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={(e) => { e.stopPropagation(); handleLangToggle(); }}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs font-bold"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{isBn ? 'EN' : 'বাংলা'}</span>
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); handleMuteToggle(); }}
                className={`p-2 rounded-xl border transition-all ${
                  muted ? 'bg-white/5 border-white/10 text-white/40' : 'bg-[#ff7a00]/15 border-[#ff7a00]/40 text-[#ff7a00]'
                }`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Liquid Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isBn ? 'প্যারাডক্স খুঁজুন...' : 'Search paradoxes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ff7a00] transition-all backdrop-blur-xl"
            />
          </div>

          {/* Navigation Bar & Controls */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none touch-pan-x">
            <nav className="flex items-center space-x-1 bg-white/[0.02] p-1 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-manipulation glossy-shine ${
                      isActive
                        ? 'bg-[#ff7a00] text-white shadow-glow-amber'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              onClick={handleLangToggle}
              className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-bold transition-all"
            >
              <Languages className="w-4 h-4 text-[#ff7a00]" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            <button
              onClick={handleMuteToggle}
              className={`hidden md:flex p-2.5 rounded-2xl border transition-all ${
                muted ? 'bg-white/5 border-white/10 text-white/40' : 'bg-[#ff7a00]/15 border-[#ff7a00]/40 text-[#ff7a00]'
              }`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
