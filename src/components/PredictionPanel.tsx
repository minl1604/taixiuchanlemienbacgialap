import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useGameActions, useCurrentPrediction, useIsAutoRunning, useStats } from '@/hooks/useGameStore';
import type { TaiXiu, ChanLe } from '@/types';
interface PredictionPanelProps {
  onSpinNow: () => void;
}
export function PredictionPanel({ onSpinNow }: PredictionPanelProps) {
  const { setPrediction, startAuto, stopAuto } = useGameActions();
  const currentPrediction = useCurrentPrediction();
  const isAutoRunning = useIsAutoRunning();
  const stats = useStats();
  const handleTaiXiuChange = (value: TaiXiu) => {
    setPrediction({ taiXiu: value || undefined });
  };
  const handleChanLeChange = (value: ChanLe) => {
    setPrediction({ chanLe: value || undefined });
  };
  return (
    <Card className="glass-dark border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-center">Dự đoán kỳ này</CardTitle>
        <p className="text-center text-muted-foreground">Điểm vui: <span className="font-bold text-primary">{stats.points}</span></p>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {isAutoRunning ? (
            <Button size="lg" variant="destructive" onClick={stopAuto} className="sm:col-span-3 h-14 text-lg">Dừng Auto</Button>
          ) : (
            <>
              <Button size="lg" variant="secondary" onClick={startAuto} className="h-14 text-lg">Bắt đầu Auto</Button>
              <Button size="lg" onClick={onSpinNow} className="btn-gradient sm:col-span-2 h-14 text-lg">Quay ngay 1 kỳ</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}