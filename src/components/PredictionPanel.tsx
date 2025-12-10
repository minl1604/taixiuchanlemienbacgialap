import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useGameActions, useCurrentPrediction, useIsAutoRunning, useBalance } from '@/hooks/useGameStore';
import type { TaiXiu, ChanLe } from '@/types';
import { toast } from 'sonner';
import * as storage from '@/lib/storage';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
function PredictionPanelComponent({ onSpinNow, defaultBet }: { onSpinNow: () => void; defaultBet?: number; }) {
  const { setPrediction, startAuto, stopAuto } = useGameActions();
  const currentPrediction = useCurrentPrediction();
  const isAutoRunning = useIsAutoRunning();
  const balance = useBalance();
  const [predictionMode, setPredictionMode] = useState<'taiXiu' | 'chanLe'>('taiXiu');
  const [betAmount, setBetAmount] = useState<string>("");
  const [selectedTaiXiu, setSelectedTaiXiu] = useState<string>("");
  const [selectedChanLe, setSelectedChanLe] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  useEffect(() => {
    setBetAmount(String(defaultBet || 500000000));
  }, [defaultBet]);
  useEffect(() => {
    setSelectedTaiXiu(currentPrediction.taiXiu || "");
    setSelectedChanLe(currentPrediction.chanLe || "");
    // Reset spinning state after a round resolves and prediction is cleared
    if (!currentPrediction.taiXiu && !currentPrediction.chanLe) {
      setIsSpinning(false);
    }
  }, [currentPrediction]);
  const handleBetAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBetAmount(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      storage.setBetAmount(numValue);
    }
  }, []);
  const handleModeChange = useCallback((mode: 'taiXiu' | 'chanLe') => {
    if (!mode || mode === predictionMode) return;
    setPredictionMode(mode);
    if (mode === 'taiXiu') {
      setPrediction({ chanLe: undefined });
      setSelectedChanLe("");
    } else {
      setPrediction({ taiXiu: undefined });
      setSelectedTaiXiu("");
    }
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }, [predictionMode, setPrediction]);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleModeChange('chanLe'),
    onSwipedRight: () => handleModeChange('taiXiu'),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });
  const handleTaiXiuChange = useCallback((value: string | undefined) => {
    setSelectedTaiXiu(value || "");
    setPrediction({ taiXiu: value as TaiXiu | undefined, chanLe: undefined });
  }, [setPrediction]);
  const handleChanLeChange = useCallback((value: string | undefined) => {
    setSelectedChanLe(value || "");
    setPrediction({ chanLe: value as ChanLe | undefined, taiXiu: undefined });
  }, [setPrediction]);
  const handleSpinWithBet = useCallback(() => {
    const betValue = parseInt(betAmount, 10);
    if (isNaN(betValue) || betValue <= 0) {
      toast.error("Số ti��n cược không hợp lệ.");
      return;
    }
    if (betValue > balance) {
      toast.error("Số dư không đủ.");
      return;
    }
    if (predictionMode === 'taiXiu' && !selectedTaiXiu) {
      toast.warning("Vui lòng chọn dự đoán Tài hoặc Xỉu.");
      return;
    }
    if (predictionMode === 'chanLe' && !selectedChanLe) {
      toast.warning("Vui lòng chọn dự đoán Chẵn hoặc Lẻ.");
      return;
    }
    setIsSpinning(true);
    setPrediction({ bet: betValue });
    toast.success(`Đặt cược ${betValue.toLocaleString('vi-VN')} VND thành công!`);
    setTimeout(() => {
      onSpinNow();
    }, 100);
  }, [betAmount, balance, predictionMode, selectedTaiXiu, selectedChanLe, setPrediction, onSpinNow]);
  return (
    <Card className="glass-dark border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-center">Dự đoán kỳ này</CardTitle>
        <p className="text-center text-muted-foreground">Số dư: <span className="font-bold text-primary">{(balance || 0).toLocaleString('vi-VN')} VND</span></p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div {...swipeHandlers} className="space-y-4 cursor-grab active:cursor-grabbing">
          <Label id="mode-label" className="text-sm text-center text-muted-foreground block">Chọn chế độ (hoặc lướt ngang)</Label>
          <ToggleGroup
            type="single"
            value={predictionMode}
            onValueChange={(value: 'taiXiu' | 'chanLe') => handleModeChange(value)}
            className="grid grid-cols-2 gap-2"
            aria-labelledby="mode-label"
          >
            <ToggleGroupItem value="taiXiu" aria-label="Chế độ Tài Xỉu" className="h-12 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Tài / Xỉu</ToggleGroupItem>
            <ToggleGroupItem value="chanLe" aria-label="Chế độ Chẵn Lẻ" className="h-12 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Chẵn / Lẻ</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <Label id="selection-label" className="sr-only">{predictionMode === 'taiXiu' ? 'Chọn Tài hoặc Xỉu' : 'Chọn Chẵn hoặc Lẻ'}</Label>
          {predictionMode === 'taiXiu' && (
            <ToggleGroup type="single" className="grid grid-cols-2 gap-2" value={selectedTaiXiu} onValueChange={handleTaiXiuChange} aria-labelledby="selection-label">
              <ToggleGroupItem value="Tài" aria-label="Chọn Tài" className={cn("text-2xl font-bold data-[state=on]:bg-red-500/80 data-[state=on]:text-white", "h-14 md:h-16 min-h-[44px]")}>Tài</ToggleGroupItem>
              <ToggleGroupItem value="Xỉu" aria-label="Chọn Xỉu" className={cn("text-2xl font-bold data-[state=on]:bg-blue-500/80 data-[state=on]:text-white", "h-14 md:h-16 min-h-[44px]")}>Xỉu</ToggleGroupItem>
            </ToggleGroup>
          )}
          {predictionMode === 'chanLe' && (
            <ToggleGroup type="single" className="grid grid-cols-2 gap-2" value={selectedChanLe} onValueChange={handleChanLeChange} aria-labelledby="selection-label">
              <ToggleGroupItem value="Lẻ" aria-label="Chọn Lẻ" className={cn("text-2xl font-bold data-[state=on]:bg-red-500/80 data-[state=on]:text-white", "h-14 md:h-16 min-h-[44px]")}>Lẻ</ToggleGroupItem>
              <ToggleGroupItem value="Chẵn" aria-label="Chọn Chẵn" className={cn("text-2xl font-bold data-[state=on]:bg-blue-500/80 data-[state=on]:text-white", "h-14 md:h-16 min-h-[44px]")}>Chẵn</ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
        <div className="space-y-2">
          {balance === undefined ? (
            <Skeleton className="h-14 w-full" />
          ) : (
            <Input type="number" placeholder="Số tiền cược" value={betAmount} onChange={handleBetAmountChange} className="h-14 text-center text-lg min-h-[44px]" min="0" aria-describedby="bet-help" />
          )}
          <p id="bet-help" className="text-xs text-muted-foreground text-center">Số tiền phải &gt; 0 và &le; số dư.</p>
        </div>
        <div className="space-y-2">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button size="lg" onClick={handleSpinWithBet} disabled={isSpinning} className="btn-gradient w-full h-14 text-lg min-h-[44px]">
              {isSpinning ? 'Đang quay...' : 'Đặt cược & Quay'}
            </Button>
          </motion.div>
          {isAutoRunning ? (
            <Button size="lg" variant="destructive" onClick={stopAuto} className="h-14 text-lg min-h-[44px]">Dừng Auto</Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={startAuto} className="h-14 text-lg min-h-[44px]">Bắt đầu Auto</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export const PredictionPanel = memo(PredictionPanelComponent);
PredictionPanel.displayName = 'PredictionPanel';