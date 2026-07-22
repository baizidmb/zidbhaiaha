import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Flame, DoorClosed, BarChart2, Coins, DollarSign, Brain, Languages } from 'lucide-react';
import { toggleMute, playClickSound } from '../utils/sound.js';

export default function Header({ activeFilter, setActiveFilter, lang, setLang }) {
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
    { id: 'all', label: isBn ? 'সকল প্যারাডক্স' : 'All Paradoxes', icon: Sparkles },
    { id: 'birthday', label: isBn ? 'বার্থডে প্যারাডক্স' : 'Birthday Paradox', icon: Flame },
    { id: 'monty', label: isBn ? 'মন্টি হল' : 'Monty Hall', icon: DoorClosed },
    { id: 'simpsons', label: isBn ? 'সিম্পসন' : 'Simpson', icon: BarChart2 },
    { id: 'parrondo', label: isBn ? 'পারন্ডো' : 'Parrondo', icon: Coins },
    { id: 'stpetersburg', label: isBn ? 'সেন্ট পিটার্সবার্গ' : 'St. Petersburg', icon: DollarSign },
    { id: 'newcombs', label: isBn ? 'নিউকম্বস' : 'Newcomb', icon: Brain },
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
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand Header */}
          <div className="flex items-center space-x-3 group cursor-pointer w-full md:w-auto justify-between md:justify-start" onClick={() => handleNavClick('all')}>
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-amber-500 p-0.5 shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg sm:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-amber-400">
                    {isBn ? 'আহা! // প্যারাডক্স ভিজ্যুয়ালাইজার' : 'AHA! // MATH VISUALIZER'}
                  </h1>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
                  {isBn ? 'মাইন্ড-বেন্ডিং লজিক এবং সম্ভাব্যতা, গল্প ও গাণিতিক রিয়েল-টাইম খেলায়!' : 'Mind-Bending Logic & Probability, Visualized in Interactive Games.'}
                </p>
              </div>
            </div>

            {/* Mobile Controls (Lang + Mute) */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={(e) => { e.stopPropagation(); handleLangToggle(); }}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold shadow-glow-blue"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{isBn ? 'EN' : 'বাংলা'}</span>
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); handleMuteToggle(); }}
                className={`p-2 rounded-xl border transition-all duration-200 ${
                  muted
                    ? 'bg-slate-900 border-slate-800 text-slate-500'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Nav Bar & Desktop Controls */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none touch-pan-x">
            <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/90 p-1 sm:p-1.5 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-manipulation ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-glow-blue'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop Language Toggle */}
            <button
              onClick={handleLangToggle}
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold shadow-glow-blue transition-all duration-200"
            >
              <Languages className="w-4 h-4" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Desktop Mute Button */}
            <button
              onClick={handleMuteToggle}
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
              className={`hidden md:flex p-2.5 rounded-xl border transition-all duration-200 ${
                muted
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 shadow-glow-blue'
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
