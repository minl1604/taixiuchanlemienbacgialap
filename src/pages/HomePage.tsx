import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useGameStore, useHistory, useStats, useIsAutoRunning, useLastRound, useGameActions } from '@/hooks/useGameStore';
import { RoundTimer } from '@/components/RoundTimer';
import { CurrentRoundPanel } from '@/components/CurrentRoundPanel';
import { PredictionPanel } from '@/components/PredictionPanel';
import { TrendView } from '@/components/TrendView';
import { HistoryTable } from '@/components/HistoryTable';
import { StatsPanel } from '@/components/StatsPanel';
export function HomePage() {
  // Initialize store on mount
  useEffect(() => {
    useGameStore.getState().actions.init();
  }, []);
  const history = useHistory();
  const stats = useStats();
  const isAutoRunning = useIsAutoRunning();
  const lastRound = useLastRound();
  const { spinNewRound, resetHistory, resetStats } = useGameActions();
  const handleSpin = useCallback(() => {
    const { newRound, wasCorrect } = spinNewRound();
    const resultText = `${newRound.taiXiu} - ${newRound.chanLe}`;
    if (wasCorrect === true) {
      toast.success(`Kỳ #${newRound.roundNumber} - ${resultText}`, { description: 'Dự đoán chính xác!' });
    } else if (wasCorrect === false) {
      toast.error(`Kỳ #${newRound.roundNumber} - ${resultText}`, { description: 'Chúc bạn may mắn lần sau!' });
    } else {
      toast.info(`Kỳ #${newRound.roundNumber} - ${resultText}`, { description: 'Đã có kết quả mới.' });
    }
  }, [spinNewRound]);
  return (
    <div className="min-h-screen bg-gray-900 text-foreground dark font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-10 pointer-events-none" />
      <ThemeToggle className="absolute top-4 right-4" />
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-balance leading-tight">
          <span className="text-gradient">Tài Xỉu Miền Bắc</span> Giả Lập
        </h1>
        <p className="text-sm text-muted-foreground mt-2">Không dùng cho cá cược tiền thật</p>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-8"
            >
              <RoundTimer isAutoRunning={isAutoRunning} onExpire={handleSpin} intervalSeconds={45} />
              <CurrentRoundPanel round={lastRound} />
              <PredictionPanel onSpinNow={handleSpin} />
              <TrendView history={history} />
            </motion.div>
            {/* Sidebar Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <StatsPanel stats={stats} onResetStats={resetStats} />
              <HistoryTable history={history} onClearHistory={resetHistory} />
            </motion.div>
          </div>
        </div>
      </main>
      <footer className="text-center py-8 text-muted-foreground/80 text-sm">
        <p>Built with ❤�� at Cloudflare</p>
      </footer>
      <Toaster richColors closeButton theme="dark" />
    </div>
  );
}