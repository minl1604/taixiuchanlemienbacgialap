import React, { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useGameStore, useHistory, useStats, useIsAutoRunning, useLastRound, useGameActions, useBalance, useBettingHistory } from '@/hooks/useGameStore';
import { RoundTimer } from '@/components/RoundTimer';
import { CurrentRoundPanel } from '@/components/CurrentRoundPanel';
import { PredictionPanel } from '@/components/PredictionPanel';
import { TrendView } from '@/components/TrendView';
import { HistoryTable } from '@/components/HistoryTable';
import { StatsPanel } from '@/components/StatsPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { GameGuide } from '@/components/GameGuide';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import * as storage from '@/lib/storage';
const ConfettiPiece = ({ x, y, rotate, color }: { x: number; y: number; rotate: number; color: string }) => (
  <motion.div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 10,
      height: 20,
      backgroundColor: color,
      x,
      y,
      rotate,
      opacity: 0,
    }}
    animate={{
      y: y + 200,
      opacity: [1, 1, 0],
      scale: [1, 1.2, 0],
      rotate: rotate + 180,
    }}
    transition={{ duration: 2, ease: "easeOut" }}
  />
);
export function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);
  const { init, userInteracted } = useGameStore(s => s.actions);
  useEffect(() => {
    setIsClient(true);
    try {
      init();
      if (!localStorage.getItem('disclaimerSeen')) {
        setShowDisclaimer(true);
      }
    } catch (e) {
      console.error("Failed to initialize game store:", e);
    }
  }, [init]);
  const history = useHistory();
  const stats = useStats();
  const isAutoRunning = useIsAutoRunning();
  const lastRound = useLastRound();
  const balance = useBalance();
  const bettingHistory = useBettingHistory();
  const { spinNewRound, resetHistory, resetStatsAndBalance } = useGameActions();
  const triggerConfetti = () => {
    const colors = ['#F38020', '#4FACFE', '#F5576C', '#FFD700'];
    const newConfetti = Array.from({ length: 50 }).map((_, i) => (
      <ConfettiPiece
        key={i}
        x={Math.random() * 400 - 200}
        y={Math.random() * 200 - 100}
        rotate={Math.random() * 360}
        color={colors[Math.floor(Math.random() * colors.length)]}
      />
    ));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 2000);
  };
  const handleSpin = useCallback(() => {
    const { newRound, wasCorrect, profit } = spinNewRound();
    const resultText = `${newRound.taiXiu} - ${newRound.chanLe}`;
    if (profit !== null) {
      if (profit > 0) {
        toast.success(`Kỳ #${newRound.roundNumber} - Thắng!`, { description: `Lợi nhuận: +${profit.toLocaleString('vi-VN')} VND` });
        triggerConfetti();
      } else if (profit < 0) {
        toast.error(`Kỳ #${newRound.roundNumber} - Thua!`, { description: `Mất: ${(-profit).toLocaleString('vi-VN')} VND` });
      } else {
        toast.info(`Kỳ #${newRound.roundNumber} - Hòa`, { description: 'Hoàn tiền cược.' });
      }
    } else if (wasCorrect !== null) {
        if (wasCorrect) {
            toast.success(`Kỳ #${newRound.roundNumber} - ${resultText}`, { description: 'Dự đoán chính xác!' });
        } else {
            toast.error(`Kỳ #${newRound.roundNumber} - ${resultText}`, { description: 'Chúc bạn may mắn lần sau!' });
        }
    } else {
      toast.info(`Kỳ #${newRound.roundNumber} - ${resultText}`, { description: 'Đã có kết quả mới.' });
    }
  }, [spinNewRound]);
  const handleDisclaimerClose = () => {
    localStorage.setItem('disclaimerSeen', 'true');
    setShowDisclaimer(false);
  };
  if (!isClient) {
    return null; // or a loading spinner
  }
  return (
    <div className="min-h-screen bg-gray-900 text-foreground dark font-sans relative overflow-x-hidden" onClick={userInteracted} onTouchStart={userInteracted}>
      <div className="absolute inset-0 bg-gradient-mesh opacity-10 pointer-events-none" />
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setShowGuide(true)} className="text-2xl hover:scale-110 hover:rotate-12 transition-all duration-200 active:scale-90 z-50">
          <HelpCircle className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="text-2xl hover:scale-110 hover:rotate-12 transition-all duration-200 active:scale-90 z-50">
          <SettingsIcon className="h-6 w-6" />
        </Button>
        <ThemeToggle className="relative top-0 right-0" />
      </div>
      <header className="text-center pt-8 pb-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-balance leading-tight">
          <span className="text-gradient">Tài Xỉu Miền Bắc</span> Giả Lập
        </h1>
        <p className="text-sm text-muted-foreground mt-2">Không dùng cho cá cược tiền thật</p>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-8"
            >
              <RoundTimer isAutoRunning={isAutoRunning} onExpire={handleSpin} intervalSeconds={20} />
              <CurrentRoundPanel round={lastRound} />
              <PredictionPanel onSpinNow={handleSpin} defaultBet={storage.getBetAmount()} />
              <TrendView history={history} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <StatsPanel stats={stats} balance={balance} bettingHistory={bettingHistory} onResetStats={resetStatsAndBalance} />
              <HistoryTable history={history} onClearHistory={resetHistory} />
            </motion.div>
          </div>
        </div>
      </main>
      <footer className="text-center py-8 text-muted-foreground/80 text-sm">
        <p>Built with ���️ at Cloudflare</p>
      </footer>
      <Toaster richColors closeButton theme="dark" />
      <SettingsPanel open={showSettings} onOpenChange={setShowSettings} />
      <GameGuide open={showGuide} onOpenChange={setShowGuide} />
      <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lưu ý quan trọng</AlertDialogTitle>
            <AlertDialogDescription>
              Đây là một ��ng dụng giả lập chỉ dành cho mục đích giải trí. Mọi kết quả đều là ngẫu nhiên và không liên quan đ��n kết quả xổ số thực tế. Ứng dụng này không sử dụng tiền thật và không dành cho mục đích cờ bạc.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDisclaimerClose}>Tôi đã hiểu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="fixed inset-0 pointer-events-none z-50">{confetti}</div>
    </div>
  );
}