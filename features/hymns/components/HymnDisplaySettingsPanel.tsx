"use client";

import { useState } from "react";
import {
  Settings2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import type { HymnDisplaySettings } from "@/features/hymns/types";
import { IconButton } from "@/components/ui/IconButton";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/utils/cn";

const ALIGN_OPTIONS: {
  value: HymnDisplaySettings["textAlign"];
  icon: typeof AlignLeft;
  label: string;
}[] = [
  { value: "left", icon: AlignLeft, label: "Izquierda" },
  { value: "center", icon: AlignCenter, label: "Centro" },
  { value: "right", icon: AlignRight, label: "Derecha" },
  { value: "justify", icon: AlignJustify, label: "Justificado" },
];

interface HymnDisplaySettingsPanelProps {
  settings: HymnDisplaySettings;
  onUpdate: (patch: Partial<HymnDisplaySettings>) => void;
  onReset: () => void;
}

export function HymnDisplaySettingsPanel({
  settings,
  onUpdate,
  onReset,
}: HymnDisplaySettingsPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <IconButton
        icon={Settings2}
        label="Configuración de visualización"
        onClick={() => setOpen((v) => !v)}
        className={cn(open && "bg-accent text-accent-foreground")}
      />

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,18rem)] rounded-2xl border border-border bg-card p-4 shadow-lg animate-scale-in"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Visualización</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cerrar
            </button>
          </div>

          <div className="space-y-4">
            <Switch
              checked={settings.musicianMode}
              onCheckedChange={(checked) => onUpdate({ musicianMode: checked })}
              label="Modo músico"
              description="Acordes y transportador de tonalidad"
              className="border-0 bg-transparent p-0"
            />

            <SliderField
              label="Tamaño de fuente"
              value={settings.fontSize}
              min={12}
              max={28}
              step={1}
              display={`${settings.fontSize}px`}
              onChange={(v) => onUpdate({ fontSize: v })}
            />

            <SliderField
              label="Interlineado"
              value={settings.lineHeight}
              min={1}
              max={2.5}
              step={0.05}
              display={settings.lineHeight.toFixed(2)}
              onChange={(v) => onUpdate({ lineHeight: v })}
            />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Justificación
              </p>
              <div className="flex gap-1">
                {ALIGN_OPTIONS.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    title={label}
                    onClick={() => onUpdate({ textAlign: value })}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                      settings.textAlign === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Restaurar valores
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
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className="text-xs font-mono font-semibold">{display}</span>
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
