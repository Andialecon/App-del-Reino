"use client";

import { useState } from "react";
import {
  getKeyRoot,
  KEYS_MAJOR,
  noteToIndex,
  transposeKey,
} from "@/features/hymns/utils/chords";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";

interface KeyTransposerProps {
  originalKey: string;
  transposeSteps: number;
  onTransposeStepsChange: (steps: number) => void;
  className?: string;
}

function semitonesToTargetKey(originalKey: string, targetRoot: string): number {
  const fromIdx = noteToIndex(getKeyRoot(originalKey));
  const toIdx = noteToIndex(targetRoot);
  let diff = toIdx - fromIdx;
  while (diff < 0) diff += 12;
  while (diff >= 12) diff -= 12;
  return diff;
}

export function KeyTransposer({
  originalKey,
  transposeSteps,
  onTransposeStepsChange,
  className,
}: KeyTransposerProps) {
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const currentKey = transposeKey(originalKey, transposeSteps);

  const selectKey = (targetSteps: number) => {
    onTransposeStepsChange(targetSteps);
    setKeyModalOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-center gap-1.5",
          className
        )}
      >
        <IconButton
          icon={Minus}
          label="Bajar medio tono"
          size="sm"
          onClick={() => onTransposeStepsChange(transposeSteps - 1)}
        />
        <button
          type="button"
          onClick={() => setKeyModalOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-accent"
          aria-label="Seleccionar tonalidad"
        >
          <span className="text-muted-foreground">{originalKey}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-semibold text-primary">{currentKey}</span>
        </button>
        <IconButton
          icon={Plus}
          label="Subir medio tono"
          size="sm"
          onClick={() => onTransposeStepsChange(transposeSteps + 1)}
        />
      </div>

      <Modal
        open={keyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        title="Tonalidad"
      >
        <p className="text-xs text-muted-foreground mb-3">
          Original: <span className="font-medium text-foreground">{originalKey}</span>
        </p>
        <div className="grid grid-cols-4 gap-2">
          {KEYS_MAJOR.map((key) => {
            const targetSteps = semitonesToTargetKey(originalKey, key);
            const isActive = transposeSteps === targetSteps;
            const displayKey = transposeKey(originalKey, targetSteps);
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectKey(targetSteps)}
                className={cn(
                  "rounded-xl py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-accent"
                )}
              >
                {displayKey}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
