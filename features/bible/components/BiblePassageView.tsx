"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Minimize2 } from "lucide-react";
import type { BibleDisplaySettings, BibleVerse } from "@/features/bible/types";
import { IconButton } from "@/components/ui/IconButton";
import { useBibleLabels } from "@/hooks/useBibleLabels";
import { cn } from "@/utils/cn";
interface BiblePassageViewProps {
  verses: BibleVerse[];
  display: BibleDisplaySettings;
  isFullscreen: boolean;
  onExitFullscreen: () => void;
  onChangeVerse: (verse: number) => void;
  reference: string;
  toolbar?: ReactNode;
}

function getTextStyle(display: BibleDisplaySettings): CSSProperties {
  return {
    fontSize: display.fontSize,
    lineHeight: display.lineHeight,
    fontFamily:
      display.fontFamily === "serif"
        ? "var(--font-lora), Georgia, 'Times New Roman', serif"
        : "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
  };
}

export function BiblePassageView({
  verses,
  display,
  isFullscreen,
  onExitFullscreen,
  onChangeVerse,
  reference,
  toolbar,
}: BiblePassageViewProps) {
  const { t } = useBibleLabels();
  const [mounted, setMounted] = useState(false);
  const textStyle = getTextStyle(display);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  const passageContent = (
    <div className="space-y-4">
      {verses.map((v) => (
        <p key={v.number} style={textStyle}>
          {v.study && (
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              {v.study}
            </span>
          )}
          <button
            type="button"
            onClick={() => onChangeVerse(v.number)}
            className="mr-1.5 inline align-super text-xs font-bold text-amber-600 hover:underline dark:text-amber-400"
            aria-label={t("bible.verseLabel", { number: v.number })}
          >
            {v.number}
          </button>
          {v.text}
        </p>
      ))}
    </div>
  );

  const articleClassName = cn(
    "rounded-2xl border border-border bg-gradient-to-b from-amber-50/40 via-card to-card p-5 shadow-sm dark:from-amber-950/20",
    isFullscreen && "border-0 rounded-none bg-background shadow-none dark:from-background"
  );

  if (isFullscreen && mounted) {
    return createPortal(
      <div
        className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-background animate-fade-in"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{reference}</p>
          </div>
          {toolbar}
          <IconButton
            icon={Minimize2}
            label={t("bible.fullscreen.exit")}
            onClick={onExitFullscreen}
          />
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          <article className={articleClassName}>{passageContent}</article>
        </div>
      </div>,
      document.body
    );
  }

  return <article className={articleClassName}>{passageContent}</article>;
}
