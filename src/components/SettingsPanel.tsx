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
  if (!settings) return null;
  const handleSettingsChange = (changedSettings: Partial<Settings>) => {
    setSettings(changedSettings);
  };
  const handleThemeChange = (theme: Theme) => {
    handleSettingsChange({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-dark border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Cài đặt</DialogTitle>
          <DialogDescription>
            Tùy chỉnh trải nghiệm của bạn. Các thay đổi được lưu tự động.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="theme-select">Chủ đề giao diện</Label>
            <Select value={settings.theme} onValueChange={handleThemeChange}>
              <SelectTrigger id="theme-select">
                <SelectValue placeholder="Chọn một chủ đề" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="auto-start" className="flex flex-col space-y-1">
              <span>Tự động bắt đầu</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Bắt đầu chế độ auto khi tải trang.
              </span>
            </Label>
            <Switch
              id="auto-start"
              checked={settings.autoStart}
              onCheckedChange={(checked) => handleSettingsChange({ autoStart: checked })}
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="sound-enabled" className="flex flex-col space-y-1">
              <span>Âm thanh</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Bật/tắt hiệu ứng âm thanh.
              </span>
            </Label>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => handleSettingsChange({ soundEnabled: checked })}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="sound-volume">Âm lượng âm thanh ({settings.soundVolume}%)</Label>
            <Slider
              id="sound-volume"
              min={0}
              max={100}
              step={1}
              value={[settings.soundVolume]}
              onValueChange={(value) => handleSettingsChange({ soundVolume: value[0] })}
              disabled={!settings.soundEnabled}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="history-limit">Giới hạn lịch sử ({settings.historyLimit} kỳ)</Label>
            <Slider
              id="history-limit"
              min={10}
              max={100}
              step={10}
              value={[settings.historyLimit]}
              onValueChange={(value) => handleSettingsChange({ historyLimit: value[0] })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}