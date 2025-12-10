export type TaiXiu = 'Tài' | 'Xỉu';
export type ChanLe = 'Chẵn' | 'Lẻ';
export interface Round {
  id: string;
  roundNumber: number;
  digits: string;
  sum: number;
  taiXiu: TaiXiu;
  chanLe: ChanLe;
  timestamp: string;
}
export interface Prediction {
  taiXiu?: TaiXiu;
  chanLe?: ChanLe;
  bet?: number;
}
export interface UserPrediction extends Prediction {
  roundId: string;
  result?: {
    taiXiuCorrect?: boolean;
    chanLeCorrect?: boolean;
  };
}
export interface Stats {
  predictionsMade: number;
  correct: number;
  incorrect: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
  netProfit: number;
}
export interface Settings {
  autoStart: boolean;
  soundEnabled: boolean;
  historyLimit: number;
}
export type BetOutcome = 'win' | 'loss' | 'partial';
export interface BetRecord {
  roundId: string;
  roundNumber: number;
  betAmount: number;
  outcome: BetOutcome;
  profit: number;
  timestamp: string;
}