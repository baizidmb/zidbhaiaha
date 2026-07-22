import React, { useState } from 'react';
import Header from './components/Header.js';
import BirthdayParadox from './components/BirthdayParadox.js';
import MontyHall from './components/MontyHall.js';
import InfiniteHotel from './components/InfiniteHotel.js';
import AnchoringBias from './components/AnchoringBias.js';
import SimpsonsParadox from './components/SimpsonsParadox.js';
import ParrondosParadox from './components/ParrondosParadox.js';
import Footer from './components/Footer.js';
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
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  const matchesSearch = (id, title, desc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return id.toLowerCase().includes(q) || title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-[#030305] text-slate-100 selection:bg-[#ff7a00] selection:text-white flex flex-col justify-between font-sans"
  }, /*#__PURE__*/React.createElement(Header, {
    activeFilter: activeFilter,
    setActiveFilter: setActiveFilter,
    lang: lang,
    setLang: setLang,
    searchQuery: searchQuery,
    setSearchQuery: setSearchQuery
  }), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-12"
  }, !searchQuery && activeFilter === 'all' && /*#__PURE__*/React.createElement("div", {
    className: "relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-r from-[#030305] via-[#ff7a00]/10 to-[#030305] min-h-[320px] sm:min-h-[380px] flex items-center p-6 sm:p-12 glossy-shine"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0 top-0 w-full sm:w-1/2 h-full bg-gradient-to-l from-[#ff7a00]/20 to-transparent pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-2xl space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 rounded-full bg-[#ff7a00] text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-glow-amber"
  }, "#1 TRENDING TODAY"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-white/60 font-mono flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-3.5 h-3.5 text-[#ff7a00]"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? '৯৯.৮% ইউজার রেটিং' : '99.8% User Rating'))), /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
  }, isBn ? '🚗 গেম শো ফাঁদ (The Game Show Trap)' : '🚗 The Game Show Trap'), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-base text-white/80 font-medium leading-relaxed"
  }, isBn ? '৩টি দরজার পেছনে ১টি দামি স্পোর্টস কার এবং ২টি ছাগল লুকিয়ে আছে! হোস্ট ছাগল প্রকাশের পর দরজা সুইচ করলে আপনার জেতার সম্ভাবনা দ্বিগুণ হয়ে যায়!' : 'Behind 3 doors lies a luxury sports car and 2 goats. Switching doors after the host reveals a goat DOUBLES your winning chances!'), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleHeroPlay,
    className: "btn-cosmic flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl text-xs sm:text-sm glossy-shine touch-manipulation"
  }, /*#__PURE__*/React.createElement(Play, {
    className: "w-4 h-4 fill-current"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? '▶ লাইভ গেম সিমুলেশন খেলুন' : '▶ Play Interactive Simulation'))))), (activeFilter === 'all' || activeFilter === 'birthday' || activeFilter === 'monty') && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 border-b border-white/10 pb-2"
  }, /*#__PURE__*/React.createElement(Flame, {
    className: "w-5 h-5 text-[#ff7a00]"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg sm:text-xl font-black text-white uppercase tracking-wider"
  }, isBn ? '🔥 ট্রেন্ডিং প্যারাডক্স (Trending Mind-Benders)' : '🔥 Trending Mind-Benders')), /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, (activeFilter === 'all' || activeFilter === 'birthday') && matchesSearch('birthday', 'party coincidence', 'birthday paradox') && /*#__PURE__*/React.createElement(BirthdayParadox, {
    lang: lang
  }), (activeFilter === 'all' || activeFilter === 'monty') && matchesSearch('monty', 'game show trap', 'monty hall') && /*#__PURE__*/React.createElement(MontyHall, {
    lang: lang
  }))), (activeFilter === 'all' || activeFilter === 'hotel' || activeFilter === 'anchoring') && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 pt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 border-b border-white/10 pb-2"
  }, /*#__PURE__*/React.createElement(Brain, {
    className: "w-5 h-5 text-purple-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg sm:text-xl font-black text-white uppercase tracking-wider"
  }, isBn ? '🧠 লজিক ও ব্রেন ট্র্যাপ (Mind & Logic Traps)' : '🧠 Mind & Logic Traps')), /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, (activeFilter === 'all' || activeFilter === 'hotel') && matchesSearch('hotel', 'hilbert infinite hotel', 'infinity') && /*#__PURE__*/React.createElement(InfiniteHotel, {
    lang: lang
  }), (activeFilter === 'all' || activeFilter === 'anchoring') && matchesSearch('anchoring', 'anchoring trick', 'cognitive bias') && /*#__PURE__*/React.createElement(AnchoringBias, {
    lang: lang
  }))), (activeFilter === 'all' || activeFilter === 'simpsons' || activeFilter === 'parrondo') && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 pt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 border-b border-white/10 pb-2"
  }, /*#__PURE__*/React.createElement(BarChart2, {
    className: "w-5 h-5 text-blue-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg sm:text-xl font-black text-white uppercase tracking-wider"
  }, isBn ? '📊 ডেটা ও গণিতের ম্যাজিক (Data & Math Magic)' : '📊 Data & Math Magic')), /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, (activeFilter === 'all' || activeFilter === 'simpsons') && matchesSearch('simpsons', 'data flip', 'simpsons paradox') && /*#__PURE__*/React.createElement(SimpsonsParadox, {
    lang: lang
  }), (activeFilter === 'all' || activeFilter === 'parrondo') && matchesSearch('parrondo', 'winning loss trick', 'parrondos paradox') && /*#__PURE__*/React.createElement(ParrondosParadox, {
    lang: lang
  })))), /*#__PURE__*/React.createElement(Footer, {
    lang: lang
  }));
}