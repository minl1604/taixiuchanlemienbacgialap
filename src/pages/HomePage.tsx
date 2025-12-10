import React, { useEffect, useCallback, useState, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { useGameStore, useHistory, useStats, useIsAutoRunning, useLastRound, useGameActions, getGameActions, useBalance, useBettingHistory, useSettings } from '@/hooks/useGameStore';
import { RoundTimer } from '@/components/RoundTimer';
import { CurrentRoundPanel } from '@/components/CurrentRoundPanel';
import { PredictionPanel } from '@/components/PredictionPanel';
import { TrendView } from '@/components/TrendView';
import { HistoryTable } from '@/components/HistoryTable';
import { StatsPanel } from '@/components/StatsPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { GameGuide } from '@/components/GameGuide';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import * as storage from '@/lib/storage';
const ConfettiPiece = memo(({ x, y, rotate, color }: { x: number; y: number; rotate: number; color: string }) => (
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
    transition={{ duration: 1.5, ease: "easeOut" }}
  />
));
ConfettiPiece.displayName = 'ConfettiPiece';
export function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);
  const hasInteracted = useRef(false);
  useEffect(() => {
    setIsClient(true);
    try {
      getGameActions().init();
      const theme = storage.getSettings().theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      if (!localStorage.getItem('disclaimerSeen')) {
        setShowDisclaimer(true);
      } else if (!localStorage.getItem('onboardingSeen')) {
        setShowOnboarding(true);
        const timer = setTimeout(() => {
          localStorage.setItem('onboardingSeen', 'true');
          setShowOnboarding(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      toast.error('Lỗi khởi tạo, vui lòng tải lại trang.');
    }
  }, []);
  const settings = useSettings();
  const history = useHistory();
  const stats = useStats();
  const isAutoRunning = useIsAutoRunning();
  const lastRound = useLastRound();
  const balance = useBalance();
  const bettingHistory = useBettingHistory();
  const { spinNewRound, resetHistory, resetStatsAndBalance } = useGameActions();
  const triggerConfetti = useCallback(() => {
    const colors = ['#F38020', '#4FACFE', '#F5576C', '#FFD700'];
    const newConfetti = Array.from({ length: 20 }).map((_, i) => (
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
  }, []);
  const handleSpin = useCallback(() => {
    const { newRound, profit, wasCorrect } = spinNewRound();
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
      toast.info(`Kỳ #${newRound.roundNumber} - ${newRound.taiXiu} - ${newRound.chanLe}`, { description: `Dự đoán c���a bạn: ${wasCorrect ? 'Đúng' : 'Sai'}` });
    } else {
      toast.info(`Kỳ #${newRound.roundNumber} - ${newRound.taiXiu} - ${newRound.chanLe}`, { description: 'Đã có kết qu�� mới.' });
    }
  }, [spinNewRound, triggerConfetti]);
  const handleDisclaimerClose = useCallback(() => {
    localStorage.setItem('disclaimerSeen', 'true');
    setShowDisclaimer(false);
    if (!localStorage.getItem('onboardingSeen')) {
      setShowOnboarding(true);
      setTimeout(() => {
        localStorage.setItem('onboardingSeen', 'true');
        setShowOnboarding(false);
      }, 5000);
    }
  }, []);
  const handleUserInteraction = () => {
    if (!hasInteracted.current) {
      getGameActions().userInteracted();
      hasInteracted.current = true;
    }
  };
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="space-y-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden" onClick={handleUserInteraction} onTouchStart={handleUserInteraction}>
      <div className="absolute inset-0 bg-gradient-mesh opacity-10 pointer-events-none" />
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <Button variant="ghost" size="icon" onClick={() => setShowGuide(true)} className="text-2xl hover:scale-110 hover:rotate-12 transition-all duration-200 active:scale-90" aria-label="Mở hướng dẫn">
          <HelpCircle className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="text-2xl hover:scale-110 hover:rotate-12 transition-all duration-200 active:scale-90" aria-label="Mở cài đặt">
          <SettingsIcon className="h-6 w-6" />
        </Button>
      </div>
      <header className="text-center pt-8 pb-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-balance leading-tight">
          <span className="text-gradient">Tài X��u Miền Bắc</span> Giả Lập
        </h1>
        <p className="text-sm text-muted-foreground mt-2">Không dùng cho cá cược tiền thật</p>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Trò chơi Tài Xỉu Miền Bắc Giả Lập - Kỳ hiện tại và dự đoán">
        <TooltipProvider>
          <div className="py-8 md:py-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 space-y-8"
              >
                <Tooltip open={showOnboarding}><TooltipTrigger asChild><div><RoundTimer isAutoRunning={isAutoRunning} onExpire={handleSpin} intervalSeconds={20} /></div></TooltipTrigger><TooltipContent><p>Đếm ngược kỳ tiếp theo (20s)</p></TooltipContent></Tooltip>
                <CurrentRoundPanel round={lastRound} />
                <Tooltip open={showOnboarding}><TooltipTrigger asChild><div><PredictionPanel onSpinNow={handleSpin} defaultBet={storage.getBetAmount()} /></div></TooltipTrigger><TooltipContent><p>Dự đoán và đặt cược tại đây</p></TooltipContent></Tooltip>
                <TrendView />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-8"
              >
                <Tooltip open={showOnboarding}><TooltipTrigger asChild><div><StatsPanel stats={stats} balance={balance} bettingHistory={bettingHistory} onResetStats={resetStatsAndBalance} /></div></TooltipTrigger><TooltipContent><p>Theo d��i thống kê và thành tích của bạn</p></TooltipContent></Tooltip>
                <HistoryTable history={history} onClearHistory={resetHistory} />
              </motion.div>
            </div>
          </div>
        </TooltipProvider>
      </main>
      <footer className="text-center py-8 text-muted-foreground/80 text-sm">
        <p>© 2025 CLTX MB ��� Dev by MinL x Cloudflare</p>
        <p className="mt-1">Built with ��️ at Cloudflare</p>
        <Badge variant="secondary" className="text-xs mt-2 opacity-80">Không dùng cho cá cược tiền thật</Badge>
      </footer>
      <Toaster richColors closeButton theme={settings?.theme === 'light' ? 'light' : 'dark'} />
      <SettingsPanel open={showSettings} onOpenChange={setShowSettings} />
      <GameGuide open={showGuide} onOpenChange={setShowGuide} />
      <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lưu ý quan trọng</AlertDialogTitle>
            <AlertDialogDescription>
              Đây là một ứng dụng giả lập chỉ dành cho m��c đích giải trí. Mọi kết quả đều là ngẫu nhiên và không liên quan đến kết quả xổ số thực tế. Ứng dụng này không sử dụng tiền thật và không dành cho mục đích cờ bạc.
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