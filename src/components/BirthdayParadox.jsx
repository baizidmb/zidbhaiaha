import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Flame, Play, RefreshCw, UserCheck, Users, Zap, Percent } from 'lucide-react';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { 
  calculateBirthdayProbability, 
  getBirthdayCurveData, 
  generateBirthdayTrial, 
  formatDayOfYear 
} from '../utils/paradoxMath.js';
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

    runBirthdayMonteCarloAsync(
      numPeople,
      1000,
      (progress, snapshot) => {
        setMonteCarloProgress(progress);
        setEmpiricalRate(snapshot.empiricalRate);
      },
      () => {
        setIsSimulating(false);
      }
    );
  };

  const curveData = useMemo(() => {
    const { labels, data } = getBirthdayCurveData();
    return {
      labels,
      datasets: [
        {
          label: 'তাত্ত্বিক সম্ভাব্যতা (%)',
          data,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: `বর্তমান অবস্থান (${numPeople} জন)`,
          data: labels.map(l => l === numPeople ? +probPercent : null),
          borderColor: '#EC4899',
          backgroundColor: '#EC4899',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }, [numPeople, probPercent]);

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
      x: { title: { display: true, text: 'মানুষের সংখ্যা (n)', color: '#64748b' } },
      y: { min: 0, max: 100, title: { display: true, text: 'সম্ভাব্যতা (%)', color: '#64748b' } }
    }
  };

  return (
    <section id="birthday" className="py-6 sm:py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                বার্থডে প্যারাডক্স (Birthday Paradox)
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
              একটি ঘরে মাত্র ২৩ জন মানুষ থাকলেই অন্তত ২ জনের একই দিনে জন্মদিন হওয়ার সম্ভাবনা <span className="text-blue-400 font-bold">৫০.৭%</span>!
            </p>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={runSingleTrial}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-glow-blue transition-all duration-200 touch-manipulation"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>র্যান্ডম ট্রায়াল চালান</span>
            </button>

            <button
              onClick={handleRunMonteCarlo}
              disabled={isSimulating}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all duration-200 disabled:opacity-50 touch-manipulation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-blue-400' : ''}`} />
              <span>{isSimulating ? `${monteCarloProgress}%` : '১,০০০ সিমুলেশন'}</span>
            </button>
          </div>
        </div>

        {/* Top Control Bar & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          {/* Slider Control */}
          <div className="md:col-span-2 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>ঘরে মানুষের সংখ্যা (n):</span>
              </label>
              <span className="text-xl sm:text-2xl font-black font-mono text-blue-400 bg-blue-500/10 px-3 py-0.5 sm:py-1 rounded-xl border border-blue-500/30">
                {numPeople} জন
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={numPeople}
              onChange={(e) => setNumPeople(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg cursor-pointer accent-blue-500 my-2 touch-none"
            />

            <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-mono mt-1">
              <span>১ জন (০%)</span>
              <span className={`font-bold ${isThreshold ? 'text-blue-400 underline decoration-2' : ''}`}>
                ২৩ জন (৫০.৭% থ্রেশহোল্ড)
              </span>
              <span>১০০ জন (৯৯.৯৯%)</span>
            </div>
          </div>

          {/* Glowing Math Readout Card */}
          <StatCard
            label="একত্রিত ম্যাচ সম্ভাবনা"
            value={`${probPercent}%`}
            subtext={isThreshold ? "★ ৫০.৭% গুরুত্বপূর্ণ সীমা অর্জিত!" : `P(match) = 1 - (365! / (365^${numPeople} * (365-${numPeople})!))`}
            icon={Percent}
            color={isThreshold ? 'blue' : 'purple'}
            highlight={true}
          />

        </div>

        {/* Empirical Simulation Stat Notice */}
        {empiricalRate !== null && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                এমপিরিক্যাল মন্টি কার্লো ফলাফল ({numPeople} জনের ১,০০০ ট্রায়াল):
              </span>
            </div>
            <span className="text-base sm:text-lg font-extrabold font-mono text-blue-400 bg-slate-900 px-3 py-0.5 rounded-lg border border-slate-700">
              {empiricalRate}% ম্যাচে অমিল হয়নি (ম্যাচ পাওয়া গেছে)
            </span>
          </div>
        )}

        {/* Main Interactive Grid & Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Avatar Glass Grid (Mobile Optimized 4 cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>সিমুলেটেড ঘরের মানুষ ({numPeople} জন)</span>
              </h3>
              {trialResult && (
                <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg font-mono ${
                  trialResult.hasMatch ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {trialResult.hasMatch ? `✓ ${trialResult.totalMatches} টি মিল পাওয়া গেছে!` : 'কোন মিল নেই'}
                </span>
              )}
            </div>

            <div ref={gridContainerRef} className="relative min-h-[250px] p-1">
              <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

              <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2 relative z-0">
                {trialResult?.avatars.map((av) => {
                  const isMatched = trialResult.matchedAvatarSet.has(av.id);
                  return (
                    <div
                      key={av.id}
                      data-avatar-id={av.id}
                      className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${
                        isMatched
                          ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-glow-cyan scale-105 z-20 animate-pulse-slow'
                          : 'bg-slate-900/80 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs ${
                        isMatched ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{av.id + 1}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono mt-1 font-semibold text-slate-300 text-center leading-tight">
                        {formatDayOfYear(av.birthday)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Theoretical Curve Chart */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Percent className="w-4 h-4 text-purple-400" />
              <span>তাত্ত্বিক সম্ভাব্যতা কার্ভ (Curve)</span>
            </h3>
            <div className="flex-1 min-h-[220px] sm:min-h-[260px] relative">
              <Line data={curveData} options={chartOptions} />
            </div>
          </div>

        </div>

        {/* Explainer Drawer in Bangla */}
        <ExplainerDrawer
          title="বার্থডে প্যারাডক্স (Birthday Paradox)"
          eli5="একটু ভেবে দেখুন: আপনি যদি ঘরে আসা যেকোনো ১ জনের জন্মদিনের সাথে আপনার জন্মদিন মেলাতে চান, তবে বছরের অর্ধেকের বেশি ১৮৩ জন মানুষের প্রয়োজন। কিন্তু আমরা যখন বলি 'যেকোনো ২ জন মানুষের জন্মদিন মিলবে কিনা'—তখন ঘরের সবাই সবার সাথে হ্যান্ডশেক করে! মাত্র ২৩ জন মানুষ থাকলে সেখানে ২৫৩ টি জোড়া তৈরি হয়, যা ৫০.৭% সম্ভাবনা তৈরি করে।"
          intuitionTrap="আমাদের মস্তিষ্ক সবসময় স্বজ্ঞাতভাবে চিন্তা করে: 'অন্য কারোর জন্মদিন কি আমার জন্মদিনের সাথে মিলবে?' (যাতে ১৮৩ জন লাগে)। কিন্তু প্যারাডক্সটি হলো: 'যে কোনো ২ জন মানুষের মধ্যে কি মিল রয়েছে?' জোড়ার সংখ্যা মানুষের সংখ্যার সাথে সাথে বহুগুণে বাড়তে থাকে।"
          mathProof={`n জন মানুষের সূত্র:
P(match) = 1 - P(no match)
P(no match) = (365/365) * (364/365) * (363/365) * ... * ((365 - n + 1)/365)

n = ২৩ জনের জন্য মোট জোড়ার সংখ্যা:
জোড়া = ২৩ * ২২ / ২ = ২৫৩ টি জোড়া!
P(no match) = ০.৪৯২৭
P(কমপক্ষে ১টি মিল) = ১ - ০.৪৯২৭ = ০.৫০৭৩ (৫০.৭%)`}
          realWorld="সাইবার সিকিউরিটিতে পাসওয়ার্ড হ্যাশিং (Birthday Attack)! হ্যাকাররা এই প্যারাডক্স ব্যবহার করে ভিন্ন দুটি ডিজিটাল ফাইল বা পাসওয়ার্ডের জন্য হুবহু একই ডিজিটাল সিগনেচার হ্যাশ তৈরি করে সিস্টেম ক্র্যাক করে।"
        />

      </div>
    </section>
  );
}
