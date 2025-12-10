import React, { useState, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import type { Round, TaiXiu, ChanLe } from '@/types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useGameStore } from '@/hooks/useGameStore';
import { shallow } from 'zustand/shallow';
import { ChevronRight } from 'lucide-react';
const TrendDot = memo(({ round, viewMode, index, style }: { round: Round; viewMode: 'taiXiu' | 'chanLe'; index: number; style: React.CSSProperties }) => {
  const isTx = viewMode === 'taiXiu';
  const result: TaiXiu | ChanLe = isTx ? round.taiXiu : round.chanLe;
  const isPrimary = (isTx && result === 'Tài') || (!isTx && result === 'Lẻ');
  const isSecondary = (isTx && result === 'Xỉu') || (!isTx && result === 'Chẵn');
  const label = isTx ? (result === 'Tài' ? 'T' : 'X') : (result === 'Lẻ' ? 'L' : 'C');
  const tooltipId = `trend-dot-tooltip-${round.id}`;
  const ariaLabel = `K�� #${round.roundNumber}: ${result}`;
  const handleMouseEnter = () => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (e) {
        // Vibration may be unsupported or blocked
      }
    }
  };
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            style={style}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(
              "center flex-none w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[11px] sm:text-xs font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.35)] border border-white/10 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-105",
              isPrimary && "bg-[linear-gradient(180deg,#c23a3a,#a82b2b)] hover:shadow-[0_0_10px_#c23a3a]",
              isSecondary && "bg-[linear-gradient(180deg,#2b6bd1,#1f4fb0)] hover:shadow-[0_0_10px_#2b6bd1]"
            )}
            aria-label={ariaLabel}
            aria-describedby={tooltipId}
            onMouseEnter={handleMouseEnter}
          >
            {label}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent id={tooltipId}>
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
const MAX_VISIBLE_COLUMNS = 15;
function TrendViewComponent({ history }: { history: Round[] }) {
  const [viewMode, setViewMode] = useState<'taiXiu' | 'chanLe'>('taiXiu');
  const { columns, maxColHeight, gridNodes, totalColumns } = useMemo(() => {
    if (!history || history.length === 0) {
      return { columns: [], maxColHeight: 0, gridNodes: [], totalColumns: 0 };
    }
    const recentHistory = history.slice(0, 50).reverse();
    const allColumns: Round[][] = [];
    if (recentHistory.length > 0) {
      allColumns.push([recentHistory[0]]);
    }
    for (let i = 1; i < recentHistory.length; i++) {
      const currentRound = recentHistory[i];
      const lastColumn = allColumns[allColumns.length - 1];
      const lastRoundInColumn = lastColumn[lastColumn.length - 1];
      const currentOutcome = viewMode === 'taiXiu' ? currentRound.taiXiu : currentRound.chanLe;
      const lastOutcome = viewMode === 'taiXiu' ? lastRoundInColumn.taiXiu : lastRoundInColumn.chanLe;
      if (currentOutcome === lastOutcome) {
        lastColumn.push(currentRound);
      } else {
        allColumns.push([currentRound]);
      }
    }
    const totalColumns = allColumns.length;
    const visibleColumns = totalColumns > MAX_VISIBLE_COLUMNS ? allColumns.slice(-MAX_VISIBLE_COLUMNS) : allColumns;
    const maxColHeight = visibleColumns.length > 0 ? Math.max(...visibleColumns.map(col => col.length)) : 0;
    const gridNodes = visibleColumns.flatMap((col, colIndex) =>
      col.map((round, rowIndex) => ({ round, colIndex, rowIndex }))
    );
    return { columns: visibleColumns, maxColHeight, gridNodes, totalColumns };
  }, [history, viewMode]);
  if (!history) {
    return <Skeleton className="h-48 w-full" />;
  }
  return (
    <Card className="glass-dark border-purple-500/20 hover:shadow-glow transition-shadow overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-2xl font-display text-gradient">Xu Hướng</CardTitle>
          <div className="w-full sm:w-auto">
            <Label id="trend-mode-label" className="sr-only">Chế ��ộ xem xu hướng</Label>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value: 'taiXiu' | 'chanLe') => value && setViewMode(value)}
              className="w-full"
              aria-labelledby="trend-mode-label"
            >
              <ToggleGroupItem value="taiXiu" aria-label="Xem xu hướng Tài Xỉu" className="flex-1 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Tài Xỉu</ToggleGroupItem>
              <ToggleGroupItem value="chanLe" aria-label="Xem xu hướng Chẵn Lẻ" className="flex-1 data-[state=on]:bg-purple-600/80 data-[state=on]:text-white">Chẵn Lẻ</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {history.length > 0 ? (
          <div className="w-full max-w-full overflow-x-auto pb-2 -mb-2">
            <div
              className="p-3 sm:p-4 rounded-lg bg-black/20 min-h-[12rem] inline-grid"
              style={{
                gridTemplateColumns: `repeat(${columns.length}, minmax(28px, 1fr))`,
                gridTemplateRows: `repeat(${maxColHeight}, minmax(28px, 1fr))`,
                gap: '6px 10px',
                justifyContent: 'center',
                minWidth: '100%',
              }}
            >
              {gridNodes.map(({ round, colIndex, rowIndex }, index) => (
                <TrendDot
                  key={round.id}
                  round={round}
                  viewMode={viewMode}
                  index={index}
                  style={{ gridColumn: colIndex + 1, gridRow: rowIndex + 1 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-4 min-h-[12rem] center flex-col">
            <div className="w-full space-y-2 p-2">
              <p>Đang chờ dữ liệu...</p>
            </div>
          </div>
        )}
        {totalColumns > MAX_VISIBLE_COLUMNS && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-black/50 to-transparent px-2 pointer-events-none">
            <ChevronRight className="h-5 w-5 text-white/70" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function TrendViewWrapper() {
  const history: Round[] = useGameStore((state) => state.history ?? [], shallow);
  return <TrendViewComponent history={history} />;
}
export const TrendView = memo(TrendViewWrapper);
TrendView.displayName = 'TrendView';