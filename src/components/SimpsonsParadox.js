import React, { useState, useMemo } from 'react';
import { BarChart2, Layers, Filter, Sliders, ArrowRightLeft } from 'lucide-react';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
import { DEFAULT_SIMPSONS_DATA, computeSimpsonsRates } from '../utils/paradoxMath.js';
import { playClickSound } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';
export default function SimpsonsParadox() {
  // Custom configurable sample sizes
  const [data, setData] = useState(DEFAULT_SIMPSONS_DATA);
  const [viewMode, setViewMode] = useState('subgroup'); // 'subgroup' | 'aggregate'

  const rates = useMemo(() => computeSimpsonsRates(data), [data]);
  const handleToggleView = mode => {
    playClickSound();
    setViewMode(mode);
  };

  // Slider adjustments
  const handleCountChange = (treatment, group, field, value) => {
    const val = parseInt(value) || 1;
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[treatment][group][field] = val;
      // ensure success <= total
      if (field === 'total' && next[treatment][group].success > val) {
        next[treatment][group].success = val;
      }
      return next;
    });
  };

  // Reset to default kidney stone study
  const handleReset = () => {
    playClickSound();
    setData(DEFAULT_SIMPSONS_DATA);
  };

  // Chart Setup
  const chartData = useMemo(() => {
    if (viewMode === 'subgroup') {
      return {
        labels: ['Small Kidney Stones (Mild Case)', 'Large Kidney Stones (Severe Case)'],
        datasets: [{
          label: 'Treatment A (Invasive Surgery)',
          data: [rates.treatmentA.smallRate, rates.treatmentA.largeRate],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          borderRadius: 8
        }, {
          label: 'Treatment B (Ultrasound)',
          data: [rates.treatmentB.smallRate, rates.treatmentB.largeRate],
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: '#EC4899',
          borderWidth: 2,
          borderRadius: 8
        }]
      };
    } else {
      return {
        labels: ['All Combined Cases (Aggregate)'],
        datasets: [{
          label: 'Treatment A Overall Success Rate',
          data: [rates.treatmentA.overallRate],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          borderRadius: 8
        }, {
          label: 'Treatment B Overall Success Rate',
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
            size: 12
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
    className: "py-8 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
  }, /*#__PURE__*/React.createElement(BarChart2, {
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, "Simpson's Paradox")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-sm mt-1.5 font-medium"
  }, "A trend that appears in separate subgroups can completely ", /*#__PURE__*/React.createElement("span", {
    className: "text-cyan-400 font-bold"
  }, "REVERSE direction"), " when all groups are combined!")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleToggleView('subgroup'),
    className: `flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${viewMode === 'subgroup' ? 'bg-cyan-600 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-slate-200'}`
  }, /*#__PURE__*/React.createElement(Layers, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Subgroup View (Treatment A Wins Both!)")), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleToggleView('aggregate'),
    className: `flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${viewMode === 'aggregate' ? 'bg-pink-600 text-white shadow-glow-pink' : 'text-slate-400 hover:text-slate-200'}`
  }, /*#__PURE__*/React.createElement(Filter, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Combined View (Treatment B Looks Better!)")))), /*#__PURE__*/React.createElement("div", {
    className: `mb-6 p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${viewMode === 'subgroup' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-pink-500/10 border-pink-500/30 text-pink-300'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement(ArrowRightLeft, {
    className: "w-5 h-5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold"
  }, viewMode === 'subgroup' ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Subgroup Analysis:"), " Treatment A is strictly better for Small Stones (", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-400"
  }, rates.treatmentA.smallRate, "%"), " vs ", rates.treatmentB.smallRate, "%) AND Large Stones (", /*#__PURE__*/React.createElement("strong", {
    className: "text-blue-400"
  }, rates.treatmentA.largeRate, "%"), " vs ", rates.treatmentB.largeRate, "%).") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Combined Aggregate Trap:"), " Treatment B appears to win overall (", /*#__PURE__*/React.createElement("strong", {
    className: "text-pink-400"
  }, rates.treatmentB.overallRate, "%"), " vs ", rates.treatmentA.overallRate, "%) simply because Treatment A was assigned to way more hard/severe cases!")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Trt A (Small Stones)",
    value: `${rates.treatmentA.smallRate}%`,
    subtext: `${data.treatmentA.smallStones.success}/${data.treatmentA.smallStones.total} Cured`,
    color: "blue",
    highlight: viewMode === 'subgroup'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Trt A (Large Stones)",
    value: `${rates.treatmentA.largeRate}%`,
    subtext: `${data.treatmentA.largeStones.success}/${data.treatmentA.largeStones.total} Cured`,
    color: "blue",
    highlight: viewMode === 'subgroup'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Trt A Overall Rate",
    value: `${rates.treatmentA.overallRate}%`,
    subtext: `${rates.treatmentA.totalCount} Total Patients`,
    color: "blue"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Trt B Overall Rate",
    value: `${rates.treatmentB.overallRate}%`,
    subtext: `${rates.treatmentB.totalCount} Total Patients`,
    color: "pink",
    highlight: viewMode === 'aggregate'
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 glass-card rounded-2xl p-5 border border-slate-800 min-h-[320px] flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(BarChart2, {
    className: "w-4 h-4 text-cyan-400"
  }), /*#__PURE__*/React.createElement("span", null, viewMode === 'subgroup' ? 'Subgroup Success Rates Comparison' : 'Aggregate Combined Success Rates')), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 relative min-h-[260px]"
  }, /*#__PURE__*/React.createElement(Bar, {
    data: chartData,
    options: chartOptions
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Sliders, {
    className: "w-4 h-4 text-purple-400"
  }), /*#__PURE__*/React.createElement("span", null, "Interactive Sample Size Tuner")), /*#__PURE__*/React.createElement("button", {
    onClick: handleReset,
    className: "text-xs font-mono text-cyan-400 hover:underline"
  }, "Reset Case Study")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-blue-400 text-xs uppercase tracking-wider"
  }, "Treatment A Patient Allocations"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "Small Stones (Total):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "500",
    value: data.treatmentA.smallStones.total,
    onChange: e => handleCountChange('treatmentA', 'smallStones', 'total', e.target.value),
    className: "w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-blue-300"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "Large Stones (Total):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "500",
    value: data.treatmentA.largeStones.total,
    onChange: e => handleCountChange('treatmentA', 'largeStones', 'total', e.target.value),
    className: "w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-blue-300"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-pink-400 text-xs uppercase tracking-wider"
  }, "Treatment B Patient Allocations"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "Small Stones (Total):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "500",
    value: data.treatmentB.smallStones.total,
    onChange: e => handleCountChange('treatmentB', 'smallStones', 'total', e.target.value),
    className: "w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-pink-300"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "Large Stones (Total):"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "500",
    value: data.treatmentB.largeStones.total,
    onChange: e => handleCountChange('treatmentB', 'largeStones', 'total', e.target.value),
    className: "w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-pink-300"
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400 mt-4 leading-relaxed italic"
  }, "* Notice how shifting the sample distribution between small (easy) and large (hard) cases flips the overall outcome!"))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: "Simpson's Paradox",
    eli5: "Imagine a super smart doctor who always gets given the HARDEST, most dangerous medical cases. Because their cases are so difficult, their overall success percentage looks lower than a junior doctor who only treats mild scrapes. But if you compare them on mild cases OR hard cases separately, the smart doctor wins every single time!",
    intuitionTrap: "We naturally assume that if Option A is better in Group 1 and Option A is better in Group 2, then Option A MUST be better overall. We ignore 'confounding variables'\u2014like how many patients were assigned to each group.",
    mathProof: `Let A and B be treatments, and C be severity (C1=Mild, C2=Severe).
It is entirely mathematically possible to have:
P(Success | A, C1) > P(Success | B, C1)   [93% > 87%]
P(Success | A, C2) > P(Success | B, C2)   [73% > 69%]

AND YET:
P(Success | A) < P(Success | B)            [78% < 83%]

Because:
P(Success | A) = P(Success | A, C1) * P(C1 | A) + P(Success | A, C2) * P(C2 | A)
Since P(C2 | A) = 263/350 (75% severe!), Treatment A's total is heavily weighted by the lower severe rate.`,
    realWorld: "Real-World Clinical Trials & Policy Making! Famous examples include UC Berkeley Gender Bias study in 1973 (overall admissions favored men, but individual department admissions actually favored women!)."
  })));
}