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

  // Exact math calculation
  const probDecimal = useMemo(() => calculateBirthdayProbability(numPeople), [numPeople]);
  const probPercent = (probDecimal * 100).toFixed(1);
  const isThreshold = numPeople === 23;

  // Initial trial on mount or slider change
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

  // Draw lines connecting matching avatars
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

  // Run 1,000 Monte Carlo Trials
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

  // Precomputed chart curve
  const curveData = useMemo(() => {
    const { labels, data } = getBirthdayCurveData();
    return {
      labels,
      datasets: [
        {
          label: 'Theoretical Probability (%)',
          data,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: `Current (${numPeople} people)`,
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
      x: { title: { display: true, text: 'People in Room (n)', color: '#64748b' } },
      y: { min: 0, max: 100, title: { display: true, text: 'Probability (%)', color: '#64748b' } }
    }
  };

  return (
    <section id="birthday" className="py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Flame className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                The Birthday Paradox
              </h2>
            </div>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              In a room of just 23 people, there is a <span className="text-blue-400 font-bold">50.7% chance</span> that two people share the exact same birthday.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={runSingleTrial}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-glow-blue transition-all duration-200"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run Random Trial</span>
            </button>

            <button
              onClick={handleRunMonteCarlo}
              disabled={isSimulating}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin text-blue-400' : ''}`} />
              <span>{isSimulating ? `${monteCarloProgress}%` : '1,000 Sims'}</span>
            </button>
          </div>
        </div>

        {/* Top Control Bar & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Slider Control */}
          <div className="md:col-span-2 glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>People in Room (n):</span>
              </label>
              <span className="text-2xl font-black font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/30">
                {numPeople}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={numPeople}
              onChange={(e) => setNumPeople(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg cursor-pointer accent-blue-500 my-2"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-1">
              <span>1 person (0%)</span>
              <span className={`font-bold ${isThreshold ? 'text-blue-400 underline decoration-2' : ''}`}>
                23 people (50.7% Threshold)
              </span>
              <span>100 people (99.99%)</span>
            </div>
          </div>

          {/* Glowing Math Readout Card */}
          <StatCard
            label="Exact Match Probability"
            value={`${probPercent}%`}
            subtext={isThreshold ? "★ 50.7% Critical Threshold!" : `P(match) = 1 - (365! / (365^${numPeople} * (365-${numPeople})!))`}
            icon={Percent}
            color={isThreshold ? 'blue' : 'purple'}
            highlight={true}
          />

        </div>

        {/* Empirical Simulation Stat Notice if run */}
        {empiricalRate !== null && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-slate-200">
                Empirical Monte Carlo Result (1,000 room trials of {numPeople} people):
              </span>
            </div>
            <span className="text-lg font-extrabold font-mono text-blue-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
              {empiricalRate}% Matches Found
            </span>
          </div>
        )}

        {/* Main Interactive Grid & Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Avatar Glass Grid (7 Cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-5 border border-slate-800 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Simulated Room Avatars ({numPeople} People)</span>
              </h3>
              {trialResult && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg font-mono ${
                  trialResult.hasMatch ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {trialResult.hasMatch ? `✓ ${trialResult.totalMatches} Shared Birthday Match!` : 'No matches in this trial'}
                </span>
              )}
            </div>

            {/* Container for Avatars & Connection Lines */}
            <div ref={gridContainerRef} className="relative min-h-[280px] p-2">
              <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5 relative z-0">
                {trialResult?.avatars.map((av) => {
                  const isMatched = trialResult.matchedAvatarSet.has(av.id);
                  return (
                    <div
                      key={av.id}
                      data-avatar-id={av.id}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                        isMatched
                          ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-glow-cyan scale-105 z-20 animate-pulse-slow'
                          : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isMatched ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{av.id + 1}
                      </div>
                      <span className="text-[10px] font-mono mt-1 font-semibold text-slate-300">
                        {formatDayOfYear(av.birthday)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Theoretical Probability Curve Chart (5 Cols) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-slate-800 flex flex-col">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Percent className="w-4 h-4 text-purple-400" />
              <span>Theoretical Probability Curve</span>
            </h3>
            <div className="flex-1 min-h-[260px] relative">
              <Line data={curveData} options={chartOptions} />
            </div>
          </div>

        </div>

        {/* Explainer Drawer */}
        <ExplainerDrawer
          title="The Birthday Paradox"
          eli5="Imagine inviting people to a party. You might think you need 183 people (half the year) for a 50% chance of a shared birthday. But you actually only need 23! Why? Because you are comparing EVERY person to EVERY other person in the room—which creates 253 pairs of people shaking hands!"
          intuitionTrap="Our human brain naturally thinks: 'What are the chances someone else has MY birthday?' That requires 183 people. But the paradox asks: 'Do ANY TWO people share a birthday?' We forget how fast pairs multiply!"
          mathProof={`Formula for n people:
P(match) = 1 - P(no match)
P(no match) = (365/365) * (364/365) * (363/365) * ... * ((365 - n + 1)/365)

Number of unique pairs for n people:
Pairs = n * (n - 1) / 2

For n = 23:
Pairs = 23 * 22 / 2 = 253 unique comparisons!
P(no match) = 0.4927
P(at least 1 match) = 1 - 0.4927 = 0.5073 (50.7%)`}
          realWorld="Cryptographic Hash Collisions (The Birthday Attack)! In cybersecurity, hackers use the Birthday Paradox to find two different password files that produce the exact same digital signature hash."
        />

      </div>
    </section>
  );
}
