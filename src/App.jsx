import React, { useState } from 'react';
import Header from './components/Header.jsx';
import BirthdayParadox from './components/BirthdayParadox.jsx';
import MontyHall from './components/MontyHall.jsx';
import SimpsonsParadox from './components/SimpsonsParadox.jsx';
import ParrondosParadox from './components/ParrondosParadox.jsx';
import StPetersburgParadox from './components/StPetersburgParadox.jsx';
import NewcombsParadox from './components/NewcombsParadox.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lang, setLang] = useState('bn'); // 'bn' | 'en'

  const isBn = lang === 'bn';

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Top Header with Language Toggle */}
      <Header activeFilter={activeFilter} setActiveFilter={setActiveFilter} lang={lang} setLang={setLang} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        
        {/* Hero Welcome Banner */}
        <div className="text-center py-4 sm:py-6 px-3 relative">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 animate-pulse-slow">
            <span>{isBn ? '✨ ইন্টারেক্টিভ লজিক ও গণিত প্লেগ্রাউন্ড' : '✨ Interactive Logic & Math Playground'}</span>
          </div>
          <h2 className="text-2xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            {isBn ? (
              <>মানুষের সাবলীল অনুভূতি বনাম <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400">গাণিতিক বাস্তবতার গল্প</span></>
            ) : (
              <>Where Human Intuition Meets <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400">Mathematical Reality</span></>
            )}
          </h2>
          <p className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto mt-3 font-medium leading-relaxed">
            {isBn ? (
              'নিচের ৬টি আকর্ষণীয় মডিউল ও ইন্টারেক্টিভ গেমের সাহায্যে রিয়েল-টাইম সিমুলেশন চালান, কয়েন ফ্লিপ ও বক্স বেছে নিন এবং সুন্দর গল্প বলার স্টাইলে বাংলায় জেনে নিন আমাদের মস্তিষ্ক কীভাবে ধোঁকা খায়!'
            ) : (
              'Run real-time simulations, play interactive games, flip coins, open mystery boxes, and explore plain-English & storytelling Bengali breakdowns of why human intuition fails!'
            )}
          </p>
        </div>

        {/* Modules */}
        {(activeFilter === 'all' || activeFilter === 'birthday') && <BirthdayParadox lang={lang} />}
        {(activeFilter === 'all' || activeFilter === 'monty') && <MontyHall lang={lang} />}
        {(activeFilter === 'all' || activeFilter === 'simpsons') && <SimpsonsParadox lang={lang} />}
        {(activeFilter === 'all' || activeFilter === 'parrondo') && <ParrondosParadox lang={lang} />}
        {(activeFilter === 'all' || activeFilter === 'stpetersburg') && <StPetersburgParadox lang={lang} />}
        {(activeFilter === 'all' || activeFilter === 'newcombs') && <NewcombsParadox lang={lang} />}

      </main>

      {/* Footer */}
      <Footer lang={lang} />

    </div>
  );
}
