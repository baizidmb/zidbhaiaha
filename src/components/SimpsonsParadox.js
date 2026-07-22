import React, { useState, useMemo } from 'react';
import { BarChart2, Layers, Filter, Sliders, ArrowRightLeft, Lightbulb, ChevronDown } from 'lucide-react';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
import { DEFAULT_SIMPSONS_DATA, computeSimpsonsRates } from '../utils/paradoxMath.js';
import { playClickSound } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';
export default function SimpsonsParadox({
  lang = 'bn'
}) {
  const [data, setData] = useState(DEFAULT_SIMPSONS_DATA);
  const [viewMode, setViewMode] = useState('subgroup'); // 'subgroup' | 'aggregate'
  const isBn = lang === 'bn';
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
        labels: isBn ? ['ছোট পাথর (সহজ কেস)', 'বড় পাথর (জটিল কেস)'] : ['Small Stones (Mild Case)', 'Large Stones (Severe Case)'],
        datasets: [{
          label: isBn ? 'চিকিৎসা A (সার্জারি)' : 'Treatment A (Surgery)',
          data: [rates.treatmentA.smallRate, rates.treatmentA.largeRate],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          borderRadius: 8
        }, {
          label: isBn ? 'চিকিৎসা B (আল্ট্রাসাউন্ড)' : 'Treatment B (Ultrasound)',
          data: [rates.treatmentB.smallRate, rates.treatmentB.largeRate],
          backgroundColor: 'rgba(236, 72, 153, 0.8)',
          borderColor: '#EC4899',
          borderWidth: 2,
          borderRadius: 8
        }]
      };
    } else {
      return {
        labels: isBn ? ['একত্রিত মোট সকল কেস (Aggregate)'] : ['All Combined Cases (Aggregate)'],
        datasets: [{
          label: isBn ? 'চিকিৎসা A মোট হার' : 'Treatment A Overall',
          data: [rates.treatmentA.overallRate],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          borderRadius: 8
        }, {
          label: isBn ? 'চিকিৎসা B মোট হার' : 'Treatment B Overall',
          data: [rates.treatmentB.overallRate],
          backgroundColor: 'rgba(236, 72, 153, 0.8)',
          borderColor: '#EC4899',
          borderWidth: 2,
          borderRadius: 8
        }]
      };
    }
  }, [viewMode, rates, isBn]);
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
          label: ctx => `${ctx.parsed.y}%`
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
    className: "glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
  }, /*#__PURE__*/React.createElement(BarChart2, {
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, isBn ? '📊 ডেটা টুইস্ট (The Data Flip)' : '📊 The Data Flip')), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-sm mt-1 font-medium"
  }, isBn ? 'একটি ট্রেন্ড আলাদা গ্রুপে একরকম দেখায়, আবার একসাথে মিলালে উল্টে যায়!' : 'A trend appears in separate subgroups, but completely flips when combined!')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleToggleView('subgroup'),
    className: `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center touch-manipulation ${viewMode === 'subgroup' ? 'bg-cyan-600 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-slate-200'}`
  }, /*#__PURE__*/React.createElement(Layers, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'সাবগ্রুপ ভিউ (A জয়ী!)' : 'Subgroup View (Trt A Wins!)')), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleToggleView('aggregate'),
    className: `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center touch-manipulation ${viewMode === 'aggregate' ? 'bg-pink-600 text-white shadow-glow-pink' : 'text-slate-400 hover:text-slate-200'}`
  }, /*#__PURE__*/React.createElement(Filter, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'একত্রিত ভিউ (B জয়ী!)' : 'Combined View (Trt B Wins!)')))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider"
  }, /*#__PURE__*/React.createElement(Lightbulb, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'সহজ গল্পে মূল কথা' : 'The 2-Sentence Story')), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-200 leading-relaxed font-medium"
  }, isBn ? 'কল্পনা করুন এক প্রবীণ ডাক্তার যিনি হাসপাতালের সবচেয়ে কঠিন রোগীদের চিকিৎসা করেন। ওনার মোট সুস্থতার হার হয়তো শিক্ষানবিস ডাক্তারের চেয়ে কম দেখাবে—কিন্তু সহজ কেস কিংবা কঠিন কেস আলাদাভাবে বিবেচনা করলে প্রবীণ ডাক্তারই প্রতিবার সেরা প্রমানিত হবেন!' : 'Imagine a top surgeon who treats only the HARDEST medical cases. Their overall survival rate looks lower than a junior doctor who treats only mild cases—yet the top surgeon wins in EVERY single category when compared fairly!')), /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${viewMode === 'subgroup' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-pink-500/10 border-pink-500/30 text-pink-300'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement(ArrowRightLeft, {
    className: "w-5 h-5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm font-semibold"
  }, viewMode === 'subgroup' ? isBn ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u09B8\u09BE\u09AC\u0997\u09CD\u09B0\u09C1\u09AA \u09AB\u09B2\u09BE\u09AB\u09B2:"), " \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE A \u099B\u09CB\u099F \u09AA\u09BE\u09A5\u09B0 (", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-400"
  }, rates.treatmentA.smallRate, "%"), " vs ", rates.treatmentB.smallRate, "%) \u098F\u09AC\u0982 \u09AC\u09DC \u09AA\u09BE\u09A5\u09B0 (", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-400"
  }, rates.treatmentA.largeRate, "%"), " vs ", rates.treatmentB.largeRate, "%) \u0989\u09AD\u09DF \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7\u0987 \u09B8\u09C7\u09B0\u09BE!") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Subgroup Result:"), " Treatment A is strictly better for Small Stones (", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-400"
  }, rates.treatmentA.smallRate, "%"), " vs ", rates.treatmentB.smallRate, "%) AND Large Stones (", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-400"
  }, rates.treatmentA.largeRate, "%"), " vs ", rates.treatmentB.largeRate, "%).") : isBn ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u098F\u0995\u09A4\u09CD\u09B0\u09BF\u09A4 \u09AC\u09BF\u09AD\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF:"), " \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE B \u0995\u09C7 \u09B8\u09BE\u09AE\u0997\u09CD\u09B0\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u099C\u09DF\u09C0 \u09AE\u09A8\u09C7 \u09B9\u09DF (", /*#__PURE__*/React.createElement("strong", {
    className: "text-pink-400"
  }, rates.treatmentB.overallRate, "%"), " vs ", rates.treatmentA.overallRate, "%) \u0995\u09BE\u09B0\u09A3 \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE A-\u0995\u09C7 \u0985\u09A8\u09C7\u0995 \u09AC\u09C7\u09B6\u09BF \u0995\u09A0\u09BF\u09A8 \u09B0\u09CB\u0997\u09C0\u09A6\u09C7\u09B0 \u09A6\u09C7\u0993\u09DF\u09BE \u09B9\u09DF\u09C7\u099B\u09BF\u09B2!") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Combined Trap:"), " Treatment B appears to win overall (", /*#__PURE__*/React.createElement("strong", {
    className: "text-pink-400"
  }, rates.treatmentB.overallRate, "%"), " vs ", rates.treatmentA.overallRate, "%) simply because Treatment A was assigned to far more severe cases!")))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 min-h-[260px] sm:min-h-[300px] flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 relative min-h-[220px] sm:min-h-[260px]"
  }, /*#__PURE__*/React.createElement(Bar, {
    data: chartData,
    options: chartOptions
  }))), /*#__PURE__*/React.createElement("details", {
    className: "group border border-slate-800/80 rounded-2xl bg-slate-900/60 overflow-hidden"
  }, /*#__PURE__*/React.createElement("summary", {
    className: "px-5 py-4 flex items-center justify-between cursor-pointer font-bold text-sm text-slate-200 hover:bg-slate-800/60 transition-colors"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Sliders, {
    className: "w-4 h-4 text-purple-400"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'রোগীর সংখ্যা ও নমুনা পরীক্ষা করুন (Deep Dive Tuner)' : 'Tune Sample Sizes & Data Allocations')), /*#__PURE__*/React.createElement(ChevronDown, {
    className: "w-4 h-4 transition-transform group-open:rotate-180 text-slate-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-800 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-300 uppercase tracking-wider"
  }, isBn ? 'রোগীর সংখ্যা পরিবর্তন করুন' : 'Interactive Patient Allocations'), /*#__PURE__*/React.createElement("button", {
    onClick: handleReset,
    className: "text-xs font-mono text-cyan-400 hover:underline"
  }, isBn ? 'রিসেট' : 'Reset Default')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "font-bold text-blue-400 uppercase"
  }, "Treatment A"), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", null, "Small Stones Total:"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: data.treatmentA.smallStones.total,
    onChange: e => handleCountChange('treatmentA', 'smallStones', 'total', e.target.value),
    className: "w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right text-blue-300 font-mono"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", null, "Large Stones Total:"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: data.treatmentA.largeStones.total,
    onChange: e => handleCountChange('treatmentA', 'largeStones', 'total', e.target.value),
    className: "w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right text-blue-300 font-mono"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "font-bold text-pink-400 uppercase"
  }, "Treatment B"), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", null, "Small Stones Total:"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: data.treatmentB.smallStones.total,
    onChange: e => handleCountChange('treatmentB', 'smallStones', 'total', e.target.value),
    className: "w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right text-pink-300 font-mono"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", null, "Large Stones Total:"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: data.treatmentB.largeStones.total,
    onChange: e => handleCountChange('treatmentB', 'largeStones', 'total', e.target.value),
    className: "w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right text-pink-300 font-mono"
  })))))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: isBn ? "ডেটা টুইস্ট (The Data Flip)" : "The Data Flip",
    eli5: isBn ? "মনে করুন একজন প্রবীণ ডাক্তার যিনি সবসময় সবচেয়ে কঠিন রোগীর চিকিৎসা করেন। যেহেতু ওনার রোগীরা গুরুতর, তাই ওনার মোট সুস্থতার শতাংশ কম দেখায়। কিন্তু সহজ কেস অথবা কঠিন কেস আলাদাভাবে তুলনা করলে প্রবীণ ডাক্তারই প্রতিবার সেরা প্রমানিত হবেন!" : "Imagine a top surgeon who treats only the HARDEST medical cases. Their overall survival rate looks lower than a junior doctor who treats only mild cases—yet the top surgeon wins in EVERY single category when compared fairly!",
    intuitionTrap: isBn ? "আমরা ধরে নিই যদি কোনো অপশন গ্রুপ ১ এ সেরা হয় এবং গ্রুপ ২ তেও সেরা হয়, তবে সেটি সামগ্রিক বিচারেও সেরা হবে। কিন্তু আমরা কেসের জটিলতা ভুলে যাই।" : "We naturally assume that if Option A is better in Group 1 and Option A is better in Group 2, then Option A MUST be better overall. We ignore confounding variables.",
    mathProof: `P(Success | A, Small) > P(Success | B, Small)
P(Success | A, Large) > P(Success | B, Large)
YET: P(Success | A) < P(Success | B) Overall!`,
    realWorld: isBn ? "মেডিকেল ক্লিনিক্যাল ট্রায়াল এবং ইউসি বার্কলে জেন্ডার বায়াস স্টাডি (১৯৭৩)।" : "Clinical Trials & UC Berkeley Admissions Study (1973)."
  })));
}