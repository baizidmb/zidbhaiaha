/**
 * Asynchronous Non-Blocking Simulation Engine for Aha! Paradox Visualizer
 * Uses requestAnimationFrame batch chunking to keep UI silky smooth during 10,000+ trial loops.
 */

import { stepParrondoGameA, stepParrondoGameB, generateBirthdayTrial } from './paradoxMath.js';

/**
 * Runs Monty Hall Auto-Simulations (Switch vs Stay) over N total trials.
 * @param {number} totalTrials Default 10,000
 * @param {function} onProgress Callback(progressPercent, currentResults)
 * @param {function} onComplete Callback(finalResults)
 */
export function runMontyHallSimulationAsync(totalTrials = 10000, onProgress, onComplete) {
  let trialsCompleted = 0;
  let switchWins = 0;
  let stayWins = 0;
  const chunkSize = 400; // Batch per frame

  function processChunk() {
    const end = Math.min(trialsCompleted + chunkSize, totalTrials);

    for (let i = trialsCompleted; i < end; i++) {
      // Setup prize behind random door (0, 1, 2)
      const carDoor = Math.floor(Math.random() * 3);
      // Player picks random door
      const playerChoice = Math.floor(Math.random() * 3);

      // Stay strategy: wins if initial pick was car
      if (playerChoice === carDoor) {
        stayWins++;
      } else {
        // Switch strategy: host MUST open the other goat door.
        // Remaining unchosen door is guaranteed to be the car!
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

    if (onProgress) {
      onProgress(progress, currentStats);
    }

    if (trialsCompleted < totalTrials) {
      requestAnimationFrame(processChunk);
    } else {
      if (onComplete) {
        onComplete(currentStats);
      }
    }
  }

  requestAnimationFrame(processChunk);
}

/**
 * Runs Parrondo's Paradox trajectories asynchronously.
 * Compares: Strategy 1 (Game A only), Strategy 2 (Game B only), Strategy 3 (Alternating ABBABB...)
 * @param {number} totalSteps Default 100 or 500
 * @param {function} onProgress
 * @param {function} onComplete
 */
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
      // Game A alone
      capA = stepParrondoGameA(capA);
      historyA.push(capA);

      // Game B alone
      capB = stepParrondoGameB(capB);
      historyB.push(capB);

      // Alternating strategy: A, B, B, A, B, B...
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

    if (onProgress) {
      onProgress(progress, dataSnapshot);
    }

    if (step < totalSteps) {
      requestAnimationFrame(processChunk);
    } else {
      if (onComplete) {
        onComplete(dataSnapshot);
      }
    }
  }

  requestAnimationFrame(processChunk);
}

/**
 * Empirical Monte Carlo for Birthday Paradox
 * Runs numTrials room setups for group size n and counts match percentage.
 */
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
