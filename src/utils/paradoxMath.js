/**
 * Mathematical Utilities & Numerical Safety for Aha! Paradox Visualizer (Bangla Enabled)
 */

/**
 * Calculates Birthday Paradox probability safely without factorials.
 * P(match) = 1 - P(no match)
 * @param {number} n - Number of people in room
 * @returns {number} Probability between 0 and 1
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

/**
 * Precomputes theoretical curve for 1..100 people
 */
export function getBirthdayCurveData() {
  const labels = [];
  const data = [];
  for (let i = 1; i <= 100; i++) {
    labels.push(i);
    data.push(+(calculateBirthdayProbability(i) * 100).toFixed(2));
  }
  return { labels, data };
}

/**
 * Generates random birthdays (1 to 365) for n avatars and finds all matching pairs.
 */
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

/**
 * Bangla Month & Day Formatter
 */
export function formatDayOfYear(dayNum) {
  const months = [
    { name: 'জানুয়ারি', days: 31 }, { name: 'ফেব্রুয়ারি', days: 28 }, { name: 'মার্চ', days: 31 },
    { name: 'এপ্রিল', days: 30 }, { name: 'মে', days: 31 }, { name: 'জুন', days: 30 },
    { name: 'জুলাই', days: 31 }, { name: 'আগস্ট', days: 31 }, { name: 'সেপ্টেম্বর', days: 30 },
    { name: 'অক্টোবর', days: 31 }, { name: 'নভেম্বর', days: 30 }, { name: 'ডিসেম্বর', days: 31 }
  ];
  
  let day = dayNum;
  for (const m of months) {
    if (day <= m.days) {
      return `${m.name} ${day}`;
    }
    day -= m.days;
  }
  return `ডিসেম্বর ৩১`;
}

/**
 * Parrondo's Paradox Step Calculations
 */
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

/**
 * Classic Simpson's Paradox Dataset
 */
export const DEFAULT_SIMPSONS_DATA = {
  treatmentA: {
    name: "চিকিৎসা A (সার্জারি)",
    smallStones: { success: 81, total: 87 },   // 93.1%
    largeStones: { success: 192, total: 263 }  // 73.0%
  },
  treatmentB: {
    name: "চিকিৎসা B (আল্ট্রাসাউন্ড)",
    smallStones: { success: 234, total: 270 },  // 86.7%
    largeStones: { success: 55, total: 80 }     // 68.8%
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
