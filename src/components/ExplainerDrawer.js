import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Brain, BookOpen, Globe2, Lightbulb } from 'lucide-react';
import { playClickSound } from '../utils/sound.js';
export default function ExplainerDrawer({
  title,
  eli5,
  intuitionTrap,
  mathProof,
  realWorld
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('eli5');
  const toggleDrawer = () => {
    playClickSound();
    setIsOpen(!isOpen);
  };
  const tabs = [{
    id: 'eli5',
    label: "Explain Like I'm 5",
    icon: Lightbulb,
    color: 'text-amber-400'
  }, {
    id: 'trap',
    label: 'The Intuition Trap',
    icon: Brain,
    color: 'text-pink-400'
  }, {
    id: 'proof',
    label: 'Mathematical Proof',
    icon: BookOpen,
    color: 'text-blue-400'
  }, {
    id: 'real',
    label: 'Real-World Impact',
    icon: Globe2,
    color: 'text-emerald-400'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-6 border border-slate-800/80 rounded-2xl bg-slate-900/60 overflow-hidden transition-all duration-300"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggleDrawer,
    className: "w-full px-5 py-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-800/80 transition-colors duration-200 text-left group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:scale-105 transition-transform duration-200"
  }, /*#__PURE__*/React.createElement(HelpCircle, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm sm:text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors duration-200"
  }, "Explain the Aha! // ", title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 font-medium"
  }, isOpen ? 'Click to collapse explanation' : 'Click to unpack the mind-bending logic & mathematical proof'))), /*#__PURE__*/React.createElement("div", {
    className: `p-2 rounded-lg bg-slate-800 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-600/20 text-blue-400' : ''}`
  }, /*#__PURE__*/React.createElement(ChevronDown, {
    className: "w-4 h-4"
  }))), isOpen && /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-800 bg-slate-950/70"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto"
  }, tabs.map(tab => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      onClick: () => {
        playClickSound();
        setActiveTab(tab.id);
      },
      className: `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`
    }, /*#__PURE__*/React.createElement(Icon, {
      className: `w-4 h-4 ${tab.color}`
    }), /*#__PURE__*/React.createElement("span", null, tab.label));
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 text-sm leading-relaxed text-slate-300"
  }, activeTab === 'eli5' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-amber-400 font-bold"
  }, /*#__PURE__*/React.createElement(Lightbulb, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Simple ELI5 Explanation")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-300"
  }, eli5)), activeTab === 'trap' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 bg-pink-500/5 p-4 rounded-xl border border-pink-500/20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-pink-400 font-bold"
  }, /*#__PURE__*/React.createElement(Brain, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Why Human Intuition Fails")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-300"
  }, intuitionTrap)), activeTab === 'proof' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 font-mono text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-blue-400 font-bold font-sans text-sm"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Rigorous Logic & Proof")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-slate-900 rounded-lg border border-slate-800 text-blue-300 whitespace-pre-line leading-relaxed"
  }, mathProof)), activeTab === 'real' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-emerald-400 font-bold"
  }, /*#__PURE__*/React.createElement(Globe2, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Practical Real-World Applications")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-300"
  }, realWorld)))));
}