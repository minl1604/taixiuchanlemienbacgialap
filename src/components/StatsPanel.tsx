import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Stats, BetRecord } from '@/types';
import { cn } from '@/lib/utils';
interface StatsPanelProps {
  stats: Stats;
  balance: number;
  bettingHistory: BetRecord[];
  onResetStats: () => void;
}
export function StatsPanel({ stats, balance, bettingHistory, onResetStats }: StatsPanelProps) {
  const accuracy = stats.predictionsMade > 0 ? Math.round((stats.correct / stats.predictionsMade) * 100) : 0;
  const totalWagered = bettingHistory.reduce((sum, bet) => sum + bet.betAmount, 0);
  return (
    <Card className="glass-dark border-yellow-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-display">Thống kê</CardTitle>
        <Button variant="outline" size="sm" onClick={onResetStats}>Đặt lại</Button>
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
          <Progress value={accuracy} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Chuỗi thắng dài nh��t</span>
          <span className="text-lg font-semibold">{stats.longestStreak}</span>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Lịch sử cược</p>
          <ScrollArea className="h-40 pr-4">
            <div className="space-y-2 text-sm">
              {bettingHistory.length > 0 ? (
                bettingHistory.slice(0, 20).map((bet) => (
                  <div key={bet.roundId} className="flex justify-between items-center">
                    <span>Kỳ #{bet.roundNumber}</span>
                    {bet.outcome === 'win' && <Badge className="bg-green-500/80">Thắng {bet.profit.toLocaleString('vi-VN')}</Badge>}
                    {bet.outcome === 'partial' && <Badge variant="secondary">Hòa</Badge>}
                    {bet.outcome === 'loss' && <Badge variant="destructive">Thua {Math.abs(bet.profit).toLocaleString('vi-VN')}</Badge>}
                  </div>
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