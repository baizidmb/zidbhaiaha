import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Flame, Play, RefreshCw, UserCheck, Users, Percent, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
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

export default function BirthdayParadox({ lang = 'bn' }) {
  const [numPeople, setNumPeople] = useState(23);
  const [userGuess, setUserGuess] = useState(180);
  const [hasGuessed, setHasGuessed] = useState(false);

  const [trialResult, setTrialResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [monteCarloProgress, setMonteCarloProgress] = useState(null);
  const [empiricalRate, setEmpiricalRate] = useState(null);

  const canvasRef = useRef(null);
  const gridContainerRef = useRef(null);
  const isBn = lang === 'bn';

  const probDecimal = useMemo(() => calculateBirthdayProbability(numPeople), [numPeople]);
  const probPercent = (probDecimal * 100).toFixed(1);

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
    ctx.lineWidth = 3;
    ctx.shadowColor = '#3B82F6';
    ctx.shadowBlur = 10;

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
          label: isBn ? 'তাত্ত্বিক সম্ভাব্যতা (%)' : 'Theoretical Probability (%)',
          data,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: isBn ? `বর্তমান অবস্থান (${numPeople} জন)` : `Current (${numPeople} people)`,
          data: labels.map(l => l === numPeople ? +probPercent : null),
          borderColor: '#EC4899',
          backgroundColor: '#EC4899',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }, [numPeople, probPercent, isBn]);

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
      x: { title: { display: true, text: isBn ? 'মানুষের সংখ্যা (n)' : 'People (n)', color: '#64748b' } },
      y: { min: 0, max: 100, title: { display: true, text: '%', color: '#64748b' } }
    }
  };

  return (
    <section id="birthday" className="py-6 sm:py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Flame className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {isBn ? '🎉 জন্মদিনের মিল (The Party Coincidence)' : '🎉 The Party Coincidence'}
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              {isBn ? 'একটি পার্টিতে কতজন মানুষ থাকলে অন্তত দুজন মানুষের একই দিনে জন্মদিন হওয়ার সম্ভাবনা ৫০%?' : 'How many people do you need in a room for a 50% chance of a shared birthday?'}
            </p>
          </div>
        </div>

        {/* Step 1: Hook - Interactive Intuition Guess First Slider */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>{isBn ? 'ধাপ ১: প্রথমে আপনার আন্দাজ পরীক্ষা করুন!' : 'Step 1: Test Your Intuition First!'}</span>
            </span>
            <span className="text-sm font-mono font-black text-blue-300 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/30">
              {userGuess} {isBn ? 'জন মানুষ' : 'people'}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-semibold">
            {isBn 
              ? '৫০% সম্ভাবনার জন্য একটি ঘরে কতজন মানুষ প্রয়োজন বলে আপনার অনুমান?' 
              : 'How many people do you THINK are needed for a 50% chance of a shared birthday?'}
          </p>

          <input
            type="range"
            min="10"
            max="365"
            value={userGuess}
            onChange={(e) => { setUserGuess(parseInt(e.target.value)); setHasGuessed(true); }}
            className="w-full h-3 bg-slate-800 rounded-lg cursor-pointer accent-blue-500 touch-none"
          />

          {hasGuessed && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3 text-xs text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                {isBn ? (
                  <>আপনার অনুমান <strong>{userGuess} জন</strong>! কিন্তু আসল গাণিতিক উত্তর হলো মাত্র <strong className="text-blue-400 font-extrabold text-sm">২৩ জন!</strong></>
                ) : (
                  <>You guessed <strong>{userGuess} people</strong>! But the real mathematical answer is ONLY <strong className="text-blue-400 font-extrabold text-sm">23 people!</strong></>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Step 2: Interactive Micro-Game (The Party Room Avatar Grid) */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                {isBn ? 'ধাপ ২: পার্টি রুম সিমুলেটর' : 'Step 2: Interactive Party Room'}
              </h3>
            </div>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <button
                onClick={runSingleTrial}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue transition-all touch-manipulation"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isBn ? 'নতুন পার্টি ট্রায়াল' : 'Run New Trial'}</span>
              </button>
            </div>
          </div>

          {/* Controls Slider */}
          <div className="flex items-center space-x-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300 whitespace-nowrap">
              {isBn ? 'ঘরে কতজন:' : 'People:'} <strong className="text-blue-400">{numPeople}</strong>
            </span>
            <input
              type="range"
              min="2"
              max="100"
              value={numPeople}
              onChange={(e) => setNumPeople(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg cursor-pointer accent-blue-500"
            />
          </div>

          {/* Avatar Room Canvas */}
          <div ref={gridContainerRef} className="relative min-h-[220px] p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2 relative z-0">
              {trialResult?.avatars.map((av) => {
                const isMatched = trialResult.matchedAvatarSet.has(av.id);
                return (
                  <div
                    key={av.id}
                    data-avatar-id={av.id}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                      isMatched
                        ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-glow-cyan scale-105 z-20 animate-pulse-slow'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isMatched ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{av.id + 1}
                    </div>
                    <span className="text-[10px] font-mono mt-1 font-semibold text-slate-300 text-center leading-tight">
                      {formatDayOfYear(av.birthday, lang)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Big Readable "Aha!" Verdict Card */}
        <StatCard
          label={isBn ? "গাণিতিক রায় (The Aha! Verdict)" : "The Aha! Verdict"}
          value={`${probPercent}% Match Chance`}
          subtext={isBn ? `২৩ জন মানুষ থাকলেই অন্তত ২টি একই জন্মদিনের মিল পাওয়ার সম্ভাবনা ৫০.৭%!` : `At 23 people, there is a 50.7% chance of a shared birthday!`}
          icon={Percent}
          color="blue"
          highlight={true}
        />

        {/* Step 4: Collapsible Deep Dive Math & Formula Drawer */}
        <details className="group border border-slate-800/80 rounded-2xl bg-slate-900/60 overflow-hidden">
          <summary className="px-5 py-4 flex items-center justify-between cursor-pointer font-bold text-sm text-slate-200 hover:bg-slate-800/60 transition-colors">
            <span className="flex items-center space-x-2">
              <span>📐</span>
              <span>{isBn ? 'গাণিতিক সূত্র, গ্রাফ ও ১,০০০ সিমুলেশন প্রমাণ দেখুন (Deep Dive)' : 'View Mathematical Formula, Graph & 1,000-Sim Proof'}</span>
            </span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-slate-400" />
          </summary>

          <div className="p-5 border-t border-slate-800 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Math Formula Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
                  {isBn ? 'সঠিক গাণিতিক সূত্র' : 'Exact Probability Formula'}
                </h4>
                <div className="p-3 bg-slate-900 rounded-lg text-blue-300 font-mono text-xs overflow-x-auto">
                  P(match) = 1 - (365! / (365^n * (365-n)!))
                </div>
                <p className="text-xs text-slate-400">
                  {isBn ? '২৩ জন মানুষের জন্য জোড়ার সংখ্যা = ২৩ × ২২ / ২ = ২৫৩ টি জোড়া!' : 'For 23 people, unique pairings = 23 * 22 / 2 = 253 unique pairs!'}
                </p>
              </div>

              {/* Monte Carlo Run */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                    {isBn ? '১,০০০ ট্রায়াল সিমুলেশন টেস্ট' : '1,000 Trial Simulation Test'}
                  </h4>
                  {empiricalRate !== null && (
                    <p className="text-sm font-bold text-emerald-400 mt-1">
                      {isBn ? `সিমুলেটেড অমিল না হওয়ার হার: ${empiricalRate}%` : `Simulated Match Rate: ${empiricalRate}%`}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleRunMonteCarlo}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-blue-400' : ''}`} />
                  <span>{isSimulating ? `${monteCarloProgress}%` : (isBn ? '১,০০০ সিমুলেশন চালান' : 'Run 1,000 Sims')}</span>
                </button>
              </div>

            </div>

            {/* Line Chart */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[240px]">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isBn ? 'তাত্ত্বিক সম্ভাব্যতা কার্ভ (Theoretical Probability Curve)' : 'Theoretical Probability Curve'}
              </h4>
              <div className="h-[200px] relative">
                <Line data={curveData} options={chartOptions} />
              </div>
            </div>
          </div>
        </details>

        {/* Step 5: Explainer Drawer */}
        <ExplainerDrawer
          title={isBn ? "জন্মদিনের কাকতালীয় ঘটনা (The Party Coincidence)" : "The Party Coincidence"}
          eli5={isBn 
            ? "একটু ভেবে দেখুন: আপনি যদি ঘরে আসা যেকোনো ১ জনের জন্মদিনের সাথে আপনার জন্মদিন মেলাতে চান, তবে বছরের অর্ধেকের বেশি ১৮৩ জন মানুষের প্রয়োজন। কিন্তু আমরা যখন বলি 'যেকোনো ২ জন মানুষের জন্মদিন মিলবে কিনা'—তখন ঘরের সবাই সবার সাথে হ্যান্ডশেক করে! মাত্র ২৩ জন মানুষ থাকলে সেখানে ২৫৩ টি জোড়া তৈরি হয়, যা ৫০.৭% সম্ভাবনা তৈরি করে।"
            : "Imagine inviting people to a party. You might think you need 183 people (half the year) for a 50% chance of a shared birthday. But you actually only need 23! Why? Because you are comparing EVERY person to EVERY other person in the room—which creates 253 pairs of people shaking hands!"}
          intuitionTrap={isBn 
            ? "আমাদের মস্তিষ্ক সবসময় স্বজ্ঞাতভাবে চিন্তা করে: 'অন্য কারোর জন্মদিন কি আমার জন্মদিনের সাথে মিলবে?' (যাতে ১৮৩ জন লাগে)। কিন্তু প্যারাডক্সটি হলো: 'যে কোনো ২ জন মানুষের মধ্যে কি মিল রয়েছে?' জোড়ার সংখ্যা মানুষের সংখ্যার সাথে সাথে বহুগুণে বাড়তে থাকে।"
            : "Our human brain naturally thinks: 'What are the chances someone else has MY birthday?' That requires 183 people. But the paradox asks: 'Do ANY TWO people share a birthday?' We forget how fast pairs multiply!"}
          mathProof={`P(match) = 1 - P(no match)
For n = 23: Pairs = 23 * 22 / 2 = 253
P(no match) = 0.4927
P(match) = 1 - 0.4927 = 0.5073 (50.7%)`}
          realWorld={isBn 
            ? "সাইবার সিকিউরিটিতে পাসওয়ার্ড হ্যাশিং (Birthday Attack)! হ্যাকাররা এই প্যারাডক্স ব্যবহার করে ভিন্ন দুটি পাসওয়ার্ডের জন্য হুবহু একই ডিজিটাল সিগনেচার হ্যাশ তৈরি করে সিস্টেম ক্র্যাক করে।"
            : "Cryptographic Hash Collisions (The Birthday Attack)! Cybersecurity hackers use this to find two different password files that produce the exact same digital hash."}
        />

      </div>
    </section>
  );
}
