import React, { useState, useEffect } from 'react';
import { DoorClosed, RotateCcw, Play, BarChart, Sparkles, Check, X, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import StatCard from './StatCard.js';
import ExplainerDrawer from './ExplainerDrawer.js';
import { runMontyHallSimulationAsync } from '../utils/simulationEngine.js';
import { playClickSound, playDoorOpenSound, playWinFanfare } from '../utils/sound.js';
import { Bar } from 'react-chartjs-2';
export default function MontyHall({
  lang = 'bn'
}) {
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
  const isBn = lang === 'bn';
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
    labels: isBn ? ['সুইচ করার কৌশল', 'একই দরজায় থাকার কৌশল'] : ['Switch Strategy', 'Stay Strategy'],
    datasets: [{
      label: isBn ? 'জেতার হার (%)' : 'Win Rate (%)',
      data: [simStats.switchWinRate, simStats.stayWinRate],
      backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)'],
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
          label: ctx => `${ctx.parsed.y}%`
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
    className: "glass-card rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400"
  }, /*#__PURE__*/React.createElement(DoorClosed, {
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight"
  }, isBn ? '🚗 গেম শো ফাঁদ (The Game Show Trap)' : '🚗 The Game Show Trap')), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs sm:text-sm mt-1 font-medium"
  }, isBn ? 'আপনি কি দরজা পরিবর্তন করবেন নাকি নিজের প্রথম পছন্দে থাকবেন?' : 'Would you SWITCH doors or STAY with your initial pick?')), /*#__PURE__*/React.createElement("button", {
    onClick: resetGame,
    className: "flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all touch-manipulation"
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'নতুন গেম খেলুন' : 'Play New Game'))), /*#__PURE__*/React.createElement("div", {
    className: "glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center"
  }, gameState === 'pick' && /*#__PURE__*/React.createElement("p", {
    className: "text-sm sm:text-base font-bold text-blue-400 flex items-center justify-center space-x-2"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-5 h-5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, isBn ? 'ধাপ ১: আপনার ভাগ্যবান দরজাটি বেছে নিন!' : 'Step 1: Choose your lucky door!')), gameState === 'revealed' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm font-bold text-amber-400"
  }, isBn ? `🐐 হোস্ট দরজা #${hostRevealedDoor + 1} খুলে ছাগল দেখিয়েছেন! আপনি কি সুইচ করবেন নাকি থাকবেন?` : `🐐 Host opens Door #${hostRevealedDoor + 1} showing a Goat! Will you SWITCH or STAY?`), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleFinalDecision(true),
    className: "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-glow-blue transition-all touch-manipulation"
  }, isBn ? 'দরজা সুইচ করুন! (প্রস্তাবিত - ৬৬.৭%)' : 'SWITCH DOOR! (Recommended)'), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleFinalDecision(false),
    className: "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 touch-manipulation"
  }, isBn ? 'প্রথম পছন্দতেই থাকুন (৩৩.৩%)' : 'STAY WITH INITIAL PICK'))), gameState === 'finished' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-xs sm:text-sm font-black px-4 py-1.5 rounded-xl ${isWin ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'}`
  }, isWin ? isBn ? '🎉 অভিনন্দন! আপনি নতুন স্পোর্টস কার 🚗 জিতেছেন!' : '🎉 CONGRATULATIONS! YOU WON THE SPORTS CAR 🚗!' : isBn ? '🐐 দুর্ভাগ্য! আপনি ছাগল পেয়েছেন!' : '🐐 BAD LUCK! YOU GOT A GOAT!'), /*#__PURE__*/React.createElement("button", {
    onClick: resetGame,
    className: "px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
  }, isBn ? 'আবার খেলুন' : 'Play Again'))), /*#__PURE__*/React.createElement("div", {
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
        label: isBn ? 'ছাগল' : 'GOAT',
        bg: 'bg-amber-950/60 border-amber-600/40'
      };
    } else if (gameState === 'finished') {
      doorContent = isCar ? {
        icon: '🚗',
        label: isBn ? 'নতুন কার!' : 'SPORTS CAR!',
        bg: 'bg-emerald-950/80 border-emerald-500 shadow-glow-emerald'
      } : {
        icon: '🐐',
        label: isBn ? 'ছাগল' : 'GOAT',
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
    }, "DOOR #", doorIdx + 1), isUserInitialPick && /*#__PURE__*/React.createElement("span", {
      className: "text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40"
    }, isBn ? 'পছন্দ' : 'Pick')), /*#__PURE__*/React.createElement("div", {
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
    }, isBn ? 'ক্লিক করুন' : 'Click to pick'))), /*#__PURE__*/React.createElement("div", {
      className: "w-full text-center"
    }, isFinalChosen && gameState === 'finished' && /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-lg ${isWin ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`
    }, isWin ? isBn ? 'বিজয়ী!' : 'WINNER!' : isBn ? 'ছাগল' : 'GOAT')));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "সুইচ করলে জেতার হার" : "Switch Strategy Win Chance",
    value: `${simStats.switchWinRate}%`,
    subtext: isBn ? "সর্বদা সুইচ করলে ৬৬.৭% জয়ের সুযোগ!" : "Always switching doubles your win chance!",
    icon: Check,
    color: "blue",
    highlight: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: isBn ? "একই দরজায় থাকলে জেতার হার" : "Stay Strategy Win Chance",
    value: `${simStats.stayWinRate}%`,
    subtext: isBn ? "প্রথম পছন্দে থাকলে মাত্র ৩৩.৩% সুযোগ!" : "Staying keeps only your initial 1/3 luck!",
    icon: X,
    color: "purple"
  })), /*#__PURE__*/React.createElement("details", {
    className: "group border border-slate-800/80 rounded-2xl bg-slate-900/60 overflow-hidden"
  }, /*#__PURE__*/React.createElement("summary", {
    className: "px-5 py-4 flex items-center justify-between cursor-pointer font-bold text-sm text-slate-200 hover:bg-slate-800/60 transition-colors"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("span", null, isBn ? '১০,০০০ অটো-সিমুলেশন প্রমাণ ও গ্রাফ দেখুন (Deep Dive)' : 'View 10,000 Auto-Simulation Proof & Chart')), /*#__PURE__*/React.createElement(ChevronDown, {
    className: "w-4 h-4 transition-transform group-open:rotate-180 text-slate-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-800 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-300 uppercase tracking-wider"
  }, isBn ? '১০,০০০ ট্রায়াল সিমুলেশন রেজাল্ট' : '10,000 Trial Simulation Engine'), /*#__PURE__*/React.createElement("button", {
    onClick: handleRun10kSims,
    disabled: isSimulating,
    className: "flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple"
  }, /*#__PURE__*/React.createElement(Play, {
    className: `w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`
  }), /*#__PURE__*/React.createElement("span", null, isSimulating ? `${simProgress}%` : isBn ? 'সিমুলেশন চালান' : 'Run 10,000 Sims'))), /*#__PURE__*/React.createElement("div", {
    className: "h-[220px] relative"
  }, /*#__PURE__*/React.createElement(Bar, {
    data: chartData,
    options: chartOptions
  })))), /*#__PURE__*/React.createElement(ExplainerDrawer, {
    title: isBn ? "গেম শো ফাঁদ (The Game Show Trap)" : "The Game Show Trap",
    eli5: isBn ? "খেলা শুরুতেই আপনি ১টি দরজা বেছে নিলে গাড়িটি জেতার সম্ভাবনা ছিল ১/৩ এবং বাকি দুটি দরজায় গাড়ি থাকার সম্ভাবনা ছিল ২/৩। হোস্ট মন্টি যখন নিশ্চিতভাবে ১টি ছাগল থাকা দরজা খুলে দেন, তিনি আপনার আগের ১/৩ ভাগ্য পরিবর্তন করেন না—তিনি বাকি ২/৩ সম্ভাবনা পুরোটাই না খোলা অন্য দরজাটিতে শিফট করে দেন!" : "When you pick a door at the start, you have a 1 in 3 chance of picking the car, and a 2 in 3 chance that the car is behind one of the OTHER two doors. When Monty opens a goat door, he doesn't change your initial 1/3 luck—he concentrates the entire remaining 2/3 probability into the unopened door!",
    intuitionTrap: isBn ? "আমরা ভাবি: 'এখন তো ২টি দরজা বাকি রয়েছে, তাই সম্ভাবনা ৫০/৫০ হওয়া উচিত।' কিন্তু মন্টি র্যান্ডমভাবে দরজা খোলেননি! মন্টি জানেন কোথায় গাড়ি রয়েছে এবং তিনি ছাগল দেখাতে বাধ্য। এই নতুন তথ্যই সম্ভাবনার অনুপাত পরিবর্তন করে দেয়।" : "We think: 'There are 2 doors left, so it must be 50/50.' But Monty didn't open a random door! He KNOWS where the car is and is FORCED to reveal a goat. That key action transfers information to the unchosen door.",
    mathProof: `P(Car in Door 1) = 1/3
P(Car in Door 2 or 3) = 2/3
P(Switch Win) = 2/3 (66.7%)
P(Stay Win) = 1/3 (33.3%)`,
    realWorld: isBn ? "গেম থিওরি ও ফাইন্যান্সিয়াল ইনফরমেশন ডাইনামিক্স! শেয়ার বাজারে বা চিকিৎসায় যখন একজন অভিজ্ঞ তথ্যদাতা নতুন কোনো অপশন বাদ দেন, তখন অপরীক্ষিত অন্য অপশনগুলোর মূল্য স্বয়ংক্রিয়ভাবে বৃদ্ধি পায়।" : "Game Theory and Information Economics! In financial markets, getting new information from an informed agent updates the value of unchosen options."
  })));
}