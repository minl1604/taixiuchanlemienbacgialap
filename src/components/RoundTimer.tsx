import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, playSound } from '@/hooks/useGameStore';
interface RoundTimerProps {
  intervalSeconds?: number;
  isAutoRunning: boolean;
  onExpire: () => void;
}
export function RoundTimer({ intervalSeconds = 20, isAutoRunning, onExpire }: RoundTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(intervalSeconds);
  const settings = useGameStore(s => s.settings);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expectedRef = useRef<number | null>(null);
  const tick = useCallback(() => {
    if (expectedRef.current === null) return;
    const drift = Date.now() - expectedRef.current;
    playSound('tick', settings);
    setSecondsLeft(prev => {
      if (prev <= 1) {
        onExpire();
        return intervalSeconds;
      }
      return prev - 1;
    });
    expectedRef.current += 1000;
    intervalRef.current = setTimeout(tick, 1000 - drift);
  }, [onExpire, intervalSeconds, settings]);
  useEffect(() => {
    if (isAutoRunning) {
      setSecondsLeft(intervalSeconds);
      expectedRef.current = Date.now() + 1000;
      intervalRef.current = setTimeout(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
        expectedRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isAutoRunning, intervalSeconds, tick]);
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