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
    className: "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center py-6 px-4 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse-slow"
  }, /*#__PURE__*/React.createElement("span", null, "\u2728 Interactive Logic Playground")), /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl sm:text-5xl font-black text-slate-100 tracking-tight"
  }, "Where Human Intuition Meets ", /*#__PURE__*/React.createElement("span", {
    className: "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
  }, "Mathematical Reality")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-medium leading-relaxed"
  }, "Select a paradox module below to run live simulations, tweak parameters, and unlock plain-English breakdowns of why our brains get fooled.")), (activeFilter === 'all' || activeFilter === 'birthday') && /*#__PURE__*/React.createElement(BirthdayParadox, null), (activeFilter === 'all' || activeFilter === 'monty') && /*#__PURE__*/React.createElement(MontyHall, null), (activeFilter === 'all' || activeFilter === 'simpsons') && /*#__PURE__*/React.createElement(SimpsonsParadox, null), (activeFilter === 'all' || activeFilter === 'parrondo') && /*#__PURE__*/React.createElement(ParrondosParadox, null)), /*#__PURE__*/React.createElement(Footer, null));
}