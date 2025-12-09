import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Round } from '@/types';
import { cn } from '@/lib/utils';
interface HistoryTableProps {
  history: Round[];
  onClearHistory: () => void;
}
const MiniDigit = ({ digit }: { digit: string }) => (
  <div className="center w-5 h-5 rounded-full bg-gray-600 text-white text-xs font-bold">{digit}</div>
);
export function HistoryTable({ history, onClearHistory }: HistoryTableProps) {
  return (
    <Card className="glass-dark border-green-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-display">Kết quả gần đây</CardTitle>
        <Button variant="destructive" size="sm" onClick={onClearHistory}>Xóa l���ch sử</Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kỳ</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead className="text-center">Tổng</TableHead>
                <TableHead className="text-center">T/X</TableHead>
                <TableHead className="text-center">C/L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length > 0 ? (
                history.map((round) => (
                  <TableRow key={round.id}>
                    <TableCell className="font-medium">#{round.roundNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {round.digits.split('').map((d, i) => <MiniDigit key={i} digit={d} />)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold">{round.sum}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(round.taiXiu === 'Tài' ? 'bg-red-500' : 'bg-blue-500')}>{round.taiXiu}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(round.chanLe === 'Lẻ' ? 'bg-red-500' : 'bg-blue-500')}>{round.chanLe}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">Chưa c�� lịch sử.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}