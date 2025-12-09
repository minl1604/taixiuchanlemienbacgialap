import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Round, Prediction, Stats } from '@/types';
import * as storage from '@/lib/storage';
import { generateRound, evaluatePrediction } from '@/lib/simulator';
interface GameState {
  history: Round[];
  stats: Stats;
  currentPrediction: Prediction;
  isAutoRunning: boolean;
  lastRound?: Round;
  actions: {
    init: () => void;
    setPrediction: (prediction: Prediction) => void;
    startAuto: () => void;
    stopAuto: () => void;
    spinNewRound: () => { newRound: Round; wasCorrect: boolean | null };
    resetHistory: () => void;
    resetStats: () => void;
  };
}
export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    history: [],
    stats: storage.getStats(),
    currentPrediction: {},
    isAutoRunning: false,
    lastRound: undefined,
    actions: {
      init: () => {
        const history = storage.getHistory();
        set((state) => {
          state.history = history;
          state.lastRound = history[0];
        });
      },
      setPrediction: (prediction) => {
        set((state) => {
          state.currentPrediction = { ...state.currentPrediction, ...prediction };
        });
      },
      startAuto: () => set({ isAutoRunning: true }),
      stopAuto: () => set({ isAutoRunning: false }),
      spinNewRound: () => {
        const lastRoundNumber = get().history[0]?.roundNumber ?? 0;
        const newRound = generateRound(lastRoundNumber);
        const currentPrediction = get().currentPrediction;
        const currentStats = get().stats;
        let wasCorrect: boolean | null = null;
        let newStats = currentStats;
        if (Object.keys(currentPrediction).length > 0) {
          const result = evaluatePrediction(newRound, currentPrediction, currentStats);
          newStats = result.newStats;
          wasCorrect = result.wasCorrect;
        }
        const newHistory = [newRound, ...get().history].slice(0, 100);
        set((state) => {
          state.history = newHistory;
          state.stats = newStats;
          state.lastRound = newRound;
          state.currentPrediction = {};
        });
        storage.setHistory(newHistory);
        storage.setStats(newStats);
        return { newRound, wasCorrect };
      },
      resetHistory: () => {
        set({ history: [], lastRound: undefined });
        storage.setHistory([]);
      },
      resetStats: () => {
        const initialStats = {
          predictionsMade: 0,
          correct: 0,
          incorrect: 0,
          currentStreak: 0,
          longestStreak: 0,
          points: 0,
        };
        set({ stats: initialStats });
        storage.setStats(initialStats);
      },
    },
  }))
);
// Export actions and selectors for convenience and to enforce best practices
export const useGameActions = () => useGameStore((state) => state.actions);
export const useHistory = () => useGameStore((state) => state.history);
export const useStats = () => useGameStore((state) => state.stats);
export const useCurrentPrediction = () => useGameStore((state) => state.currentPrediction);
export const useIsAutoRunning = () => useGameStore((state) => state.isAutoRunning);
export const useLastRound = () => useGameStore((state) => state.lastRound);