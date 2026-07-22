/**
 * Mathematical Utilities & Numerical Safety for Aha! Paradox Visualizer
 */

export function calculateBirthdayProbability(n) {
  if (n <= 1) return 0;
  if (n > 365) return 1;

  let pNoMatch = 1.0;
  for (let i = 0; i < n; i++) {
    pNoMatch *= (365 - i) / 365;
  }
  return 1 - pNoMatch;
}

export function getBirthdayCurveData() {
  const labels = [];
  const data = [];
  for (let i = 1; i <= 100; i++) {
    labels.push(i);
    data.push(+(calculateBirthdayProbability(i) * 100).toFixed(2));
  }
  return { labels, data };
}

export function generateBirthdayTrial(n) {
  const avatars = [];
  const birthdayMap = new Map();
  const matchingPairs = [];
  const matchedAvatarSet = new Set();

  for (let i = 0; i < n; i++) {
    const bday = Math.floor(Math.random() * 365) + 1;
    avatars.push({ id: i, birthday: bday });

    if (!birthdayMap.has(bday)) {
      birthdayMap.set(bday, []);
    }
    birthdayMap.get(bday).push(i);
  }

  birthdayMap.forEach((indices, bday) => {
    if (indices.length > 1) {
      for (let i = 0; i < indices.length; i++) {
        matchedAvatarSet.add(indices[i]);
        for (let j = i + 1; j < indices.length; j++) {
          matchingPairs.push([indices[i], indices[j], bday]);
        }
      }
    }
  });

  return {
    avatars,
    hasMatch: matchingPairs.length > 0,
    matchingPairs,
    matchedAvatarSet,
    totalMatches: matchingPairs.length
  };
}

export function formatDayOfYear(dayNum, lang = 'bn') {
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let day = dayNum;
  for (let i = 0; i < 12; i++) {
    if (day <= days[i]) {
      const monthName = lang === 'bn' ? monthsBn[i] : monthsEn[i];
      return `${monthName} ${day}`;
    }
    day -= days[i];
  }
  return lang === 'bn' ? `ডিসেম্বর ৩১` : `Dec 31`;
}

/**
 * St. Petersburg Paradox Simulation Helper
 * Flips a coin until Heads appears.
 * Pot doubles each Tail: Heads on 1st flip = $2 (2^1), 2nd = $4 (2^2), 3rd = $8 (2^3)...
 */
export function playStPetersburgGame() {
  let flips = 1;
  while (Math.random() < 0.5) {
    flips++;
    if (flips > 30) break; // Numerical safety cap
  }
  const payout = Math.pow(2, flips);
  return { flips, payout };
}

/**
 * Newcomb's Paradox Predictor Engine
 * Predictor has accuracy (default 99%)
 */
export function playNewcombsGame(userChoice, predictorAccuracy = 0.99) {
  // Choice: 'boxB' (One-Box) or 'both' (Two-Box)
  const isPredictorCorrect = Math.random() < predictorAccuracy;

  let predictedChoice = userChoice;
  if (!isPredictorCorrect) {
    predictedChoice = userChoice === 'boxB' ? 'both' : 'boxB';
  }

  // Predictor put $1,000,000 in Box B ONLY IF predictor predicted userChoice === 'boxB'
  const boxBHasMillion = predictedChoice === 'boxB';
  const boxAValue = 1000;
  const boxBValue = boxBHasMillion ? 1000000 : 0;

  const totalWon = userChoice === 'boxB' ? boxBValue : (boxAValue + boxBValue);

  return {
    userChoice,
    predictedChoice,
    isPredictorCorrect,
    boxBHasMillion,
    boxAValue,
    boxBValue,
    totalWon
  };
}

export function stepParrondoGameA(capital, epsilon = 0.005) {
  const pWin = 0.49 - epsilon;
  const win = Math.random() < pWin;
  return capital + (win ? 1 : -1);
}

export function stepParrondoGameB(capital, epsilon = 0.005) {
  const isMultipleOf3 = Math.abs(capital) % 3 === 0;
  const pWin = isMultipleOf3 ? (0.09 - epsilon) : (0.74 - epsilon);
  const win = Math.random() < pWin;
  return capital + (win ? 1 : -1);
}

export const DEFAULT_SIMPSONS_DATA = {
  treatmentA: {
    name: "চিকিৎসা A (সার্জারি)",
    smallStones: { success: 81, total: 87 },
    largeStones: { success: 192, total: 263 }
  },
  treatmentB: {
    name: "চিকিৎসা B (আল্ট্রাসাউন্ড)",
    smallStones: { success: 234, total: 270 },
    largeStones: { success: 55, total: 80 }
  }
};

export function computeSimpsonsRates(data = DEFAULT_SIMPSONS_DATA) {
  const aSmall = data.treatmentA.smallStones.success / data.treatmentA.smallStones.total;
  const aLarge = data.treatmentA.largeStones.success / data.treatmentA.largeStones.total;
  const aTotalSuccess = data.treatmentA.smallStones.success + data.treatmentA.largeStones.success;
  const aTotalCount = data.treatmentA.smallStones.total + data.treatmentA.largeStones.total;
  const aOverall = aTotalSuccess / aTotalCount;

  const bSmall = data.treatmentB.smallStones.success / data.treatmentB.smallStones.total;
  const bLarge = data.treatmentB.largeStones.success / data.treatmentB.largeStones.total;
  const bTotalSuccess = data.treatmentB.smallStones.success + data.treatmentB.largeStones.success;
  const bTotalCount = data.treatmentB.smallStones.total + data.treatmentB.largeStones.total;
  const bOverall = bTotalSuccess / bTotalCount;

  return {
    treatmentA: {
      smallRate: +(aSmall * 100).toFixed(1),
      largeRate: +(aLarge * 100).toFixed(1),
      overallRate: +(aOverall * 100).toFixed(1),
      totalCount: aTotalCount,
      smallCount: data.treatmentA.smallStones.total,
      largeCount: data.treatmentA.largeStones.total
    },
    treatmentB: {
      smallRate: +(bSmall * 100).toFixed(1),
      largeRate: +(bLarge * 100).toFixed(1),
      overallRate: +(bOverall * 100).toFixed(1),
      totalCount: bTotalCount,
      smallCount: data.treatmentB.smallStones.total,
      largeCount: data.treatmentB.largeStones.total
    }
  };
}
