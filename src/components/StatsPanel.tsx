import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Stats } from '@/types';
interface StatsPanelProps {
  stats: Stats;
  onResetStats: () => void;
}
export function StatsPanel({ stats, onResetStats }: StatsPanelProps) {
  const accuracy = stats.predictionsMade > 0 ? Math.round((stats.correct / stats.predictionsMade) * 100) : 0;
  return (
    <Card className="glass-dark border-yellow-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-display">Thống kê</CardTitle>
        <Button variant="outline" size="sm" onClick={onResetStats}>Đặt lại</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Điểm vui</span>
          <span className="text-2xl font-bold text-gradient">{stats.points}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Tổng dự đoán</span>
          <span className="text-lg font-semibold">{stats.predictionsMade}</span>
        </div>
        <div className="flex justify-between items-baseline text-green-400">
          <span className="text-muted-foreground">Đúng</span>
          <span className="text-lg font-semibold">{stats.correct}</span>
        </div>
        <div className="flex justify-between items-baseline text-red-400">
          <span className="text-muted-foreground">Sai</span>
          <span className="text-lg font-semibold">{stats.incorrect}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground">% Chính xác</span>
            <span className="text-lg font-semibold">{accuracy}%</span>
          </div>
          <Progress value={accuracy} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Chuỗi thắng hiện tại</span>
          <span className="text-lg font-semibold">{stats.currentStreak}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">Chuỗi thắng dài nhất</span>
          <span className="text-lg font-semibold">{stats.longestStreak}</span>
        </div>
      </CardContent>
    </Card>
  );
}