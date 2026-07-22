import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Flame, DoorClosed, BarChart2, Coins, DollarSign, Brain, Languages } from 'lucide-react';
import { toggleMute, playClickSound } from '../utils/sound.js';
export default function Header({
  activeFilter,
  setActiveFilter,
  lang,
  setLang
}) {
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
  const navItems = [{
    id: 'all',
    label: isBn ? 'সকল প্যারাডক্স' : 'All Paradoxes',
    icon: Sparkles
  }, {
    id: 'birthday',
    label: isBn ? '🎉 জন্মদিনের মিল' : '🎉 The Party Coincidence',
    icon: Flame
  }, {
    id: 'monty',
    label: isBn ? '🚗 গেম শো ফাঁদ' : '🚗 The Game Show Trap',
    icon: DoorClosed
  }, {
    id: 'simpsons',
    label: isBn ? '📊 ডেটা টুইস্ট' : '📊 The Data Flip',
    icon: BarChart2
  }, {
    id: 'parrondo',
    label: isBn ? '🪙 জেতা-হারার ট্রিক' : '🪙 The Winning-Loss Trick',
    icon: Coins
  }, {
    id: 'stpetersburg',
    label: isBn ? '🎰 দ্বিগুণ পাত্র' : '🎰 The Doubling Pot',
    icon: DollarSign
  }, {
    id: 'newcombs',
    label: isBn ? '🧠 এআই মাইন্ড রিডার' : '🧠 The AI Mind Reader',
    icon: Brain
  }];
  const handleNavClick = id => {
    playClickSound();
    setActiveFilter(id);
    if (id !== 'all') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };
  return /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all duration-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 group cursor-pointer w-full md:w-auto justify-between md:justify-start",
    onClick: () => handleNavClick('all')
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-amber-500 p-0.5 shadow-glow-blue transition-transform duration-300 group-hover:scale-105"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:rotate-12 transition-transform duration-300"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-lg sm:text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-amber-400"
  }, "AHA! ", /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 font-mono text-xs font-normal"
  }, "//"), " PARADOX LAB")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] sm:text-xs text-blue-400/90 font-semibold tracking-wide"
  }, isBn ? 'কঠিন লজিক এখন সহজ! আপনার স্বজ্ঞাত ধারণা পরীক্ষা করতে ট্যাপ করুন!' : 'Mind-Bending Logic Made Simple. Tap a Paradox to Test Your Intuition!'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 md:hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      handleLangToggle();
    },
    className: "flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold shadow-glow-blue"
  }, /*#__PURE__*/React.createElement(Languages, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'EN' : 'বাংলা')), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      handleMuteToggle();
    },
    className: `p-2 rounded-xl border transition-all duration-200 ${muted ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`
  }, muted ? /*#__PURE__*/React.createElement(VolumeX, {
    className: "w-4 h-4"
  }) : /*#__PURE__*/React.createElement(Volume2, {
    className: "w-4 h-4"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none touch-pan-x"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/90 p-1 sm:p-1.5 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto"
  }, navItems.map(item => {
    const Icon = item.icon;
    const isActive = activeFilter === item.id;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: () => handleNavClick(item.id),
      className: `flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-manipulation ${isActive ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-3.5 h-3.5"
    }), /*#__PURE__*/React.createElement("span", null, item.label));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleLangToggle,
    className: "hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold shadow-glow-blue transition-all duration-200"
  }, /*#__PURE__*/React.createElement(Languages, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'English' : 'বাংলা')), /*#__PURE__*/React.createElement("button", {
    onClick: handleMuteToggle,
    title: muted ? 'Unmute Sound' : 'Mute Sound',
    className: `hidden md:flex p-2.5 rounded-xl border transition-all duration-200 ${muted ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 shadow-glow-blue'}`
  }, muted ? /*#__PURE__*/React.createElement(VolumeX, {
    className: "w-4 h-4"
  }) : /*#__PURE__*/React.createElement(Volume2, {
    className: "w-4 h-4"
  }))))));
}