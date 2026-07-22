import React, { useState } from 'react';
import { Sparkles, HelpCircle, X, Award } from 'lucide-react';
import { playClickSound } from '../utils/sound.js';
export default function Footer() {
  const [showTrivia, setShowTrivia] = useState(false);
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);
  const triviaList = [{
    title: "হিলবার্টের গ্র্যান্ড হোটেল প্যারাডক্স",
    fact: "একটি সম্পূর্ণ পূর্ণ অনন্ত (Infinite) রুম থাকা হোটেলে অসীমসংখ্যক নতুন অতিথি আসলেও সবাইকে জায়গা দেওয়া সম্ভব! শুধু ১ নম্বর রুমের অতিথিকে ২ নম্বরে, ২ নম্বরকে ৪ নম্বরে পাঠালে সব বিজোড় রুম ফাঁকা হয়ে যাবে!",
    category: "ইনফিনিটি ও সেট থিওরি"
  }, {
    title: "গ্যাব্রিয়েল হর্ন (Gabriel's Horn)",
    fact: "এই বিশেষ জ্যামিতিক শিঙ্গার আকৃতির বস্তুটির উপরিভাগের ক্ষেত্রফল অসীম, কিন্তু ভেতরটির আয়তন সসীম! অর্থাৎ এটি রঙ দিয়ে পূর্ণ করা সম্ভব, কিন্তু বাইরের দেয়াল কখনোই রঙ করে শেষ করা সম্ভব নয়!",
    category: "ক্যালকুলাস ও জ্যামিতি"
  }, {
    title: "বানাখ-তার্স্কি প্যারাডক্স (Banach-Tarski)",
    fact: "একটি কঠিন ত্রিমাত্রিক গোলককে কেটে মাত্র ৫টি টুকরো করে সেই টুকরোগুলো দিয়ে হুবহু একই আকারের দুটি সম্পূর্ণ নিরেট গোলক বানিয়ে ফেলা গাণিতিকভাবে সম্ভব!",
    category: "মেজার থিওরি"
  }];
  const handleTriviaNext = () => {
    playClickSound();
    setCurrentTriviaIdx(prev => (prev + 1) % triviaList.length);
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "bg-slate-950 border-t border-slate-800/80 py-8 sm:py-12 relative overflow-hidden text-slate-400"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-blue-600/5 blur-3xl pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row items-center justify-between gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 text-center md:text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center md:justify-start space-x-2"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-4 h-4 text-blue-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-200 tracking-wider text-xs sm:text-sm"
  }, "\u0986\u09B9\u09BE! // \u0997\u09BE\u09A3\u09BF\u09A4\u09BF\u0995 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2\u09BE\u0987\u099C\u09BE\u09B0")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs italic text-slate-400 max-w-md"
  }, "\"\u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF\u09A4\u09BE \u09B9\u09B2\u09CB \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u099C\u09CD\u099E\u09BE\u09A8\u0995\u09C7 \u0997\u09A3\u09BF\u09A4\u09C7 \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09BE\u09B0 \u09B6\u09BF\u09B2\u09CD\u09AA\u0964\" \u2014 \u09AA\u09BF\u09AF\u09BC\u09C7\u09B0\u09C7-\u09B8\u09BF\u09AE\u09A8 \u09B2\u09BE\u09AA\u09CD\u09B2\u09BE\u09B8")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      playClickSound();
      setShowTrivia(true);
    },
    className: "flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 font-bold text-xs border border-blue-500/30 shadow-glow-blue transition-all duration-200 touch-manipulation"
  }, /*#__PURE__*/React.createElement(Award, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "\u09AC\u09CB\u09A8\u09BE\u09B8 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u09AD\u09BF\u09AF\u09BC\u09BE \u098F\u0995\u09CD\u09B8\u09AA\u09CD\u09B2\u09CB\u09B0 \u0995\u09B0\u09C1\u09A8"))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-400 text-center md:text-right font-mono"
  }, /*#__PURE__*/React.createElement("span", null, "React + Vite + Tailwind CSS \u09A6\u09BF\u09DF\u09C7 \u09A4\u09C8\u09B0\u09BF")))), showTrivia && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-5 sm:p-8 max-w-lg w-full border border-blue-500/40 shadow-2xl relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowTrivia(false),
    className: "absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0"
  }, /*#__PURE__*/React.createElement(HelpCircle, {
    className: "w-5 h-5 sm:w-6 sm:h-6"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold"
  }, triviaList[currentTriviaIdx].category), /*#__PURE__*/React.createElement("h3", {
    className: "text-base sm:text-lg font-extrabold text-slate-100"
  }, triviaList[currentTriviaIdx].title))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-slate-800 my-4"
  }, triviaList[currentTriviaIdx].fact), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mt-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-slate-400"
  }, "\u09A4\u09A5\u09CD\u09AF ", currentTriviaIdx + 1, " / ", triviaList.length), /*#__PURE__*/React.createElement("button", {
    onClick: handleTriviaNext,
    className: "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue touch-manipulation"
  }, "\u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 \u2192")))));
}