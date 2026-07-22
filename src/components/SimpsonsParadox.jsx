import React, { useState, useMemo } from 'react';
import { BarChart2, Layers, Filter, Sliders, ArrowRightLeft } from 'lucide-react';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { DEFAULT_SIMPSONS_DATA, computeSimpsonsRates } from '../utils/paradoxMath.js';
import { playClickSound } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';

export default function SimpsonsParadox() {
  // Custom configurable sample sizes
  const [data, setData] = useState(DEFAULT_SIMPSONS_DATA);
  const [viewMode, setViewMode] = useState('subgroup'); // 'subgroup' | 'aggregate'

  const rates = useMemo(() => computeSimpsonsRates(data), [data]);

  const handleToggleView = (mode) => {
    playClickSound();
    setViewMode(mode);
  };

  // Slider adjustments
  const handleCountChange = (treatment, group, field, value) => {
    const val = parseInt(value) || 1;
    setData((prev) => {
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
        datasets: [
          {
            label: 'Treatment A (Invasive Surgery)',
            data: [rates.treatmentA.smallRate, rates.treatmentA.largeRate],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3B82F6',
            borderWidth: 2,
            borderRadius: 8
          },
          {
            label: 'Treatment B (Ultrasound)',
            data: [rates.treatmentB.smallRate, rates.treatmentB.largeRate],
            backgroundColor: 'rgba(236, 72, 153, 0.7)',
            borderColor: '#EC4899',
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      };
    } else {
      return {
        labels: ['All Combined Cases (Aggregate)'],
        datasets: [
          {
            label: 'Treatment A Overall Success Rate',
            data: [rates.treatmentA.overallRate],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3B82F6',
            borderWidth: 2,
            borderRadius: 8
          },
          {
            label: 'Treatment B Overall Success Rate',
            data: [rates.treatmentB.overallRate],
            backgroundColor: 'rgba(236, 72, 153, 0.7)',
            borderColor: '#EC4899',
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      };
    }
  }, [viewMode, rates]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      y: { min: 50, max: 100, ticks: { callback: (v) => `${v}%` } }
    }
  };

  return (
    <section id="simpsons" className="py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Simpson's Paradox
              </h2>
            </div>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              A trend that appears in separate subgroups can completely <span className="text-cyan-400 font-bold">REVERSE direction</span> when all groups are combined!
            </p>
          </div>

          {/* Toggle View Pills */}
          <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => handleToggleView('subgroup')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                viewMode === 'subgroup'
                  ? 'bg-cyan-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Subgroup View (Treatment A Wins Both!)</span>
            </button>
            <button
              onClick={() => handleToggleView('aggregate')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                viewMode === 'aggregate'
                  ? 'bg-pink-600 text-white shadow-glow-pink'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Combined View (Treatment B Looks Better!)</span>
            </button>
          </div>
        </div>

        {/* Notice Banner explaining the flip */}
        <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
          viewMode === 'subgroup' 
            ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' 
            : 'bg-pink-500/10 border-pink-500/30 text-pink-300'
        }`}>
          <div className="flex items-center space-x-3">
            <ArrowRightLeft className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">
              {viewMode === 'subgroup' ? (
                <span>
                  <strong>Subgroup Analysis:</strong> Treatment A is strictly better for Small Stones (<strong className="text-blue-400">{rates.treatmentA.smallRate}%</strong> vs {rates.treatmentB.smallRate}%) AND Large Stones (<strong className="text-blue-400">{rates.treatmentA.largeRate}%</strong> vs {rates.treatmentB.largeRate}%).
                </span>
              ) : (
                <span>
                  <strong>Combined Aggregate Trap:</strong> Treatment B appears to win overall (<strong className="text-pink-400">{rates.treatmentB.overallRate}%</strong> vs {rates.treatmentA.overallRate}%) simply because Treatment A was assigned to way more hard/severe cases!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Trt A (Small Stones)"
            value={`${rates.treatmentA.smallRate}%`}
            subtext={`${data.treatmentA.smallStones.success}/${data.treatmentA.smallStones.total} Cured`}
            color="blue"
            highlight={viewMode === 'subgroup'}
          />
          <StatCard
            label="Trt A (Large Stones)"
            value={`${rates.treatmentA.largeRate}%`}
            subtext={`${data.treatmentA.largeStones.success}/${data.treatmentA.largeStones.total} Cured`}
            color="blue"
            highlight={viewMode === 'subgroup'}
          />
          <StatCard
            label="Trt A Overall Rate"
            value={`${rates.treatmentA.overallRate}%`}
            subtext={`${rates.treatmentA.totalCount} Total Patients`}
            color="blue"
          />
          <StatCard
            label="Trt B Overall Rate"
            value={`${rates.treatmentB.overallRate}%`}
            subtext={`${rates.treatmentB.totalCount} Total Patients`}
            color="pink"
            highlight={viewMode === 'aggregate'}
          />
        </div>

        {/* Main Content Grid: Chart + Sample Size Tuner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Visualization Chart (7 Cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-5 border border-slate-800 min-h-[320px] flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>{viewMode === 'subgroup' ? 'Subgroup Success Rates Comparison' : 'Aggregate Combined Success Rates'}</span>
            </h3>
            <div className="flex-1 relative min-h-[260px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Subgroup Sample Size Controls (5 Cols) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>Interactive Sample Size Tuner</span>
                </h3>
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  Reset Case Study
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Treatment A Controls */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider">Treatment A Patient Allocations</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Small Stones (Total):</span>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={data.treatmentA.smallStones.total}
                      onChange={(e) => handleCountChange('treatmentA', 'smallStones', 'total', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-blue-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Large Stones (Total):</span>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={data.treatmentA.largeStones.total}
                      onChange={(e) => handleCountChange('treatmentA', 'largeStones', 'total', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-blue-300"
                    />
                  </div>
                </div>

                {/* Treatment B Controls */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-pink-400 text-xs uppercase tracking-wider">Treatment B Patient Allocations</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Small Stones (Total):</span>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={data.treatmentB.smallStones.total}
                      onChange={(e) => handleCountChange('treatmentB', 'smallStones', 'total', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-pink-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Large Stones (Total):</span>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={data.treatmentB.largeStones.total}
                      onChange={(e) => handleCountChange('treatmentB', 'largeStones', 'total', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-pink-300"
                    />
                  </div>
                </div>

              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed italic">
              * Notice how shifting the sample distribution between small (easy) and large (hard) cases flips the overall outcome!
            </p>
          </div>

        </div>

        {/* Explainer Drawer */}
        <ExplainerDrawer
          title="Simpson's Paradox"
          eli5="Imagine a super smart doctor who always gets given the HARDEST, most dangerous medical cases. Because their cases are so difficult, their overall success percentage looks lower than a junior doctor who only treats mild scrapes. But if you compare them on mild cases OR hard cases separately, the smart doctor wins every single time!"
          intuitionTrap="We naturally assume that if Option A is better in Group 1 and Option A is better in Group 2, then Option A MUST be better overall. We ignore 'confounding variables'—like how many patients were assigned to each group."
          mathProof={`Let A and B be treatments, and C be severity (C1=Mild, C2=Severe).
It is entirely mathematically possible to have:
P(Success | A, C1) > P(Success | B, C1)   [93% > 87%]
P(Success | A, C2) > P(Success | B, C2)   [73% > 69%]

AND YET:
P(Success | A) < P(Success | B)            [78% < 83%]

Because:
P(Success | A) = P(Success | A, C1) * P(C1 | A) + P(Success | A, C2) * P(C2 | A)
Since P(C2 | A) = 263/350 (75% severe!), Treatment A's total is heavily weighted by the lower severe rate.`}
          realWorld="Real-World Clinical Trials & Policy Making! Famous examples include UC Berkeley Gender Bias study in 1973 (overall admissions favored men, but individual department admissions actually favored women!)."
        />

      </div>
    </section>
  );
}
