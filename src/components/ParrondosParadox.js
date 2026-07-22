import React, { useState, useEffect } from 'react';
import { Coins, Play, TrendingUp, TrendingDown, Zap, Lightbulb, ChevronDown } from 'lucide-react';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
import { runParrondoSimulationAsync } from '../utils/simulationEngine.js';
import { playClickSound, playCoinFlipSound } from '../utils/sound.js';
import { Line } from 'react-chartjs-2';
export default function ParrondosParadox({
  lang = 'bn'
}) {
  const [totalSteps, setTotalSteps] = useState(200);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simResults, setSimResults] = useState(null);
  const isBn = lang === 'bn';
  useEffect(() => {
    runSim();
  }, [totalSteps]);
  const runSim = () => {
    playClickSound();
    playCoinFlipSound();
    setIsSimulating(true);
    setSimProgress(0);
    runParrondoSimulationAsync(totalSteps, (progress, snapshot) => {
      setSimProgress(progress);
      setSimResults(snapshot);
    }, finalSnapshot => {
      setSimResults(finalSnapshot);
      setIsSimulating(false);
    });
  };
  const chartData = {
    labels: simResults?.labels || [],
    datasets: [{
      label: isBn ? 'পর্যায়ক্রমিক বিকল্প (A+B) [বিজয়ী!]' : 'Alternating Strategy (A+B) [WINNING!]',
      data: simResults?.alternating || [],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointRadius: 0
    }, {
      label: isBn ? 'শুধুমাত্র গেম A [হারার ঝুঁকি]' : 'Game A Only [LOSING]',
      data: simResults?.gameA || [],
      borderColor: '#EC4899',
      borderWidth: 2,
      borderDash: [4, 4],
      pointRadius: 0
    }, {
      label: isBn ? 'শুধুমাত্র গেম B [হারার ঝুঁকি]' : 'Game B Only [LOSING]',
      data: simResults?.gameB || [],
      borderColor: '#8B5CF6',
      borderWidth: 2,
      borderDash: [4, 4],
      pointRadius: 0
    }]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.parsed.y} Capital`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: isBn ? 'কয়েন টস স্টেপ' : 'Flips',
          color: '#64748b'
        }
      },
      y: {
        title: {
          display: true,
          text: isBn ? 'মূলধন ($)' : 'Capital ($)',
          color: '#64748b'
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "parrondo",
    className: "py-6 sm:py-8 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
  }, /*#__PURE__*/React.createElement(Coins, {
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, isBn ? '🪙 জেতা-হারার ট্রিক (The Winning-Loss Trick)' : '🪙 The Winning-Loss Trick')), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-sm mt-1 font-medium"
  }, isBn ? 'দুটি আলাদাভাবে হারা গেম অল্টারনেট করে খেললে একটি বিজয়ী ট্রেন্ড তৈরি হয়!' : 'Combine two individually LOSING games to produce a steadily WINNING trend!')), /*#__PURE__*/React.createElement("button", {
    onClick: runSim,
    disabled: isSimulating,
    className: "flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-glow-emerald transition-all touch-manipulation"
  }, /*#__PURE__*/React.createElement(Play, {
    className: `w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`
  }), /*#__PURE__*/React.createElement("span", null, isSimulating ? `${simProgress}%` : isBn ? 'নতুন ফ্লিপ ট্রায়াল' : 'Run Flip Trial'))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider"
  }, /*#__PURE__*/React.createElement(Lightbulb, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'সহজ গল্পে মূল কথা' : 'The 2-Sentence Story')), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-200 leading-relaxed font-medium"
  }, isBn ? 'দুই বন্ধু দুটি পৃথক কয়েন গেম তৈরি করল যেখানে আলাদাভাবে খেললে টাকা শুধুই কমতে থাকে। কিন্তু অল্টারনেট বা বিকল্প হিসেবে খেললে গেম A গেম B-এর খারাপ ফাঁদটি ভেঙে দেয় এবং ব্যাংক ব্যালেন্স রকেটের মত লাফিয়ে বাড়ে!' : 'Can playing two LOSING games result in a WINNING strategy? Parrondo\'s Paradox proves that alternating between two bad coin games breaks the trap cycle and creates a ratcheting upward profit!')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "শুধুমাত্র গেম A" : "Game A Only",
    value: simResults ? `${simResults.finalCapA > 0 ? '+' : ''}${simResults.finalCapA}` : '$0',
    subtext: isBn ? "টাকা খালি হতে থাকবে" : "Decays downward",
    icon: TrendingDown,
    color: "purple"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "শুধুমাত্র গেম B" : "Game B Only",
    value: simResults ? `${simResults.finalCapB > 0 ? '+' : ''}${simResults.finalCapB}` : '$0',
    subtext: isBn ? "টাকা খালি হতে থাকবে" : "Decays downward",
    icon: TrendingDown,
    color: "purple"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "বিকল্প কৌশল (A + B)" : "Alternating Strategy (A + B)",
    value: simResults ? `+$${simResults.finalCapAlt}` : '$0',
    subtext: isBn ? "★ জেতা র্যাচেট ট্রেন্ড!" : "★ RATCHET WINNING TREND!",
    icon: TrendingUp,
    color: "emerald",
    highlight: true
  })), /*#__PURE__*/React.createElement("details", {
    className: "group border border-slate-800/80 rounded-2xl bg-slate-900/60 overflow-hidden"
  }, /*#__PURE__*/React.createElement("summary", {
    className: "px-5 py-4 flex items-center justify-between cursor-pointer font-bold text-sm text-slate-200 hover:bg-slate-800/60 transition-colors"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Zap, {
    className: "w-4 h-4 text-emerald-400"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'কয়েন টস ট্র্যাজেক্টোরি গ্রাফ ও স্টেপস দেখুন (Deep Dive Graph)' : 'View Coin Flip Trajectory Graph & Step Tuner')), /*#__PURE__*/React.createElement(ChevronDown, {
    className: "w-4 h-4 transition-transform group-open:rotate-180 text-slate-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-800 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-slate-300"
  }, isBn ? 'কয়েন টস স্টেপ:' : 'Steps:', " ", /*#__PURE__*/React.createElement("strong", {
    className: "text-emerald-400"
  }, totalSteps)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "50",
    max: "500",
    step: "50",
    value: totalSteps,
    onChange: e => setTotalSteps(parseInt(e.target.value)),
    className: "w-48 h-2 bg-slate-800 rounded-lg cursor-pointer accent-emerald-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "h-[240px] relative"
  }, /*#__PURE__*/React.createElement(Line, {
    data: chartData,
    options: chartOptions
  })))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: isBn ? "জেতা-হারার ট্রিক (The Winning-Loss Trick)" : "The Winning-Loss Trick",
    eli5: isBn ? "এমন দুটি কয়েন গেমের কথা ভাবুন যেখানে আলাদাভাবে খেলতে গেলে আপনার টাকা কমতেই থাকে। কিন্তু দুটি গেম পর্যায়ক্রমে বদলে বদলে খেললে গেম A প্লেয়ারকে খারাপ ফাঁদ থেকে বের করে আনে এবং টাকা বহুগুণে বাড়তে শুরু করে!" : "Imagine two games where you lose money over time. But if you alternate between Game A and Game B, Game A breaks the bad trap cycle of Game B, causing your money to shoot UP!",
    intuitionTrap: isBn ? "আমাদের স্বজ্ঞাত ধারণা বলে দুটি ঋণাত্মক ফলাফল যোগ করলে ঋণাত্মকই হয় (-২ + -২ = -৪)। কিন্তু এখানে পর্যায়ক্রমিক পরিবর্তন ফলাফলের মোমেন্টাম বদলে দেয়।" : "Common sense dictates that adding two negative numbers gives a negative number (-2 + -2 = -4). So combining two losing games SHOULD yield a super-losing game! We fail to realize that Game A breaks the bad cycle trap of Game B.",
    mathProof: `Game A: P(win) = 0.49 - e (Losing EV)
Game B: Capital mod 3 == 0 (P(win)=0.09) vs Capital mod 3 != 0 (P(win)=0.74)
Alternating A+B yields positive expected value (+0.016 EV)!`,
    realWorld: isBn ? "বায়োলজি ও পোর্টফোলিও রিব্যালেন্সিং (Volatility Harvesting)।" : "Biological Survival & Portfolio Rebalancing (Volatility Harvesting)."
  })));
}