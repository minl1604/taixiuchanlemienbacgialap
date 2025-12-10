import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Round, Prediction, Stats, BetRecord, Settings } from '@/types';
import * as storage from '@/lib/storage';
import { generateRound, evaluatePrediction, calculateReward } from '@/lib/simulator';
let audioCtx: AudioContext | null = null;
const initAudioContext = () => {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser", e);
    }
  }
};
export const playSound = (type: 'win' | 'loss' | 'tick', settings: Settings) => {
  if (!settings.soundEnabled || settings.soundVolume === 0) return;
  initAudioContext();
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(settings.soundVolume / 100, audioCtx.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  let freq: number, waveType: OscillatorType, duration: number;
  switch (type) {
    case 'win':
      freq = 800;
      waveType = 'sine';
      duration = 0.5;
      break;
    case 'loss':
      freq = 200;
      waveType = 'square';
      duration = 0.3;
      break;
    case 'tick':
      freq = 600;
      waveType = 'triangle';
      duration = 0.05;
      gainNode.gain.setValueAtTime(settings.soundVolume / 200, audioCtx.currentTime); // Ticks are quieter
      break;
  }
  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};
interface GameState {
  history: Round[];
  stats: Stats;
  balance: number;
  bettingHistory: BetRecord[];
  currentPrediction: Prediction;
  isAutoRunning: boolean;
  lastRound?: Round;
  settings: Settings;
  actions: {
    init: () => void;
    setPrediction: (prediction: Prediction) => void;
    startAuto: () => void;
    stopAuto: () => void;
    spinNewRound: () => { newRound: Round; wasCorrect: boolean | null; profit: number | null };
    resetHistory: () => void;
    resetStatsAndBalance: () => void;
    setSettings: (newSettings: Partial<Settings>) => void;
    userInteracted: () => void;
  };
}
const initialStats: Stats = {
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
    settings: storage.getSettings(),
    actions: {
      init: () => {
        const history = storage.getHistory();
        const stats = storage.getStats();
        const balance = storage.getBalance();
        const bettingHistory = storage.getBettingHistory();
        const settings = storage.getSettings();
        set((state) => {
          state.history = history;
          state.stats = stats;
          state.balance = balance;
          state.bettingHistory = bettingHistory;
          state.lastRound = history[0];
          state.settings = settings;
        });
        if (settings.autoStart) {
          setTimeout(() => {
            set({ isAutoRunning: true });
          }, 1000);
        }
      },
      userInteracted: () => {
        initAudioContext();
      },
      setPrediction: (prediction) => {
        set((state) => {
          state.currentPrediction = { ...state.currentPrediction, ...prediction };
        });
      },
      startAuto: () => set({ isAutoRunning: true }),
      stopAuto: () => set({ isAutoRunning: false }),
      spinNewRound: () => {
        const { settings } = get();
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
              if (state.bettingHistory.length > state.settings.historyLimit) {
                state.bettingHistory = state.bettingHistory.slice(0, state.settings.historyLimit);
              }
            });
            playSound(profit > 0 ? 'win' : 'loss', settings);
          }
        }
        const newHistory = [newRound, ...get().history].slice(0, settings.historyLimit);
        set((state) => {
          state.history = newHistory;
          state.stats = newStats;
          state.lastRound = newRound;
          state.currentPrediction = {}; // Clear prediction for next round
        });
        storage.setHistory(get().history);
        storage.setStats(get().stats);
        storage.setBalance(get().balance);
        storage.setBettingHistory(get().bettingHistory);
        return { newRound, wasCorrect, profit };
      },
      resetHistory: () => {
        set({ history: [], lastRound: undefined, bettingHistory: [] });
        storage.setHistory([]);
        storage.setBettingHistory([]);
      },
      resetStatsAndBalance: () => {
        set({ stats: initialStats, balance: 1000000000, bettingHistory: [] });
        storage.setStats(initialStats);
        storage.setBalance(1000000000);
        storage.setBettingHistory([]);
      },
      setSettings: (newSettings: Partial<Settings>) => {
        set(state => {
          state.settings = { ...state.settings, ...newSettings };
        });
        storage.setSettings(get().settings);
      },
    },
  }))
);
export const useHistory = () => useGameStore(s => s.history);
export const useStats = () => useGameStore(s => s.stats);
export const useBalance = () => useGameStore(s => s.balance);
export const useBettingHistory = () => useGameStore(s => s.bettingHistory);
export const useCurrentPrediction = () => useGameStore(s => s.currentPrediction);
export const useIsAutoRunning = () => useGameStore(s => s.isAutoRunning);
export const useLastRound = () => useGameStore(s => s.lastRound);
export const useGameActions = () => useGameStore(s => s.actions);
export const useSettings = () => useGameStore(s => s.settings);