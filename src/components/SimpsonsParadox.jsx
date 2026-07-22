import React, { useState, useMemo } from 'react';
import { BarChart2, Layers, Filter, Sliders, ArrowRightLeft } from 'lucide-react';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { DEFAULT_SIMPSONS_DATA, computeSimpsonsRates } from '../utils/paradoxMath.js';
import { playClickSound } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';

export default function SimpsonsParadox() {
  const [data, setData] = useState(DEFAULT_SIMPSONS_DATA);
  const [viewMode, setViewMode] = useState('subgroup');

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
        labels: ['ছোট পাথর (সহজ কেস)', 'বড় পাথর (জটিল কেস)'],
        datasets: [
          {
            label: 'চিকিৎসা A (সার্জারি)',
            data: [rates.treatmentA.smallRate, rates.treatmentA.largeRate],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3B82F6',
            borderWidth: 2,
            borderRadius: 8
          },
          {
            label: 'চিকিৎসা B (আল্ট্রাসাউন্ড)',
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
        labels: ['একত্রিত মোট সকল কেস (Aggregate)'],
        datasets: [
          {
            label: 'চিকিৎসা A মোট সফলতার হার',
            data: [rates.treatmentA.overallRate],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3B82F6',
            borderWidth: 2,
            borderRadius: 8
          },
          {
            label: 'চিকিৎসা B মোট সফলতার হার',
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
      legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
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
    <section id="simpsons" className="py-6 sm:py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                সিম্পসনের প্যারাডক্স (Simpson's Paradox)
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
              পৃথক সাবগ্রুপে যে ট্রেন্ড সঠিক দেখায়, সবগুলো গ্রুপ একত্রিত করলে ফলাফল <span className="text-cyan-400 font-bold">সম্পূর্ণ উল্টে যায়</span>!
            </p>
          </div>

          {/* Toggle View Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 sm:p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => handleToggleView('subgroup')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center touch-manipulation ${
                viewMode === 'subgroup'
                  ? 'bg-cyan-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>সাবগ্রুপ ভিউ (A সেরা)</span>
            </button>
            <button
              onClick={() => handleToggleView('aggregate')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center touch-manipulation ${
                viewMode === 'aggregate'
                  ? 'bg-pink-600 text-white shadow-glow-pink'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>একত্রিত ভিউ (B ভালো দেখায়)</span>
            </button>
          </div>
        </div>

        {/* Notice Banner explaining the flip */}
        <div className={`mb-6 p-3.5 sm:p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
          viewMode === 'subgroup' 
            ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' 
            : 'bg-pink-500/10 border-pink-500/30 text-pink-300'
        }`}>
          <div className="flex items-center space-x-3">
            <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">
              {viewMode === 'subgroup' ? (
                <span>
                  <strong>সাবগ্রুপ এনালাইসিস:</strong> চিকিৎসা A ছোট পাথর (<strong className="text-blue-400">{rates.treatmentA.smallRate}%</strong> বনাম {rates.treatmentB.smallRate}%) এবং বড় পাথর (<strong className="text-blue-400">{rates.treatmentA.largeRate}%</strong> বনাম {rates.treatmentB.largeRate}%) উভয় ক্ষেত্রেই সেরা!
                </span>
              ) : (
                <span>
                  <strong>একত্রিত বিভ্রান্তি:</strong> চিকিৎসা B কে সামগ্রিকভাবে জয়ী মনে হয় (<strong className="text-pink-400">{rates.treatmentB.overallRate}%</strong> বনাম {rates.treatmentA.overallRate}%) কারণ চিকিৎসা A-কে অনেক বেশি জটিল রোগীদের দেওয়া হয়েছিল!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            label="Trt A (ছোট পাথর)"
            value={`${rates.treatmentA.smallRate}%`}
            subtext={`${data.treatmentA.smallStones.success}/${data.treatmentA.smallStones.total} সুস্থ`}
            color="blue"
            highlight={viewMode === 'subgroup'}
          />
          <StatCard
            label="Trt A (বড় পাথর)"
            value={`${rates.treatmentA.largeRate}%`}
            subtext={`${data.treatmentA.largeStones.success}/${data.treatmentA.largeStones.total} সুস্থ`}
            color="blue"
            highlight={viewMode === 'subgroup'}
          />
          <StatCard
            label="Trt A মোট হার"
            value={`${rates.treatmentA.overallRate}%`}
            subtext={`${rates.treatmentA.totalCount} জন রোগী`}
            color="blue"
          />
          <StatCard
            label="Trt B মোট হার"
            value={`${rates.treatmentB.overallRate}%`}
            subtext={`${rates.treatmentB.totalCount} জন রোগী`}
            color="pink"
            highlight={viewMode === 'aggregate'}
          />
        </div>

        {/* Main Content Grid: Chart + Sample Size Tuner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Main Visualization Chart */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>{viewMode === 'subgroup' ? 'সাবগ্রুপ চিকিৎসায় সফলতার তুলনা' : 'একত্রিত সামগ্রিক সফলতার তুলনা'}</span>
            </h3>
            <div className="flex-1 relative min-h-[220px] sm:min-h-[260px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Subgroup Sample Size Controls */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>রোগীর সংখ্যা পরিবর্তন করুন</span>
                </h3>
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  রিসেট কেস
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Treatment A Controls */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider">চিকিৎসা A রোগী সংখ্যা</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ছোট পাথর (মোট):</span>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={data.treatmentA.smallStones.total}
                      onChange={(e) => handleCountChange('treatmentA', 'smallStones', 'total', e.target.value)}
                      className="w-16 sm:w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-blue-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">বড় পাথর (মোট):</span>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={data.treatmentA.largeStones.total}
                      onChange={(e) => handleCountChange('treatmentA', 'largeStones', 'total', e.target.value)}
                      className="w-16 sm:w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-blue-300"
                    />
                  </div>
                </div>

                {/* Treatment B Controls */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-pink-400 text-xs uppercase tracking-wider">চিকিৎসা B রোগী সংখ্যা</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ছোট পাথর (মোট):</span>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={data.treatmentB.smallStones.total}
                      onChange={(e) => handleCountChange('treatmentB', 'smallStones', 'total', e.target.value)}
                      className="w-16 sm:w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-pink-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">বড় পাথর (মোট):</span>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={data.treatmentB.largeStones.total}
                      onChange={(e) => handleCountChange('treatmentB', 'largeStones', 'total', e.target.value)}
                      className="w-16 sm:w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right font-mono text-pink-300"
                    />
                  </div>
                </div>

              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed italic">
              * খেয়াল করুন: রোগীর বণ্টন সহজ এবং জটিল কেসে পরিবর্তন করলে সামগ্রিক ফলাফলের দিক সম্পূর্ণ উল্টে যায়!
            </p>
          </div>

        </div>

        {/* Explainer Drawer in Bangla */}
        <ExplainerDrawer
          title="সিম্পসনের প্যারাডক্স (Simpson's Paradox)"
          eli5="মনে করুন একজন বিখ্যাত ডাক্তার রয়েছেন যিনি সবসময় হাসপাতালের সবচেয়ে কঠিন রোগীদের চিকিৎসা করেন। যেহেতু তাঁর রোগীরা অনেক বেশি গুরুতর, তাই ওনার মোট সুস্থতার শতাংশ হয়তো একজন তরুণ ডাক্তারের চেয়ে কম দেখাবে যিনি শুধু সামান্য কেস চিকিৎসা করেন। কিন্তু ছোট কেস অথবা বড় কেস আলাদাভাবে তুলনা করলে প্রবীণ ডাক্তারই প্রতিবার সেরা প্রমাণিত হবেন!"
          intuitionTrap="আমরা ধরে নিই যদি কোনো অপশন গ্রুপ ১ এ সেরা হয় এবং গ্রুপ ২ তেও সেরা হয়, তবে সেটি সামগ্রিক বিচারেও সেরা হবে। কিন্তু আমরা 'Confounding Variable' বা কেসের জটিলতা ভুলে যাই।"
          mathProof={`A এবং B দুটি চিকিৎসা এবং C কেসের জটিলতা (C1=সহজ, C2=জটিল)।
গাণিতিকভাবে এটি সম্পূর্ণ সম্ভব:
P(Success | A, C1) > P(Success | B, C1)   [৯৩% > ৮৭%]
P(Success | A, C2) > P(Success | B, C2)   [৭৩% > ৬৮%]

অথচ:
P(Success | A) < P(Success | B)            [৭৮% < ৮৩%]

কারণ চিকিৎসা A-এর ক্ষেত্রে ৭৫% রোগীই ছিলেন অত্যন্ত জটিল কেসের!`}
          realWorld="ক্লিনিক্যাল মেডিকেল ট্রায়াল এবং ইউসি বার্কলে জেন্ডার বায়াস স্টাডি (১৯৭৩)! সামগ্রিক বিশ্ববিদ্যালয়ে ভর্তিতে পুরুষরা এগিয়ে মনে হলেও প্রতিটি আলাদা বিভাগে নারীদের ভর্তির হার বেশি ছিল।"
        />

      </div>
    </section>
  );
}
