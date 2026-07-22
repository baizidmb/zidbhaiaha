import React, { useState, useEffect } from 'react';
import { Coins, Play, RotateCcw, TrendingUp, TrendingDown, Zap } from 'lucide-react';
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
      label: 'Alternating Strategy (A+B) [WINNING!]',
      data: simResults?.alternating || [],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointRadius: 0
    }, {
      label: 'Game A Only [LOSING]',
      data: simResults?.gameA || [],
      borderColor: '#EC4899',
      borderWidth: 2,
      borderDash: [4, 4],
      pointRadius: 0
    }, {
      label: 'Game B Only [LOSING]',
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
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} Capital`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Simulation Steps / Coin Flips',
          color: '#64748b'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Player Capital ($)',
          color: '#64748b'
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "parrondo",
    className: "py-8 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
  }, /*#__PURE__*/React.createElement(Coins, {
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, "Parrondo's Paradox")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-sm mt-1.5 font-medium"
  }, "Combine two individually ", /*#__PURE__*/React.createElement("span", {
    className: "text-pink-400 font-bold"
  }, "LOSING games"), " (Game A & Game B) to produce a steadily ", /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-400 font-bold"
  }, "WINNING trend"), "!")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: runSim,
    disabled: isSimulating,
    className: "flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald transition-all duration-200 disabled:opacity-50"
  }, /*#__PURE__*/React.createElement(Play, {
    className: `w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`
  }), /*#__PURE__*/React.createElement("span", null, isSimulating ? `${simProgress}%` : 'Run New Trial')))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-300"
  }, "Total Flip Steps:"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30"
  }, totalSteps)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "50",
    max: "500",
    step: "50",
    value: totalSteps,
    onChange: e => setTotalSteps(parseInt(e.target.value)),
    className: "w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-emerald-500"
  })), /*#__PURE__*/React.createElement(StatCard, {
    label: "Game A Only",
    value: simResults ? `${simResults.finalCapA > 0 ? '+' : ''}${simResults.finalCapA}` : '$0',
    subtext: "Biased coin (Losing EV)",
    icon: TrendingDown,
    color: "purple"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Game B Only",
    value: simResults ? `${simResults.finalCapB > 0 ? '+' : ''}${simResults.finalCapB}` : '$0',
    subtext: "Capital modulo coin (Losing EV)",
    icon: TrendingDown,
    color: "purple"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Alternating (A+B)",
    value: simResults ? `+$${simResults.finalCapAlt}` : '$0',
    subtext: "\u2605 RATCHET WINNING TREND!",
    icon: TrendingUp,
    color: "emerald",
    highlight: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-2xl p-5 border border-slate-800 min-h-[340px] flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Zap, {
    className: "w-4 h-4 text-emerald-400"
  }), /*#__PURE__*/React.createElement("span", null, "Capital Trajectory Over Time (", totalSteps, " Coin Tosses)"))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 relative min-h-[280px]"
  }, /*#__PURE__*/React.createElement(Line, {
    data: chartData,
    options: chartOptions
  }))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: "Parrondo's Paradox",
    eli5: "Imagine two games where you lose money over time. In Game A, you flip a slightly rigged coin. In Game B, you flip a coin whose odds depend on whether your current money is a multiple of 3. If you play Game A alone, you lose. If you play Game B alone, you lose. But if you alternate between Game A and Game B, your money shoots UP!",
    intuitionTrap: "Common sense dictates that adding two negative numbers gives a negative number (-2 + -2 = -4). So combining two losing games SHOULD yield a super-losing game! We fail to realize that Game A breaks the bad cycle trap of Game B.",
    mathProof: `Game A: P(win) = 0.49 - e (Losing expected value)

Game B:
  If Capital mod 3 == 0: P(win) = 0.09 - e (Bad state)
  If Capital mod 3 != 0: P(win) = 0.74 - e (Good state)

When playing Game B alone, player capital naturally gets trapped in the Bad State (mod 3 == 0) most of the time, causing net loss.

When alternating Game A + Game B:
Game A's random step shifts the capital out of the mod 3 == 0 trap! This forces the player into Game B's 74% winning state far more often, turning the overall stationary probability into a positive ratchet (+0.016 EV)!`,
    realWorld: "Biological Survival & Financial Portfolios! In biology, organisms alternate between two survival strategies to survive harsh conditions. In finance, rebalancing two decaying assets can yield positive portfolio growth (Volatility Harvesting)."
  })));
}