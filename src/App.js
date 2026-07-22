import React, { useState } from 'react';
import Header from './components/Header.js';
import BirthdayParadox from './components/BirthdayParadox.js';
import MontyHall from './components/MontyHall.js';
import SimpsonsParadox from './components/SimpsonsParadox.js';
import ParrondosParadox from './components/ParrondosParadox.js';
import Footer from './components/Footer.js';
export default function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col justify-between selection:bg-blue-500 selection:text-white"
  }, /*#__PURE__*/React.createElement(Header, {
    activeFilter: activeFilter,
    setActiveFilter: setActiveFilter
  }), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center py-4 sm:py-6 px-3 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 animate-pulse-slow"
  }, /*#__PURE__*/React.createElement("span", null, "\u2728 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09C7\u0995\u09CD\u099F\u09BF\u09AD \u09B2\u099C\u09BF\u0995 \u0993 \u0997\u09A3\u09BF\u09A4 \u09AA\u09CD\u09B2\u09C7\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1")), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight"
  }, "\u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09B8\u09BE\u09AC\u09B2\u09C0\u09B2 \u0985\u09A8\u09C1\u09AD\u09C2\u09A4\u09BF \u09AC\u09A8\u09BE\u09AE ", /*#__PURE__*/React.createElement("span", {
    className: "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
  }, "\u0997\u09BE\u09A3\u09BF\u09A4\u09BF\u0995 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC\u09A4\u09BE")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-base max-w-2xl mx-auto mt-3 font-medium leading-relaxed"
  }, "\u09A8\u09BF\u099A\u09C7\u09B0 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09C7\u0995\u09CD\u099F\u09BF\u09AD \u09AE\u09A1\u09BF\u0989\u09B2\u0997\u09C1\u09B2\u09CB\u09B0 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF\u09C7 \u09B0\u09BF\u09AF\u09BC\u09C7\u09B2-\u099F\u09BE\u0987\u09AE \u09B8\u09BF\u09AE\u09C1\u09B2\u09C7\u09B6\u09A8 \u099A\u09BE\u09B2\u09BE\u09A8, \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09AE\u09BF\u099F\u09BE\u09B0 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09AC\u09BE\u0982\u09B2\u09BE\u09AF\u09BC \u099C\u09C7\u09A8\u09C7 \u09A8\u09BF\u09A8 \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09AE\u09B8\u09CD\u09A4\u09BF\u09B7\u09CD\u0995 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A7\u09CB\u0981\u0995\u09BE \u0996\u09BE\u09AF\u09BC!")), (activeFilter === 'all' || activeFilter === 'birthday') && /*#__PURE__*/React.createElement(BirthdayParadox, null), (activeFilter === 'all' || activeFilter === 'monty') && /*#__PURE__*/React.createElement(MontyHall, null), (activeFilter === 'all' || activeFilter === 'simpsons') && /*#__PURE__*/React.createElement(SimpsonsParadox, null), (activeFilter === 'all' || activeFilter === 'parrondo') && /*#__PURE__*/React.createElement(ParrondosParadox, null)), /*#__PURE__*/React.createElement(Footer, null));
}