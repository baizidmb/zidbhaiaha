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

    ctx.strokeStyle = '#ff7a00';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ff7a00';
    ctx.shadowBlur = 12;

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
          borderColor: '#ff7a00',
          backgroundColor: 'rgba(255, 122, 0, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: isBn ? `বর্তমান অবস্থান (${numPeople} জন)` : `Current (${numPeople} people)`,
          data: labels.map(l => l === numPeople ? +probPercent : null),
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
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
      legend: { labels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      x: { title: { display: true, text: isBn ? 'মানুষের সংখ্যা (n)' : 'People (n)', color: 'rgba(255, 255, 255, 0.4)' } },
      y: { min: 0, max: 100, title: { display: true, text: '%', color: 'rgba(255, 255, 255, 0.4)' } }
    }
  };

  return (
    <section id="birthday" className="py-6 sm:py-8 scroll-mt-24">
      <div className="liquid-glass-card rounded-3xl p-4 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Cosmic Orange Glow */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 border border-[#ff7a00]/40 text-[#ff7a00]">
                <Flame className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                {isBn ? '🎉 জন্মদিনের মিল (The Party Coincidence)' : '🎉 The Party Coincidence'}
              </h2>
            </div>
            <p className="text-white/60 text-xs sm:text-sm mt-1 font-medium">
              {isBn ? 'একটি পার্টিতে কতজন মানুষ থাকলে অন্তত দুজন মানুষের একই দিনে জন্মদিন হওয়ার সম্ভাবনা ৫০%?' : 'How many people do you need in a room for a 50% chance of a shared birthday?'}
            </p>
          </div>
        </div>

        {/* Step 1: Hook - Guess Slider */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#ff7a00]/15 via-white/[0.02] to-purple-600/15 border border-[#ff7a00]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#ff7a00] uppercase tracking-wider flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>{isBn ? 'ধাপ ১: আপনার অনুমান পরীক্ষা করুন!' : 'Step 1: Test Your Intuition First!'}</span>
            </span>
            <span className="text-sm font-mono font-black text-[#ff7a00] bg-[#ff7a00]/15 px-3 py-1 rounded-xl border border-[#ff7a00]/40">
              {userGuess} {isBn ? 'জন মানুষ' : 'people'}
            </span>
          </div>

          <p className="text-xs text-white/80 font-semibold">
            {isBn 
              ? '৫০% সম্ভাবনার জন্য একটি ঘরে কতজন মানুষ প্রয়োজন বলে আপনার ধারণা?' 
              : 'How many people do you THINK are needed for a 50% chance of a shared birthday?'}
          </p>

          <input
            type="range"
            min="10"
            max="365"
            value={userGuess}
            onChange={(e) => { setUserGuess(parseInt(e.target.value)); setHasGuessed(true); }}
            className="w-full h-3 bg-white/10 rounded-lg cursor-pointer accent-[#ff7a00] touch-none"
          />

          {hasGuessed && (
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center space-x-3 text-xs text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                {isBn ? (
                  <>আপনার অনুমান <strong>{userGuess} জন</strong>! কিন্তু আসল গাণিতিক উত্তর হলো মাত্র <strong className="text-[#ff7a00] font-extrabold text-sm">২৩ জন!</strong></>
                ) : (
                  <>You guessed <strong>{userGuess} people</strong>! But the real mathematical answer is ONLY <strong className="text-[#ff7a00] font-extrabold text-sm">23 people!</strong></>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Step 2: Interactive Party Room */}
        <div className="liquid-glass-card rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-[#ff7a00]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isBn ? 'ধাপ ২: পার্টি রুম সিমুলেটর' : 'Step 2: Interactive Party Room'}
              </h3>
            </div>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <button
                onClick={runSingleTrial}
                className="btn-cosmic flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl text-xs touch-manipulation glossy-shine"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isBn ? 'নতুন পার্টি ট্রায়াল' : 'Run New Trial'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white/[0.03] p-3 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-white/80 whitespace-nowrap">
              {isBn ? 'ঘরে কতজন:' : 'People:'} <strong className="text-[#ff7a00]">{numPeople}</strong>
            </span>
            <input
              type="range"
              min="2"
              max="100"
              value={numPeople}
              onChange={(e) => setNumPeople(parseInt(e.target.value))}
              className="w-full h-2.5 bg-white/10 rounded-lg cursor-pointer accent-[#ff7a00]"
            />
          </div>

          <div ref={gridContainerRef} className="relative min-h-[220px] p-3 bg-[#030305]/70 rounded-2xl border border-white/10">
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2 relative z-0">
              {trialResult?.avatars.map((av) => {
                const isMatched = trialResult.matchedAvatarSet.has(av.id);
                return (
                  <div
                    key={av.id}
                    data-avatar-id={av.id}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                      isMatched
                        ? 'bg-[#ff7a00]/20 border-2 border-[#ff7a00] shadow-glow-amber scale-105 z-20 animate-pulse-slow'
                        : 'bg-white/[0.03] border border-white/10 text-white/60'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isMatched ? 'bg-[#ff7a00] text-slate-950 font-black' : 'bg-white/10 text-white'
                    }`}>
                      #{av.id + 1}
                    </div>
                    <span className="text-[10px] font-mono mt-1 font-semibold text-white/80 text-center leading-tight">
                      {formatDayOfYear(av.birthday, lang)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Aha! Verdict */}
        <StatCard
          label={isBn ? "গাণিতিক রায় (The Aha! Verdict)" : "The Aha! Verdict"}
          value={`${probPercent}% Match Chance`}
          subtext={isBn ? `২৩ জন মানুষ থাকলেই অন্তত ২টি একই জন্মদিনের মিল পাওয়ার সম্ভাবনা ৫০.৭%!` : `At 23 people, there is a 50.7% chance of a shared birthday!`}
          icon={Percent}
          color="amber"
          highlight={true}
        />

        {/* Step 4: Behind the Math */}
        <details className="group border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
          <summary className="px-5 py-4 flex items-center justify-between cursor-pointer font-bold text-sm text-white hover:bg-white/5 transition-colors">
            <span className="flex items-center space-x-2">
              <span>📐</span>
              <span>{isBn ? '📐 সূত্রের পেছনে ও গ্রাফ দেখুন (Behind the Math)' : '📐 Behind the Math & Proof'}</span>
            </span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-white/40" />
          </summary>

          <div className="p-5 border-t border-white/10 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-[#030305] border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-[#ff7a00] uppercase tracking-wider font-mono">
                  {isBn ? 'সঠিক গাণিতিক সূত্র' : 'Exact Probability Formula'}
                </h4>
                <div className="p-3 bg-white/5 rounded-xl text-[#ff7a00] font-mono text-xs overflow-x-auto border border-white/10">
                  P(match) = 1 - (365! / (365^n * (365-n)!))
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#030305] border border-white/10 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                    {isBn ? '১,০০০ সিমুলেশন টেস্ট' : '1,000 Trial Simulation'}
                  </h4>
                  {empiricalRate !== null && (
                    <p className="text-sm font-bold text-emerald-400 mt-1">
                      {isBn ? `সিমুলেটেড মিলের হার: ${empiricalRate}%` : `Simulated Match Rate: ${empiricalRate}%`}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleRunMonteCarlo}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-[#ff7a00]' : ''}`} />
                  <span>{isSimulating ? `${monteCarloProgress}%` : (isBn ? '১,০০০ সিমুলেশন' : 'Run 1,000 Sims')}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#030305] border border-white/10 min-h-[240px]">
              <div className="h-[200px] relative">
                <Line data={curveData} options={chartOptions} />
              </div>
            </div>
          </div>
        </details>

        {/* Step 5: Explainer */}
        <ExplainerDrawer
          title={isBn ? "জন্মদিনের মিল (The Party Coincidence)" : "The Party Coincidence"}
          eli5={isBn 
            ? "একটি ঘরে মাত্র ২৩ জন মানুষ থাকলে ২৫৩ টি জোড়া তৈরি হয়! সবাই সবার সাথে তুলনা করায় ৫০.৭% সম্ভাবনা তৈরি হয়।"
            : "In a room of 23 people, there are 253 unique pairs comparing birthdays, creating a 50.7% chance of a match!"}
          intuitionTrap="We naturally think about people sharing MY birthday (requires 183 people), not ANY TWO people sharing a birthday!"
          mathProof="P(match) = 1 - (365! / (365^n * (365-n)!))"
          realWorld="Cryptographic Hash Collisions (Birthday Attack)!"
        />

      </div>
    </section>
  );
}
