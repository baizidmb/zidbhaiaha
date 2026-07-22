import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Flame, DoorClosed, BarChart2, Coins } from 'lucide-react';
import { toggleMute, playClickSound } from '../utils/sound.js';

export default function Header({ activeFilter, setActiveFilter }) {
  const [muted, setMuted] = useState(false);

  const handleMuteToggle = () => {
    const nextMute = toggleMute();
    setMuted(nextMute);
    if (!nextMute) playClickSound();
  };

  const navItems = [
    { id: 'all', label: 'All Paradoxes', icon: Sparkles },
    { id: 'birthday', label: 'Birthday Paradox', icon: Flame },
    { id: 'monty', label: 'Monty Hall', icon: DoorClosed },
    { id: 'simpsons', label: "Simpson's Paradox", icon: BarChart2 },
    { id: 'parrondo', label: "Parrondo's Paradox", icon: Coins },
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
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Header */}
          <div className="flex items-center space-x-3.5 group cursor-pointer" onClick={() => handleNavClick('all')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  AHA! <span className="text-slate-500 font-mono text-sm font-normal">//</span> VISUALIZER
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold tracking-wide uppercase">
                  Interactive Math
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Mind-Bending Logic & Probability, Visualized.
              </p>
            </div>
          </div>

          {/* Quick Nav Bar & Audio Toggle */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <nav className="flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
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

            {/* Mute Button */}
            <button
              onClick={handleMuteToggle}
              title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${
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
