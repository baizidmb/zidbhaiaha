import React, { useState, useEffect } from 'react';
import { DoorClosed, RotateCcw, Play, BarChart, Sparkles, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
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
  const handleDoorPick = doorIdx => {
    if (gameState !== 'pick') return;
    playClickSound();
    setUserPick(doorIdx);
    const availableGoatDoors = [0, 1, 2].filter(d => d !== doorIdx && d !== carDoor);
    const hostChoice = availableGoatDoors[Math.floor(Math.random() * availableGoatDoors.length)];
    setHostRevealedDoor(hostChoice);
    setGameState('revealed');
    playDoorOpenSound();
  };
  const handleFinalDecision = shouldSwitch => {
    if (gameState !== 'revealed') return;
    playClickSound();
    let choice = userPick;
    if (shouldSwitch) {
      choice = [0, 1, 2].find(d => d !== userPick && d !== hostRevealedDoor);
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
          origin: {
            y: 0.6
          }
        });
      } catch (e) {}
    }
  };
  const handleRun10kSims = () => {
    playClickSound();
    setIsSimulating(true);
    setSimProgress(0);
    runMontyHallSimulationAsync(10000, (progress, snapshot) => {
      setSimProgress(progress);
      setSimStats(snapshot);
    }, finalSnapshot => {
      setSimStats(finalSnapshot);
      setIsSimulating(false);
    });
  };
  const chartData = {
    labels: ['সুইচ করার কৌশল', 'একই দরজায় থাকার কৌশল'],
    datasets: [{
      label: 'জেতার হার (%)',
      data: [simStats.switchWinRate, simStats.stayWinRate],
      backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(139, 92, 246, 0.7)'],
      borderColor: ['#3B82F6', '#8B5CF6'],
      borderWidth: 2,
      borderRadius: 12
    }]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: ctx => `জেতার হার: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: v => `${v}%`
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "monty",
    className: "py-6 sm:py-8 scroll-mt-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 sm:p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400"
  }, /*#__PURE__*/React.createElement(DoorClosed, {
    className: "w-5 h-5 sm:w-6 sm:h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, "\u09AE\u09A8\u09CD\u099F\u09BF \u09B9\u09B2 \u09AA\u09CD\u09B0\u09AC\u09B2\u09C7\u09AE (Monty Hall Problem)")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-sm mt-1.5 font-medium"
  }, "\u09B8\u09B0\u09CD\u09AC\u09A6\u09BE \u09B8\u09C1\u09AF\u09CB\u0997 \u09A6\u09C7\u0993\u09DF\u09BE \u09B9\u09B2\u09C7 \u09A6\u09B0\u099C\u09BE \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09C1\u09A8! \u09B8\u09C1\u0987\u099A \u0995\u09B0\u09B2\u09C7 \u099C\u09C7\u09A4\u09BE\u09B0 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE ", /*#__PURE__*/React.createElement("span", {
    className: "text-purple-400 font-bold"
  }, "\u09E7/\u09E9 (\u09E9\u09E9.\u09E9%)"), " \u09A5\u09C7\u0995\u09C7 \u09A6\u09CD\u09AC\u09BF\u0997\u09C1\u09A3 \u09AC\u09C7\u09DC\u09C7 ", /*#__PURE__*/React.createElement("span", {
    className: "text-blue-400 font-bold"
  }, "\u09E8/\u09E9 (\u09EC\u09EC.\u09ED%)"), " \u09B9\u09DF\u0964")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: resetGame,
    className: "flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all duration-200 touch-manipulation"
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "\u09AA\u09C1\u09A8\u09B0\u09BE\u09DF \u09B6\u09C1\u09B0\u09C1")), /*#__PURE__*/React.createElement("button", {
    onClick: handleRun10kSims,
    disabled: isSimulating,
    className: "flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-glow-purple transition-all duration-200 disabled:opacity-50 touch-manipulation"
  }, /*#__PURE__*/React.createElement(Play, {
    className: `w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`
  }), /*#__PURE__*/React.createElement("span", null, isSimulating ? `${simProgress}%` : '১০,০০০ সিমুলেশন')))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center"
  }, gameState === 'pick' && /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-base font-bold text-blue-400 flex items-center justify-center space-x-2"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "\u09A7\u09BE\u09AA \u09E7: \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09E7\u099F\u09BF \u09A6\u09B0\u099C\u09BE\u09DF \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u099B\u09A8\u09CD\u09A6\u09C7\u09B0 \u09A6\u09B0\u099C\u09BE \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8!")), gameState === 'revealed' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5 sm:space-y-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm font-bold text-amber-400"
  }, "\uD83D\uDC10 \u09B9\u09CB\u09B8\u09CD\u099F \u09A6\u09B0\u099C\u09BE #", hostRevealedDoor + 1, " \u0996\u09C1\u09B2\u09C7 \u098F\u0995\u099F\u09BF \u099B\u09BE\u0997\u09B2 \u09A6\u09C7\u0996\u09BF\u09DF\u09C7\u099B\u09C7\u09A8! \u0986\u09AA\u09A8\u09BF \u0995\u09BF \u09A6\u09B0\u099C\u09BE \u09B8\u09C1\u0987\u099A \u0995\u09B0\u09AC\u09C7\u09A8?"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleFinalDecision(true),
    className: "w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-glow-blue transition-all touch-manipulation"
  }, "\u09A6\u09B0\u099C\u09BE \u09B8\u09C1\u0987\u099A \u0995\u09B0\u09C1\u09A8! (\u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09BE\u09AC\u09BF\u09A4 - \u09EC\u09EC.\u09ED%)"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleFinalDecision(false),
    className: "w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 touch-manipulation"
  }, "\u09AA\u09CD\u09B0\u09A5\u09AE \u09AA\u099B\u09A8\u09CD\u09A6\u09A4\u09C7\u0987 \u09A5\u09BE\u0995\u09C1\u09A8 (\u09E9\u09E9.\u09E9%)"))), gameState === 'finished' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl ${isWin ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'}`
  }, isWin ? '🎉 অভিনন্দন! আপনি নতুন স্পোর্টস কার 🚗 জিতেছেন!' : '🐐 দুর্ভাগ্য! আপনি ছাগল পেয়েছেন!'), /*#__PURE__*/React.createElement("button", {
    onClick: resetGame,
    className: "px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
  }, "\u0986\u09AC\u09BE\u09B0 \u0996\u09C7\u09B2\u09C1\u09A8"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2.5 sm:gap-6 my-2 sm:my-4"
  }, [0, 1, 2].map(doorIdx => {
    const isUserInitialPick = userPick === doorIdx;
    const isHostRevealed = hostRevealedDoor === doorIdx;
    const isFinalChosen = finalChoice === doorIdx;
    const isCar = carDoor === doorIdx;
    let doorContent = null;
    if (gameState === 'revealed' && isHostRevealed) {
      doorContent = {
        icon: '🐐',
        label: 'ছাগল',
        bg: 'bg-amber-950/60 border-amber-600/40'
      };
    } else if (gameState === 'finished') {
      doorContent = isCar ? {
        icon: '🚗',
        label: 'নতুন কার!',
        bg: 'bg-emerald-950/80 border-emerald-500 shadow-glow-emerald'
      } : {
        icon: '🐐',
        label: 'ছাগল',
        bg: 'bg-slate-900 border-slate-800 opacity-60'
      };
    }
    return /*#__PURE__*/React.createElement("div", {
      key: doorIdx,
      onClick: () => handleDoorPick(doorIdx),
      className: `relative rounded-xl sm:rounded-2xl p-2.5 sm:p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between min-h-[170px] sm:min-h-[220px] select-none touch-manipulation ${gameState === 'pick' ? 'bg-slate-900/90 border-slate-700 hover:border-blue-500 hover:shadow-glow-blue' : isUserInitialPick && gameState === 'revealed' ? 'bg-blue-950/60 border-blue-500 shadow-glow-blue' : doorContent ? doorContent.bg : 'bg-slate-900/60 border-slate-800'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between w-full"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-[10px] sm:text-xs font-bold text-slate-400"
    }, "\u09A6\u09B0\u099C\u09BE #", doorIdx + 1), isUserInitialPick && /*#__PURE__*/React.createElement("span", {
      className: "text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40"
    }, "\u09AA\u099B\u09A8\u09CD\u09A6")), /*#__PURE__*/React.createElement("div", {
      className: "my-2 sm:my-6 text-center"
    }, doorContent ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-1 sm:space-y-2 animate-bounce"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-3xl sm:text-5xl"
    }, doorContent.icon), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] sm:text-xs font-black text-slate-200 tracking-wider"
    }, doorContent.label)) : /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col items-center space-y-1 sm:space-y-2"
    }, /*#__PURE__*/React.createElement(DoorClosed, {
      className: "w-10 h-10 sm:w-16 sm:h-16 text-slate-500"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] sm:text-xs text-slate-400 font-medium"
    }, "\u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8"))), /*#__PURE__*/React.createElement("div", {
      className: "w-full text-center"
    }, isFinalChosen && gameState === 'finished' && /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-lg ${isWin ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`
    }, isWin ? 'বিজয়ী!' : 'ছাগল')));
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 sm:gap-4 mt-4"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "\u09B8\u09C1\u0987\u099A \u0995\u09B0\u09B2\u09C7 \u099C\u09C7\u09A4\u09BE\u09B0 \u09B9\u09BE\u09B0",
    value: `${simStats.switchWinRate}%`,
    subtext: "~\u09EC\u09EC.\u09ED% \u0997\u09BE\u09A3\u09BF\u09A4\u09BF\u0995 \u09A8\u09BF\u09B6\u09CD\u099A\u09DF\u09A4\u09BE",
    icon: Check,
    color: "blue",
    highlight: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\u098F\u0995\u0987 \u09A6\u09B0\u099C\u09BE\u09DF \u09A5\u09BE\u0995\u09B2\u09C7 \u09B9\u09BE\u09B0",
    value: `${simStats.stayWinRate}%`,
    subtext: "~\u09E9\u09E9.\u09E9% \u0997\u09BE\u09A3\u09BF\u09A4\u09BF\u0995 \u099C\u09C7\u09A4\u09BE\u09B0 \u09B8\u09C1\u09AF\u09CB\u0997",
    icon: X,
    color: "purple"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(BarChart, {
    className: "w-4 h-4 text-purple-400"
  }), /*#__PURE__*/React.createElement("span", null, "\u09E7\u09E6,\u09E6\u09E6\u09E6 \u099F\u09CD\u09B0\u09BE\u09AF\u09BC\u09BE\u09B2 \u0985\u099F\u09CB-\u09B8\u09BF\u09AE\u09C1\u09B2\u09C7\u09B6\u09A8")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] sm:text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"
  }, "\u09E7\u09E6,\u09E6\u09E6\u09E6 \u09B8\u09BF\u09AE\u09C1\u09B2\u09C7\u09B6\u09A8")), isSimulating && /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-xs text-slate-400 font-mono mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u09B8\u09BF\u09AE\u09C1\u09B2\u09C7\u09B6\u09A8 \u099A\u09B2\u099B\u09C7..."), /*#__PURE__*/React.createElement("span", null, simProgress, "%")), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-2 bg-slate-800 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150",
    style: {
      width: `${simProgress}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "min-h-[200px] sm:min-h-[260px] relative my-2"
  }, /*#__PURE__*/React.createElement(Bar, {
    data: chartData,
    options: chartOptions
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1.5 font-medium mt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-slate-200 font-bold"
  }, /*#__PURE__*/React.createElement("span", null, "\u09B8\u09C1\u0987\u099A \u0995\u09B0\u09C7 \u099C\u09DF:"), /*#__PURE__*/React.createElement("span", {
    className: "text-blue-400 font-mono"
  }, simStats.switchWins.toLocaleString(), " \u099F\u09BF \u09AE\u09CD\u09AF\u09BE\u099A")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-slate-200 font-bold"
  }, /*#__PURE__*/React.createElement("span", null, "\u09A5\u09BE\u0995\u09B2\u09C7 \u099C\u09DF:"), /*#__PURE__*/React.createElement("span", {
    className: "text-purple-400 font-mono"
  }, simStats.stayWins.toLocaleString(), " \u099F\u09BF \u09AE\u09CD\u09AF\u09BE\u099A"))))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: "\u09AE\u09A8\u09CD\u099F\u09BF \u09B9\u09B2 \u09AA\u09CD\u09B0\u09AC\u09B2\u09C7\u09AE (Monty Hall Problem)",
    eli5: "\u0996\u09C7\u09B2\u09BE \u09B6\u09C1\u09B0\u09C1\u09A4\u09C7\u0987 \u0986\u09AA\u09A8\u09BF \u09E7\u099F\u09BF \u09A6\u09B0\u099C\u09BE \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09B2\u09C7 \u0997\u09BE\u09DC\u09BF\u099F\u09BF \u099C\u09C7\u09A4\u09BE\u09B0 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE \u099B\u09BF\u09B2 \u09E7/\u09E9 \u098F\u09AC\u0982 \u09AC\u09BE\u0995\u09BF \u09A6\u09C1\u099F\u09BF \u09A6\u09B0\u099C\u09BE\u09DF \u0997\u09BE\u09DC\u09BF \u09A5\u09BE\u0995\u09BE\u09B0 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE \u099B\u09BF\u09B2 \u09E8/\u09E9\u0964 \u09B9\u09CB\u09B8\u09CD\u099F \u09AE\u09A8\u09CD\u099F\u09BF \u09AF\u0996\u09A8 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4\u09AD\u09BE\u09AC\u09C7 \u09E7\u099F\u09BF \u099B\u09BE\u0997\u09B2 \u09A5\u09BE\u0995\u09BE \u09A6\u09B0\u099C\u09BE \u0996\u09C1\u09B2\u09C7 \u09A6\u09C7\u09A8, \u09A4\u09BF\u09A8\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u0986\u0997\u09C7\u09B0 \u09E7/\u09E9 \u09AD\u09BE\u0997\u09CD\u09AF \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09C7\u09A8 \u09A8\u09BE\u2014\u09A4\u09BF\u09A8\u09BF \u09AC\u09BE\u0995\u09BF \u09E8/\u09E9 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE \u09AA\u09C1\u09B0\u09CB\u099F\u09BE\u0987 \u09A8\u09BE \u0996\u09CB\u09B2\u09BE \u0985\u09A8\u09CD\u09AF \u09A6\u09B0\u099C\u09BE\u099F\u09BF\u09A4\u09C7 \u09B6\u09BF\u09AB\u099F \u0995\u09B0\u09C7 \u09A6\u09C7\u09A8!",
    intuitionTrap: "\u0986\u09AE\u09B0\u09BE \u09AD\u09BE\u09AC\u09BF: '\u098F\u0996\u09A8 \u09A4\u09CB \u09E8\u099F\u09BF \u09A6\u09B0\u099C\u09BE \u09AC\u09BE\u0995\u09BF \u09B0\u09DF\u09C7\u099B\u09C7, \u09A4\u09BE\u0987 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE \u09EB\u09E6/\u09EB\u09E6 \u09B9\u0993\u09DF\u09BE \u0989\u099A\u09BF\u09A4\u0964' \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09AE\u09A8\u09CD\u099F\u09BF \u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1\u09AE\u09AD\u09BE\u09AC\u09C7 \u09A6\u09B0\u099C\u09BE \u0996\u09CB\u09B2\u09C7\u09A8\u09A8\u09BF! \u09AE\u09A8\u09CD\u099F\u09BF \u099C\u09BE\u09A8\u09C7\u09A8 \u0995\u09CB\u09A5\u09BE\u09DF \u0997\u09BE\u09DC\u09BF \u09B0\u09DF\u09C7\u099B\u09C7 \u098F\u09AC\u0982 \u09A4\u09BF\u09A8\u09BF \u099B\u09BE\u0997\u09B2 \u09A6\u09C7\u0996\u09BE\u09A4\u09C7 \u09AC\u09BE\u09A7\u09CD\u09AF\u0964 \u098F\u0987 \u09A8\u09A4\u09C1\u09A8 \u09A4\u09A5\u09CD\u09AF\u0987 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09A8\u09BE\u09B0 \u0985\u09A8\u09C1\u09AA\u09BE\u09A4 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09C7 \u09A6\u09C7\u09DF\u0964",
    mathProof: `P(দরজা ১-এ কার) = ১/৩
P(দরজা ২ বা ৩-এ কার) = ২/৩

আপনি দরজা ১ বেছে নিয়েছেন।
হোস্ট দরজা ৩ খুলে একটি ছাগল দেখালেন।

বেয়েসের থিওরেম (Bayes' Theorem) অনুযায়ী:
P(দরজা ২-এ কার | হোস্ট দরজা ৩ খুললেন) = ২/৩ (৬৬.৭%)
P(দরজা ১-এ কার | হোস্ট দরজা ৩ খুললেন) = ১/৩ (৩৩.৩%)`,
    realWorld: "\u0997\u09C7\u09AE \u09A5\u09BF\u0993\u09B0\u09BF \u0993 \u09AB\u09BE\u0987\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8\u09BF\u09DF\u09BE\u09B2 \u0987\u09A8\u09AB\u09B0\u09AE\u09C7\u09B6\u09A8 \u09A1\u09BE\u0987\u09A8\u09BE\u09AE\u09BF\u0995\u09CD\u09B8! \u09B6\u09C7\u09DF\u09BE\u09B0 \u09AC\u09BE\u099C\u09BE\u09B0\u09C7 \u09AC\u09BE \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE\u09DF \u09AF\u0996\u09A8 \u098F\u0995\u099C\u09A8 \u0985\u09AD\u09BF\u099C\u09CD\u099E \u09A4\u09A5\u09CD\u09AF\u09A6\u09BE\u09A4\u09BE \u09A8\u09A4\u09C1\u09A8 \u0995\u09CB\u09A8\u09CB \u0985\u09AA\u09B6\u09A8 \u09AC\u09BE\u09A6 \u09A6\u09C7\u09A8, \u09A4\u0996\u09A8 \u0985\u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u09BF\u09A4 \u0985\u09A8\u09CD\u09AF \u0985\u09AA\u09B6\u09A8\u0997\u09C1\u09B2\u09CB\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF \u09B8\u09CD\u09AC\u09DF\u0982\u0995\u09CD\u09B0\u09BF\u09DF\u09AD\u09BE\u09AC\u09C7 \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u09AA\u09BE\u09DF\u0964"
  })));
}