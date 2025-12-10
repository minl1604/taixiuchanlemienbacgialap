import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Round, Prediction, Stats, BetRecord } from '@/types';
import * as storage from '@/lib/storage';
import { generateRound, evaluatePrediction, calculateReward } from '@/lib/simulator';
interface GameState {
  history: Round[];
  stats: Stats;
  balance: number;
  bettingHistory: BetRecord[];
  currentPrediction: Prediction;
  isAutoRunning: boolean;
  lastRound?: Round;
  actions: {
    init: () => void;
    setPrediction: (prediction: Prediction) => void;
    startAuto: () => void;
    stopAuto: () => void;
    spinNewRound: () => { newRound: Round; wasCorrect: boolean | null; profit: number | null };
    resetHistory: () => void;
    resetStatsAndBalance: () => void;
  };
}
const initialStats = {
  predictionsMade: 0,
  correct: 0,
  incorrect: 0,
  currentStreak: 0,
  longestStreak: 0,
  points: 0,
  netProfit: 0,
};
export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    history: [],
    stats: initialStats,
    balance: 1000000000,
    bettingHistory: [],
    currentPrediction: {},
    isAutoRunning: false,
    lastRound: undefined,
    actions: {
      init: () => {
        const history = storage.getHistory();
        const stats = storage.getStats();
        const balance = storage.getBalance();
        const bettingHistory = storage.getBettingHistory();
        set((state) => {
          state.history = history;
          state.stats = stats;
          state.balance = balance;
          state.bettingHistory = bettingHistory;
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
        let profit: number | null = null;
        const hasPrediction = currentPrediction.taiXiu || currentPrediction.chanLe;
        if (hasPrediction) {
          const evalResult = evaluatePrediction(newRound, currentPrediction, currentStats);
          newStats = evalResult.newStats;
          wasCorrect = evalResult.wasCorrect;
          const betAmount = currentPrediction.bet;
          if (betAmount && betAmount > 0) {
            const rewardResult = calculateReward(betAmount, evalResult.matches);
            profit = rewardResult.profit;
            set(state => {
              state.balance += profit ?? 0;
              state.stats.netProfit += profit ?? 0;
              const newBetRecord: BetRecord = {
                roundId: newRound.id,
                roundNumber: newRound.roundNumber,
                betAmount,
                outcome: rewardResult.outcome,
                profit: profit ?? 0,
                timestamp: newRound.timestamp,
              };
              state.bettingHistory.unshift(newBetRecord);
              if (state.bettingHistory.length > 100) {
                state.bettingHistory.pop();
              }
            });
          }
        }
        const newHistory = [newRound, ...get().history].slice(0, 100);
        set((state) => {
          state.history = newHistory;
          state.stats = newStats;
          state.lastRound = newRound;
          state.currentPrediction = {}; // Clear prediction for next round
        });
        storage.setHistory(newHistory);
        storage.setStats(get().stats);
        storage.setBalance(get().balance);
        storage.setBettingHistory(get().bettingHistory);
        return { newRound, wasCorrect, profit };
      },
      resetHistory: () => {
        set({ history: [], lastRound: undefined });
        storage.setHistory([]);
      },
      resetStatsAndBalance: () => {
        set({ stats: initialStats, balance: 1000000000, bettingHistory: [] });
        storage.setStats(initialStats);
        storage.setBalance(1000000000);
        storage.setBettingHistory([]);
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
export const useBalance = () => useGameStore((state) => state.balance);
export const useBettingHistory = () => useGameStore((state) => state.bettingHistory);