import type { Round, Stats, Settings, UserPrediction, BetRecord } from '@/types';
const HISTORY_KEY = 'txmb_history';
const STATS_KEY = 'txmb_stats';
const SETTINGS_KEY = 'txmb_settings';
const PREDICTIONS_KEY = 'txmb_predictions';
const BALANCE_KEY = 'txmb_balance';
const BETTING_HISTORY_KEY = 'txmb_bettingHistory';
const BET_AMOUNT_KEY = 'txmb_betAmount';
const safeJSONParse = <T>(jsonString: string | null, fallback: T): T => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON from localStorage", error);
    return fallback;
  }
};
// History
export const getHistory = (): Round[] => safeJSONParse(localStorage.getItem(HISTORY_KEY), []);
export const setHistory = (history: Round[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};
// Stats
export const getStats = (): Stats => safeJSONParse(localStorage.getItem(STATS_KEY), {
  predictionsMade: 0,
  correct: 0,
  incorrect: 0,
  currentStreak: 0,
  longestStreak: 0,
  points: 0,
  netProfit: 0,
});
export const setStats = (stats: Stats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats to localStorage", error);
  }
};
// Settings
export const getSettings = (): Settings => {
  const defaultSettings: Settings = {
    autoStart: false,
    soundEnabled: true,
    historyLimit: 100,
    soundVolume: 50,
  };
  const storedSettings = safeJSONParse(localStorage.getItem(SETTINGS_KEY), {});
  return { ...defaultSettings, ...storedSettings };
};
export const setSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to localStorage", error);
  }
};
// User Predictions (optional, if needed to persist across sessions)
export const getPredictions = (): UserPrediction[] => safeJSONParse(localStorage.getItem(PREDICTIONS_KEY), []);
export const setPredictions = (predictions: UserPrediction[]): void => {
  try {
    localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error("Failed to save predictions to localStorage", error);
  }
};
// Balance
export const getBalance = (): number => safeJSONParse(localStorage.getItem(BALANCE_KEY), 1000000000);
export const setBalance = (balance: number): void => {
  try {
    localStorage.setItem(BALANCE_KEY, JSON.stringify(balance));
  } catch (error) {
    console.error("Failed to save balance to localStorage", error);
  }
};
// Betting History
export const getBettingHistory = (): BetRecord[] => safeJSONParse(localStorage.getItem(BETTING_HISTORY_KEY), []);
export const setBettingHistory = (bettingHistory: BetRecord[]): void => {
  try {
    localStorage.setItem(BETTING_HISTORY_KEY, JSON.stringify(bettingHistory));
  } catch (error) {
    console.error("Failed to save betting history to localStorage", error);
  }
};
// Bet Amount
export const getBetAmount = (): number => safeJSONParse(localStorage.getItem(BET_AMOUNT_KEY), 500000000);
export const setBetAmount = (amount: number): void => {
  try {
    localStorage.setItem(BET_AMOUNT_KEY, JSON.stringify(amount));
  } catch (error) {
    console.error("Failed to save bet amount to localStorage", error);
  }
};