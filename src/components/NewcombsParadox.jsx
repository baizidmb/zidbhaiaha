import React, { useState } from 'react';
import { Brain, Play, RefreshCw, CheckCircle2, Package, Award } from 'lucide-react';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { playNewcombsGame } from '../utils/paradoxMath.js';
import { runNewcombsSimulationAsync } from '../utils/simulationEngine.js';
import { playClickSound, playDoorOpenSound, playWinFanfare } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';

export default function NewcombsParadox({ lang = 'bn' }) {
  const [gameState, setGameState] = useState('choice'); // 'choice' | 'revealed'
  const [gameResult, setGameResult] = useState(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simStats, setSimStats] = useState({
    trialsDone: 10000,
    avgBoxB: 990000,
    avgBoth: 11000
  });

  const isBn = lang === 'bn';

  const handleMakeChoice = (userChoice) => {
    playClickSound();
    playDoorOpenSound();

    const result = playNewcombsGame(userChoice, 0.99);
    setGameResult(result);
    setGameState('revealed');

    if (result.totalWon >= 1000000) {
      playWinFanfare();
    }
  };

  const resetGame = () => {
    playClickSound();
    setGameState('choice');
    setGameResult(null);
  };

  const handleRun10kSims = () => {
    playClickSound();
    setIsSimulating(true);
    setSimProgress(0);

    runNewcombsSimulationAsync(
      10000,
      (progress, snapshot) => {
        setSimProgress(progress);
        setSimStats(snapshot);
      },
      (finalSnapshot) => {
        setSimStats(finalSnapshot);
        setIsSimulating(false);
      }
    );
  };

  const chartData = {
    labels: isBn ? ['১টি বক্স কৌশল (Box B Only)', '২টি বক্স কৌশল (Both A + B)'] : ['1-Box Strategy (Box B Only)', '2-Box Strategy (Both A + B)'],
    datasets: [
      {
        label: isBn ? 'গড় আয় ($)' : 'Average Winnings ($)',
        data: [simStats.avgBoxB, simStats.avgBoth],
        backgroundColor: ['rgba(139, 92, 246, 0.8)', 'rgba(236, 72, 153, 0.8)'],
        borderColor: ['#8B5CF6', '#EC4899'],
        borderWidth: 2,
        borderRadius: 12
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: { ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } }
    }
  };

  return (
    <section id="newcombs" className="py-6 sm:py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {isBn ? 'নিউকম্বসের প্যারাডক্স (Newcomb\'s Paradox)' : 'Newcomb\'s Paradox'}
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
              {isBn 
                ? 'ভবিষ্যৎদ্রষ্টা এআই বনাম স্বাধীন ইচ্ছা! ৯৯% নির্ভুল ভবিষ্যৎদ্রষ্টা গতকালই ভবিষ্যৎ জেনে একটি বাক্সে ১০ লাখ ডলার রেখেছে। আপনি কি ১টি বাক্স নাকি ২টি বাক্সই বেছে নেবেন?'
                : 'Super-AI Predictor vs Free Will! A 99% accurate predictor predicted your decision yesterday. Will you pick 1 Box or Both Boxes?'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={resetGame}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all duration-200 touch-manipulation"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isBn ? 'পুনরায় খেলা' : 'Reset Choices'}</span>
            </button>

            <button
              onClick={handleRun10kSims}
              disabled={isSimulating}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-glow-purple transition-all duration-200 disabled:opacity-50 touch-manipulation"
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? `${simProgress}%` : (isBn ? '১০,০০০ সিমুলেশন' : '10,000 Auto-Sims')}</span>
            </button>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            label={isBn ? "বক্স A (নিশ্চিত টাকা)" : "Box A (Guaranteed)"}
            value="$1,000"
            subtext={isBn ? "সবার জন্য খোলা টাকা" : "Always inside Box A"}
            color="blue"
          />
          <StatCard
            label={isBn ? "বক্স B (ভবিষ্যদ্বাণীর টাকা)" : "Box B (Predictor)"}
            value="$1,000,000 / $0"
            subtext={isBn ? "ভবিষ্যৎদ্রষ্টার সিদ্ধান্তের ওপর নির্ভর" : "Depends on Prediction"}
            color="purple"
            highlight={true}
          />
          <StatCard
            label={isBn ? "১-বক্স কৌশল গড় আয়" : "1-Box Strategy Avg"}
            value={`$${(simStats.avgBoxB / 1000).toFixed(0)}k`}
            subtext={isBn ? "~$৯৯০,০০০ প্রায় নিশ্চিত জয়" : "~$990k Average Win"}
            color="emerald"
            highlight={true}
          />
          <StatCard
            label={isBn ? "২-বক্স কৌশল গড় আয়" : "2-Box Strategy Avg"}
            value={`$${(simStats.avgBoth / 1000).toFixed(0)}k`}
            subtext={isBn ? "মাত্র ~$১১,০০০ গড় আয়" : "Only ~$11k Average Win"}
            color="amber"
          />
        </div>

        {/* Main Content Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Interactive Boxes Choice Stage */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center mb-6">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                  {isBn ? '🧠 ৯৯.৯% নিখুঁত ভবিষ্যৎদ্রষ্টা গতকালই বাক্স দুটি সাজিয়েছে' : '🧠 99.9% Accurate Predictor set the boxes yesterday'}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">
                  {isBn 
                    ? 'আপনি কি শুধু বক্স B নেবেন ($১,০০০,০০০ সম্ভাবনা)? নাকি দুটি বক্সই (Box A + Box B) নেবেন?'
                    : 'Will you take ONLY Box B ($1 Million chance) or BOTH Box A + Box B?'}
                </p>
              </div>

              {/* Two Visual Box Cards */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 my-4">
                
                {/* Box A Card */}
                <div className="p-4 sm:p-6 rounded-2xl bg-blue-950/40 border-2 border-blue-500/50 text-center flex flex-col items-center justify-between min-h-[160px]">
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase">BOX A</span>
                  <Package className="w-12 h-12 text-blue-400 my-2" />
                  <span className="text-base sm:text-xl font-black font-mono text-blue-300">$1,000</span>
                  <span className="text-[10px] text-slate-400">{isBn ? 'নিশ্চিত খোলা টাকা' : 'Guaranteed Cash'}</span>
                </div>

                {/* Box B Card */}
                <div className="p-4 sm:p-6 rounded-2xl bg-purple-950/40 border-2 border-purple-500/50 text-center flex flex-col items-center justify-between min-h-[160px]">
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase">BOX B</span>
                  <Package className="w-12 h-12 text-purple-400 my-2 animate-pulse-slow" />
                  <span className="text-base sm:text-xl font-black font-mono text-purple-300">
                    {gameState === 'revealed' ? (gameResult.boxBHasMillion ? '$1,000,000' : '$0') : '$1,000,000 ?'}
                  </span>
                  <span className="text-[10px] text-slate-400">{isBn ? 'ভবিষ্যদ্বাণীর ওপর নির্ভর' : 'Secret Million Dollars'}</span>
                </div>

              </div>

              {/* Action Decision Buttons */}
              {gameState === 'choice' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => handleMakeChoice('boxB')}
                    className="p-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm shadow-glow-purple transition-all touch-manipulation"
                  >
                    {isBn ? '১টি বক্স নিন (শুধু Box B)' : 'Take 1-Box (Box B Only)'}
                  </button>
                  <button
                    onClick={() => handleMakeChoice('both')}
                    className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all touch-manipulation"
                  >
                    {isBn ? '২টি বক্সই নিন (Box A + Box B)' : 'Take Both Boxes (Box A + B)'}
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-sm sm:text-base">
                    <Award className="w-5 h-5" />
                    <span>{isBn ? `আপনি জিতেছেন $${gameResult.totalWon.toLocaleString()}!` : `You Won $${gameResult.totalWon.toLocaleString()}!`}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isBn 
                      ? (gameResult.boxBHasMillion ? 'ভবিষ্যৎদ্রষ্টা সঠিকভাবে ভবিষ্যদ্বাণী করেছিল যে আপনি ১টি বক্স নেবেন! বক্স B-তে ১০ লাখ ডলার রাখা ছিল!' : 'ভবিষ্যৎদ্রষ্টা জানত আপনি লোভী হয়ে ২টি বক্সই নেবেন, তাই বক্স B খালি রেখেছিল!') 
                      : (gameResult.boxBHasMillion ? 'The Predictor correctly foresaw you would take 1-Box and left $1 Million inside Box B!' : 'The Predictor foresaw you taking both boxes and left Box B empty!')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 10,000 Auto-Simulation Chart */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>{isBn ? '১০,০০০ গেমের গাণিতিক গড় আয়' : '10,000 Games Average Winnings'}</span>
              </h3>
              <div className="flex-1 min-h-[220px] sm:min-h-[260px] relative">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed italic">
              {isBn 
                ? '* ৯৯% নিখুঁত ভবিষ্যৎদ্রষ্টার বিরুদ্ধে ১টি বাক্স (Box B) নেওয়া দর্শনে গড় আয় ~$৯৯০,০০০ কিন্তু ২টি বাক্স নেওয়ার দর্শনে গড় আয় মাত্র ~$১১,০০০!' 
                : '* Against a 99% accurate predictor, 1-Boxers average ~$990k while 2-Boxers average only ~$11k!'}
            </p>
          </div>

        </div>

        {/* Explainer Drawer in Authentic Storytelling Bengali */}
        <ExplainerDrawer
          title={isBn ? "নিউকম্বসের প্যারাডক্স (Newcomb's Paradox)" : "Newcomb's Paradox"}
          eli5={isBn 
            ? "গল্পটি শুনুন: একজন অতি-উন্নত সুপার-এআই বা ভবিষ্যৎদ্রষ্টা গতকাল রাতে একটি খেলা সাজিয়েছে। আপনার সামনে দুটি বাক্স রয়েছে—বক্স A-তে নিশ্চিত ১,০০০ ডলার রাখা আছে। আর বক্স B-তে রাখা আছে ১০ লাখ ডলার অথবা কিছুই না! ভবিষ্যৎদ্রষ্টা গতকালই ভবিষ্যদ্বাণী করেছে আপনি আজ কী সিদ্ধান্ত নেবেন। যদি সে ভেবে থাকে আপনি শুধু 'বক্স B' নেবেন, তবে সে বক্স B-তে ১০ লাখ ডলার রেখেছে! আর যদি সে ভেবে থাকে আপনি চালাকি করে দুটি বক্সই (Box A + Box B) নেবেন, তবে সে বক্স B খালি রেখে দিয়েছে! এখন প্রশ্ন হলো—গতকালই যখন বাক্সগুলো বন্ধ হয়ে গেছে, আপনি আজ কোনটা বেছে নেবেন? ১টি বাক্স নাকি ২টি বাক্সই?"
            : "A super-intelligent Predictor sets up a game yesterday. Box A contains $1,000 guaranteed. Box B contains either $1,000,000 or NOTHING. If the Predictor predicted you'd choose Box B only, it placed $1M inside. If it predicted you'd take BOTH boxes, it left Box B empty. The boxes are locked yesterday. What do you choose today?"}
          intuitionTrap={isBn 
            ? "দর্শনশাস্ত্র ও পদার্থবিজ্ঞানের দুটি বিখ্যাত দল এখানে লড়াই করে! ১ নম্বর দল (Causal Decision Theory) বলে: 'গতকালই তো টাকা রাখা হয়ে গেছে, এখন আমার বক্স খোলার সিদ্ধান্ত অতীতে গিয়ে বাক্সের ভেতরের টাকা পাল্টাতে পারবে না! তাই ২টি বক্স নিলে বাড়তি ১,০০০ ডলার তো নিশ্চিত পাবো!' কিন্তু ২ নম্বর দল (Evidential Decision Theory) বলে: 'এত শত মানুষের মধ্যে যারা ১টি বাক্স বেছে নিয়েছে তারাই ১০ লাখ ডলার পেয়ে বাড়ি ফিরেছে, আর যারা ২টি বাক্স বেছে নিয়েছে তারা খালি বাক্সের ১,০০০ ডলার পেয়ে বাড়ি গেছে! সিদ্ধান্ত যদি ফলাফলকে প্রভাবিত করে তবে ১টি বাক্স নেওয়াই বুদ্ধিমানের কাজ!'"
            : "Dominance Principle vs Expected Utility! Dominance says: the money is already in the boxes, so taking both gives $1,000 more no matter what. Expected Utility says: 1-boxers walk away rich ($990k average), while 2-boxers walk away poor ($11k average)."}
          mathProof={`Let Accuracy = 99% (p = 0.99)

Strategy 1: Pick Box B Only
E(Box B) = (0.99 * $1,000,000) + (0.01 * $0) = $990,000

Strategy 2: Pick Both (Box A + Box B)
E(Both) = (0.01 * $1,001,000) + (0.99 * $1,000) = $11,010

Expected Value Difference: $990,000 vs $11,010!`}
          realWorld={isBn 
            ? "কৃত্রিম বুদ্ধিমত্তা (AI), গেম থিওরি ও স্বাধীন ইচ্ছা (Free Will)! এআই যুগের সবচেয়ে বড় প্রশ্ন—যদি কোনো এআই মানুষের সিদ্ধান্ত ৯৯.৯% নিখুঁতভাবে অনুমান করতে পারে, তবে মানুষের 'স্বাধীন ইচ্ছা' বলে কি আদৌ কিছু থাকে?"
            : "Artificial Intelligence, Free Will & Game Theory! Examines if humans truly have free will if an AI agent can predict human decisions with 99.9% accuracy."}
        />

      </div>
    </section>
  );
}
