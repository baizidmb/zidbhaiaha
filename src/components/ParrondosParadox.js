import React, { useState, useEffect } from 'react';
import { Coins, Play, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
import { runParrondoSimulationAsync } from '../utils/simulationEngine.js';
import { playClickSound, playCoinFlipSound } from '../utils/sound.js';
import { Line } from 'react-chartjs-2';
export default function ParrondosParadox() {
  const [totalSteps, setTotalSteps] = useState(200);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simResults, setSimResults] = useState(null);
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
      label: 'পর্যায়ক্রমিক বিকল্প কৌশল (A+B) [বিজয়ী!]',
      data: simResults?.alternating || [],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointRadius: 0
    }, {
      label: 'শুধুমাত্র গেম A [হারার ঝুঁকি]',
      data: simResults?.gameA || [],
      borderColor: '#EC4899',
      borderWidth: 2,
      borderDash: [4, 4],
      pointRadius: 0
    }, {
      label: 'শুধুমাত্র গেম B [হারার ঝুঁকি]',
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
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} ক্যাপিটাল`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'কয়েন টস স্টেপ সংখ্যা',
          color: '#64748b'
        }
      },
      y: {
        title: {
          display: true,
          text: 'প্লেয়ার মূলধন ($)',
          color: '#64748b'
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "parrondo",
    className: "py-6 sm:py-8 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 sm:p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
  }, /*#__PURE__*/React.createElement(Coins, {
    className: "w-5 h-5 sm:w-6 sm:h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, "\u09AA\u09BE\u09B0\u09A8\u09CD\u09A1\u09CB\u09B0 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 (Parrondo's Paradox)")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-sm mt-1.5 font-medium"
  }, "\u09A6\u09C1\u099F\u09BF \u0986\u09B2\u09BE\u09A6\u09BE\u09AD\u09BE\u09AC\u09C7 ", /*#__PURE__*/React.createElement("span", {
    className: "text-pink-400 font-bold"
  }, "\u09B9\u09BE\u09B0\u09BE \u0997\u09C7\u09AE"), " (\u0997\u09C7\u09AE A \u098F\u09AC\u0982 \u0997\u09C7\u09AE B) \u0985\u09B2\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09AC\u09BE \u09AC\u09BF\u0995\u09B2\u09CD\u09AA \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u0996\u09C7\u09B2\u09B2\u09C7 \u09A4\u09BE \u098F\u0995\u099F\u09BF \u09A7\u09BE\u09B0\u09BE\u09AC\u09BE\u09B9\u09BF\u0995 ", /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-400 font-bold"
  }, "\u09AC\u09BF\u099C\u09AF\u09BC\u09C0 \u099F\u09CD\u09B0\u09C7\u09A8\u09CD\u09A1\u09C7"), " \u09AA\u09B0\u09BF\u09A3\u09A4 \u09B9\u09AF\u09BC!")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: runSim,
    disabled: isSimulating,
    className: "w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-glow-emerald transition-all duration-200 disabled:opacity-50 touch-manipulation"
  }, /*#__PURE__*/React.createElement(Play, {
    className: `w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`
  }), /*#__PURE__*/React.createElement("span", null, isSimulating ? `${simProgress}%` : 'নতুন ট্রায়াল চালান')))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-800 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-300"
  }, "\u09AE\u09CB\u099F \u0995\u09AF\u09BC\u09C7\u09A8 \u099F\u09B8 \u09B8\u09CD\u099F\u09C7\u09AA:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30"
  }, totalSteps)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "50",
    max: "500",
    step: "50",
    value: totalSteps,
    onChange: e => setTotalSteps(parseInt(e.target.value)),
    className: "w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-emerald-500 touch-none"
  })), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u0997\u09C7\u09AE A",
    value: simResults ? `${simResults.finalCapA > 0 ? '+' : ''}${simResults.finalCapA}` : '$0',
    subtext: "\u09AC\u09BE\u09AF\u09BC\u09BE\u09B8\u09CD\u09A1 \u0995\u09AF\u09BC\u09C7\u09A8 (\u09B2\u09B8\u09BF\u0982 EV)",
    icon: TrendingDown,
    color: "purple"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u0997\u09C7\u09AE B",
    value: simResults ? `${simResults.finalCapB > 0 ? '+' : ''}${simResults.finalCapB}` : '$0',
    subtext: "\u0995\u09CD\u09AF\u09BE\u09AA\u09BF\u099F\u09BE\u09B2 \u09AE\u09CB\u09A1\u09C1\u09B2\u09CB (\u09B2\u09B8\u09BF\u0982 EV)",
    icon: TrendingDown,
    color: "purple"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u09AA\u09B0\u09CD\u09AF\u09BE\u09AF\u09BC\u0995\u09CD\u09B0\u09AE\u09BF\u0995 \u09AC\u09BF\u0995\u09B2\u09CD\u09AA (A+B)",
    value: simResults ? `+$${simResults.finalCapAlt}` : '$0',
    subtext: "\u2605 \u09A7\u09BE\u09B0\u09BE\u09AC\u09BE\u09B9\u09BF\u0995 \u09AC\u09BF\u099C\u09AF\u09BC\u09C0 \u099F\u09CD\u09B0\u09C7\u09A8\u09CD\u09A1!",
    icon: TrendingUp,
    color: "emerald",
    highlight: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 min-h-[280px] sm:min-h-[340px] flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Zap, {
    className: "w-4 h-4 text-emerald-400"
  }), /*#__PURE__*/React.createElement("span", null, "\u0995\u09CD\u09AF\u09BE\u09AA\u09BF\u099F\u09BE\u09B2 \u0997\u09CD\u09B0\u09BE\u09AB (", totalSteps, " \u099F\u09BF \u0995\u09AF\u09BC\u09C7\u09A8 \u09AB\u09CD\u09B2\u09BF\u09AA)"))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 relative min-h-[220px] sm:min-h-[280px]"
  }, /*#__PURE__*/React.createElement(Line, {
    data: chartData,
    options: chartOptions
  }))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: "\u09AA\u09BE\u09B0\u09A8\u09CD\u09A1\u09CB\u09B0 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 (Parrondo's Paradox)",
    eli5: "\u098F\u09AE\u09A8 \u09A6\u09C1\u099F\u09BF \u0995\u09AF\u09BC\u09C7\u09A8 \u0997\u09C7\u09AE\u09C7\u09B0 \u0995\u09A5\u09BE \u09AD\u09BE\u09AC\u09C1\u09A8 \u09AF\u09C7\u0996\u09BE\u09A8\u09C7 \u0986\u09B2\u09BE\u09A6\u09BE\u09AD\u09BE\u09AC\u09C7 \u0996\u09C7\u09B2\u09A4\u09C7 \u0997\u09C7\u09B2\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u099F\u09BE\u0995\u09BE \u0995\u09AE\u09A4\u09C7\u0987 \u09A5\u09BE\u0995\u09C7\u0964 \u0997\u09C7\u09AE A-\u09A4\u09C7 \u09B0\u09BF\u0997\u09A1 \u0995\u09DF\u09C7\u09A8 \u09A5\u09BE\u0995\u09C7\u0964 \u0997\u09C7\u09AE B-\u09A4\u09C7 \u0995\u09DF\u09C7\u09A8 \u099F\u09B8\u09C7\u09B0 \u09AD\u09BE\u0997\u09CD\u09AF \u09A8\u09BF\u09B0\u09CD\u09AD\u09B0 \u0995\u09B0\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8 \u099F\u09BE\u0995\u09BE\u09B0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE \u09E9 \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09AC\u09BF\u09AD\u09BE\u099C\u09CD\u09AF \u0995\u09BF\u09A8\u09BE\u0964 \u0986\u09AA\u09A8\u09BF \u098F\u0995\u09BE \u0997\u09C7\u09AE A \u0996\u09C7\u09B2\u09B2\u09C7 \u09B9\u09BE\u09B0\u09AC\u09C7\u09A8, \u098F\u0995\u09BE \u0997\u09C7\u09AE B \u0996\u09C7\u09B2\u09B2\u09C7\u0993 \u09B9\u09BE\u09B0\u09AC\u09C7\u09A8\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09A6\u09C1\u099F\u09BF \u0997\u09C7\u09AE \u09AA\u09B0\u09CD\u09AF\u09BE\u09DF\u0995\u09CD\u09B0\u09AE\u09C7 \u09AC\u09A6\u09B2\u09C7 \u09AC\u09A6\u09B2\u09C7 \u0996\u09C7\u09B2\u09B2\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u099F\u09BE\u0995\u09BE \u09AC\u09B9\u09C1\u0997\u09C1\u09A3\u09C7 \u09AC\u09BE\u09DC\u09A4\u09C7 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09C7!",
    intuitionTrap: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u09CD\u09AC\u099C\u09CD\u099E\u09BE\u09A4 \u09A7\u09BE\u09B0\u09A3\u09BE \u09AC\u09B2\u09C7 \u09A6\u09C1\u099F\u09BF \u098B\u09A3\u09BE\u09A4\u09CD\u09AE\u0995 \u09AB\u09B2\u09BE\u09AB\u09B2 \u09AF\u09CB\u0997 \u0995\u09B0\u09B2\u09C7 \u098B\u09A3\u09BE\u09A4\u09CD\u09AE\u0995\u0987 \u09B9\u09DF (-\u09E8 + -\u09E8 = -\u09EA)\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09AA\u09BE\u09B0\u09A8\u09CD\u09A1\u09CB\u09B0 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8\u09C7 \u0997\u09C7\u09AE A \u0997\u09C7\u09AE B-\u098F\u09B0 \u0996\u09BE\u09B0\u09BE\u09AA \u099A\u0995\u09CD\u09B0 \u09A5\u09C7\u0995\u09C7 \u09AA\u09CD\u09B2\u09C7\u09DF\u09BE\u09B0\u0995\u09C7 \u09AC\u09C7\u09B0 \u0995\u09B0\u09C7 \u098F\u09A8\u09C7 \u099C\u09DF\u09C0 \u09B9\u0993\u09DF\u09BE\u09B0 \u09B0\u09BE\u099C\u09CD\u09AF\u09C7 \u09A8\u09BF\u09DF\u09C7 \u09AF\u09BE\u09DF\u0964",
    mathProof: `গেম A: P(win) = ০.৪৯ - e (লসিং প্রত্যাশিত মান)

গেম B:
  যদি মূলধন mod 3 == 0: P(win) = ০.০৯ - e (খারাপ স্টেট)
  যদি মূলধন mod 3 != 0: P(win) = ০.৭৪ - e (ভালো স্টেট)

একা গেম B খেললে প্লেয়ারের মূলধন বেশিরভাগ সময় bad state এ আটকে যায়।
কিন্তু গেম A ও গেম B অল্টারনেট করে খেললে গেম A প্লেয়ারকে mod 3 == 0 ফাঁদ থেকে বের করে দেয় এবং প্লেয়ার ৭৪% জেতার সুযোগ পায়!`,
    realWorld: "\u09AC\u09BE\u09AF\u09BC\u09CB\u09B2\u099C\u09BF \u0993 \u09AB\u09BE\u0987\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8 \u09AA\u09CB\u09B0\u09CD\u09AB\u09CB\u09B2\u09BF\u0993 \u09B0\u09BF\u09AC\u09CD\u09AF\u09BE\u09B2\u09C7\u09A8\u09CD\u09B8\u09BF\u0982 (Volatility Harvesting)! \u09AC\u09BE\u09AF\u09BC\u09CB\u09B2\u099C\u09BF\u09A4\u09C7 \u09AA\u09CD\u09B0\u099C\u09BE\u09A4\u09BF\u09B0\u09BE \u09AC\u09C7\u0981\u099A\u09C7 \u09A5\u09BE\u0995\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A6\u09C1\u099F\u09BF \u099D\u09C1\u0981\u0995\u09BF\u09AA\u09C2\u09B0\u09CD\u09A3 \u0995\u09CC\u09B6\u09B2 \u09AA\u09B0\u09CD\u09AF\u09BE\u09DF\u0995\u09CD\u09B0\u09AE\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09A6\u09C0\u09B0\u09CD\u0998\u09AE\u09C7\u09DF\u09BE\u09A6\u09C7 \u099F\u09BF\u0995\u09C7 \u09A5\u09BE\u0995\u09C7\u0964"
  })));
}