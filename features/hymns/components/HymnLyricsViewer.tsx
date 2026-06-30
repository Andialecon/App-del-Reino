"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { ChordCell, HymnDisplaySettings, LyricLine } from "@/features/hymns/types";
import { transposeChord } from "@/features/hymns/utils/chords";
import {
  lyricsWithoutChords,
  parseLyricsToLines,
  transposeAlignedChordLine,
} from "@/features/hymns/utils/parseLyrics";
import { cn } from "@/utils/cn";

interface HymnLyricsViewerProps {
  lyrics: string;
  musicianMode: boolean;
  transposeSteps: number;
  display: HymnDisplaySettings;
  className?: string;
}

function useDoubleActivate(onActivate: () => void) {
  const lastTouchRef = useRef(0);

  const onDoubleClick = useCallback(() => {
    onActivate();
  }, [onActivate]);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchRef.current <= 300) {
        e.preventDefault();
        onActivate();
        lastTouchRef.current = 0;
      } else {
        lastTouchRef.current = now;
      }
    },
    [onActivate]
  );

  return { onDoubleClick, onTouchEnd };
}

/** Espacio entre líneas de la canción (controlado por el slider de interlineado). */
function getLineGap(display: HymnDisplaySettings): number {
  return Math.max(0, Math.round((display.lineHeight - 1) * display.fontSize * 0.65));
}

function getTextStyle(display: HymnDisplaySettings): CSSProperties {
  return {
    fontSize: display.fontSize,
    lineHeight: display.lineHeight,
  };
}

function getLineLayoutStyle(
  display: HymnDisplaySettings,
  lineGap: number
): CSSProperties {
  // En ChordPro, justify/space-between rompe la posición acorde-sílaba.
  const textAlign =
    display.textAlign === "justify" ? "left" : display.textAlign;

  return {
    width: "100%",
    marginBottom: lineGap,
    textAlign,
  };
}

function getChordRowHeight(chordSize: number): number {
  return Math.ceil(chordSize * 1.15) + 2;
}

function transposeCellChord(chord: string | null, steps: number): string | null {
  if (!chord) return null;
  return steps !== 0 ? transposeChord(chord, steps) : chord;
}

function ChordAboveText({
  chord,
  text,
  section,
  textStyle,
  chordSize,
  chordRowHeight,
  reserveChordSpace,
}: {
  chord: string | null;
  text: string;
  section?: string;
  textStyle: CSSProperties;
  chordSize: number;
  chordRowHeight: number;
  reserveChordSpace: boolean;
}) {
  if (section) {
    return (
      <span
        className="block w-full text-sm font-semibold text-muted-foreground tracking-wide"
        style={textStyle}
      >
        {section}
      </span>
    );
  }

  return (
    <span
      className="inline-flex flex-col-reverse items-start"
      style={{ verticalAlign: "bottom" }}
    >
      <span className="whitespace-pre" style={textStyle}>
        {text || (chord ? "\u00a0" : "")}
      </span>
      {reserveChordSpace && (
        <span
          className="relative self-stretch overflow-visible"
          style={{ height: chordRowHeight, marginBottom: 3, lineHeight: 1 }}
          aria-hidden={!chord}
        >
          {chord && (
            <span
              className="absolute bottom-0 left-0 font-mono font-extrabold leading-none text-primary whitespace-nowrap select-none"
              style={{ fontSize: chordSize }}
            >
              {chord}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

function SectionLine({
  label,
  display,
  lineGap,
  textStyle,
  isFirst,
}: {
  label: string;
  display: HymnDisplaySettings;
  lineGap: number;
  textStyle: CSSProperties;
  isFirst: boolean;
}) {
  return (
    <p
      className="w-full text-sm font-semibold text-muted-foreground tracking-wide"
      style={{
        ...textStyle,
        textAlign: display.textAlign,
        marginTop: isFirst ? 0 : Math.max(lineGap, 8),
        marginBottom: lineGap,
      }}
    >
      {label}
    </p>
  );
}

function ChordProLine({
  cells,
  transposeSteps,
  display,
  lineGap,
  textStyle,
  chordSize,
}: {
  cells: ChordCell[];
  transposeSteps: number;
  display: HymnDisplaySettings;
  lineGap: number;
  textStyle: CSSProperties;
  chordSize: number;
}) {
  const lineStyle = getLineLayoutStyle(display, lineGap);
  const chordRowHeight = getChordRowHeight(chordSize);
  const reserveChordSpace = cells.some((cell) => cell.chord);

  return (
    <div style={{ ...lineStyle, lineHeight: 1 }}>
      {cells.map((cell, i) => (
        <ChordAboveText
          key={i}
          chord={transposeCellChord(cell.chord, transposeSteps)}
          text={cell.text}
          section={cell.section}
          textStyle={textStyle}
          chordSize={chordSize}
          chordRowHeight={chordRowHeight}
          reserveChordSpace={reserveChordSpace}
        />
      ))}
    </div>
  );
}

function AlignedLine({
  chordLine,
  lyricLine,
  transposeSteps,
  display,
  lineGap,
  textStyle,
  chordSize,
}: {
  chordLine: string;
  lyricLine: string;
  transposeSteps: number;
  display: HymnDisplaySettings;
  lineGap: number;
  textStyle: CSSProperties;
  chordSize: number;
}) {
  const transposedChords = transposeAlignedChordLine(chordLine, transposeSteps);
  const align =
    display.textAlign === "justify" ? "left" : display.textAlign;

  return (
    <div
      className="overflow-x-auto"
      style={{ width: "100%", marginBottom: lineGap }}
    >
      <pre
        className="font-mono font-extrabold text-primary whitespace-pre leading-none"
        style={{
          fontSize: display.fontSize,
          lineHeight: 1,
          textAlign: align,
          marginBottom: 2,
        }}
        aria-hidden
      >
        {transposedChords}
      </pre>
      <pre
        className="font-mono whitespace-pre text-foreground"
        style={{
          fontSize: display.fontSize,
          lineHeight: display.lineHeight,
          textAlign: align,
          width: "100%",
        }}
      >
        {lyricLine}
      </pre>
    </div>
  );
}

function MusicianLyrics({
  lines,
  transposeSteps,
  display,
}: {
  lines: LyricLine[];
  transposeSteps: number;
  display: HymnDisplaySettings;
}) {
  const lineGap = getLineGap(display);
  const textStyle = getTextStyle(display);
  const chordSize = Math.round(display.fontSize * 0.75);

  return (
    <div>
      {lines.map((line, i) =>
        line.kind === "section" ? (
          <SectionLine
            key={i}
            label={line.label}
            display={display}
            lineGap={lineGap}
            textStyle={textStyle}
            isFirst={i === 0}
          />
        ) : line.kind === "aligned" ? (
          <AlignedLine
            key={i}
            chordLine={line.chordLine}
            lyricLine={line.lyricLine}
            transposeSteps={transposeSteps}
            display={display}
            lineGap={lineGap}
            textStyle={textStyle}
            chordSize={chordSize}
          />
        ) : (
          <ChordProLine
            key={i}
            cells={line.cells}
            transposeSteps={transposeSteps}
            display={display}
            lineGap={lineGap}
            textStyle={textStyle}
            chordSize={chordSize}
          />
        )
      )}
    </div>
  );
}

function LyricsBody({
  lyrics,
  musicianMode,
  transposeSteps,
  display,
}: Omit<HymnLyricsViewerProps, "className">) {
  const safeLyrics = lyrics ?? "";
  const textStyle = getTextStyle(display);

  if (!musicianMode) {
    return (
      <div
        className="whitespace-pre-wrap w-full"
        style={{
          ...textStyle,
          textAlign: display.textAlign,
        }}
      >
        {lyricsWithoutChords(safeLyrics) || "Sin letra."}
      </div>
    );
  }

  const lines = parseLyricsToLines(safeLyrics);

  return (
    <MusicianLyrics
      lines={lines}
      transposeSteps={transposeSteps}
      display={display}
    />
  );
}

export function HymnLyricsViewer({
  lyrics,
  musicianMode,
  transposeSteps,
  display,
  className,
}: HymnLyricsViewerProps) {
  const [isFullView, setIsFullView] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleFullView = useCallback(() => {
    setIsFullView((value) => !value);
  }, []);

  const { onDoubleClick, onTouchEnd } = useDoubleActivate(toggleFullView);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isFullView) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullView]);

  const interactionProps = {
    onDoubleClick,
    onTouchEnd,
    role: "button" as const,
    tabIndex: 0,
    "aria-pressed": isFullView,
    "aria-label": isFullView
      ? "Doble clic para salir de la vista completa"
      : "Doble clic para vista completa",
    title: isFullView
      ? "Doble clic para salir de la vista completa"
      : "Doble clic para vista completa",
  };

  const cardClassName = cn(
    "rounded-2xl border border-border bg-card p-5 w-full cursor-pointer",
    className
  );

  const content: ReactNode = (
    <LyricsBody
      lyrics={lyrics}
      musicianMode={musicianMode}
      transposeSteps={transposeSteps}
      display={display}
    />
  );

  if (isFullView && mounted) {
    return createPortal(
      <div
        className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-background animate-fade-in"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        {...interactionProps}
      >
        <div
          className={cn(
            cardClassName,
            "mx-auto max-w-lg min-h-full border-0 rounded-none px-4 py-6"
          )}
        >
          {content}
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className={cardClassName} {...interactionProps}>
      {content}
    </div>
  );
}
