"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
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
const SELECTION_GAP = 12;
const POPUP_ESTIMATED_HEIGHT = 120;
const POPUP_ESTIMATED_WIDTH = 280;
const SELECTION_DEBOUNCE_MS = 120;
const MOBILE_SELECTION_RETRIES_MS = [0, 50, 150, 350] as const;

interface PopupPosition {
  top: number;
  left: number;
  placement: "above" | "below";
}

interface SelectionState {
  text: string;
  position: PopupPosition;
  rect: DOMRect;
}

interface SelectableTranslationProps {
  sourceLang: Locale;
  targetLang: Locale;
  children: ReactNode;
  className?: string;
}

function hasOverlapWithSelection(
  top: number,
  popupHeight: number,
  rect: DOMRect
): boolean {
  const popupBottom = top + popupHeight;
  return popupBottom > rect.top - SELECTION_GAP && top < rect.bottom + SELECTION_GAP;
}

function computePopupPosition(
  rect: DOMRect,
  popupHeight: number,
  popupWidth: number
): PopupPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const width = Math.min(popupWidth, viewportWidth - POPUP_MARGIN * 2);

  let left = rect.left + rect.width / 2 - width / 2;
  left = Math.max(
    POPUP_MARGIN,
    Math.min(left, viewportWidth - width - POPUP_MARGIN)
  );

  const spaceAbove = rect.top - POPUP_MARGIN;
  const spaceBelow = viewportHeight - rect.bottom - POPUP_MARGIN;
  const fitsAbove = spaceAbove >= popupHeight + SELECTION_GAP;
  const fitsBelow = spaceBelow >= popupHeight + SELECTION_GAP;

  const aboveTop = Math.max(
    POPUP_MARGIN,
    rect.top - SELECTION_GAP - popupHeight
  );
  const belowTop = Math.min(
    viewportHeight - popupHeight - POPUP_MARGIN,
    rect.bottom + SELECTION_GAP
  );

  let placement: "above" | "below";
  let top: number;

  if (fitsAbove && (!fitsBelow || spaceAbove >= spaceBelow)) {
    placement = "above";
    top = aboveTop;
  } else if (fitsBelow) {
    placement = "below";
    top = belowTop;
  } else if (spaceAbove >= spaceBelow) {
    placement = "above";
    top = aboveTop;
  } else {
    placement = "below";
    top = belowTop;
  }

  if (hasOverlapWithSelection(top, popupHeight, rect)) {
    const alternateTop = placement === "above" ? belowTop : aboveTop;
    if (!hasOverlapWithSelection(alternateTop, popupHeight, rect)) {
      placement = placement === "above" ? "below" : "above";
      top = alternateTop;
    }
  }

  return { top, left, placement };
}

function supportsCssHighlightApi(): boolean {
  return typeof CSS !== "undefined" && "highlights" in CSS;
}

function applySelectionHighlight(range: Range | null) {
  if (!supportsCssHighlightApi()) return;
  CSS.highlights.delete("bible-selection");
  if (!range) return;
  CSS.highlights.set("bible-selection", new Highlight(range));
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
  const popupRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<Range | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pendingTouchSelectionRef = useRef(false);
  const retryTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSelectionTextRef = useRef<string | null>(null);
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [fallbackRects, setFallbackRects] = useState<DOMRect[]>([]);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearRetryTimers = useCallback(() => {
    for (const timer of retryTimersRef.current) {
      clearTimeout(timer);
    }
    retryTimersRef.current = [];
    pendingTouchSelectionRef.current = false;
  }, []);

  const clearSelection = useCallback(() => {
    clearRetryTimers();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
    rangeRef.current = null;
    activeSelectionTextRef.current = null;
    applySelectionHighlight(null);
    setFallbackRects([]);
    setSelection(null);
    setTranslation(null);
    setLoading(false);
    setError(null);
  }, [clearRetryTimers]);

  const processSelection = useCallback(
    (options?: { allowClear?: boolean }) => {
      const allowClear = options?.allowClear ?? true;
      const container = containerRef.current;
      if (!container) return false;

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !isSelectionInside(sel, container)) {
        if (allowClear && !pendingTouchSelectionRef.current) {
          clearSelection();
        }
        return false;
      }

      const text = sel.toString().trim();
      if (
        text.length < MIN_SELECTION_LENGTH ||
        text.length > MAX_SELECTION_LENGTH
      ) {
        if (allowClear && !pendingTouchSelectionRef.current) {
          clearSelection();
        }
        return false;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        if (allowClear && !pendingTouchSelectionRef.current) {
          clearSelection();
        }
        return false;
      }

      clearRetryTimers();
      pendingTouchSelectionRef.current = false;

      rangeRef.current = range.cloneRange();
      applySelectionHighlight(rangeRef.current);

      const popupWidth = Math.min(
        POPUP_ESTIMATED_WIDTH,
        window.innerWidth - POPUP_MARGIN * 2
      );
      const position = computePopupPosition(
        rect,
        POPUP_ESTIMATED_HEIGHT,
        popupWidth
      );

      if (activeSelectionTextRef.current === text) {
        setSelection({ text, rect, position });
        return true;
      }

      activeSelectionTextRef.current = text;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setSelection({
        text,
        rect,
        position,
      });
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

      return true;
    },
    [clearSelection, clearRetryTimers, sourceLang, targetLang, t]
  );

  const scheduleSelectionProcessing = useCallback(() => {
    clearRetryTimers();
    pendingTouchSelectionRef.current = true;

    for (const delay of MOBILE_SELECTION_RETRIES_MS) {
      const timer = setTimeout(() => {
        processSelection({ allowClear: false });
      }, delay);
      retryTimersRef.current.push(timer);
    }

    const finalizeTimer = setTimeout(() => {
      pendingTouchSelectionRef.current = false;
      processSelection({ allowClear: true });
    }, MOBILE_SELECTION_RETRIES_MS[MOBILE_SELECTION_RETRIES_MS.length - 1] + 100);
    retryTimersRef.current.push(finalizeTimer);
  }, [clearRetryTimers, processSelection]);

  const handleSelectionEnd = useCallback(() => {
    scheduleSelectionProcessing();
  }, [scheduleSelectionProcessing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleSelectionChange = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        processSelection();
      }, SELECTION_DEBOUNCE_MS);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    container.addEventListener("mouseup", handleSelectionEnd);
    container.addEventListener("pointerup", handleSelectionEnd);
    container.addEventListener("touchend", handleSelectionEnd, {
      passive: true,
    });

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      container.removeEventListener("mouseup", handleSelectionEnd);
      container.removeEventListener("pointerup", handleSelectionEnd);
      container.removeEventListener("touchend", handleSelectionEnd);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      clearRetryTimers();
    };
  }, [handleSelectionEnd, processSelection, clearRetryTimers]);

  useLayoutEffect(() => {
    if (!selection || !popupRef.current) return;

    const popup = popupRef.current;
    const popupHeight = popup.offsetHeight;
    const popupWidth = popup.offsetWidth;
    const nextPosition = computePopupPosition(
      selection.rect,
      popupHeight,
      popupWidth
    );

    setSelection((current) => {
      if (!current) return current;
      if (
        current.position.top === nextPosition.top &&
        current.position.left === nextPosition.left &&
        current.position.placement === nextPosition.placement
      ) {
        return current;
      }
      return { ...current, position: nextPosition };
    });
  }, [selection?.text, loading, error, translation]);

  useEffect(() => {
    if (!selection || !rangeRef.current || supportsCssHighlightApi()) return;

    const updateFallbackRects = () => {
      if (!rangeRef.current) return;
      setFallbackRects(Array.from(rangeRef.current.getClientRects()));
    };

    updateFallbackRects();
    window.addEventListener("scroll", updateFallbackRects, true);
    window.addEventListener("resize", updateFallbackRects);

    return () => {
      window.removeEventListener("scroll", updateFallbackRects, true);
      window.removeEventListener("resize", updateFallbackRects);
    };
  }, [selection]);

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
        className={cn("bible-selectable-text select-text", className)}
        title={t("bible.selectToTranslate")}
      >
        {children}
      </div>

      {selection &&
        fallbackRects.map((rect, index) => (
          <span
            key={`selection-highlight-${index}`}
            aria-hidden
            className="pointer-events-none fixed z-40 rounded-sm bg-amber-300/50 dark:bg-amber-500/35"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }}
          />
        ))}

      {selection && (
        <div
          ref={popupRef}
          id="bible-translate-popup"
          role="tooltip"
          className="pointer-events-auto fixed z-50 w-[min(280px,calc(100vw-16px))] animate-scale-in"
          style={{
            top: selection.position.top,
            left: selection.position.left,
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
