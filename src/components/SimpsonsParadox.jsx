import React, { useState, useMemo } from 'react';
import { BarChart2, Layers, Filter, Sliders, ArrowRightLeft, Lightbulb, ChevronDown } from 'lucide-react';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { DEFAULT_SIMPSONS_DATA, computeSimpsonsRates } from '../utils/paradoxMath.js';
import { playClickSound } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';

export default function SimpsonsParadox({ lang = 'bn' }) {
  const [data, setData] = useState(DEFAULT_SIMPSONS_DATA);
  const [viewMode, setViewMode] = useState('subgroup');
  const isBn = lang === 'bn';

  const rates = useMemo(() => computeSimpsonsRates(data), [data]);

  const handleToggleView = (mode) => {
    playClickSound();
    setViewMode(mode);
  };

  const handleCountChange = (treatment, group, field, value) => {
    const val = parseInt(value) || 1;
    setData((prev) => {
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
        datasets: [
          {
            label: isBn ? 'চিকিৎসা A (সার্জারি)' : 'Treatment A (Surgery)',
            data: [rates.treatmentA.smallRate, rates.treatmentA.largeRate],
            backgroundColor: '#ff7a00',
            borderColor: '#ff7a00',
            borderWidth: 2,
            borderRadius: 8
          },
          {
            label: isBn ? 'চিকিৎসা B (আল্ট্রাসাউন্ড)' : 'Treatment B (Ultrasound)',
            data: [rates.treatmentB.smallRate, rates.treatmentB.largeRate],
            backgroundColor: '#8b5cf6',
            borderColor: '#8b5cf6',
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      };
    } else {
      return {
        labels: isBn ? ['একত্রিত মোট সকল কেস (Aggregate)'] : ['All Combined Cases (Aggregate)'],
        datasets: [
          {
            label: isBn ? 'চিকিৎসা A মোট হার' : 'Treatment A Overall',
            data: [rates.treatmentA.overallRate],
            backgroundColor: '#ff7a00',
            borderColor: '#ff7a00',
            borderWidth: 2,
            borderRadius: 8
          },
          {
            label: isBn ? 'চিকিৎসা B মোট হার' : 'Treatment B Overall',
            data: [rates.treatmentB.overallRate],
            backgroundColor: '#8b5cf6',
            borderColor: '#8b5cf6',
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      };
    }
  }, [viewMode, rates, isBn]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      y: { min: 50, max: 100, ticks: { callback: (v) => `${v}%` } }
    }
  };

  return (
    <section id="simpsons" className="py-6 sm:py-8 scroll-mt-24">
      <div className="liquid-glass-card rounded-3xl p-4 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 border border-[#ff7a00]/40 text-[#ff7a00]">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                {isBn ? '📊 ডেটা টুইস্ট (The Data Flip)' : '📊 The Data Flip'}
              </h2>
            </div>
            <p className="text-white/60 text-xs sm:text-sm mt-1 font-medium">
              {isBn ? 'একটি ট্রেন্ড আলাদা গ্রুপে একরকম দেখায়, আবার একসাথে মিলালে উল্টে যায়!' : 'A trend appears in separate subgroups, but completely flips when combined!'}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => handleToggleView('subgroup')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center touch-manipulation glossy-shine ${
                viewMode === 'subgroup'
                  ? 'bg-[#ff7a00] text-white shadow-glow-amber'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isBn ? 'সাবগ্রুপ ভিউ (A জয়ী!)' : 'Subgroup View (Trt A Wins!)'}</span>
            </button>
            <button
              onClick={() => handleToggleView('aggregate')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center touch-manipulation glossy-shine ${
                viewMode === 'aggregate'
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isBn ? 'একত্রিত ভিউ (B জয়ী!)' : 'Combined View (Trt B Wins!)'}</span>
            </button>
          </div>
        </div>

        {/* 2-Sentence Story Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ff7a00]/15 via-white/[0.02] to-purple-600/15 border border-[#ff7a00]/30 space-y-2">
          <div className="flex items-center space-x-2 text-[#ff7a00] font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>{isBn ? 'সহজ গল্পে মূল কথা' : 'The 2-Sentence Story'}</span>
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            {isBn 
              ? 'কল্পনা করুন এক প্রবীণ ডাক্তার যিনি হাসপাতালের সবচেয়ে কঠিন রোগীদের চিকিৎসা করেন। ওনার মোট সুস্থতার হার হয়তো শিক্ষানবিস ডাক্তারের চেয়ে কম দেখাবে—কিন্তু সহজ কেস কিংবা কঠিন কেস আলাদাভাবে বিবেচনা করলে প্রবীণ ডাক্তারই প্রতিবার সেরা প্রমানিত হবেন!' 
              : 'Imagine a top surgeon who treats only the HARDEST medical cases. Their overall survival rate looks lower than a junior doctor who treats only mild cases—yet the top surgeon wins in EVERY single category when compared fairly!'}
          </p>
        </div>

        {/* Dynamic Winner Indicator */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
          viewMode === 'subgroup' 
            ? 'bg-[#ff7a00]/10 border-[#ff7a00]/30 text-white' 
            : 'bg-purple-500/10 border-purple-500/30 text-white'
        }`}>
          <div className="flex items-center space-x-3">
            <ArrowRightLeft className="w-5 h-5 text-[#ff7a00] flex-shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">
              {viewMode === 'subgroup' ? (
                isBn ? (
                  <span><strong>সাবগ্রুপ ফলাফল:</strong> চিকিৎসা A ছোট পাথর (<strong className="text-[#ff7a00]">{rates.treatmentA.smallRate}%</strong> vs {rates.treatmentB.smallRate}%) এবং বড় পাথর (<strong className="text-[#ff7a00]">{rates.treatmentA.largeRate}%</strong> vs {rates.treatmentB.largeRate}%) উভয় ক্ষেত্রেই সেরা!</span>
                ) : (
                  <span><strong>Subgroup Result:</strong> Treatment A is strictly better for Small Stones (<strong className="text-[#ff7a00]">{rates.treatmentA.smallRate}%</strong> vs {rates.treatmentB.smallRate}%) AND Large Stones (<strong className="text-[#ff7a00]">{rates.treatmentA.largeRate}%</strong> vs {rates.treatmentB.largeRate}%).</span>
                )
              ) : (
                isBn ? (
                  <span><strong>একত্রিত বিভ্রান্তি:</strong> চিকিৎসা B কে সামগ্রিকভাবে জয়ী মনে হয় (<strong className="text-purple-400">{rates.treatmentB.overallRate}%</strong> vs {rates.treatmentA.overallRate}%) কারণ চিকিৎসা A-কে অনেক বেশি কঠিন রোগীদের দেওয়া হয়েছিল!</span>
                ) : (
                  <span><strong>Combined Trap:</strong> Treatment B appears to win overall (<strong className="text-purple-400">{rates.treatmentB.overallRate}%</strong> vs {rates.treatmentA.overallRate}%) simply because Treatment A was assigned to far more severe cases!</span>
                )
              )}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 min-h-[260px] sm:min-h-[300px] flex flex-col justify-between">
          <div className="flex-1 relative min-h-[220px] sm:min-h-[260px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Deep Dive */}
        <details className="group border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
          <summary className="px-5 py-4 flex items-center justify-between cursor-pointer font-bold text-sm text-white hover:bg-white/5 transition-colors">
            <span className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#ff7a00]" />
              <span>{isBn ? 'রোগীর সংখ্যা ও নমুনা পরীক্ষা করুন (Deep Dive Tuner)' : 'Tune Sample Sizes & Data Allocations'}</span>
            </span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-white/40" />
          </summary>

          <div className="p-5 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                {isBn ? 'রোগীর সংখ্যা পরিবর্তন করুন' : 'Interactive Patient Allocations'}
              </h4>
              <button onClick={handleReset} className="text-xs font-mono text-[#ff7a00] hover:underline">
                {isBn ? 'রিসেট' : 'Reset Default'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#030305] border border-white/10 space-y-2">
                <h5 className="font-bold text-[#ff7a00] uppercase">Treatment A</h5>
                <div className="flex justify-between items-center">
                  <span>Small Stones Total:</span>
                  <input
                    type="number"
                    value={data.treatmentA.smallStones.total}
                    onChange={(e) => handleCountChange('treatmentA', 'smallStones', 'total', e.target.value)}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-right text-[#ff7a00] font-mono"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Large Stones Total:</span>
                  <input
                    type="number"
                    value={data.treatmentA.largeStones.total}
                    onChange={(e) => handleCountChange('treatmentA', 'largeStones', 'total', e.target.value)}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-right text-[#ff7a00] font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#030305] border border-white/10 space-y-2">
                <h5 className="font-bold text-purple-400 uppercase">Treatment B</h5>
                <div className="flex justify-between items-center">
                  <span>Small Stones Total:</span>
                  <input
                    type="number"
                    value={data.treatmentB.smallStones.total}
                    onChange={(e) => handleCountChange('treatmentB', 'smallStones', 'total', e.target.value)}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-right text-purple-300 font-mono"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Large Stones Total:</span>
                  <input
                    type="number"
                    value={data.treatmentB.largeStones.total}
                    onChange={(e) => handleCountChange('treatmentB', 'largeStones', 'total', e.target.value)}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-right text-purple-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </details>

        {/* Explainer */}
        <ExplainerDrawer
          title={isBn ? "ডেটা টুইস্ট (The Data Flip)" : "The Data Flip"}
          eli5="Comparing subgroups fairly reveals the true superior treatment!"
          intuitionTrap="Ignoring case severity distributions causes trend reversals."
          mathProof="Simpson's Paradox Inequality Condition"
          realWorld="Medical Trials & UC Berkeley Admissions Study (1973)."
        />

      </div>
    </section>
  );
}
