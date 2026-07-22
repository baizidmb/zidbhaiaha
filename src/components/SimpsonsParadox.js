import React, { useState, useMemo } from 'react';
import { BarChart2, Layers, Filter, Sliders, ArrowRightLeft } from 'lucide-react';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
import { DEFAULT_SIMPSONS_DATA, computeSimpsonsRates } from '../utils/paradoxMath.js';
import { playClickSound } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';
export default function SimpsonsParadox() {
  const [data, setData] = useState(DEFAULT_SIMPSONS_DATA);
  const [viewMode, setViewMode] = useState('subgroup');
  const rates = useMemo(() => computeSimpsonsRates(data), [data]);
  const handleToggleView = mode => {
    playClickSound();
    setViewMode(mode);
  };
  const handleCountChange = (treatment, group, field, value) => {
    const val = parseInt(value) || 1;
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[treatment][group][field] = val;
      if (field === 'total' && next[treatment][group].success > val) {
        next[treatment][group].success = val;
      }
      return next;
    });
  };
  const handleReset = () => {
    playClickSound();
    setData(DEFAULT_SIMPSONS_DATA);
  };
  const chartData = useMemo(() => {
    if (viewMode === 'subgroup') {
      return {
        labels: ['ছোট পাথর (সহজ কেস)', 'বড় পাথর (জটিল কেস)'],
        datasets: [{
          label: 'চিকিৎসা A (সার্জারি)',
          data: [rates.treatmentA.smallRate, rates.treatmentA.largeRate],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          borderRadius: 8
        }, {
          label: 'চিকিৎসা B (আল্ট্রাসাউন্ড)',
          data: [rates.treatmentB.smallRate, rates.treatmentB.largeRate],
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: '#EC4899',
          borderWidth: 2,
          borderRadius: 8
        }]
      };
    } else {
      return {
        labels: ['একত্রিত মোট সকল কেস (Aggregate)'],
        datasets: [{
          label: 'চিকিৎসা A মোট সফলতার হার',
          data: [rates.treatmentA.overallRate],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          borderRadius: 8
        }, {
          label: 'চিকিৎসা B মোট সফলতার হার',
          data: [rates.treatmentB.overallRate],
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: '#EC4899',
          borderWidth: 2,
          borderRadius: 8
        }]
      };
    }
  }, [viewMode, rates]);
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
      y: {
        min: 50,
        max: 100,
        ticks: {
          callback: v => `${v}%`
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "simpsons",
    className: "py-6 sm:py-8 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 sm:p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
  }, /*#__PURE__*/React.createElement(BarChart2, {
    className: "w-5 h-5 sm:w-6 sm:h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, "\u09B8\u09BF\u09AE\u09CD\u09AA\u09B8\u09A8\u09C7\u09B0 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 (Simpson's Paradox)")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-sm mt-1.5 font-medium"
  }, "\u09AA\u09C3\u09A5\u0995 \u09B8\u09BE\u09AC\u0997\u09CD\u09B0\u09C1\u09AA\u09C7 \u09AF\u09C7 \u099F\u09CD\u09B0\u09C7\u09A8\u09CD\u09A1 \u09B8\u09A0\u09BF\u0995 \u09A6\u09C7\u0996\u09BE\u09AF\u09BC, \u09B8\u09AC\u0997\u09C1\u09B2\u09CB \u0997\u09CD\u09B0\u09C1\u09AA \u098F\u0995\u09A4\u09CD\u09B0\u09BF\u09A4 \u0995\u09B0\u09B2\u09C7 \u09AB\u09B2\u09BE\u09AB\u09B2 ", /*#__PURE__*/React.createElement("span", {
    className: "text-cyan-400 font-bold"
  }, "\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u0989\u09B2\u09CD\u099F\u09C7 \u09AF\u09BE\u09AF\u09BC"), "!")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-1.5 bg-slate-900/90 p-1 sm:p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleToggleView('subgroup'),
    className: `flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center touch-manipulation ${viewMode === 'subgroup' ? 'bg-cyan-600 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-slate-200'}`
  }, /*#__PURE__*/React.createElement(Layers, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "\u09B8\u09BE\u09AC\u0997\u09CD\u09B0\u09C1\u09AA \u09AD\u09BF\u0989 (A \u09B8\u09C7\u09B0\u09BE)")), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleToggleView('aggregate'),
    className: `flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center touch-manipulation ${viewMode === 'aggregate' ? 'bg-pink-600 text-white shadow-glow-pink' : 'text-slate-400 hover:text-slate-200'}`
  }, /*#__PURE__*/React.createElement(Filter, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "\u098F\u0995\u09A4\u09CD\u09B0\u09BF\u09A4 \u09AD\u09BF\u0989 (B \u09AD\u09BE\u09B2\u09CB \u09A6\u09C7\u0996\u09BE\u09AF\u09BC)")))), /*#__PURE__*/React.createElement("div", {
    className: `mb-6 p-3.5 sm:p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${viewMode === 'subgroup' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-pink-500/10 border-pink-500/30 text-pink-300'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement(ArrowRightLeft, {
    className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm font-semibold"
  }, viewMode === 'subgroup' ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u09B8\u09BE\u09AC\u0997\u09CD\u09B0\u09C1\u09AA \u098F\u09A8\u09BE\u09B2\u09BE\u0987\u09B8\u09BF\u09B8:"), " \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE A \u099B\u09CB\u099F \u09AA\u09BE\u09A5\u09B0 (", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-400"
  }, rates.treatmentA.smallRate, "%"), " \u09AC\u09A8\u09BE\u09AE ", rates.treatmentB.smallRate, "%) \u098F\u09AC\u0982 \u09AC\u09DC \u09AA\u09BE\u09A5\u09B0 (", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-400"
  }, rates.treatmentA.largeRate, "%"), " \u09AC\u09A8\u09BE\u09AE ", rates.treatmentB.largeRate, "%) \u0989\u09AD\u09DF \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7\u0987 \u09B8\u09C7\u09B0\u09BE!") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u098F\u0995\u09A4\u09CD\u09B0\u09BF\u09A4 \u09AC\u09BF\u09AD\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF:"), " \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE B \u0995\u09C7 \u09B8\u09BE\u09AE\u0997\u09CD\u09B0\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u099C\u09DF\u09C0 \u09AE\u09A8\u09C7 \u09B9\u09DF (", /*#__PURE__*/React.createElement("strong", {
    className: "text-pink-400"
  }, rates.treatmentB.overallRate, "%"), " \u09AC\u09A8\u09BE\u09AE ", rates.treatmentA.overallRate, "%) \u0995\u09BE\u09B0\u09A3 \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE A-\u0995\u09C7 \u0985\u09A8\u09C7\u0995 \u09AC\u09C7\u09B6\u09BF \u099C\u099F\u09BF\u09B2 \u09B0\u09CB\u0997\u09C0\u09A6\u09C7\u09B0 \u09A6\u09C7\u0993\u09DF\u09BE \u09B9\u09DF\u09C7\u099B\u09BF\u09B2!")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Trt A (\u099B\u09CB\u099F \u09AA\u09BE\u09A5\u09B0)",
    value: `${rates.treatmentA.smallRate}%`,
    subtext: `${data.treatmentA.smallStones.success}/${data.treatmentA.smallStones.total} সুস্থ`,
    color: "blue",
    highlight: viewMode === 'subgroup'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Trt A (\u09AC\u09DC \u09AA\u09BE\u09A5\u09B0)",
    value: `${rates.treatmentA.largeRate}%`,
    subtext: `${data.treatmentA.largeStones.success}/${data.treatmentA.largeStones.total} সুস্থ`,
    color: "blue",
    highlight: viewMode === 'subgroup'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Trt A \u09AE\u09CB\u099F \u09B9\u09BE\u09B0",
    value: `${rates.treatmentA.overallRate}%`,
    subtext: `${rates.treatmentA.totalCount} জন রোগী`,
    color: "blue"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Trt B \u09AE\u09CB\u099F \u09B9\u09BE\u09B0",
    value: `${rates.treatmentB.overallRate}%`,
    subtext: `${rates.treatmentB.totalCount} জন রোগী`,
    color: "pink",
    highlight: viewMode === 'aggregate'
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(BarChart2, {
    className: "w-4 h-4 text-cyan-400"
  }), /*#__PURE__*/React.createElement("span", null, viewMode === 'subgroup' ? 'সাবগ্রুপ চিকিৎসায় সফলতার তুলনা' : 'একত্রিত সামগ্রিক সফলতার তুলনা')), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 relative min-h-[220px] sm:min-h-[260px]"
  }, /*#__PURE__*/React.createElement(Bar, {
    data: chartData,
    options: chartOptions
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Sliders, {
    className: "w-4 h-4 text-purple-400"
  }), /*#__PURE__*/React.createElement("span", null, "\u09B0\u09CB\u0997\u09C0\u09B0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09C1\u09A8")), /*#__PURE__*/React.createElement("button", {
    onClick: handleReset,
    className: "text-xs font-mono text-cyan-400 hover:underline"
  }, "\u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09C7\u09B8")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-blue-400 text-xs uppercase tracking-wider"
  }, "\u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE A \u09B0\u09CB\u0997\u09C0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "\u099B\u09CB\u099F \u09AA\u09BE\u09A5\u09B0 (\u09AE\u09CB\u099F):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "500",
    value: data.treatmentA.smallStones.total,
    onChange: e => handleCountChange('treatmentA', 'smallStones', 'total', e.target.value),
    className: "w-16 sm:w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-blue-300"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "\u09AC\u09DC \u09AA\u09BE\u09A5\u09B0 (\u09AE\u09CB\u099F):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "500",
    value: data.treatmentA.largeStones.total,
    onChange: e => handleCountChange('treatmentA', 'largeStones', 'total', e.target.value),
    className: "w-16 sm:w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-blue-300"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-pink-400 text-xs uppercase tracking-wider"
  }, "\u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE B \u09B0\u09CB\u0997\u09C0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "\u099B\u09CB\u099F \u09AA\u09BE\u09A5\u09B0 (\u09AE\u09CB\u099F):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "500",
    value: data.treatmentB.smallStones.total,
    onChange: e => handleCountChange('treatmentB', 'smallStones', 'total', e.target.value),
    className: "w-16 sm:w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-pink-300"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "\u09AC\u09DC \u09AA\u09BE\u09A5\u09B0 (\u09AE\u09CB\u099F):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "500",
    value: data.treatmentB.largeStones.total,
    onChange: e => handleCountChange('treatmentB', 'largeStones', 'total', e.target.value),
    className: "w-16 sm:w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-pink-300"
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400 mt-3 leading-relaxed italic"
  }, "* \u0996\u09C7\u09DF\u09BE\u09B2 \u0995\u09B0\u09C1\u09A8: \u09B0\u09CB\u0997\u09C0\u09B0 \u09AC\u09A3\u09CD\u099F\u09A8 \u09B8\u09B9\u099C \u098F\u09AC\u0982 \u099C\u099F\u09BF\u09B2 \u0995\u09C7\u09B8\u09C7 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09B2\u09C7 \u09B8\u09BE\u09AE\u0997\u09CD\u09B0\u09BF\u0995 \u09AB\u09B2\u09BE\u09AB\u09B2\u09C7\u09B0 \u09A6\u09BF\u0995 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u0989\u09B2\u09CD\u099F\u09C7 \u09AF\u09BE\u09DF!"))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: "\u09B8\u09BF\u09AE\u09CD\u09AA\u09B8\u09A8\u09C7\u09B0 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09A1\u0995\u09CD\u09B8 (Simpson's Paradox)",
    eli5: "\u09AE\u09A8\u09C7 \u0995\u09B0\u09C1\u09A8 \u098F\u0995\u099C\u09A8 \u09AC\u09BF\u0996\u09CD\u09AF\u09BE\u09A4 \u09A1\u09BE\u0995\u09CD\u09A4\u09BE\u09B0 \u09B0\u09DF\u09C7\u099B\u09C7\u09A8 \u09AF\u09BF\u09A8\u09BF \u09B8\u09AC\u09B8\u09AE\u09DF \u09B9\u09BE\u09B8\u09AA\u09BE\u09A4\u09BE\u09B2\u09C7\u09B0 \u09B8\u09AC\u099A\u09C7\u09DF\u09C7 \u0995\u09A0\u09BF\u09A8 \u09B0\u09CB\u0997\u09C0\u09A6\u09C7\u09B0 \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE \u0995\u09B0\u09C7\u09A8\u0964 \u09AF\u09C7\u09B9\u09C7\u09A4\u09C1 \u09A4\u09BE\u0981\u09B0 \u09B0\u09CB\u0997\u09C0\u09B0\u09BE \u0985\u09A8\u09C7\u0995 \u09AC\u09C7\u09B6\u09BF \u0997\u09C1\u09B0\u09C1\u09A4\u09B0, \u09A4\u09BE\u0987 \u0993\u09A8\u09BE\u09B0 \u09AE\u09CB\u099F \u09B8\u09C1\u09B8\u09CD\u09A5\u09A4\u09BE\u09B0 \u09B6\u09A4\u09BE\u0982\u09B6 \u09B9\u09DF\u09A4\u09CB \u098F\u0995\u099C\u09A8 \u09A4\u09B0\u09C1\u09A3 \u09A1\u09BE\u0995\u09CD\u09A4\u09BE\u09B0\u09C7\u09B0 \u099A\u09C7\u09DF\u09C7 \u0995\u09AE \u09A6\u09C7\u0996\u09BE\u09AC\u09C7 \u09AF\u09BF\u09A8\u09BF \u09B6\u09C1\u09A7\u09C1 \u09B8\u09BE\u09AE\u09BE\u09A8\u09CD\u09AF \u0995\u09C7\u09B8 \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE \u0995\u09B0\u09C7\u09A8\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u099B\u09CB\u099F \u0995\u09C7\u09B8 \u0985\u09A5\u09AC\u09BE \u09AC\u09DC \u0995\u09C7\u09B8 \u0986\u09B2\u09BE\u09A6\u09BE\u09AD\u09BE\u09AC\u09C7 \u09A4\u09C1\u09B2\u09A8\u09BE \u0995\u09B0\u09B2\u09C7 \u09AA\u09CD\u09B0\u09AC\u09C0\u09A3 \u09A1\u09BE\u0995\u09CD\u09A4\u09BE\u09B0\u0987 \u09AA\u09CD\u09B0\u09A4\u09BF\u09AC\u09BE\u09B0 \u09B8\u09C7\u09B0\u09BE \u09AA\u09CD\u09B0\u09AE\u09BE\u09A3\u09BF\u09A4 \u09B9\u09AC\u09C7\u09A8!",
    intuitionTrap: "\u0986\u09AE\u09B0\u09BE \u09A7\u09B0\u09C7 \u09A8\u09BF\u0987 \u09AF\u09A6\u09BF \u0995\u09CB\u09A8\u09CB \u0985\u09AA\u09B6\u09A8 \u0997\u09CD\u09B0\u09C1\u09AA \u09E7 \u098F \u09B8\u09C7\u09B0\u09BE \u09B9\u09DF \u098F\u09AC\u0982 \u0997\u09CD\u09B0\u09C1\u09AA \u09E8 \u09A4\u09C7\u0993 \u09B8\u09C7\u09B0\u09BE \u09B9\u09DF, \u09A4\u09AC\u09C7 \u09B8\u09C7\u099F\u09BF \u09B8\u09BE\u09AE\u0997\u09CD\u09B0\u09BF\u0995 \u09AC\u09BF\u099A\u09BE\u09B0\u09C7\u0993 \u09B8\u09C7\u09B0\u09BE \u09B9\u09AC\u09C7\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u0986\u09AE\u09B0\u09BE 'Confounding Variable' \u09AC\u09BE \u0995\u09C7\u09B8\u09C7\u09B0 \u099C\u099F\u09BF\u09B2\u09A4\u09BE \u09AD\u09C1\u09B2\u09C7 \u09AF\u09BE\u0987\u0964",
    mathProof: `A এবং B দুটি চিকিৎসা এবং C কেসের জটিলতা (C1=সহজ, C2=জটিল)।
গাণিতিকভাবে এটি সম্পূর্ণ সম্ভব:
P(Success | A, C1) > P(Success | B, C1)   [৯৩% > ৮৭%]
P(Success | A, C2) > P(Success | B, C2)   [৭৩% > ৬৮%]

অথচ:
P(Success | A) < P(Success | B)            [৭৮% < ৮৩%]

কারণ চিকিৎসা A-এর ক্ষেত্রে ৭৫% রোগীই ছিলেন অত্যন্ত জটিল কেসের!`,
    realWorld: "\u0995\u09CD\u09B2\u09BF\u09A8\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AE\u09C7\u09A1\u09BF\u0995\u09C7\u09B2 \u099F\u09CD\u09B0\u09BE\u09AF\u09BC\u09BE\u09B2 \u098F\u09AC\u0982 \u0987\u0989\u09B8\u09BF \u09AC\u09BE\u09B0\u09CD\u0995\u09B2\u09C7 \u099C\u09C7\u09A8\u09CD\u09A1\u09BE\u09B0 \u09AC\u09BE\u09DF\u09BE\u09B8 \u09B8\u09CD\u099F\u09BE\u09A1\u09BF (\u09E7\u09EF\u09ED\u09E9)! \u09B8\u09BE\u09AE\u0997\u09CD\u09B0\u09BF\u0995 \u09AC\u09BF\u09B6\u09CD\u09AC\u09AC\u09BF\u09A6\u09CD\u09AF\u09BE\u09B2\u09DF\u09C7 \u09AD\u09B0\u09CD\u09A4\u09BF\u09A4\u09C7 \u09AA\u09C1\u09B0\u09C1\u09B7\u09B0\u09BE \u098F\u0997\u09BF\u09DF\u09C7 \u09AE\u09A8\u09C7 \u09B9\u09B2\u09C7\u0993 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u0986\u09B2\u09BE\u09A6\u09BE \u09AC\u09BF\u09AD\u09BE\u0997\u09C7 \u09A8\u09BE\u09B0\u09C0\u09A6\u09C7\u09B0 \u09AD\u09B0\u09CD\u09A4\u09BF\u09B0 \u09B9\u09BE\u09B0 \u09AC\u09C7\u09B6\u09BF \u099B\u09BF\u09B2\u0964"
  })));
}