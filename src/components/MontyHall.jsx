import React, { useState, useEffect } from 'react';
import { DoorClosed, Award, RotateCcw, Play, BarChart, Sparkles, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { runMontyHallSimulationAsync } from '../utils/simulationEngine.js';
import { playClickSound, playDoorOpenSound, playWinFanfare } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';

export default function MontyHall() {
  // Interactive Game State
  // gameState: 'pick' | 'revealed' | 'finished'
  const [gameState, setGameState] = useState('pick');
  const [carDoor, setCarDoor] = useState(0);
  const [userPick, setUserPick] = useState(null);
  const [hostRevealedDoor, setHostRevealedDoor] = useState(null);
  const [finalChoice, setFinalChoice] = useState(null);
  const [isWin, setIsWin] = useState(false);

  // Auto-simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simStats, setSimStats] = useState({
    switchWins: 6670,
    stayWins: 3330,
    switchWinRate: 66.7,
    stayWinRate: 33.3,
    totalTrials: 10000
  });

  // Start / Reset interactive game
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

  // Step 1: User picks door
  const handleDoorPick = (doorIdx) => {
    if (gameState !== 'pick') return;
    playClickSound();
    setUserPick(doorIdx);

    // Host reveals a goat door that is neither user pick nor car door
    const availableGoatDoors = [0, 1, 2].filter(
      (d) => d !== doorIdx && d !== carDoor
    );
    // Pick one random goat door to reveal
    const hostChoice = availableGoatDoors[Math.floor(Math.random() * availableGoatDoors.length)];
    setHostRevealedDoor(hostChoice);
    setGameState('revealed');
    playDoorOpenSound();
  };

  // Step 2: User decides to Switch or Stay
  const handleFinalDecision = (shouldSwitch) => {
    if (gameState !== 'revealed') return;
    playClickSound();

    let choice = userPick;
    if (shouldSwitch) {
      // Find remaining unchosen unopened door
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

  // Run 10,000 Auto-Simulations (Async Batching)
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

  // Chart setup
  const chartData = {
    labels: ['Switch Strategy', 'Stay Strategy'],
    datasets: [
      {
        label: 'Win Rate (%)',
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
          label: (ctx) => `Win Rate: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      y: { min: 0, max: 100, ticks: { callback: (v) => `${v}%` } }
    }
  };

  return (
    <section id="monty" className="py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <DoorClosed className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                The Monty Hall Problem
              </h2>
            </div>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              Always switch doors! Switching doubles your chance of winning from <span className="text-purple-400 font-bold">1/3 (33.3%)</span> to <span className="text-blue-400 font-bold">2/3 (66.7%)</span>.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetGame}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Doors</span>
            </button>

            <button
              onClick={handleRun10kSims}
              disabled={isSimulating}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-glow-purple transition-all duration-200 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? `${simProgress}% Simulating` : 'Run 10,000 Auto-Simulations'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive 3-Door Stage (7 Cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            
            {/* Game Stage Prompt Banner */}
            <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              {gameState === 'pick' && (
                <p className="text-sm sm:text-base font-bold text-blue-400 flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Step 1: Click any door to pick your prize door!</span>
                </p>
              )}
              {gameState === 'revealed' && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-amber-400">
                    🐐 Host revealed a GOAT behind Door #{hostRevealedDoor + 1}!
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => handleFinalDecision(true)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-glow-blue transition-all transform hover:scale-105"
                    >
                      SWITCH DOOR! (Recommended)
                    </button>
                    <button
                      onClick={() => handleFinalDecision(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700"
                    >
                      STAY WITH DOOR #{userPick + 1}
                    </button>
                  </div>
                </div>
              )}
              {gameState === 'finished' && (
                <div className="flex items-center justify-center space-x-3">
                  <span className={`text-base font-black px-4 py-1.5 rounded-xl ${
                    isWin ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}>
                    {isWin ? '🎉 CONGRATULATIONS! YOU WON THE SPORTS CAR 🚗!' : '🐐 BAD LUCK! YOU GOT A GOAT!'}
                  </span>
                  <button
                    onClick={resetGame}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>

            {/* 3 Animated Door Cards */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 my-4">
              {[0, 1, 2].map((doorIdx) => {
                const isUserInitialPick = userPick === doorIdx;
                const isHostRevealed = hostRevealedDoor === doorIdx;
                const isFinalChosen = finalChoice === doorIdx;
                const isCar = carDoor === doorIdx;

                let doorContent = null;
                if (gameState === 'revealed' && isHostRevealed) {
                  doorContent = { icon: '🐐', label: 'GOAT', bg: 'bg-amber-950/60 border-amber-600/40' };
                } else if (gameState === 'finished') {
                  doorContent = isCar
                    ? { icon: '🚗', label: 'SPORTS CAR!', bg: 'bg-emerald-950/80 border-emerald-500 shadow-glow-emerald' }
                    : { icon: '🐐', label: 'GOAT', bg: 'bg-slate-900 border-slate-800 opacity-60' };
                }

                return (
                  <div
                    key={doorIdx}
                    onClick={() => handleDoorPick(doorIdx)}
                    className={`relative rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between min-h-[220px] select-none ${
                      gameState === 'pick'
                        ? 'bg-slate-900/90 border-slate-700 hover:border-blue-500 hover:shadow-glow-blue transform hover:-translate-y-1'
                        : isUserInitialPick && gameState === 'revealed'
                        ? 'bg-blue-950/60 border-blue-500 shadow-glow-blue'
                        : doorContent
                        ? doorContent.bg
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs font-bold text-slate-400">DOOR #{doorIdx + 1}</span>
                      {isUserInitialPick && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          Initial Pick
                        </span>
                      )}
                    </div>

                    {/* Door Icon / Prize Reveal */}
                    <div className="my-6 text-center">
                      {doorContent ? (
                        <div className="space-y-2 animate-bounce">
                          <span className="text-5xl">{doorContent.icon}</span>
                          <p className="text-xs font-black text-slate-200 tracking-wider">{doorContent.label}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <DoorClosed className="w-16 h-16 text-slate-500 group-hover:text-blue-400 transition-colors" />
                          <span className="text-xs text-slate-400 font-medium">Click to choose</span>
                        </div>
                      )}
                    </div>

                    {/* Status Tag */}
                    <div className="w-full text-center">
                      {isFinalChosen && gameState === 'finished' && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isWin ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`}>
                          {isWin ? 'WINNER!' : 'GOT GOAT'}
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Strategy Comparison Stat Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <StatCard
                label="Switch Strategy Win Rate"
                value={`${simStats.switchWinRate}%`}
                subtext="~66.7% Theoretical Win Chance"
                icon={Check}
                color="blue"
                highlight={true}
              />
              <StatCard
                label="Stay Strategy Win Rate"
                value={`${simStats.stayWinRate}%`}
                subtext="~33.3% Theoretical Win Chance"
                icon={X}
                color="purple"
              />
            </div>

          </div>

          {/* Right: Live 10,000 Auto-Simulation Chart (5 Cols) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <BarChart className="w-4 h-4 text-purple-400" />
                  <span>10,000 Trial Simulation Engine</span>
                </h3>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {simStats.totalTrials.toLocaleString()} Trials
                </span>
              </div>

              {/* Progress Bar during simulation */}
              {isSimulating && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
                    <span>Simulating trial loop...</span>
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

              {/* Chart */}
              <div className="min-h-[260px] relative my-4">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1.5 font-medium">
              <div className="flex justify-between text-slate-200 font-bold">
                <span>Switch Wins:</span>
                <span className="text-blue-400 font-mono">{simStats.switchWins.toLocaleString()} / {simStats.totalTrials.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-200 font-bold">
                <span>Stay Wins:</span>
                <span className="text-purple-400 font-mono">{simStats.stayWins.toLocaleString()} / {simStats.totalTrials.toLocaleString()}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Explainer Drawer */}
        <ExplainerDrawer
          title="The Monty Hall Problem"
          eli5="When you pick a door at the start, you have a 1 in 3 chance of picking the car, and a 2 in 3 chance that the car is behind one of the OTHER two doors. When Monty opens a goat door, he doesn't change your initial 1/3 luck—he concentrates the entire remaining 2/3 probability into the unopened door!"
          intuitionTrap="We think: 'There are 2 doors left, so it must be 50/50.' But Monty's choice wasn't random! He KNOWS where the car is and is FORCED to reveal a goat. That key action transfers information to the unchosen door."
          mathProof={`P(Car behind Door 1) = 1/3
P(Car behind Door 2 or Door 3) = 2/3

Suppose you pick Door 1.
Host opens Door 3 revealing a Goat (since P(Host reveals Goat | Car in Door 1) = 1/2, P(Host reveals Door 3 | Car in Door 2) = 1).

By Bayes' Theorem:
P(Car in Door 2 | Host opens Door 3) = (1 * 1/3) / (1/2) = 2/3 (66.7%)
P(Car in Door 1 | Host opens Door 3) = 1/3 (33.3%)`}
          realWorld="Game Theory and Information Economics! In financial markets and decision making, getting new information from an informed agent (like Monty) updates the value of unchosen assets."
        />

      </div>
    </section>
  );
}
