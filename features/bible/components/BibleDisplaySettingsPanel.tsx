"use client";

import { useCallback, useRef, useState } from "react";
import { Settings2, Type } from "lucide-react";
import type { BibleDisplaySettings, BibleFontFamily } from "@/features/bible/types";
import { IconButton } from "@/components/ui/IconButton";
import { useBibleLabels } from "@/hooks/useBibleLabels";
import { useDismissOnOutside } from "@/hooks/useDismissOnOutside";
import { cn } from "@/utils/cn";

const FONT_OPTIONS: {
  value: BibleFontFamily;
  icon: typeof Type;
  labelKey: "bible.display.fontSans" | "bible.display.fontSerif";
}[] = [
  { value: "sans", icon: Type, labelKey: "bible.display.fontSans" },
  { value: "serif", icon: Type, labelKey: "bible.display.fontSerif" },
];

interface BibleDisplaySettingsPanelProps {
  settings: BibleDisplaySettings;
  onUpdate: (patch: Partial<BibleDisplaySettings>) => void;
  onReset: () => void;
}

export function BibleDisplaySettingsPanel({
  settings,
  onUpdate,
  onReset,
}: BibleDisplaySettingsPanelProps) {
  const { t } = useBibleLabels();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useDismissOnOutside(rootRef, open, close);

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        icon={Settings2}
        label={t("bible.display.settingsLabel")}
        onClick={() => setOpen((v) => !v)}
        className={cn(open && "bg-accent text-accent-foreground")}
      />

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,18rem)] rounded-2xl border border-border bg-card p-4 shadow-lg animate-scale-in">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">{t("bible.display.title")}</p>
            <button
              type="button"
              onClick={close}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t("bible.display.close")}
            </button>
          </div>

          <div className="space-y-4">
            <SliderField
              label={t("bible.display.fontSize")}
              value={settings.fontSize}
              min={12}
              max={28}
              step={1}
              display={`${settings.fontSize}px`}
              onChange={(v) => onUpdate({ fontSize: v })}
            />

            <SliderField
              label={t("bible.display.lineHeight")}
              value={settings.lineHeight}
              min={1}
              max={2.5}
              step={0.05}
              display={settings.lineHeight.toFixed(2)}
              onChange={(v) => onUpdate({ lineHeight: v })}
            />

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t("bible.display.fontFamily")}
              </p>
              <div className="flex gap-2">
                {FONT_OPTIONS.map(({ value, labelKey }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onUpdate({ fontFamily: value })}
                    className={cn(
                      "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                      settings.fontFamily === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    )}
                    style={{
                      fontFamily:
                        value === "serif"
                          ? "var(--font-lora), Georgia, serif"
                          : "var(--font-geist-sans), system-ui, sans-serif",
                    }}
                  >
                    {t(labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("bible.display.reset")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className="font-mono text-xs font-semibold">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}
