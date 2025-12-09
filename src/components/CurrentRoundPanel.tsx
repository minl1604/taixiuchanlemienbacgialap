import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Round } from '@/types';
import { cn } from '@/lib/utils';
interface CurrentRoundPanelProps {
  round?: Round;
}
const DigitCircle = ({ digit, index }: { digit: string; index: number }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
    className="center w-14 h-14 md:w-18 md:h-18 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner"
  >
    <span className="font-mono text-3xl md:text-4xl font-bold text-white tabular-nums">{digit}</span>
  </motion.div>
);
export function CurrentRoundPanel({ round }: CurrentRoundPanelProps) {
  const digits = round?.digits.split('') ?? Array(5).fill(null);
  return (
    <Card className="glass-dark border-orange-500/20 overflow-hidden">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-display">
          Kỳ hiện tại: <span className="text-gradient">#{round?.roundNumber ?? '...'}</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {round ? new Date(round.timestamp).toLocaleString('vi-VN') : 'Đang chờ kết qu���...'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Giải đặc biệt</p>
          <div className="flex justify-center items-center gap-2 md:gap-4">
            <AnimatePresence>
              {digits.map((digit, i) =>
                digit !== null ? (
                  <DigitCircle key={`${round?.id}-${i}`} digit={digit} index={i} />
                ) : (
                  <Skeleton key={i} className="w-14 h-14 md:w-18 md:h-18 rounded-full" />
                )
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Tổng 5 chữ số</p>
            {round ? (
              <p className="text-3xl font-bold">{round.sum}</p>
            ) : (
              <Skeleton className="h-9 w-12 mx-auto mt-1" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tài / Xỉu</p>
            {round ? (
              <Badge
                className={cn(
                  'text-lg font-bold mt-2 px-4 py-1',
                  round.taiXiu === 'Tài' ? 'bg-red-500/80 border-red-400' : 'bg-blue-500/80 border-blue-400'
                )}
              >
                {round.taiXiu}
              </Badge>
            ) : (
              <Skeleton className="h-7 w-16 mx-auto mt-2" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Chẵn / Lẻ</p>
            {round ? (
              <Badge
                className={cn(
                  'text-lg font-bold mt-2 px-4 py-1',
                  round.chanLe === 'Lẻ' ? 'bg-red-500/80 border-red-400' : 'bg-blue-500/80 border-blue-400'
                )}
              >
                {round.chanLe}
              </Badge>
            ) : (
              <Skeleton className="h-7 w-16 mx-auto mt-2" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}