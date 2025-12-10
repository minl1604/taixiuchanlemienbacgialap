import React, { useState, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import type { Round, TaiXiu, ChanLe } from '@/types';
import { cn } from '@/lib/utils';
const TrendDot = memo(({ round, viewMode, index }: { round: Round; viewMode: 'taiXiu' | 'chanLe'; index: number }) => {
  const isTx = viewMode === 'taiXiu';
  const result: TaiXiu | ChanLe = isTx ? round.taiXiu : round.chanLe;
  // Tài/Lẻ are "primary" (red), Xỉu/Chẵn are "secondary" (blue)
  const isPrimary = (isTx && result === 'Tài') || (!isTx && result === 'Lẻ');
  const isSecondary = (isTx && result === 'Xỉu') || (!isTx && result === 'Chẵn');
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
              "center w-6 h-6 rounded-full font-mono text-xs font-bold text-white shadow-sm transition-all duration-200 cursor-pointer",
              isPrimary && "bg-red-500/90 hover:shadow-[0_0_10px_theme(colors.red.500)]",
              isSecondary && "bg-blue-500/90 hover:shadow-[0_0_10px_theme(colors.blue.500)]",
              "hover:scale-110 active:scale-105"
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
  const [viewMode, setViewMode] = useState<'taiXiu' | 'chanLe'>('taiXiu');
  const groupedRows = useMemo(() => {
    if (!history || history.length === 0) {
      return [];
    }
    // Take the 50 most recent rounds. history[0] is the newest.
    // Reverse to process from oldest to newest.
    const recentHistory = history.slice(0, 50).reverse();
    if (recentHistory.length === 0) {
      return [];
    }
    const rows: Round[][] = [];
    let currentRow: Round[] = [recentHistory[0]];
    for (let i = 1; i < recentHistory.length; i++) {
      const currentRound = recentHistory[i];
      const prevRound = recentHistory[i - 1];
      const currentResult = viewMode === 'taiXiu' ? currentRound.taiXiu : currentRound.chanLe;
      const prevResult = viewMode === 'taiXiu' ? prevRound.taiXiu : prevRound.chanLe;
      if (currentResult === prevResult) {
        currentRow.push(currentRound);
      } else {
        rows.push(currentRow);
        currentRow = [currentRound];
      }
    }
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
    // Reverse the final array of rows. This puts the newest row at the top for rendering.
    return rows.reverse();
  }, [history, viewMode]);
  if (!history) {
    console.warn("TrendView received null or undefined history.");
    return <Skeleton className="h-48 w-full" />;
  }
  return (
    <Card className="glass-dark border-purple-500/20 hover:shadow-glow transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-2xl font-display text-gradient">Xu Hướng</CardTitle>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value: 'taiXiu' | 'chanLe') => value && setViewMode(value)}
            className="w-full sm:w-auto"
            aria-label="Chế độ xem xu hướng"
          >
            <ToggleGroupItem value="taiXiu" aria-label="Xem xu hướng Tài Xỉu" className="flex-1 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Tài Xỉu</ToggleGroupItem>
            <ToggleGroupItem value="chanLe" aria-label="Xem xu hướng Chẵn Lẻ" className="flex-1 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Chẵn Lẻ</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {history.length >= 5 ? (
          <div className="flex flex-col gap-1 p-2 rounded-lg bg-black/20 min-h-[12rem]">
            {groupedRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-row flex-wrap gap-0.5">
                {row.map((round, dotIndex) => (
                  <TrendDot key={round.id} round={round} viewMode={viewMode} index={rowIndex * 15 + dotIndex} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-4 h-48 center">
            Chưa có đủ dữ liệu để hiển thị xu hướng.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export const TrendView = memo(TrendViewComponent);
TrendView.displayName = 'TrendView';