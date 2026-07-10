"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Languages, Loader2, X } from "lucide-react";
import { translateText } from "@/features/bible/translate";
import { useBibleLabels } from "@/hooks/useBibleLabels";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/utils/cn";

const MIN_SELECTION_LENGTH = 1;
const MAX_SELECTION_LENGTH = 500;
const POPUP_MARGIN = 8;
const POPUP_ESTIMATED_HEIGHT = 120;

interface PopupPosition {
  top: number;
  left: number;
  placement: "above" | "below";
}

interface SelectionState {
  text: string;
  position: PopupPosition;
}

interface SelectableTranslationProps {
  sourceLang: Locale;
  targetLang: Locale;
  children: ReactNode;
  className?: string;
}

function clampPopupPosition(rect: DOMRect): PopupPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const popupWidth = Math.min(280, viewportWidth - POPUP_MARGIN * 2);

  let left = rect.left + rect.width / 2 - popupWidth / 2;
  left = Math.max(
    POPUP_MARGIN,
    Math.min(left, viewportWidth - popupWidth - POPUP_MARGIN)
  );

  const spaceAbove = rect.top;
  const spaceBelow = viewportHeight - rect.bottom;
  const showAbove =
    spaceAbove >= POPUP_ESTIMATED_HEIGHT + POPUP_MARGIN ||
    spaceAbove >= spaceBelow;

  const top = showAbove
    ? Math.max(POPUP_MARGIN, rect.top - POPUP_MARGIN)
    : Math.min(viewportHeight - POPUP_MARGIN, rect.bottom + POPUP_MARGIN);

  return { top, left, placement: showAbove ? "above" : "below" };
}

function isSelectionInside(
  selection: Selection,
  container: HTMLElement
): boolean {
  if (selection.rangeCount === 0) return false;
  const range = selection.getRangeAt(0);
  const common = range.commonAncestorContainer;
  return container.contains(
    common.nodeType === Node.TEXT_NODE ? common.parentNode : common
  );
}

export function SelectableTranslation({
  sourceLang,
  targetLang,
  children,
  className,
}: SelectableTranslationProps) {
  const { t } = useBibleLabels();
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearSelection = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSelection(null);
    setTranslation(null);
    setLoading(false);
    setError(null);
  }, []);

  const processSelection = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !isSelectionInside(sel, container)) {
      clearSelection();
      return;
    }

    const text = sel.toString().trim();
    if (
      text.length < MIN_SELECTION_LENGTH ||
      text.length > MAX_SELECTION_LENGTH
    ) {
      clearSelection();
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      clearSelection();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSelection({ text, position: clampPopupPosition(rect) });
    setTranslation(null);
    setError(null);
    setLoading(true);

    void translateText(text, sourceLang, targetLang, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setTranslation(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : t("bible.translateError")
        );
        setLoading(false);
      });
  }, [clearSelection, sourceLang, targetLang, t]);

  const handleSelectionEnd = useCallback(() => {
    requestAnimationFrame(processSelection);
  }, [processSelection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mouseup", handleSelectionEnd);
    container.addEventListener("touchend", handleSelectionEnd);

    return () => {
      container.removeEventListener("mouseup", handleSelectionEnd);
      container.removeEventListener("touchend", handleSelectionEnd);
    };
  }, [handleSelectionEnd]);

  useEffect(() => {
    if (!selection) return;

    const onScroll = () => clearSelection();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      const popup = document.getElementById("bible-translate-popup");
      if (popup?.contains(target)) return;
      clearSelection();
    };

    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [selection, clearSelection]);

  const targetLangLabel = t(`language.${targetLang}`);

  return (
    <>
      <div
        ref={containerRef}
        className={cn("select-text", className)}
        title={t("bible.selectToTranslate")}
      >
        {children}
      </div>

      {selection && (
        <div
          id="bible-translate-popup"
          role="tooltip"
          className="pointer-events-auto fixed z-50 w-[min(280px,calc(100vw-16px))] animate-scale-in"
          style={{
            top: selection.position.top,
            left: selection.position.left,
            transform:
              selection.position.placement === "above"
                ? "translateY(-100%)"
                : undefined,
          }}
        >
          <div className="rounded-xl border border-amber-200/80 bg-card px-3 py-2.5 shadow-lg shadow-amber-900/10 dark:border-amber-800/60">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
                <Languages size={12} className="shrink-0" />
                <span className="truncate">
                  {t("bible.translateTo", { language: targetLangLabel })}
                </span>
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label={t("common.close")}
              >
                <X size={14} />
              </button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Loader2 size={14} className="animate-spin text-amber-600" />
                <span>{t("bible.translating")}</span>
              </div>
            )}

            {!loading && error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {!loading && !error && translation && (
              <p className="text-sm font-medium leading-snug text-foreground">
                {translation}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
