"use client";

import type { CSSProperties } from "react";
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
  if (display.textAlign === "justify") {
    return {
      width: "100%",
      marginBottom: lineGap,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "0 0.25rem",
    };
  }

  return {
    width: "100%",
    marginBottom: lineGap,
    textAlign: display.textAlign,
  };
}

function transposeCellChord(chord: string | null, steps: number): string | null {
  if (!chord) return null;
  return steps !== 0 ? transposeChord(chord, steps) : chord;
}

function ChordAboveText({
  chord,
  text,
  textStyle,
  chordSize,
  lineHeight,
}: {
  chord: string | null;
  text: string;
  textStyle: CSSProperties;
  chordSize: number;
  lineHeight: number;
}) {
  const chordRowHeight = Math.max(chordSize, Math.round(chordSize * lineHeight * 0.55));

  return (
    <span className="inline-block align-bottom max-w-full">
      <span
        className={cn(
          "block font-mono font-extrabold leading-none select-none",
          chord ? "text-primary" : "text-transparent"
        )}
        style={{
          fontSize: chordSize,
          height: chord ? chordRowHeight : chordRowHeight * 0.5,
          lineHeight: 1,
        }}
        aria-hidden={!chord}
      >
        {chord ?? "·"}
      </span>
      <span className="block whitespace-pre-wrap" style={textStyle}>{text}</span>
    </span>
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

  return (
    <div style={lineStyle}>
      {cells.map((cell, i) => (
        <ChordAboveText
          key={i}
          chord={transposeCellChord(cell.chord, transposeSteps)}
          text={cell.text}
          textStyle={textStyle}
          chordSize={chordSize}
          lineHeight={display.lineHeight}
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
  const align = display.textAlign;

  return (
    <div
      className="overflow-x-auto"
      style={{ width: "100%", marginBottom: lineGap }}
    >
      <pre
        className="font-mono font-extrabold text-primary whitespace-pre"
        style={{
          fontSize: chordSize,
          lineHeight: 1.1,
          textAlign: align,
        }}
        aria-hidden
      >
        {transposedChords}
      </pre>
      <pre
        className="whitespace-pre-wrap text-foreground"
        style={{
          ...textStyle,
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
        line.kind === "aligned" ? (
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

export function HymnLyricsViewer({
  lyrics,
  musicianMode,
  transposeSteps,
  display,
  className,
}: HymnLyricsViewerProps) {
  const safeLyrics = lyrics ?? "";
  const textStyle = getTextStyle(display);

  if (!musicianMode) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-card p-5 whitespace-pre-wrap w-full",
          className
        )}
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
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 w-full",
        className
      )}
    >
      <MusicianLyrics
        lines={lines}
        transposeSteps={transposeSteps}
        display={display}
      />
    </div>
  );
}
