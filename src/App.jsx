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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Hero Welcome Banner */}
        <div className="text-center py-6 px-4 relative">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse-slow">
            <span>✨ Interactive Logic Playground</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
            Where Human Intuition Meets <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">Mathematical Reality</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-medium leading-relaxed">
            Select a paradox module below to run live simulations, tweak parameters, and unlock plain-English breakdowns of why our brains get fooled.
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
