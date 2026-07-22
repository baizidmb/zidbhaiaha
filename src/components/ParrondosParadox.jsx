import React, { useState, useEffect } from 'react';
import { Coins, Play, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { runParrondoSimulationAsync } from '../utils/simulationEngine.js';
import { playClickSound, playCoinFlipSound } from '../utils/sound.js';
import { Line } from 'react-chartjs-2';

export default function ParrondosParadox() {
  const [totalSteps, setTotalSteps] = useState(200);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simResults, setSimResults] = useState(null);

  useEffect(() => {
    runSim();
  }, [totalSteps]);

  const runSim = () => {
    playClickSound();
    playCoinFlipSound();
    setIsSimulating(true);
    setSimProgress(0);

    runParrondoSimulationAsync(
      totalSteps,
      (progress, snapshot) => {
        setSimProgress(progress);
        setSimResults(snapshot);
      },
      (finalSnapshot) => {
        setSimResults(finalSnapshot);
        setIsSimulating(false);
      }
    );
  };

  const chartData = {
    labels: simResults?.labels || [],
    datasets: [
      {
        label: 'পর্যায়ক্রমিক বিকল্প কৌশল (A+B) [বিজয়ী!]',
        data: simResults?.alternating || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointRadius: 0
      },
      {
        label: 'শুধুমাত্র গেম A [হারার ঝুঁকি]',
        data: simResults?.gameA || [],
        borderColor: '#EC4899',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0
      },
      {
        label: 'শুধুমাত্র গেম B [হারার ঝুঁকি]',
        data: simResults?.gameB || [],
        borderColor: '#8B5CF6',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} ক্যাপিটাল`
        }
      }
    },
    scales: {
      x: { title: { display: true, text: 'কয়েন টস স্টেপ সংখ্যা', color: '#64748b' } },
      y: { title: { display: true, text: 'প্লেয়ার মূলধন ($)', color: '#64748b' } }
    }
  };

  return (
    <section id="parrondo" className="py-6 sm:py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                পারন্ডোর প্যারাডক্স (Parrondo's Paradox)
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
              দুটি আলাদাভাবে <span className="text-pink-400 font-bold">হারা গেম</span> (গেম A এবং গেম B) অল্টারনেট বা বিকল্প হিসেবে খেললে তা একটি ধারাবাহিক <span className="text-emerald-400 font-bold">বিজয়ী ট্রেন্ডে</span> পরিণত হয়!
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={runSim}
              disabled={isSimulating}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-glow-emerald transition-all duration-200 disabled:opacity-50 touch-manipulation"
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? `${simProgress}%` : 'নতুন ট্রায়াল চালান'}</span>
            </button>
          </div>
        </div>

        {/* Controls & Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          
          <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300">মোট কয়েন টস স্টেপ:</label>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {totalSteps}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={totalSteps}
              onChange={(e) => setTotalSteps(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-emerald-500 touch-none"
            />
          </div>

          <StatCard
            label="শুধুমাত্র গেম A"
            value={simResults ? `${simResults.finalCapA > 0 ? '+' : ''}${simResults.finalCapA}` : '$0'}
            subtext="বায়াস্ড কয়েন (লসিং EV)"
            icon={TrendingDown}
            color="purple"
          />

          <StatCard
            label="শুধুমাত্র গেম B"
            value={simResults ? `${simResults.finalCapB > 0 ? '+' : ''}${simResults.finalCapB}` : '$0'}
            subtext="ক্যাপিটাল মোডুলো (লসিং EV)"
            icon={TrendingDown}
            color="purple"
          />

          <StatCard
            label="পর্যায়ক্রমিক বিকল্প (A+B)"
            value={simResults ? `+$${simResults.finalCapAlt}` : '$0'}
            subtext="★ ধারাবাহিক বিজয়ী ট্রেন্ড!"
            icon={TrendingUp}
            color="emerald"
            highlight={true}
          />

        </div>

        {/* Real-Time Trajectory Chart */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 min-h-[280px] sm:min-h-[340px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>ক্যাপিটাল গ্রাফ ({totalSteps} টি কয়েন ফ্লিপ)</span>
            </h3>
          </div>
          <div className="flex-1 relative min-h-[220px] sm:min-h-[280px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Explainer Drawer in Bangla */}
        <ExplainerDrawer
          title="পারন্ডোর প্যারাডক্স (Parrondo's Paradox)"
          eli5="এমন দুটি কয়েন গেমের কথা ভাবুন যেখানে আলাদাভাবে খেলতে গেলে আপনার টাকা কমতেই থাকে। গেম A-তে রিগড কয়েন থাকে। গেম B-তে কয়েন টসের ভাগ্য নির্ভর করে আপনার বর্তমান টাকার সংখ্যা ৩ দ্বারা বিভাজ্য কিনা। আপনি একা গেম A খেললে হারবেন, একা গেম B খেললেও হারবেন। কিন্তু দুটি গেম পর্যায়ক্রমে বদলে বদলে খেললে আপনার টাকা বহুগুণে বাড়তে শুরু করে!"
          intuitionTrap="আমাদের স্বজ্ঞাত ধারণা বলে দুটি ঋণাত্মক ফলাফল যোগ করলে ঋণাত্মকই হয় (-২ + -২ = -৪)। কিন্তু পারন্ডোর প্যারাডক্সে গেম A গেম B-এর খারাপ চক্র থেকে প্লেয়ারকে বের করে এনে জয়ী হওয়ার রাজ্যে নিয়ে যায়।"
          mathProof={`গেম A: P(win) = ০.৪৯ - e (লসিং প্রত্যাশিত মান)

গেম B:
  যদি মূলধন mod 3 == 0: P(win) = ০.০৯ - e (খারাপ স্টেট)
  যদি মূলধন mod 3 != 0: P(win) = ০.৭৪ - e (ভালো স্টেট)

একা গেম B খেললে প্লেয়ারের মূলধন বেশিরভাগ সময় bad state এ আটকে যায়।
কিন্তু গেম A ও গেম B অল্টারনেট করে খেললে গেম A প্লেয়ারকে mod 3 == 0 ফাঁদ থেকে বের করে দেয় এবং প্লেয়ার ৭৪% জেতার সুযোগ পায়!`}
          realWorld="বায়োলজি ও ফাইন্যান্স পোর্ফোলিও রিব্যালেন্সিং (Volatility Harvesting)! বায়োলজিতে প্রজাতিরা বেঁচে থাকার জন্য দুটি ঝুঁকিপূর্ণ কৌশল পর্যায়ক্রমে ব্যবহার করে দীর্ঘমেয়াদে টিকে থাকে।"
        />

      </div>
    </section>
  );
}
