import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import type { Round } from '@/types';
import { cn } from '@/lib/utils';
const TrendDot = memo(({ round, viewMode, index }: { round: Round; viewMode: 'tx' | 'cl'; index: number }) => {
  const isTx = viewMode === 'tx';
  const result = isTx ? round.taiXiu : round.chanLe;
  const isPrimary = isTx ? result === 'Tài' : result === 'Lẻ'; // Red for Tài/Lẻ
  const isSecondary = isTx ? result === 'Xỉu' : result === 'Chẵn'; // Blue for Xỉu/Chẵn
  const label = isTx
    ? (result === 'Tài' ? 'T' : 'X')
    : (result === 'Lẻ' ? 'L' : 'C');
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              "center w-5 h-5 rounded-full font-mono text-[10px] font-bold text-white shadow-sm hover:scale-110 active:scale-105 hover:shadow-glow transition-all duration-200 cursor-pointer",
              isPrimary && "bg-red-500/90",
              isSecondary && "bg-blue-500/90"
            )}
          >
            {label}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-bold">Kỳ #{round.roundNumber}</p>
            <p>Kết quả: {round.digits}</p>
            <p>Tổng: {round.sum}</p>
            <p>T/X: <span className={cn(round.taiXiu === 'Tài' ? 'text-red-400' : 'text-blue-400')}>{round.taiXiu}</span></p>
            <p>C/L: <span className={cn(round.chanLe === 'Lẻ' ? 'text-red-400' : 'text-blue-400')}>{round.chanLe}</span></p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
TrendDot.displayName = 'TrendDot';
function TrendViewComponent({ history }: { history: Round[] }) {
  const [viewMode, setViewMode] = useState<'tx' | 'cl'>('tx');
  if (!history) {
    console.warn("TrendView received null or undefined history.");
    return <Skeleton className="h-48 w-full" />;
  }
  // Display up to 50 recent rounds, reversed for chronological order (oldest top-left)
  const recentHistory = history.slice(0, 50).reverse();
  return (
    <Card className="glass-dark border-purple-500/20 hover:shadow-glow transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-2xl font-display text-gradient">Xu Hướng Gần Đây</CardTitle>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value: 'tx' | 'cl') => value && setViewMode(value)}
            className="w-full sm:w-auto"
            aria-label="Chế độ xem xu hướng"
          >
            <ToggleGroupItem value="tx" aria-label="Xem xu hướng Tài Xỉu" className="flex-1 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Tài Xỉu</ToggleGroupItem>
            <ToggleGroupItem value="cl" aria-label="Xem xu hướng Chẵn Lẻ" className="flex-1 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Chẵn Lẻ</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {recentHistory.length >= 5 ? (
          <div className="grid grid-cols-10 sm:grid-cols-12 gap-1.5 p-2 rounded-lg bg-black/20">
            {recentHistory.map((round, index) => (
              <TrendDot key={round.id} round={round} viewMode={viewMode} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-4 h-32 center">
            Chưa có đủ dữ liệu để hiển thị xu hướng.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export const TrendView = memo(TrendViewComponent);
TrendView.displayName = 'TrendView';