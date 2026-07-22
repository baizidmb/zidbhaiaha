import { stepParrondoGameA, stepParrondoGameB, generateBirthdayTrial, playStPetersburgGame, playNewcombsGame } from './paradoxMath.js';

export function runMontyHallSimulationAsync(totalTrials = 10000, onProgress, onComplete) {
  let trialsCompleted = 0;
  let switchWins = 0;
  let stayWins = 0;
  const chunkSize = 400;

  function processChunk() {
    const end = Math.min(trialsCompleted + chunkSize, totalTrials);

    for (let i = trialsCompleted; i < end; i++) {
      const carDoor = Math.floor(Math.random() * 3);
      const playerChoice = Math.floor(Math.random() * 3);

      if (playerChoice === carDoor) {
        stayWins++;
      } else {
        switchWins++;
      }
    }

    trialsCompleted = end;
    const progress = Math.floor((trialsCompleted / totalTrials) * 100);

    const currentStats = {
      trialsCompleted,
      totalTrials,
      switchWins,
      stayWins,
      switchWinRate: +((switchWins / trialsCompleted) * 100).toFixed(2),
      stayWinRate: +((stayWins / trialsCompleted) * 100).toFixed(2)
    };

    if (onProgress) onProgress(progress, currentStats);

    if (trialsCompleted < totalTrials) {
      requestAnimationFrame(processChunk);
    } else {
      if (onComplete) onComplete(currentStats);
    }
  }

  requestAnimationFrame(processChunk);
}

export function runStPetersburgSimulationAsync(totalGames = 10000, onProgress, onComplete) {
  let gamesPlayed = 0;
  let totalPayout = 0;
  let maxPayout = 0;
  const chunkSize = 500;

  function processChunk() {
    const end = Math.min(gamesPlayed + chunkSize, totalGames);

    for (let i = gamesPlayed; i < end; i++) {
      const { payout } = playStPetersburgGame();
      totalPayout += payout;
      if (payout > maxPayout) maxPayout = payout;
    }

    gamesPlayed = end;
    const progress = Math.floor((gamesPlayed / totalGames) * 100);
    const avgPayout = +(totalPayout / gamesPlayed).toFixed(2);

    const snapshot = {
      gamesPlayed,
      totalGames,
      totalPayout,
      maxPayout,
      avgPayout
    };

    if (onProgress) onProgress(progress, snapshot);

    if (gamesPlayed < totalGames) {
      requestAnimationFrame(processChunk);
    } else {
      if (onComplete) onComplete(snapshot);
    }
  }

  requestAnimationFrame(processChunk);
}

export function runNewcombsSimulationAsync(totalTrials = 10000, onProgress, onComplete) {
  let trialsDone = 0;
  let boxBWins = 0;
  let bothWins = 0;
  let boxBTotalWon = 0;
  let bothTotalWon = 0;
  const chunkSize = 500;

  function processChunk() {
    const end = Math.min(trialsDone + chunkSize, totalTrials);

    for (let i = trialsDone; i < end; i++) {
      const resB = playNewcombsGame('boxB', 0.99);
      const resBoth = playNewcombsGame('both', 0.99);

      boxBTotalWon += resB.totalWon;
      bothTotalWon += resBoth.totalWon;

      if (resB.totalWon > 0) boxBWins++;
      if (resBoth.totalWon > 1000) bothWins++;
    }

    trialsDone = end;
    const progress = Math.floor((trialsDone / totalTrials) * 100);

    const snapshot = {
      trialsDone,
      totalTrials,
      avgBoxB: Math.round(boxBTotalWon / trialsDone),
      avgBoth: Math.round(bothTotalWon / trialsDone)
    };

    if (onProgress) onProgress(progress, snapshot);

    if (trialsDone < totalTrials) {
      requestAnimationFrame(processChunk);
    } else {
      if (onComplete) onComplete(snapshot);
    }
  }

  requestAnimationFrame(processChunk);
}

export function runParrondoSimulationAsync(totalSteps = 200, onProgress, onComplete) {
  let step = 0;
  let capA = 0;
  let capB = 0;
  let capAlt = 0;

  const historyA = [0];
  const historyB = [0];
  const historyAlt = [0];
  const labels = [0];

  const chunkSize = 25;

  function processChunk() {
    const end = Math.min(step + chunkSize, totalSteps);

    for (let s = step + 1; s <= end; s++) {
      capA = stepParrondoGameA(capA);
      historyA.push(capA);

      capB = stepParrondoGameB(capB);
      historyB.push(capB);

      if (s % 3 === 1) {
        capAlt = stepParrondoGameA(capAlt);
      } else {
        capAlt = stepParrondoGameB(capAlt);
      }
      historyAlt.push(capAlt);

      labels.push(s);
    }

    step = end;
    const progress = Math.floor((step / totalSteps) * 100);

    const dataSnapshot = {
      step,
      totalSteps,
      labels: [...labels],
      gameA: [...historyA],
      gameB: [...historyB],
      alternating: [...historyAlt],
      finalCapA: capA,
      finalCapB: capB,
      finalCapAlt: capAlt
    };

    if (onProgress) onProgress(progress, dataSnapshot);

    if (step < totalSteps) {
      requestAnimationFrame(processChunk);
    } else {
      if (onComplete) onComplete(dataSnapshot);
    }
  }

  requestAnimationFrame(processChunk);
}

export function runBirthdayMonteCarloAsync(groupSize = 23, numTrials = 1000, onProgress, onComplete) {
  let trialsDone = 0;
  let matchCount = 0;
  const chunkSize = 100;

  function processChunk() {
    const end = Math.min(trialsDone + chunkSize, numTrials);

    for (let i = trialsDone; i < end; i++) {
      const trial = generateBirthdayTrial(groupSize);
      if (trial.hasMatch) {
        matchCount++;
      }
    }

    trialsDone = end;
    const progress = Math.floor((trialsDone / numTrials) * 100);
    const empiricalRate = +((matchCount / trialsDone) * 100).toFixed(2);

    const snapshot = {
      groupSize,
      trialsDone,
      numTrials,
      matchCount,
      empiricalRate
    };

    if (onProgress) onProgress(progress, snapshot);

    if (trialsDone < numTrials) {
      requestAnimationFrame(processChunk);
    } else {
      if (onComplete) onComplete(snapshot);
    }
  }

  requestAnimationFrame(processChunk);
}
