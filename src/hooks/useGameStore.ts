import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { toast } from 'sonner';
import type { Round, Prediction, Stats, BetRecord, Settings, Achievement } from '@/types';
import * as storage from '@/lib/storage';
import { generateRound, evaluatePrediction, calculateReward } from '@/lib/simulator';
let audioCtx: AudioContext | null = null;
const initAudioContext = () => {
  if (audioCtx && audioCtx.state !== 'closed') return;
  const AudioCtxConstructor = (window.AudioContext || (window as any).webkitAudioContext);
  if (!AudioCtxConstructor) {
    console.warn("Web Audio API is not available in this browser");
    return;
  }
  try {
    audioCtx = new AudioCtxConstructor();
  } catch (e) {
    console.error("Failed to create AudioContext", e);
    audioCtx = null;
  }
};
export const playSound = (type: 'win' | 'loss' | 'tick' | 'achievement', settings: Settings) => {
  if (!settings.soundEnabled || settings.soundVolume === 0) return;
  try {
    initAudioContext();
    if (!audioCtx || audioCtx.state === 'suspended') return;
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    // Cap volume at 50% for a softer experience
    const baseVolume = Math.max(0, Math.min(0.5, (settings.soundVolume ?? 30) / 100));
    let freq: number, duration: number;
    const waveType: OscillatorType = 'sine'; // Use sine for all for a softer sound
    switch (type) {
      case 'win': freq = 700; duration = 0.5; break;
      case 'loss': freq = 300; duration = 0.3; break;
      case 'tick': freq = 400; duration = 0.1; break;
      case 'achievement': freq = 1000; duration = 0.7; break;
      default: freq = 600; duration = 0.1;
    }
    // Make tick sound very subtle
    const targetVolume = type === 'tick' ? baseVolume * 0.2 : baseVolume;
    // Smoother fade in/out
    const attack = 0.05;
    const release = 0.1;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(targetVolume, now + attack * 2);
    gainNode.gain.setValueAtTime(targetVolume, now + duration - release * 2);
    gainNode.gain.linearRampToValueAtTime(0, now + duration + 0.05);
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(freq, now);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.1);
  } catch (e) {
    console.error('playSound error', e);
  }
};
const initialAchievements: Achievement[] = [
  { id: 'streak5', name: 'Nóng Tay', description: 'Đạt chu���i thắng 5 kỳ liên tiếp.', unlocked: false, criteria: { type: 'streak', value: 5 } },
  { id: 'streak10', name: 'Bậc Thầy Chuỗi', description: 'Đạt chuỗi thắng 10 kỳ liên tiếp!', unlocked: false, criteria: { type: 'streak', value: 10 } },
  { id: 'rounds50', name: 'Người Chơi Bền Bỉ', description: 'Hoàn thành 50 kỳ quay.', unlocked: false, criteria: { type: 'rounds', value: 50 } },
  { id: 'rounds100', name: 'Trăm Trận Trăm Thắng', description: 'Hoàn thành 100 kỳ quay.', unlocked: false, criteria: { type: 'rounds', value: 100 } },
  { id: 'wins50', name: 'Chuyên Gia Dự Đoán', description: 'Thắng 50 lần.', unlocked: false, criteria: { type: 'wins', value: 50 } },
];
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
const initialStats: Omit<Stats, 'achievements'> = {
  predictionsMade: 0, correct: 0, incorrect: 0, currentStreak: 0, longestStreak: 0, points: 0, netProfit: 0,
};
export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    history: [],
    stats: { ...initialStats, achievements: initialAchievements },
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
        const achievements = storage.getAchievements(initialAchievements);
        const balance = storage.getBalance();
        const bettingHistory = storage.getBettingHistory();
        const settings = storage.getSettings();
        set((state) => {
          state.history = history;
          state.stats = { ...stats, achievements };
          state.balance = balance;
          state.bettingHistory = bettingHistory;
          state.lastRound = history[0];
          state.settings = settings;
        });
        if (settings.autoStart) {
          setTimeout(() => set({ isAutoRunning: true }), 1000);
        }
      },
      userInteracted: () => {
        initAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume().catch(console.error);
        }
      },
      setPrediction: (prediction) => set((state) => { state.currentPrediction = { ...state.currentPrediction, ...prediction }; }),
      startAuto: () => set({ isAutoRunning: true }),
      stopAuto: () => set({ isAutoRunning: false }),
      spinNewRound: () => {
        const { settings } = get();
        const lastRoundNumber = get().history[0]?.roundNumber ?? 0;
        const newRound = generateRound(lastRoundNumber);
        const currentPrediction = get().currentPrediction;
        const currentStats = get().stats;
        let wasCorrect: boolean | null = null;
        let newStats = { ...currentStats };
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
                roundId: newRound.id, roundNumber: newRound.roundNumber, betAmount,
                outcome: rewardResult.outcome, profit: profit ?? 0, timestamp: newRound.timestamp,
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
        const unlockedAchievements: string[] = [];
        const updatedAchievements = newStats.achievements.map(ach => {
          if (ach.unlocked) return ach;
          let unlocked = false;
          switch (ach.criteria.type) {
            case 'streak': unlocked = newStats.currentStreak >= ach.criteria.value; break;
            case 'rounds': unlocked = newHistory.length >= ach.criteria.value; break;
            case 'wins': unlocked = newStats.correct >= ach.criteria.value; break;
            case 'points': unlocked = newStats.points >= ach.criteria.value; break;
          }
          if (unlocked) {
            unlockedAchievements.push(ach.name);
            return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
          }
          return ach;
        });
        if (unlockedAchievements.length > 0) {
          unlockedAchievements.forEach(name => toast.success(`🏆 Thành tích mới: ${name}`));
          playSound('achievement', settings);
        }
        newStats.achievements = updatedAchievements;
        set((state) => {
          state.history = newHistory;
          state.stats = newStats;
          state.lastRound = newRound;
          state.currentPrediction = {};
        });
        storage.setHistory(get().history);
        const { achievements, ...statsToSave } = get().stats;
        storage.setStats(statsToSave);
        storage.setAchievements(achievements);
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
        const achievements = storage.getAchievements(initialAchievements).map(a => ({...a, unlocked: false, unlockedAt: undefined}));
        set({ stats: { ...initialStats, achievements }, balance: 1000000000, bettingHistory: [] });
        storage.setStats(initialStats);
        storage.setAchievements(achievements);
        storage.setBalance(1000000000);
        storage.setBettingHistory([]);
      },
      setSettings: (newSettings: Partial<Settings>) => {
        set(state => { state.settings = { ...state.settings, ...newSettings }; });
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
export const useAchievements = () => useGameStore(s => s.stats.achievements);
export const getGameActions = () => useGameStore.getState().actions;