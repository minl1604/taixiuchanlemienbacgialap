import { v4 as uuidv4 } from 'uuid';
import type { Round, TaiXiu, ChanLe, Prediction, Stats, BetOutcome } from '@/types';
export const computeFromNumber = (numString: string): { digits: string[]; sum: number; taiXiu: TaiXiu; chanLe: ChanLe } => {
  const digits = numString.split('');
  const sum = digits.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  const taiXiu: TaiXiu = sum >= 23 ? 'Tài' : 'Xỉu';
  const chanLe: ChanLe = sum % 2 === 0 ? 'Chẵn' : 'Lẻ';
  return { digits, sum, taiXiu, chanLe };
};
export const generateRound = (lastRoundNumber: number = 0): Round => {
  const random5Digit = Math.floor(Math.random() * 100000);
  const digitsString = String(random5Digit).padStart(5, '0');
  const { sum, taiXiu, chanLe } = computeFromNumber(digitsString);
  return {
    id: uuidv4(),
    roundNumber: lastRoundNumber + 1,
    digits: digitsString,
    sum,
    taiXiu,
    chanLe,
    timestamp: new Date().toISOString(),
  };
};
export const evaluatePrediction = (round: Round, prediction: Prediction, currentStats: Stats): { newStats: Stats; wasCorrect: boolean; matches: number } => {
  if (!prediction.taiXiu && !prediction.chanLe) {
    return { newStats: currentStats, wasCorrect: false, matches: 0 };
  }
  const taiXiuCorrect = prediction.taiXiu ? prediction.taiXiu === round.taiXiu : false;
  const chanLeCorrect = prediction.chanLe ? prediction.chanLe === round.chanLe : false;
  const wasCorrect = taiXiuCorrect || chanLeCorrect;
  const matches = wasCorrect ? 1 : 0;
  const newStats: Stats = { ...currentStats };
  newStats.predictionsMade += 1;
  if (wasCorrect) {
    newStats.correct += 1;
    newStats.currentStreak += 1;
    newStats.points += 1; // 1 point for single correct prediction
    if (newStats.currentStreak > newStats.longestStreak) {
      newStats.longestStreak = newStats.currentStreak;
    }
  } else {
    newStats.incorrect += 1;
    newStats.currentStreak = 0;
  }
  return { newStats, wasCorrect, matches };
};
export const calculateReward = (bet: number, matches: number): { profit: number; outcome: BetOutcome } => {
  if (matches >= 1) { // Win single category prediction
    return { profit: Math.floor(bet * 0.95), outcome: 'win' }; // 1.9x payout
  }
  // Lose all predictions
  return { profit: -bet, outcome: 'loss' };
};