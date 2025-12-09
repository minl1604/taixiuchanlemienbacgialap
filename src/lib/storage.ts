import type { Round, Stats, Settings, UserPrediction } from '@/types';
const HISTORY_KEY = 'txmb_history';
const STATS_KEY = 'txmb_stats';
const SETTINGS_KEY = 'txmb_settings';
const PREDICTIONS_KEY = 'txmb_predictions';
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
});
export const setStats = (stats: Stats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats to localStorage", error);
  }
};
// Settings
export const getSettings = (): Settings => safeJSONParse(localStorage.getItem(SETTINGS_KEY), {
  autoStart: false,
  soundEnabled: true,
  historyLimit: 100,
});
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