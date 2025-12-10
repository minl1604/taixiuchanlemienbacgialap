import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Gamepad2, Target, CircleDollarSign, Trophy, BarChart, Settings, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
interface GameGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const guideSections = [
  {
    icon: Gamepad2,
    title: "Cách Chơi",
    content: "Mỗi kỳ quay sẽ tạo ra một số ngẫu nhiên 5 chữ số. Một kỳ mới sẽ tự động bắt đầu sau mỗi 20 giây nếu chế độ 'Auto' được bật. Bạn cũng có thể nhấn 'Đặt cược & Quay' để bắt đầu một kỳ mới ngay lập tức."
  },
  {
    icon: Target,
    title: "Dự Đoán",
    content: "Trước mỗi kỳ, b��n có thể chọn dự đoán kết quả. Có hai chế độ: 'Tài / Xỉu' hoặc 'Chẵn / Lẻ'. Bạn chỉ có thể chọn một trong hai chế độ và đặt cược cho một k���t quả duy nhất trong chế độ đó."
  },
  {
    icon: CircleDollarSign,
    title: "Quy Tắc Cược",
    content: "Bạn bắt đầu với một số dư ảo 1,000,000,000 VND. Nhập số tiền cược (mặc định 500,000,000 VND). Nếu đúng, nhận 1.9x (lợi nhuận 0.9x); nếu sai, mất toàn bộ."
  },
  {
    icon: Trophy,
    title: "Kết Quả",
    content: "Kết quả dựa trên tổng 5 chữ số:\n- TÀI: nếu tổng lớn hơn hoặc bằng 23.\n- XỈU: nếu tổng nhỏ hơn 23.\n- CH���N: nếu tổng là số chẵn.\n- LẺ: nếu tổng là số lẻ."
  },
  {
    icon: BarChart,
    title: "Thống Kê & Xu Hướng",
    content: "Ứng dụng theo dõi độ chính xác, chuỗi thắng và lợi nhuận của bạn. Bảng 'Xu hướng' hiển thị các kết quả gần đây dưới dạng biểu đồ để bạn dễ dàng theo dõi."
  },
  {
    icon: Settings,
    title: "Cài đặt & Âm thanh",
    content: "Trong phần Cài đặt (biểu tượng bánh răng), bạn có thể bật/tắt chế độ tự động bắt đầu, hiệu ứng âm thanh, điều chỉnh âm lượng và giới hạn lịch sử các kỳ quay."
  },
  {
    icon: AlertTriangle,
    title: "Lưu Ý Quan Trọng",
    content: "Đây là ứng dụng giả lập chỉ dành cho mục đích giải trí. Mỗi kết quả đều là ngẫu nhiên và không có giá trị tiền thật. Vui lòng chơi có trách nhiệm."
  }
];
export function GameGuide({ open, onOpenChange }: GameGuideProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-dark border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center font-vietnamese">Hướng Dẫn Chơi</DialogTitle>
          <DialogDescription className="text-center font-vietnamese">
            Tìm hiểu cách hoạt động của trò chơi giả lập này.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto pr-4">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {guideSections.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="hover:no-underline font-vietnamese">
                  <div className="flex items-center gap-3">
                    <section.icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={cn("font-vietnamese text-sm leading-relaxed text-muted-foreground whitespace-pre-line")}>
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="font-vietnamese">Đã hiểu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}