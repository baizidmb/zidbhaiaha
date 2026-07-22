import React, { useState } from 'react';
import Header from './components/Header.jsx';
import BirthdayParadox from './components/BirthdayParadox.jsx';
import MontyHall from './components/MontyHall.jsx';
import SimpsonsParadox from './components/SimpsonsParadox.jsx';
import ParrondosParadox from './components/ParrondosParadox.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Top Header */}
      <Header activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        
        {/* Hero Welcome Banner */}
        <div className="text-center py-4 sm:py-6 px-3 relative">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 animate-pulse-slow">
            <span>✨ ইন্টারেক্টিভ লজিক ও গণিত প্লেগ্রাউন্ড</span>
          </div>
          <h2 className="text-2xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            মানুষের সাবলীল অনুভূতি বনাম <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">গাণিতিক বাস্তবতা</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto mt-3 font-medium leading-relaxed">
            নিচের ইন্টারেক্টিভ মডিউলগুলোর সাহায্যে রিয়েল-টাইম সিমুলেশন চালান, প্যারামিটার পরিবর্তন করুন এবং সাধারণ বাংলায় জেনে নিন আমাদের মস্তিষ্ক কীভাবে ধোঁকা খায়!
          </p>
        </div>

        {/* Modules */}
        {(activeFilter === 'all' || activeFilter === 'birthday') && <BirthdayParadox />}
        {(activeFilter === 'all' || activeFilter === 'monty') && <MontyHall />}
        {(activeFilter === 'all' || activeFilter === 'simpsons') && <SimpsonsParadox />}
        {(activeFilter === 'all' || activeFilter === 'parrondo') && <ParrondosParadox />}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
