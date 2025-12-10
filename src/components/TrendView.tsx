import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ZAxis } from 'recharts';
import type { Round } from '@/types';
import { cn } from '@/lib/utils';
interface TrendViewProps {
  history: Round[];
}
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-background/80 backdrop-blur-sm border rounded-md shadow-lg text-sm">
        <p className="font-bold">Kỳ #{data.roundNumber}</p>
        <p>Kết quả: {data.digits}</p>
        <p>Tổng: {data.sum}</p>
        <p>T/X: <span className={cn(data.taiXiu === 'Tài' ? 'text-red-400' : 'text-blue-400')}>{data.taiXiu}</span></p>
        <p>C/L: <span className={cn(data.chanLe === 'Lẻ' ? 'text-red-400' : 'text-blue-400')}>{data.chanLe}</span></p>
      </div>
    );
  }
  return null;
};
const TrendChart = ({ data, type }: { data: any[]; type: 'tx' | 'cl' }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground p-4 h-40 center">Chưa có dữ liệu xu hướng.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={150}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -20 }}>
        <XAxis dataKey="roundNumber" type="number" domain={['dataMin', 'dataMax']} tick={{ fontSize: 10 }} />
        <YAxis dataKey="sum" type="number" domain={[0, 45]} tick={{ fontSize: 10 }} />
        <ZAxis dataKey="roundNumber" range={[20, 22]} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Scatter
          data={data.filter(d => type === 'tx' ? d.taiXiu === 'Tài' : d.chanLe === 'Lẻ')}
          fill="#ef4444"
          shape="circle"
        />
        <Scatter
          data={data.filter(d => type === 'tx' ? d.taiXiu === 'Xỉu' : d.chanLe === 'Chẵn')}
          fill="#3b82f6"
          shape="circle"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
export function TrendView({ history }: TrendViewProps) {
  const [showAll, setShowAll] = useState(false);
  const chartData = useMemo(() => {
    const reversedHistory = [...history].reverse();
    const data = showAll ? reversedHistory : reversedHistory.slice(-50);
    return data.map(round => ({
      ...round,
    }));
  }, [history, showAll]);
  return (
    <Card className="glass-dark border-purple-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-display">Xu hướng</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
          {showAll ? `Hiện 50 kỳ` : `Hiện tất cả (${history.length})`}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div>
            <p className="text-sm font-semibold mb-2">Tài (Đỏ) / Xỉu (Xanh)</p>
            <TrendChart data={chartData} type="tx" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Lẻ (Đỏ) / Chẵn (Xanh)</p>
            <TrendChart data={chartData} type="cl" />
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}