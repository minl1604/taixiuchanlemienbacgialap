import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Round } from '@/types';
import { cn } from '@/lib/utils';
interface TrendViewProps {
  history: Round[];
}
const TrendDot = ({ round, type }: { round: Round; type: 'tx' | 'cl' }) => {
  const isTai = round.taiXiu === 'Tài';
  const isLe = round.chanLe === 'Lẻ';
  const colorClass = type === 'tx' 
    ? (isTai ? 'bg-red-500' : 'bg-blue-500')
    : (isLe ? 'bg-red-500' : 'bg-blue-500');
  const label = type === 'tx' ? round.taiXiu[0] : round.chanLe[0];
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn("w-5 h-5 rounded-full center text-xs font-bold text-white", colorClass)}
          >
            {label}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Kỳ #{round.roundNumber}: {round.digits} (Tổng {round.sum})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
const TrendGrid = ({ history, type }: { history: Round[]; type: 'tx' | 'cl' }) => (
  <div className="grid grid-cols-10 md:grid-cols-20 gap-2 p-2 bg-black/20 rounded-md">
    {history.slice(0, 60).map((round) => (
      <TrendDot key={`${round.id}-${type}`} round={round} type={type} />
    ))}
  </div>
);
export function TrendView({ history }: TrendViewProps) {
  return (
    <Card className="glass-dark border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-center">Xu hướng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold mb-2">Tài (Đỏ) / Xỉu (Xanh)</p>
          <TrendGrid history={history} type="tx" />
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Lẻ (Đỏ) / Chẵn (Xanh)</p>
          <TrendGrid history={history} type="cl" />
        </div>
      </CardContent>
    </Card>
  );
}