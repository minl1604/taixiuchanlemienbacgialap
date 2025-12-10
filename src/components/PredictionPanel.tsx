import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useGameActions, useCurrentPrediction, useIsAutoRunning, useBalance } from '@/hooks/useGameStore';
import type { TaiXiu, ChanLe } from '@/types';
import { toast } from 'sonner';
interface PredictionPanelProps {
  onSpinNow: () => void;
}
export function PredictionPanel({ onSpinNow }: PredictionPanelProps) {
  const { setPrediction, startAuto, stopAuto } = useGameActions();
  const currentPrediction = useCurrentPrediction();
  const isAutoRunning = useIsAutoRunning();
  const balance = useBalance();
  const [betAmount, setBetAmount] = useState<string>("500000000");
  useEffect(() => {
    if (!currentPrediction.taiXiu && !currentPrediction.chanLe) {
      // Optional: Reset bet amount for new round if desired
    }
  }, [currentPrediction]);
  const handleTaiXiuChange = (value: string) => {
    if (value) {
      setPrediction({ taiXiu: value as TaiXiu });
    }
  };
  const handleChanLeChange = (value: string) => {
    if (value) {
      setPrediction({ chanLe: value as ChanLe });
    }
  };
  const handleSpinWithBet = () => {
    const betValue = parseInt(betAmount, 10);
    if (isNaN(betValue) || betValue <= 0) {
      toast.error("Số tiền cược không hợp lệ.");
      return;
    }
    if (betValue > balance) {
      toast.error("Số d�� không đủ.");
      return;
    }
    if (!currentPrediction.taiXiu && !currentPrediction.chanLe) {
      toast.warning("Vui lòng chọn dự đoán.");
      return;
    }
    setPrediction({ bet: betValue });
    toast.success(`Đặt cược ${betValue.toLocaleString('vi-VN')} VND thành công!`);
    setTimeout(() => {
      onSpinNow();
    }, 100);
  };
  return (
    <Card className="glass-dark border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-center">Dự đoán kỳ này</CardTitle>
        <p className="text-center text-muted-foreground">Số dư: <span className="font-bold text-primary">{(balance || 0).toLocaleString('vi-VN')} VND</span></p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <ToggleGroup
            type="single"
            className="grid grid-cols-2 gap-2"
            value={currentPrediction.taiXiu}
            onValueChange={handleTaiXiuChange}
          >
            <ToggleGroupItem value="Tài" className="h-16 text-2xl font-bold data-[state=on]:bg-red-500/80 data-[state=on]:text-white">Tài</ToggleGroupItem>
            <ToggleGroupItem value="Xỉu" className="h-16 text-2xl font-bold data-[state=on]:bg-blue-500/80 data-[state=on]:text-white">Xỉu</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            className="grid grid-cols-2 gap-2"
            value={currentPrediction.chanLe}
            onValueChange={handleChanLeChange}
          >
            <ToggleGroupItem value="Lẻ" className="h-16 text-2xl font-bold data-[state=on]:bg-red-500/80 data-[state=on]:text-white">Lẻ</ToggleGroupItem>
            <ToggleGroupItem value="Chẵn" className="h-16 text-2xl font-bold data-[state=on]:bg-blue-500/80 data-[state=on]:text-white">Chẵn</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Số tiền cược"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="h-14 text-center text-lg"
            min="0"
          />
          <Button size="lg" onClick={handleSpinWithBet} className="btn-gradient w-full h-14 text-lg">
            Đặt cược & Quay
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {isAutoRunning ? (
            <Button size="lg" variant="destructive" onClick={stopAuto} className="h-14 text-lg">Dừng Auto</Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={startAuto} className="h-14 text-lg">B���t đầu Auto</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}