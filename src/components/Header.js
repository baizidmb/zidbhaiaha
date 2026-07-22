import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Flame, DoorClosed, BarChart2, Coins } from 'lucide-react';
import { toggleMute, playClickSound } from '../utils/sound.js';
export default function Header({
  activeFilter,
  setActiveFilter
}) {
  const [muted, setMuted] = useState(false);
  const handleMuteToggle = () => {
    const nextMute = toggleMute();
    setMuted(nextMute);
    if (!nextMute) playClickSound();
  };
  const navItems = [{
    id: 'all',
    label: 'সকল প্যারাডক্স',
    icon: Sparkles
  }, {
    id: 'birthday',
    label: 'বার্থডে প্যারাডক্স',
    icon: Flame
  }, {
    id: 'monty',
    label: 'মন্টি হল',
    icon: DoorClosed
  }, {
    id: 'simpsons',
    label: 'সিম্পসনের প্যারাডক্স',
    icon: BarChart2
  }, {
    id: 'parrondo',
    label: 'পারন্ডোর প্যারাডক্স',
    icon: Coins
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
    className: "relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-glow-blue transition-transform duration-300 group-hover:scale-105"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:rotate-12 transition-transform duration-300"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-lg sm:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400"
  }, "\u0986\u09B9\u09BE! ", /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 font-mono text-xs sm:text-sm font-normal"
  }, "//"), " \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2\u09BE\u0987\u099C\u09BE\u09B0"), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold tracking-wide uppercase"
  }, "\u09AC\u09BE\u0982\u09B2\u09BE \u0997\u09A3\u09BF\u09A4")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide"
  }, "\u09AE\u09BE\u0987\u09A8\u09CD\u09A1-\u09AC\u09C7\u09A8\u09CD\u09A1\u09BF\u0982 \u09B2\u099C\u09BF\u0995 \u098F\u09AC\u0982 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF\u09A4\u09BE, \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2\u09BE\u0987\u099C\u09A1\u0964"))), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      handleMuteToggle();
    },
    title: muted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন',
    className: `md:hidden p-2 rounded-xl border transition-all duration-200 ${muted ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-glow-blue'}`
  }, muted ? /*#__PURE__*/React.createElement(VolumeX, {
    className: "w-4 h-4"
  }) : /*#__PURE__*/React.createElement(Volume2, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("div", {
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
    onClick: handleMuteToggle,
    title: muted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন',
    className: `hidden md:flex p-2.5 rounded-xl border transition-all duration-200 ${muted ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 shadow-glow-blue'}`
  }, muted ? /*#__PURE__*/React.createElement(VolumeX, {
    className: "w-4 h-4"
  }) : /*#__PURE__*/React.createElement(Volume2, {
    className: "w-4 h-4"
  }))))));
}