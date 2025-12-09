export type TaiXiu = 'Tài' | 'X���u';
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
}
export interface Settings {
  autoStart: boolean;
  soundEnabled: boolean;
  historyLimit: number;
}