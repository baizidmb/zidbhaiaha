import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Flame, Play, RefreshCw, UserCheck, Users, Zap, Percent } from 'lucide-react';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
import { calculateBirthdayProbability, getBirthdayCurveData, generateBirthdayTrial, formatDayOfYear } from '../utils/paradoxMath.js';
import { runBirthdayMonteCarloAsync } from '../utils/simulationEngine.js';
import { playClickSound, playWinFanfare } from '../utils/sound.js';
import { Line } from 'react-chartjs-2';
export default function BirthdayParadox() {
  const [numPeople, setNumPeople] = useState(23);
  const [trialResult, setTrialResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [monteCarloProgress, setMonteCarloProgress] = useState(null);
  const [empiricalRate, setEmpiricalRate] = useState(null);
  const canvasRef = useRef(null);
  const gridContainerRef = useRef(null);
  const probDecimal = useMemo(() => calculateBirthdayProbability(numPeople), [numPeople]);
  const probPercent = (probDecimal * 100).toFixed(1);
  const isThreshold = numPeople === 23;
  useEffect(() => {
    runSingleTrial();
  }, [numPeople]);
  const runSingleTrial = () => {
    playClickSound();
    const result = generateBirthdayTrial(numPeople);
    setTrialResult(result);
    if (result.hasMatch) {
      playWinFanfare();
    }
  };
  useEffect(() => {
    if (!trialResult || !canvasRef.current || !gridContainerRef.current) return;
    const canvas = canvasRef.current;
    const container = gridContainerRef.current;
    const ctx = canvas.getContext('2d');
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (trialResult.matchingPairs.length === 0) return;
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#3B82F6';
    ctx.shadowBlur = 8;
    trialResult.matchingPairs.forEach(([idxA, idxB]) => {
      const elA = container.querySelector(`[data-avatar-id="${idxA}"]`);
      const elB = container.querySelector(`[data-avatar-id="${idxB}"]`);
      if (elA && elB) {
        const rectA = elA.getBoundingClientRect();
        const rectB = elB.getBoundingClientRect();
        const x1 = rectA.left + rectA.width / 2 - rect.left;
        const y1 = rectA.top + rectA.height / 2 - rect.top;
        const x2 = rectB.left + rectB.width / 2 - rect.left;
        const y2 = rectB.top + rectB.height / 2 - rect.top;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    });
  }, [trialResult, numPeople]);
  const handleRunMonteCarlo = () => {
    playClickSound();
    setIsSimulating(true);
    setMonteCarloProgress(0);
    runBirthdayMonteCarloAsync(numPeople, 1000, (progress, snapshot) => {
      setMonteCarloProgress(progress);
      setEmpiricalRate(snapshot.empiricalRate);
    }, () => {
      setIsSimulating(false);
    });
  };
  const curveData = useMemo(() => {
    const {
      labels,
      data
    } = getBirthdayCurveData();
    return {
      labels,
      datasets: [{
        label: 'তাত্ত্বিক সম্ভাব্যতা (%)',
        data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }, {
        label: `বর্তমান অবস্থান (${numPeople} জন)`,
        data: labels.map(l => l === numPeople ? +probPercent : null),
        borderColor: '#EC4899',
        backgroundColor: '#EC4899',
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };
  }, [numPeople, probPercent]);
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
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'মানুষের সংখ্যা (n)',
          color: '#64748b'
        }
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'সম্ভাব্যতা (%)',
          color: '#64748b'
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "birthday",
    className: "py-6 sm:py-8 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 sm:p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400"
  }, /*#__PURE__*/React.createElement(Flame, {
    className: "w-5 h-5 sm:w-6 sm:h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, "\u09AC\u09BE\u09B0\u09CD\u09A5\u09A1\u09C7 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 (Birthday Paradox)")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-sm mt-1.5 font-medium"
  }, "\u098F\u0995\u099F\u09BF \u0998\u09B0\u09C7 \u09AE\u09BE\u09A4\u09CD\u09B0 \u09E8\u09E9 \u099C\u09A8 \u09AE\u09BE\u09A8\u09C1\u09B7 \u09A5\u09BE\u0995\u09B2\u09C7\u0987 \u0985\u09A8\u09CD\u09A4\u09A4 \u09E8 \u099C\u09A8\u09C7\u09B0 \u098F\u0995\u0987 \u09A6\u09BF\u09A8\u09C7 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8 \u09B9\u0993\u09DF\u09BE\u09B0 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE ", /*#__PURE__*/React.createElement("span", {
    className: "text-blue-400 font-bold"
  }, "\u09EB\u09E6.\u09ED%"), "!")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: runSingleTrial,
    className: "flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-glow-blue transition-all duration-200 touch-manipulation"
  }, /*#__PURE__*/React.createElement(Play, {
    className: "w-4 h-4 fill-current"
  }), /*#__PURE__*/React.createElement("span", null, "\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1\u09AE \u099F\u09CD\u09B0\u09BE\u09AF\u09BC\u09BE\u09B2 \u099A\u09BE\u09B2\u09BE\u09A8")), /*#__PURE__*/React.createElement("button", {
    onClick: handleRunMonteCarlo,
    disabled: isSimulating,
    className: "flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all duration-200 disabled:opacity-50 touch-manipulation"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: `w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-blue-400' : ''}`
  }), /*#__PURE__*/React.createElement("span", null, isSimulating ? `${monteCarloProgress}%` : '১,০০০ সিমুলেশন')))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs sm:text-sm font-bold text-slate-200 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Users, {
    className: "w-4 h-4 text-blue-400"
  }), /*#__PURE__*/React.createElement("span", null, "\u0998\u09B0\u09C7 \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE (n):")), /*#__PURE__*/React.createElement("span", {
    className: "text-xl sm:text-2xl font-black font-mono text-blue-400 bg-blue-500/10 px-3 py-0.5 sm:py-1 rounded-xl border border-blue-500/30"
  }, numPeople, " \u099C\u09A8")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "100",
    value: numPeople,
    onChange: e => setNumPeople(parseInt(e.target.value)),
    className: "w-full h-3 bg-slate-800 rounded-lg cursor-pointer accent-blue-500 my-2 touch-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-mono mt-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u09E7 \u099C\u09A8 (\u09E6%)"), /*#__PURE__*/React.createElement("span", {
    className: `font-bold ${isThreshold ? 'text-blue-400 underline decoration-2' : ''}`
  }, "\u09E8\u09E9 \u099C\u09A8 (\u09EB\u09E6.\u09ED% \u09A5\u09CD\u09B0\u09C7\u09B6\u09B9\u09CB\u09B2\u09CD\u09A1)"), /*#__PURE__*/React.createElement("span", null, "\u09E7\u09E6\u09E6 \u099C\u09A8 (\u09EF\u09EF.\u09EF\u09EF%)"))), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u098F\u0995\u09A4\u09CD\u09B0\u09BF\u09A4 \u09AE\u09CD\u09AF\u09BE\u099A \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE",
    value: `${probPercent}%`,
    subtext: isThreshold ? "★ ৫০.৭% গুরুত্বপূর্ণ সীমা অর্জিত!" : `P(match) = 1 - (365! / (365^${numPeople} * (365-${numPeople})!))`,
    icon: Percent,
    color: isThreshold ? 'blue' : 'purple',
    highlight: true
  })), empiricalRate !== null && /*#__PURE__*/React.createElement("div", {
    className: "mb-6 p-3.5 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2.5"
  }, /*#__PURE__*/React.createElement(Zap, {
    className: "w-4 h-4 text-blue-400 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs sm:text-sm font-semibold text-slate-200"
  }, "\u098F\u09AE\u09AA\u09BF\u09B0\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AE\u09A8\u09CD\u099F\u09BF \u0995\u09BE\u09B0\u09CD\u09B2\u09CB \u09AB\u09B2\u09BE\u09AB\u09B2 (", numPeople, " \u099C\u09A8\u09C7\u09B0 \u09E7,\u09E6\u09E6\u09E6 \u099F\u09CD\u09B0\u09BE\u09AF\u09BC\u09BE\u09B2):")), /*#__PURE__*/React.createElement("span", {
    className: "text-base sm:text-lg font-extrabold font-mono text-blue-400 bg-slate-900 px-3 py-0.5 rounded-lg border border-slate-700"
  }, empiricalRate, "% \u09AE\u09CD\u09AF\u09BE\u099A\u09C7 \u0985\u09AE\u09BF\u09B2 \u09B9\u09DF\u09A8\u09BF (\u09AE\u09CD\u09AF\u09BE\u099A \u09AA\u09BE\u0993\u09DF\u09BE \u0997\u09C7\u099B\u09C7)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(UserCheck, {
    className: "w-4 h-4 text-cyan-400"
  }), /*#__PURE__*/React.createElement("span", null, "\u09B8\u09BF\u09AE\u09C1\u09B2\u09C7\u099F\u09C7\u09A1 \u0998\u09B0\u09C7\u09B0 \u09AE\u09BE\u09A8\u09C1\u09B7 (", numPeople, " \u099C\u09A8)")), trialResult && /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg font-mono ${trialResult.hasMatch ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'}`
  }, trialResult.hasMatch ? `✓ ${trialResult.totalMatches} টি মিল পাওয়া গেছে!` : 'কোন মিল নেই')), /*#__PURE__*/React.createElement("div", {
    ref: gridContainerRef,
    className: "relative min-h-[250px] p-1"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "absolute inset-0 pointer-events-none z-10"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2 relative z-0"
  }, trialResult?.avatars.map(av => {
    const isMatched = trialResult.matchedAvatarSet.has(av.id);
    return /*#__PURE__*/React.createElement("div", {
      key: av.id,
      "data-avatar-id": av.id,
      className: `flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${isMatched ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-glow-cyan scale-105 z-20 animate-pulse-slow' : 'bg-slate-900/80 border border-slate-800 text-slate-400'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs ${isMatched ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'}`
    }, "#", av.id + 1), /*#__PURE__*/React.createElement("span", {
      className: "text-[9px] sm:text-[10px] font-mono mt-1 font-semibold text-slate-300 text-center leading-tight"
    }, formatDayOfYear(av.birthday)));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Percent, {
    className: "w-4 h-4 text-purple-400"
  }), /*#__PURE__*/React.createElement("span", null, "\u09A4\u09BE\u09A4\u09CD\u09A4\u09CD\u09AC\u09BF\u0995 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF\u09A4\u09BE \u0995\u09BE\u09B0\u09CD\u09AD (Curve)")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-h-[220px] sm:min-h-[260px] relative"
  }, /*#__PURE__*/React.createElement(Line, {
    data: curveData,
    options: chartOptions
  })))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: "\u09AC\u09BE\u09B0\u09CD\u09A5\u09A1\u09C7 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 (Birthday Paradox)",
    eli5: "\u098F\u0995\u099F\u09C1 \u09AD\u09C7\u09AC\u09C7 \u09A6\u09C7\u0996\u09C1\u09A8: \u0986\u09AA\u09A8\u09BF \u09AF\u09A6\u09BF \u0998\u09B0\u09C7 \u0986\u09B8\u09BE \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09E7 \u099C\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8 \u09AE\u09C7\u09B2\u09BE\u09A4\u09C7 \u099A\u09BE\u09A8, \u09A4\u09AC\u09C7 \u09AC\u099B\u09B0\u09C7\u09B0 \u0985\u09B0\u09CD\u09A7\u09C7\u0995\u09C7\u09B0 \u09AC\u09C7\u09B6\u09BF \u09E7\u09EE\u09E9 \u099C\u09A8 \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09AA\u09CD\u09B0\u09DF\u09CB\u099C\u09A8\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u0986\u09AE\u09B0\u09BE \u09AF\u0996\u09A8 \u09AC\u09B2\u09BF '\u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09E8 \u099C\u09A8 \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8 \u09AE\u09BF\u09B2\u09AC\u09C7 \u0995\u09BF\u09A8\u09BE'\u2014\u09A4\u0996\u09A8 \u0998\u09B0\u09C7\u09B0 \u09B8\u09AC\u09BE\u0987 \u09B8\u09AC\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09B9\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1\u09B6\u09C7\u0995 \u0995\u09B0\u09C7! \u09AE\u09BE\u09A4\u09CD\u09B0 \u09E8\u09E9 \u099C\u09A8 \u09AE\u09BE\u09A8\u09C1\u09B7 \u09A5\u09BE\u0995\u09B2\u09C7 \u09B8\u09C7\u0996\u09BE\u09A8\u09C7 \u09E8\u09EB\u09E9 \u099F\u09BF \u099C\u09CB\u09DC\u09BE \u09A4\u09C8\u09B0\u09BF \u09B9\u09DF, \u09AF\u09BE \u09EB\u09E6.\u09ED% \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C7\u0964",
    intuitionTrap: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09AE\u09B8\u09CD\u09A4\u09BF\u09B7\u09CD\u0995 \u09B8\u09AC\u09B8\u09AE\u09DF \u09B8\u09CD\u09AC\u099C\u09CD\u099E\u09BE\u09A4\u09AD\u09BE\u09AC\u09C7 \u099A\u09BF\u09A8\u09CD\u09A4\u09BE \u0995\u09B0\u09C7: '\u0985\u09A8\u09CD\u09AF \u0995\u09BE\u09B0\u09CB\u09B0 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8 \u0995\u09BF \u0986\u09AE\u09BE\u09B0 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AE\u09BF\u09B2\u09AC\u09C7?' (\u09AF\u09BE\u09A4\u09C7 \u09E7\u09EE\u09E9 \u099C\u09A8 \u09B2\u09BE\u0997\u09C7)\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8\u099F\u09BF \u09B9\u09B2\u09CB: '\u09AF\u09C7 \u0995\u09CB\u09A8\u09CB \u09E8 \u099C\u09A8 \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u0995\u09BF \u09AE\u09BF\u09B2 \u09B0\u09DF\u09C7\u099B\u09C7?' \u099C\u09CB\u09DC\u09BE\u09B0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09B8\u09BE\u09A5\u09C7 \u09AC\u09B9\u09C1\u0997\u09C1\u09A3\u09C7 \u09AC\u09BE\u09DC\u09A4\u09C7 \u09A5\u09BE\u0995\u09C7\u0964",
    mathProof: `n জন মানুষের সূত্র:
P(match) = 1 - P(no match)
P(no match) = (365/365) * (364/365) * (363/365) * ... * ((365 - n + 1)/365)

n = ২৩ জনের জন্য মোট জোড়ার সংখ্যা:
জোড়া = ২৩ * ২২ / ২ = ২৫৩ টি জোড়া!
P(no match) = ০.৪৯২৭
P(কমপক্ষে ১টি মিল) = ১ - ০.৪৯২৭ = ০.৫০৭৩ (৫০.৭%)`,
    realWorld: "\u09B8\u09BE\u0987\u09AC\u09BE\u09B0 \u09B8\u09BF\u0995\u09BF\u0989\u09B0\u09BF\u099F\u09BF\u09A4\u09C7 \u09AA\u09BE\u09B8\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u09B9\u09CD\u09AF\u09BE\u09B6\u09BF\u0982 (Birthday Attack)! \u09B9\u09CD\u09AF\u09BE\u0995\u09BE\u09B0\u09B0\u09BE \u098F\u0987 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09AD\u09BF\u09A8\u09CD\u09A8 \u09A6\u09C1\u099F\u09BF \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AB\u09BE\u0987\u09B2 \u09AC\u09BE \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B9\u09C1\u09AC\u09B9\u09C1 \u098F\u0995\u0987 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B8\u09BF\u0997\u09A8\u09C7\u099A\u09BE\u09B0 \u09B9\u09CD\u09AF\u09BE\u09B6 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C7 \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u0995\u09CD\u09B0\u09CD\u09AF\u09BE\u0995 \u0995\u09B0\u09C7\u0964"
  })));
}