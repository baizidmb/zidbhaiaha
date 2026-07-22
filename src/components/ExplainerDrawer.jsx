import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Brain, BookOpen, Globe2, Lightbulb } from 'lucide-react';
import { playClickSound } from '../utils/sound.js';

export default function ExplainerDrawer({ title, eli5, intuitionTrap, mathProof, realWorld }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('eli5');

  const toggleDrawer = () => {
    playClickSound();
    setIsOpen(!isOpen);
  };

  const tabs = [
    { id: 'eli5', label: 'সহজ বাংলায় বুঝুন (ELI5)', icon: Lightbulb, color: 'text-amber-400' },
    { id: 'trap', label: 'কেন মস্তিষ্ক ধোঁকা খায়', icon: Brain, color: 'text-pink-400' },
    { id: 'proof', label: 'গাণিতিক প্রমাণ', icon: BookOpen, color: 'text-blue-400' },
    { id: 'real', label: 'বাস্তব জীবনের প্রয়োগ', icon: Globe2, color: 'text-emerald-400' },
  ];

  return (
    <div className="mt-6 border border-slate-800/80 rounded-2xl bg-slate-900/60 overflow-hidden transition-all duration-300">
      
      {/* Toggle Button */}
      <button
        onClick={toggleDrawer}
        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-800/80 transition-colors duration-200 text-left group touch-manipulation"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors duration-200">
              সহজে ব্যাখ্যা করুন // {title}
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              {isOpen ? 'লজিক্যাল ব্যাখ্যা গুটিয়ে ফেলুন' : 'লজিক এবং গাণিতিক প্রমাণটি উন্মোচন করতে ক্লিক করুন'}
            </p>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-slate-800 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 bg-blue-600/20 text-blue-400' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70">
          
          {/* Mobile Scrollable Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none touch-pan-x">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { playClickSound(); setActiveTab(tab.id); }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-manipulation ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="pt-4 text-xs sm:text-sm leading-relaxed text-slate-300">
            {activeTab === 'eli5' && (
              <div className="space-y-3 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Lightbulb className="w-4 h-4" />
                  <span>সহজ ভাষায় মূল ধারণা</span>
                </div>
                <p className="text-slate-300">{eli5}</p>
              </div>
            )}

            {activeTab === 'trap' && (
              <div className="space-y-3 bg-pink-500/5 p-4 rounded-xl border border-pink-500/20">
                <div className="flex items-center space-x-2 text-pink-400 font-bold">
                  <Brain className="w-4 h-4" />
                  <span>কেন মানুষের স্বজ্ঞাত ধারণা ভুল প্রমানিত হয়</span>
                </div>
                <p className="text-slate-300">{intuitionTrap}</p>
              </div>
            )}

            {activeTab === 'proof' && (
              <div className="space-y-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 font-mono text-xs">
                <div className="flex items-center space-x-2 text-blue-400 font-bold font-sans text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>গাণিতিক যুক্তি ও সূত্রের ব্যাখা</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-blue-300 whitespace-pre-line leading-relaxed overflow-x-auto">
                  {mathProof}
                </div>
              </div>
            )}

            {activeTab === 'real' && (
              <div className="space-y-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Globe2 className="w-4 h-4" />
                  <span>বাস্তব দুনিয়া এবং সাইবার সিকিউরিটিতে ব্যবহার</span>
                </div>
                <p className="text-slate-300">{realWorld}</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
