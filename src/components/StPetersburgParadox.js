import React, { useState } from 'react';
import { Sparkles, Play, RotateCcw, DollarSign, TrendingUp, HelpCircle } from 'lucide-react';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
import { playStPetersburgGame } from '../utils/paradoxMath.js';
import { runStPetersburgSimulationAsync } from '../utils/simulationEngine.js';
import { playClickSound, playCoinFlipSound, playWinFanfare } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';
export default function StPetersburgParadox({
  lang = 'bn'
}) {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'flipping' | 'ended'
  const [currentFlips, setCurrentFlips] = useState(0);
  const [currentPot, setCurrentPot] = useState(2);
  const [history, setHistory] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simStats, setSimStats] = useState({
    gamesPlayed: 10000,
    avgPayout: 14.85,
    maxPayout: 16384,
    totalPayout: 148500
  });
  const isBn = lang === 'bn';
  const handlePlayOneGame = () => {
    playClickSound();
    playCoinFlipSound();
    setGameState('flipping');
    const result = playStPetersburgGame();
    setCurrentFlips(result.flips);
    setCurrentPot(result.payout);
    setHistory(prev => [result, ...prev].slice(0, 5));
    setGameState('ended');
    if (result.payout >= 16) {
      playWinFanfare();
    }
  };
  const handleRun10kSims = () => {
    playClickSound();
    setIsSimulating(true);
    setSimProgress(0);
    runStPetersburgSimulationAsync(10000, (progress, snapshot) => {
      setSimProgress(progress);
      setSimStats(snapshot);
    }, finalSnapshot => {
      setSimStats(finalSnapshot);
      setIsSimulating(false);
    });
  };
  const chartData = {
    labels: isBn ? ['গড় পে-আউট (১০,০০০ গেম)', 'তাত্ত্বিক প্রত্যাশিত মান (Expected Value)'] : ['Real Average Payout', 'Theoretical Expected Value'],
    datasets: [{
      label: isBn ? 'টাকা ($)' : 'Dollars ($)',
      data: [simStats.avgPayout, 100],
      // 100 capped for visual scale comparison
      backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
      borderColor: ['#3B82F6', '#10B981'],
      borderWidth: 2,
      borderRadius: 12
    }]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: ctx => ctx.dataIndex === 1 ? isBn ? 'অসীম (Infinite ∞)' : 'Infinite ∞' : `$${ctx.parsed.y}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: v => `$${v}`
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "stpetersburg",
    className: "py-6 sm:py-8 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 sm:p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400"
  }, /*#__PURE__*/React.createElement(DollarSign, {
    className: "w-5 h-5 sm:w-6 sm:h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, isBn ? 'সেন্ট পিটার্সবার্গ প্যারাডক্স (St. Petersburg Paradox)' : 'St. Petersburg Paradox')), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed"
  }, isBn ? 'গাণিতিকভাবে জেতার গড় সুযোগ অসীম ($∞)! অথচ কোনো সুস্থ মস্তিষ্কের মানুষ এই গেমটি খেলার জন্য মাত্র ২৫ টাকাও দিতে রাজি হন না কেন?' : 'Mathematically, the expected payout is INFINITE ($∞)! Yet no rational person is willing to pay even $25 to play this game.')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handlePlayOneGame,
    className: "flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-glow-amber transition-all duration-200 touch-manipulation"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-4 h-4 fill-current"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? '১টি কয়েন ফ্লিপ গেম খেলুন' : 'Play 1 Coin Flip Game')), /*#__PURE__*/React.createElement("button", {
    onClick: handleRun10kSims,
    disabled: isSimulating,
    className: "flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all duration-200 disabled:opacity-50 touch-manipulation"
  }, /*#__PURE__*/React.createElement(Play, {
    className: `w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-amber-400' : ''}`
  }), /*#__PURE__*/React.createElement("span", null, isSimulating ? `${simProgress}%` : isBn ? '১০,০০০ অটো-সিমুলেশন' : '10,000 Auto-Sims')))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "সর্বশেষ গেমের লাভ" : "Last Game Payout",
    value: `$${currentPot}`,
    subtext: isBn ? `${currentFlips} বার টসের পর হেড পড়েছে` : `Heads appeared after ${currentFlips} flips`,
    color: "amber",
    highlight: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "১০,০০০ গেমে প্রকৃত গড়" : "Real Average (10k Games)",
    value: `$${simStats.avgPayout}`,
    subtext: isBn ? "বাস্তব পে-আউট অত্যন্ত কম" : "Real average payout is small",
    color: "blue"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "সর্বোচ্চ প্রাপ্ত জ্যাকপট" : "Max Jackpot Hit",
    value: `$${simStats.maxPayout.toLocaleString()}`,
    subtext: isBn ? "দুর্লভ বিশাল জয়" : "Rare huge win",
    color: "purple"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "গাণিতিক প্রত্যাশিত মান" : "Theoretical Expected Value",
    value: "\u221E (\u0985\u09B8\u09C0\u09AE)",
    subtext: isBn ? "১+১+১+... অসীম যোগফল" : "1 + 1 + 1 + ... infinite sum",
    color: "emerald",
    highlight: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(DollarSign, {
    className: "w-4 h-4 text-amber-400"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'লাইভ কয়েন ডাবল মানি পোর্ট' : 'Live Doubling Pot Stage'))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-center relative overflow-hidden my-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30"
  }, gameState === 'idle' ? isBn ? 'খেলা শুরু করতে বাটনে চাপ দিন' : 'Click to start game' : isBn ? `টেলস পড়েছে: ${currentFlips - 1} বার | ১ম হেডস ফ্লিপ #${currentFlips}` : `Tails: ${currentFlips - 1} times | 1st Heads on Flip #${currentFlips}`), /*#__PURE__*/React.createElement("div", {
    className: "py-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-4xl sm:text-6xl font-black font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500"
  }, "$", currentPot.toLocaleString())), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 font-medium"
  }, isBn ? 'নিয়ম: প্রতিবার টেলস (Tails) পড়লে পট দ্বিগুণ হবে ($২ ➔ $৪ ➔ $৮ ➔ $১৬ ➔ $৩২...). প্রথম হেডস (Heads) পড়লেই আপনি পাত্রের পুরো টাকা জিতবেন!' : 'Rules: Pot doubles on each Tail ($2 ➔ $4 ➔ $8 ➔ $16 ➔ $32...). The 1st Head ends the game and pays the pot!'))), history.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-300 mb-2"
  }, isBn ? 'সাম্প্রতিক গেমের ইতিহাস:' : 'Recent Game History:'), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, history.map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700"
  }, h.flips, " ", isBn ? 'ফ্লিপ' : 'flips', " \u2794 $", h.payout)))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    className: "w-4 h-4 text-emerald-400"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'বাস্তব গড় বনাম তাত্ত্বিক অসীম' : 'Real Average vs Theoretical Infinity')), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-h-[220px] sm:min-h-[260px] relative"
  }, /*#__PURE__*/React.createElement(Bar, {
    data: chartData,
    options: chartOptions
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400 mt-3 leading-relaxed italic"
  }, isBn ? '* তাত্ত্বিক গাণিতিক মান অসীম হলেও, বাস্তব জীবনে কোটি টাকা জেতার সম্ভাবনা এত অবিশ্বাস্য রকম কম যে গড় পে-আউট সবসময় মাত্র ১০-২০ ডলারের মধ্যে থাকে!' : '* Even though theoretical EV is infinite, huge jackpots are so rare that real average payouts stay around $10-$20!'))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: isBn ? "সেন্ট পিটার্সবার্গ প্যারাডক্স (St. Petersburg Paradox)" : "The St. Petersburg Paradox",
    eli5: isBn ? "কল্পনা করুন এক অদ্ভুত জুয়ার আসর! ক্যাসিনোর মালিক আপনাকে বললেন: 'আমি একটি কয়েন টস করব। প্রথমবারই হেডস পড়লে পাবেন ২ টাকা। যদি প্রথমে টেলস পড়ে, তবে টাকা দ্বিগুণ হয়ে হবে ৪ টাকা। পরের বারও টেলস পড়লে হবে ৮ টাকা, তারপর ১৬ টাকা, ৩২ টাকা... এভাবে যতক্ষণ না হেডস পড়ছে টাকা দ্বিগুণ হতেই থাকবে!' গণিত অনুযায়ী আপনি অসীম কোটি টাকা জিততে পারেন! কিন্তু ক্যাসিনোর মালিক যদি এই খেলায় ঢোকার এন্ট্রি ফি ৫০ টাকা চান—আপনি কি খেলবেন? কখনই না! কারণ বাস্তব জীবনে ৯৯% মানুষ প্রথম ২-৩ টসেই হেরে মাত্র ২ থেকে ৮ টাকা নিয়ে বাড়ি ফেরেন!" : "Imagine a casino where a coin is tossed until Heads appears. 1st Heads pays $2, 2nd pays $4, 3rd pays $8... doubling infinitely! Mathematically, the expected payout is infinite (1 + 1 + 1... = ∞). Yet no sane person would pay even $50 to play, because 99% of games end in the first 3 flips paying under $8!",
    intuitionTrap: isBn ? "আমাদের মস্তিষ্ক কেন একে ধোঁকা ভাবে? কারণ আমাদের মাথায় 'অসীম সম্ভাবনা' বা Infinity কাজ করে না। গণিতে ১/২ * ২ = ১ টাকা, ১/৪ * ৪ = ১ টাকা... এভাবে অসীম পদ যোগ করলে মোট প্রত্যাশিত মান অসীম (Infinity) হয়। কিন্তু বাস্তব জীবনে ১ বিলিয়ন ডলার জেতার সম্ভাবনা ১ বিলিয়নে ১ বার! তাই মানুষ অসীম সম্ভাবনার পেছনে বাস্তব টাকা ধ্বংস করতে চায় না (Marginal Utility of Wealth)।" : "Humans evaluate expected utility, not pure expected monetary value. $1,000,000 isn't 1 million times as useful to a person as $1. Diminishing marginal utility and finite wealth/lifespan mean infinite theoretical expected value fails in real life.",
    mathProof: `Expected Value Formula:
E = (1/2 * 2^1) + (1/4 * 2^2) + (1/8 * 2^3) + ...
E = 1 + 1 + 1 + 1 + ... = ∞ (Infinite sum!)

Why Real Average is ~$15:
For n = 10,000 games, maximum flips achieved is roughly ~14 (2^14 = $16,384).
Sum of probability up to 14 flips = $15 average!`,
    realWorld: isBn ? "ইনস্যুরেন্স ও অর্থনীতিতে ঝুঁকি নির্ধারণ (Risk & Expected Utility Theory)! ড্যানিয়েল বার্নোলি ১৭৩৮ সালে এই প্যারাডক্সের সমাধান করতে গিয়ে 'মার্জিনাল ইউটিলিটি' থিওরি আবিষ্কার করেন, যা আজকের আধুনিক অর্থনীতি ও ইনস্যুরেন্স ব্যবস্থার মূল ভিত্তি।" : "Insurance and Risk Management! Daniel Bernoulli solved this in 1738 by inventing Expected Utility Theory, forming the bedrock of modern finance and insurance."
  })));
}