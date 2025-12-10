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
  const taiXiuCorrect = prediction.taiXiu ? prediction.taiXiu === round.taiXiu : undefined;
  const chanLeCorrect = prediction.chanLe ? prediction.chanLe === round.chanLe : undefined;
  let correctCount = 0;
  if (taiXiuCorrect === true) correctCount++;
  if (chanLeCorrect === true) correctCount++;
  const wasCorrect = (prediction.taiXiu && prediction.chanLe)
    ? (taiXiuCorrect === true && chanLeCorrect === true)
    : (taiXiuCorrect === true || chanLeCorrect === true);
  const newStats: Stats = { ...currentStats };
  newStats.predictionsMade += 1;
  if (wasCorrect) {
    newStats.correct += 1;
    newStats.currentStreak += 1;
    newStats.points += correctCount;
    if (newStats.currentStreak > newStats.longestStreak) {
      newStats.longestStreak = newStats.currentStreak;
    }
  } else {
    newStats.incorrect += 1;
    newStats.currentStreak = 0;
  }
  return { newStats, wasCorrect, matches: correctCount };
};
export const calculateReward = (bet: number, matches: number): { profit: number; outcome: BetOutcome } => {
  if (matches === 2) {
    // Win both predictions
    return { profit: Math.floor(bet * 0.95), outcome: 'win' }; // 1.9x payout means 0.95 profit on bet
  }
  if (matches === 1) {
    // Win one of two predictions
    return { profit: 0, outcome: 'partial' }; // Push/draw
  }
  // Lose all predictions
  return { profit: -bet, outcome: 'loss' };
};