import React, { useState } from 'react';
import Header from './components/Header.js';
import BirthdayParadox from './components/BirthdayParadox.js';
import MontyHall from './components/MontyHall.js';
import SimpsonsParadox from './components/SimpsonsParadox.js';
import ParrondosParadox from './components/ParrondosParadox.js';
import StPetersburgParadox from './components/StPetersburgParadox.js';
import NewcombsParadox from './components/NewcombsParadox.js';
import Footer from './components/Footer.js';
export default function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lang, setLang] = useState('bn'); // 'bn' | 'en'

  const isBn = lang === 'bn';
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col justify-between selection:bg-blue-500 selection:text-white"
  }, /*#__PURE__*/React.createElement(Header, {
    activeFilter: activeFilter,
    setActiveFilter: setActiveFilter,
    lang: lang,
    setLang: setLang
  }), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center py-4 sm:py-6 px-3 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 animate-pulse-slow"
  }, /*#__PURE__*/React.createElement("span", null, isBn ? '✨ ইন্টারেক্টিভ লজিক ও গণিত প্লেগ্রাউন্ড' : '✨ Interactive Logic & Math Playground')), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight"
  }, isBn ? /*#__PURE__*/React.createElement(React.Fragment, null, "\u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09B8\u09BE\u09AC\u09B2\u09C0\u09B2 \u0985\u09A8\u09C1\u09AD\u09C2\u09A4\u09BF \u09AC\u09A8\u09BE\u09AE ", /*#__PURE__*/React.createElement("span", {
    className: "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400"
  }, "\u0997\u09BE\u09A3\u09BF\u09A4\u09BF\u0995 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC\u09A4\u09BE\u09B0 \u0997\u09B2\u09CD\u09AA")) : /*#__PURE__*/React.createElement(React.Fragment, null, "Where Human Intuition Meets ", /*#__PURE__*/React.createElement("span", {
    className: "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400"
  }, "Mathematical Reality"))), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-base max-w-2xl mx-auto mt-3 font-medium leading-relaxed"
  }, isBn ? 'নিচের ৬টি আকর্ষণীয় মডিউল ও ইন্টারেক্টিভ গেমের সাহায্যে রিয়েল-টাইম সিমুলেশন চালান, কয়েন ফ্লিপ ও বক্স বেছে নিন এবং সুন্দর গল্প বলার স্টাইলে বাংলায় জেনে নিন আমাদের মস্তিষ্ক কীভাবে ধোঁকা খায়!' : 'Run real-time simulations, play interactive games, flip coins, open mystery boxes, and explore plain-English & storytelling Bengali breakdowns of why human intuition fails!')), (activeFilter === 'all' || activeFilter === 'birthday') && /*#__PURE__*/React.createElement(BirthdayParadox, {
    lang: lang
  }), (activeFilter === 'all' || activeFilter === 'monty') && /*#__PURE__*/React.createElement(MontyHall, {
    lang: lang
  }), (activeFilter === 'all' || activeFilter === 'simpsons') && /*#__PURE__*/React.createElement(SimpsonsParadox, {
    lang: lang
  }), (activeFilter === 'all' || activeFilter === 'parrondo') && /*#__PURE__*/React.createElement(ParrondosParadox, {
    lang: lang
  }), (activeFilter === 'all' || activeFilter === 'stpetersburg') && /*#__PURE__*/React.createElement(StPetersburgParadox, {
    lang: lang
  }), (activeFilter === 'all' || activeFilter === 'newcombs') && /*#__PURE__*/React.createElement(NewcombsParadox, {
    lang: lang
  })), /*#__PURE__*/React.createElement(Footer, {
    lang: lang
  }));
}