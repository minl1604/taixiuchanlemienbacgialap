import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameStore } from '@/hooks/useGameStore';
import type { Settings, Theme } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const themes: { value: Theme; label: string }[] = [
  { value: 'dark', label: 'Tối (Mặc định)' },
  { value: 'light', label: 'Sáng' },
  { value: 'neon', label: 'Neon' },
  { value: 'vintage', label: 'Cổ điển (Vintage)' },
];
export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const settings = useGameStore((state) => state.settings);
  const setSettings = useGameStore((state) => state.actions.setSettings);
  const history = useGameStore((state) => state.history);
  const currentSettings = {
    soundVolume: 30,
    ...settings,
  };
  if (!settings) return null;
  const handleSettingsChange = (changedSettings: Partial<Settings>) => {
    setSettings(changedSettings);
  };
  const handleThemeChange = (theme: Theme) => {
    handleSettingsChange({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  };
  const handleExportHistory = () => {
    if (history && history.length > 0) {
      try {
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lich-su-tai-xiu-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Đã tải lịch sử thành công!');
      } catch (error) {
        console.error("Failed to export history:", error);
        toast.error('Xuất lịch sử thất bại.');
      }
    } else {
      toast.warning('Chưa có dữ liệu lịch sử để xuất.');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-dark border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-vietnamese">Cài đặt</DialogTitle>
          <DialogDescription className="font-vietnamese">
            Tùy chỉnh trải nghiệm của bạn. Các thay đổi được lưu tự động.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="theme-select" className="font-vietnamese">Chủ đề giao diện</Label>
            <Select value={currentSettings.theme} onValueChange={handleThemeChange}>
              <SelectTrigger id="theme-select" className="font-vietnamese">
                <SelectValue placeholder="Chọn một chủ đề" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value} className="font-vietnamese">
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="auto-start" className="flex flex-col space-y-1">
              <span className="font-vietnamese">Tự động bắt đầu</span>
              <span className="font-normal leading-snug text-muted-foreground font-vietnamese">
                Bắt đầu chế độ auto khi tải trang.
              </span>
            </Label>
            <Switch
              id="auto-start"
              checked={currentSettings.autoStart}
              onCheckedChange={(checked) => handleSettingsChange({ autoStart: checked })}
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="sound-enabled" className="flex flex-col space-y-1">
              <span className="font-vietnamese">Âm thanh</span>
              <span className="font-normal leading-snug text-muted-foreground font-vietnamese">
                Bật/tắt hiệu ứng âm thanh.
              </span>
            </Label>
            <Switch
              id="sound-enabled"
              checked={currentSettings.soundEnabled}
              onCheckedChange={(checked) => handleSettingsChange({ soundEnabled: checked })}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="sound-volume" className="font-vietnamese">Âm lượng âm thanh ({currentSettings.soundVolume}%)</Label>
            <Slider
              id="sound-volume"
              min={0}
              max={100}
              step={1}
              value={[currentSettings.soundVolume]}
              onValueChange={(value) => handleSettingsChange({ soundVolume: value[0] })}
              disabled={!currentSettings.soundEnabled}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="history-limit" className="font-vietnamese">Giới hạn lịch sử ({currentSettings.historyLimit} kỳ)</Label>
            <Slider
              id="history-limit"
              min={10}
              max={100}
              step={10}
              value={[currentSettings.historyLimit]}
              onValueChange={(value) => handleSettingsChange({ historyLimit: value[0] })}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="export-data" className="font-vietnamese">Xuất dữ liệu</Label>
            <Button id="export-data" onClick={handleExportHistory} variant="outline" className={cn("w-full hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20", "font-vietnamese")}>
              Tải lịch sử (JSON)
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="font-vietnamese">Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}