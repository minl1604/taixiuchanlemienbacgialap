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
  const isPrimary = isTx ? result === 'Tài' : result === 'Lẻ'; // Red
  const isSecondary = isTx ? result === 'Xỉu' : result === 'Chẵn'; // Blue
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
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              "center w-6 h-6 rounded-full font-mono text-xs font-bold text-white shadow-md hover:scale-110 active:scale-105 hover:shadow-glow transition-all duration-200 cursor-pointer",
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
  const recentHistory = history.slice(0, 40).reverse();
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
          >
            <ToggleGroupItem value="tx" className="flex-1 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Tài / Xỉu</ToggleGroupItem>
            <ToggleGroupItem value="cl" className="flex-1 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Chẵn / Lẻ</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {recentHistory.length > 0 ? (
          <div className="grid grid-cols-10 md:grid-cols-20 gap-2 p-2 rounded-lg bg-black/20">
            {recentHistory.map((round, index) => (
              <TrendDot key={round.id} round={round} viewMode={viewMode} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-4 h-40 center">
            Chưa có đủ dữ liệu để hiển thị xu hướng.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export const TrendView = memo(TrendViewComponent);
TrendView.displayName = 'TrendView';