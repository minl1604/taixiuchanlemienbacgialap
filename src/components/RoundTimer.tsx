import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
interface RoundTimerProps {
  intervalSeconds?: number;
  isAutoRunning: boolean;
  onExpire: () => void;
}
export function RoundTimer({ intervalSeconds = 20, isAutoRunning, onExpire }: RoundTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(intervalSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setSecondsLeft(intervalSeconds);
  }, [intervalSeconds]);
  useEffect(() => {
    if (isAutoRunning) {
      resetTimer();
      const tick = () => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            onExpire();
            return intervalSeconds;
          }
          return prev - 1;
        });
        timerRef.current = setTimeout(tick, 1000);
      };
      timerRef.current = setTimeout(tick, 1000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isAutoRunning, intervalSeconds, onExpire, resetTimer]);
  // Manual trigger for onExpire when not auto-running
  useEffect(() => {
    if (!isAutoRunning && secondsLeft <= 0) {
      onExpire();
      resetTimer();
    }
  }, [secondsLeft, isAutoRunning, onExpire, resetTimer]);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-2">Kỳ tiếp theo sau</p>
      <motion.div
        key={secondsLeft}
        initial={{ scale: 1.1, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
        className="font-mono text-6xl md:text-8xl font-bold tabular-nums tracking-tighter"
        style={{ textShadow: '0 0 10px #F38020, 0 0 20px #F38020, 0 0 30px #F5576C' }}
      >
        <span className="text-gradient">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
      </motion.div>
    </div>
  );
}