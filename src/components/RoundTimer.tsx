import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
interface RoundTimerProps {
  intervalSeconds?: number;
  isAutoRunning: boolean;
  onExpire: () => void;
}
export function RoundTimer({ intervalSeconds = 45, isAutoRunning, onExpire }: RoundTimerProps) {
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
      // When auto-running starts, we want the first tick to happen after 1s,
      // not immediately. So we set up the timer to call tick.
      const tick = () => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            onExpire();
            return intervalSeconds; // Reset for the next round
          }
          return prev - 1;
        });
        timerRef.current = setTimeout(tick, 1000);
      };
      // If the timer is not already running, start it.
      if (!timerRef.current) {
        timerRef.current = setTimeout(tick, 1000);
      }
    } else {
      // If auto-running is stopped, clear any scheduled ticks.
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    // Cleanup function to clear the timer on component unmount or when dependencies change.
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isAutoRunning, intervalSeconds, onExpire]);
  // Effect to reset the timer display when auto-running is toggled.
  useEffect(() => {
    if (isAutoRunning) {
      resetTimer();
    }
  }, [isAutoRunning, resetTimer]);
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