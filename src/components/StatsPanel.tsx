import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import type { Stats, BetRecord } from '@/types';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
const BetHistoryItem = memo(({ bet }: { bet: BetRecord }) => (
  <div className="flex justify-between items-center">
    <span>Kỳ #{bet.roundNumber}</span>
    {bet.outcome === 'win' && <Badge className="bg-green-500/80">Thắng {bet.profit.toLocaleString('vi-VN')}</Badge>}
    {bet.outcome === 'partial' && <Badge variant="secondary">Hòa</Badge>}
    {bet.outcome === 'loss' && <Badge variant="destructive">Thua {Math.abs(bet.profit).toLocaleString('vi-VN')}</Badge>}
  </div>
));
BetHistoryItem.displayName = 'BetHistoryItem';
function StatsPanelComponent({ stats, balance, bettingHistory, onResetStats }: { stats: Stats; balance: number; bettingHistory: BetRecord[]; onResetStats: () => void; }) {
  const recentBets = bettingHistory ? bettingHistory.slice(0,20) : [];
  if (!stats || !bettingHistory) {
    return (
      <Card className="glass-dark border-yellow-500/20">
        <CardHeader><CardTitle>Thống kê</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-2/3" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
          <Skeleton className="h-6 w-1/2" />
          <div className="pt-2">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <div className="flex gap-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-24" /></div>
          </div>
          <div className="pt-2">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  const accuracy = stats.predictionsMade > 0 ? Math.round((stats.correct / stats.predictionsMade) * 100) : 0;
  const totalWagered = bettingHistory.reduce((sum, bet) => sum + bet.betAmount, 0);
  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);
  const handleReset = () => {
    onResetStats();
    toast.success("Đã đặt lại thống kê và số dư.");
  };
  return (
    <Card className="glass-dark border-yellow-500/20 hover:shadow-glow transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-display">Thống kê</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">Đặt lại</Button>
            </AlertDialogTrigger>
              <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ xóa toàn bộ thống kê, thành tích, lịch sử cược và đặt lại số dư về mặc định.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Xác nhận</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Số dư khả dụng (VND)</span>
          <span className="text-2xl font-bold text-gradient">{(balance || 0).toLocaleString('vi-VN')}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Lợi nhuận ròng</span>
          <span className={cn("text-lg font-semibold", stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400')}>
            {(stats.netProfit || 0).toLocaleString('vi-VN')}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Tổng cược</span>
          <span className="text-lg font-semibold">{(totalWagered || 0).toLocaleString('vi-VN')}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground">Độ chính xác</span>
            <span className="text-lg font-semibold">{accuracy}% ({stats.correct}/{stats.predictionsMade})</span>
          </div>
          <Progress value={accuracy} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500 shimmer-bg" aria-label={`Độ chính xác: ${accuracy}%`} />
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Chuỗi thắng dài nhất</span>
          <span className="text-lg font-semibold">{stats.longestStreak}</span>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Thành tích</p>
          <div className="flex flex-wrap gap-2">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map((ach, i) => {
                const tooltipId = `ach-tooltip-${ach.id}`;
                return (
                  <TooltipProvider key={ach.id} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                          <Badge className="bg-yellow-500/80 hover:bg-yellow-500/90 text-yellow-foreground border-yellow-400" aria-describedby={tooltipId}>
                            <Trophy className="h-4 w-4 mr-1.5" /> {ach.name}
                          </Badge>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent id={tooltipId}>{ach.description}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })
            ) : (
              <p className="text-xs text-muted-foreground">Chưa có thành tích nào được mở khóa.</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Lịch sử cược</p>
          <ScrollArea className="h-40 pr-4" aria-label="Lịch sử cược gần đây">
            <div className="space-y-2 text-sm">
              {recentBets.length > 0 ? (
                recentBets.map((bet) => (
                  <BetHistoryItem key={bet.roundId} bet={bet} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Chưa có lịch sử cược.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
export const StatsPanel = memo(StatsPanelComponent);
StatsPanel.displayName = 'StatsPanel';