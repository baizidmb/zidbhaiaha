import React, { useState } from 'react';
import { Sparkles, Heart, HelpCircle, X, Award } from 'lucide-react';
import { playClickSound } from '../utils/sound.js';
export default function Footer() {
  const [showTrivia, setShowTrivia] = useState(false);
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);
  const triviaList = [{
    title: "Hilbert's Grand Hotel Paradox",
    fact: "A fully booked hotel with infinitely many rooms can still accommodate infinitely many new guests! Just move room n to 2n, freeing all odd-numbered rooms.",
    category: "Set Theory & Infinity"
  }, {
    title: "The Gabriel's Horn Paradox",
    fact: "Gabriel's Horn has an infinite surface area, but a finite volume! You could fill the inside with a bucket of paint, but you could never paint the outside.",
    category: "Calculus & Geometry"
  }, {
    title: "The Banach-Tarski Paradox",
    fact: "Given a solid 3D sphere, it is mathematically possible to cut it into 5 pieces and reassemble them into TWO identical solid spheres of the exact same size!",
    category: "Measure Theory"
  }];
  const handleTriviaNext = () => {
    playClickSound();
    setCurrentTriviaIdx(prev => (prev + 1) % triviaList.length);
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "bg-slate-950 border-t border-slate-800/80 py-12 relative overflow-hidden text-slate-400"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-blue-600/5 blur-3xl pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row items-center justify-between gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 text-center md:text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center md:justify-start space-x-2"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-5 h-5 text-blue-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-200 tracking-wider text-sm"
  }, "AHA! // MATH PARADOX VISUALIZER")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs italic text-slate-400 max-w-md"
  }, "\"Probability is common sense reduced to calculation.\" \u2014 Pierre-Simon Laplace")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      playClickSound();
      setShowTrivia(true);
    },
    className: "flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 font-bold text-xs border border-blue-500/30 shadow-glow-blue transition-all duration-200"
  }, /*#__PURE__*/React.createElement(Award, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Explore Bonus Paradox Trivia"))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-400 text-center md:text-right font-mono"
  }, /*#__PURE__*/React.createElement("span", null, "Built with React + Vite + Tailwind CSS")))), showTrivia && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-blue-500/40 shadow-2xl relative animate-float"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowTrivia(false),
    className: "absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 rounded-xl bg-blue-500/10 text-blue-400"
  }, /*#__PURE__*/React.createElement(HelpCircle, {
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold"
  }, triviaList[currentTriviaIdx].category), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-extrabold text-slate-100"
  }, triviaList[currentTriviaIdx].title))), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-300 leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-slate-800 my-4"
  }, triviaList[currentTriviaIdx].fact), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mt-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-slate-400"
  }, "Fact ", currentTriviaIdx + 1, " of ", triviaList.length), /*#__PURE__*/React.createElement("button", {
    onClick: handleTriviaNext,
    className: "px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue"
  }, "Next Mind-Bender \u2192")))));
}