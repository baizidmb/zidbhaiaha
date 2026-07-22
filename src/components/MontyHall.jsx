import React, { useState, useEffect } from 'react';
import { DoorClosed, RotateCcw, Play, BarChart, Sparkles, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { runMontyHallSimulationAsync } from '../utils/simulationEngine.js';
import { playClickSound, playDoorOpenSound, playWinFanfare } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';

export default function MontyHall() {
  const [gameState, setGameState] = useState('pick');
  const [carDoor, setCarDoor] = useState(0);
  const [userPick, setUserPick] = useState(null);
  const [hostRevealedDoor, setHostRevealedDoor] = useState(null);
  const [finalChoice, setFinalChoice] = useState(null);
  const [isWin, setIsWin] = useState(false);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simStats, setSimStats] = useState({
    switchWins: 6670,
    stayWins: 3330,
    switchWinRate: 66.7,
    stayWinRate: 33.3,
    totalTrials: 10000
  });

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomCar = Math.floor(Math.random() * 3);
    setCarDoor(randomCar);
    setUserPick(null);
    setHostRevealedDoor(null);
    setFinalChoice(null);
    setIsWin(false);
    setGameState('pick');
  };

  const handleDoorPick = (doorIdx) => {
    if (gameState !== 'pick') return;
    playClickSound();
    setUserPick(doorIdx);

    const availableGoatDoors = [0, 1, 2].filter(
      (d) => d !== doorIdx && d !== carDoor
    );
    const hostChoice = availableGoatDoors[Math.floor(Math.random() * availableGoatDoors.length)];
    setHostRevealedDoor(hostChoice);
    setGameState('revealed');
    playDoorOpenSound();
  };

  const handleFinalDecision = (shouldSwitch) => {
    if (gameState !== 'revealed') return;
    playClickSound();

    let choice = userPick;
    if (shouldSwitch) {
      choice = [0, 1, 2].find((d) => d !== userPick && d !== hostRevealedDoor);
    }
    setFinalChoice(choice);
    const won = choice === carDoor;
    setIsWin(won);
    setGameState('finished');
    playDoorOpenSound();

    if (won) {
      playWinFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleRun10kSims = () => {
    playClickSound();
    setIsSimulating(true);
    setSimProgress(0);

    runMontyHallSimulationAsync(
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
    labels: ['সুইচ করার কৌশল', 'একই দরজায় থাকার কৌশল'],
    datasets: [
      {
        label: 'জেতার হার (%)',
        data: [simStats.switchWinRate, simStats.stayWinRate],
        backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(139, 92, 246, 0.7)'],
        borderColor: ['#3B82F6', '#8B5CF6'],
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
          label: (ctx) => `জেতার হার: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      y: { min: 0, max: 100, ticks: { callback: (v) => `${v}%` } }
    }
  };

  return (
    <section id="monty" className="py-6 sm:py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <DoorClosed className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                মন্টি হল প্রবলেম (Monty Hall Problem)
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
              সর্বদা সুযোগ দেওয়া হলে দরজা পরিবর্তন করুন! সুইচ করলে জেতার সম্ভাবনা <span className="text-purple-400 font-bold">১/৩ (৩৩.৩%)</span> থেকে দ্বিগুণ বেড়ে <span className="text-blue-400 font-bold">২/৩ (৬৬.৭%)</span> হয়।
            </p>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={resetGame}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all duration-200 touch-manipulation"
            >
              <RotateCcw className="w-4 h-4" />
              <span>পুনরায় শুরু</span>
            </button>

            <button
              onClick={handleRun10kSims}
              disabled={isSimulating}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-glow-purple transition-all duration-200 disabled:opacity-50 touch-manipulation"
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? `${simProgress}%` : '১০,০০০ সিমুলেশন'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left: Interactive 3-Door Stage */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col justify-between">
            
            {/* Game Stage Prompt Banner */}
            <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              {gameState === 'pick' && (
                <p className="text-xs sm:text-base font-bold text-blue-400 flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>ধাপ ১: যেকোনো ১টি দরজায় ক্লিক করে আপনার পছন্দের দরজা বেছে নিন!</span>
                </p>
              )}
              {gameState === 'revealed' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-amber-400">
                    🐐 হোস্ট দরজা #{hostRevealedDoor + 1} খুলে একটি ছাগল দেখিয়েছেন! আপনি কি দরজা সুইচ করবেন?
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => handleFinalDecision(true)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-glow-blue transition-all touch-manipulation"
                    >
                      দরজা সুইচ করুন! (প্রস্তাবিত - ৬৬.৭%)
                    </button>
                    <button
                      onClick={() => handleFinalDecision(false)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 touch-manipulation"
                    >
                      প্রথম পছন্দতেই থাকুন (৩৩.৩%)
                    </button>
                  </div>
                </div>
              )}
              {gameState === 'finished' && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <span className={`text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl ${
                    isWin ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}>
                    {isWin ? '🎉 অভিনন্দন! আপনি নতুন স্পোর্টস কার 🚗 জিতেছেন!' : '🐐 দুর্ভাগ্য! আপনি ছাগল পেয়েছেন!'}
                  </span>
                  <button
                    onClick={resetGame}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    আবার খেলুন
                  </button>
                </div>
              )}
            </div>

            {/* 3 Animated Door Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-6 my-2 sm:my-4">
              {[0, 1, 2].map((doorIdx) => {
                const isUserInitialPick = userPick === doorIdx;
                const isHostRevealed = hostRevealedDoor === doorIdx;
                const isFinalChosen = finalChoice === doorIdx;
                const isCar = carDoor === doorIdx;

                let doorContent = null;
                if (gameState === 'revealed' && isHostRevealed) {
                  doorContent = { icon: '🐐', label: 'ছাগল', bg: 'bg-amber-950/60 border-amber-600/40' };
                } else if (gameState === 'finished') {
                  doorContent = isCar
                    ? { icon: '🚗', label: 'নতুন কার!', bg: 'bg-emerald-950/80 border-emerald-500 shadow-glow-emerald' }
                    : { icon: '🐐', label: 'ছাগল', bg: 'bg-slate-900 border-slate-800 opacity-60' };
                }

                return (
                  <div
                    key={doorIdx}
                    onClick={() => handleDoorPick(doorIdx)}
                    className={`relative rounded-xl sm:rounded-2xl p-2.5 sm:p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between min-h-[170px] sm:min-h-[220px] select-none touch-manipulation ${
                      gameState === 'pick'
                        ? 'bg-slate-900/90 border-slate-700 hover:border-blue-500 hover:shadow-glow-blue'
                        : isUserInitialPick && gameState === 'revealed'
                        ? 'bg-blue-950/60 border-blue-500 shadow-glow-blue'
                        : doorContent
                        ? doorContent.bg
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-400">দরজা #{doorIdx + 1}</span>
                      {isUserInitialPick && (
                        <span className="text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          পছন্দ
                        </span>
                      )}
                    </div>

                    {/* Door Icon / Prize Reveal */}
                    <div className="my-2 sm:my-6 text-center">
                      {doorContent ? (
                        <div className="space-y-1 sm:space-y-2 animate-bounce">
                          <span className="text-3xl sm:text-5xl">{doorContent.icon}</span>
                          <p className="text-[10px] sm:text-xs font-black text-slate-200 tracking-wider">{doorContent.label}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                          <DoorClosed className="w-10 h-10 sm:w-16 sm:h-16 text-slate-500" />
                          <span className="text-[10px] sm:text-xs text-slate-400 font-medium">ক্লিক করুন</span>
                        </div>
                      )}
                    </div>

                    {/* Status Tag */}
                    <div className="w-full text-center">
                      {isFinalChosen && gameState === 'finished' && (
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-lg ${isWin ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`}>
                          {isWin ? 'বিজয়ী!' : 'ছাগল'}
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Strategy Comparison Stat Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
              <StatCard
                label="সুইচ করলে জেতার হার"
                value={`${simStats.switchWinRate}%`}
                subtext="~৬৬.৭% গাণিতিক নিশ্চয়তা"
                icon={Check}
                color="blue"
                highlight={true}
              />
              <StatCard
                label="একই দরজায় থাকলে হার"
                value={`${simStats.stayWinRate}%`}
                subtext="~৩৩.৩% গাণিতিক জেতার সুযোগ"
                icon={X}
                color="purple"
              />
            </div>

          </div>

          {/* Right: Live 10,000 Auto-Simulation Chart */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <BarChart className="w-4 h-4 text-purple-400" />
                  <span>১০,০০০ ট্রায়াল অটো-সিমুলেশন</span>
                </h3>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  ১০,০০০ সিমুলেশন
                </span>
              </div>

              {isSimulating && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
                    <span>সিমুলেশন চলছে...</span>
                    <span>{simProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="min-h-[200px] sm:min-h-[260px] relative my-2">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1.5 font-medium mt-2">
              <div className="flex justify-between text-slate-200 font-bold">
                <span>সুইচ করে জয়:</span>
                <span className="text-blue-400 font-mono">{simStats.switchWins.toLocaleString()} টি ম্যাচ</span>
              </div>
              <div className="flex justify-between text-slate-200 font-bold">
                <span>থাকলে জয়:</span>
                <span className="text-purple-400 font-mono">{simStats.stayWins.toLocaleString()} টি ম্যাচ</span>
              </div>
            </div>

          </div>

        </div>

        {/* Explainer Drawer in Bangla */}
        <ExplainerDrawer
          title="মন্টি হল প্রবলেম (Monty Hall Problem)"
          eli5="খেলা শুরুতেই আপনি ১টি দরজা বেছে নিলে গাড়িটি জেতার সম্ভাবনা ছিল ১/৩ এবং বাকি দুটি দরজায় গাড়ি থাকার সম্ভাবনা ছিল ২/৩। হোস্ট মন্টি যখন নিশ্চিতভাবে ১টি ছাগল থাকা দরজা খুলে দেন, তিনি আপনার আগের ১/৩ ভাগ্য পরিবর্তন করেন না—তিনি বাকি ২/৩ সম্ভাবনা পুরোটাই না খোলা অন্য দরজাটিতে শিফট করে দেন!"
          intuitionTrap="আমরা ভাবি: 'এখন তো ২টি দরজা বাকি রয়েছে, তাই সম্ভাবনা ৫০/৫০ হওয়া উচিত।' কিন্তু মন্টি র্যান্ডমভাবে দরজা খোলেননি! মন্টি জানেন কোথায় গাড়ি রয়েছে এবং তিনি ছাগল দেখাতে বাধ্য। এই নতুন তথ্যই সম্ভাবনার অনুপাত পরিবর্তন করে দেয়।"
          mathProof={`P(দরজা ১-এ কার) = ১/৩
P(দরজা ২ বা ৩-এ কার) = ২/৩

আপনি দরজা ১ বেছে নিয়েছেন।
হোস্ট দরজা ৩ খুলে একটি ছাগল দেখালেন।

বেয়েসের থিওরেম (Bayes' Theorem) অনুযায়ী:
P(দরজা ২-এ কার | হোস্ট দরজা ৩ খুললেন) = ২/৩ (৬৬.৭%)
P(দরজা ১-এ কার | হোস্ট দরজা ৩ খুললেন) = ১/৩ (৩৩.৩%)`}
          realWorld="গেম থিওরি ও ফাইন্যান্সিয়াল ইনফরমেশন ডাইনামিক্স! শেয়ার বাজারে বা চিকিৎসায় যখন একজন অভিজ্ঞ তথ্যদাতা নতুন কোনো অপশন বাদ দেন, তখন অপরীক্ষিত অন্য অপশনগুলোর মূল্য স্বয়ংক্রিয়ভাবে বৃদ্ধি পায়।"
        />

      </div>
    </section>
  );
}
