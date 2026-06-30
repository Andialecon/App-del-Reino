import type { ChordCell, LyricLine } from "../types";
import { isChordToken, normalizeChordToken, transposeChord } from "./chords";

/** Contenido entre [] que no es acorde: Verso 2, Coro, Intro, etc. */
export function isSectionMarker(content: string): boolean {
  const label = content.trim();
  if (!label) return false;
  return !isChordToken(label);
}

function parseSectionOnlyLine(line: string): string | null {
  const trimmed = line.trim();
  const match = trimmed.match(/^\[([^\]]+)\]$/);
  if (!match) return null;
  const label = match[1].trim();
  if (!isSectionMarker(label)) return null;
  return label;
}

/**
 * Parsea letra en formato ChordPro: [C]Santo, [G]santo
 * También líneas solo con acordes separadas por espacios seguidas de letra.
 */
export function parseLyricsToLines(raw: string): LyricLine[] {
  const result: LyricLine[] = [];
  const lines = raw.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    const sectionLabel = parseSectionOnlyLine(line);
    if (sectionLabel) {
      result.push({ kind: "section", label: sectionLabel });
      continue;
    }

    if (
      line.trim() &&
      nextLine !== undefined &&
      isChordOnlyLine(line) &&
      !line.includes("[") &&
      !isChordOnlyLine(nextLine)
    ) {
      result.push({ kind: "aligned", chordLine: line, lyricLine: nextLine });
      i++;
      continue;
    }

    const cells = parseChordProLineToCells(line);
    result.push({
      kind: "chordpro",
      cells: cells.length > 0 ? cells : [{ chord: null, text: "" }],
    });
  }

  return result;
}

/** @deprecated Usar parseLyricsToLines */
export function parseChordProLyrics(raw: string) {
  const segments: import("../types").LyricSegment[] = [];
  const parsed = parseLyricsToLines(raw);

  for (let i = 0; i < parsed.length; i++) {
    const line = parsed[i];
    if (line.kind === "aligned") {
      line.chordLine
        .trim()
        .split(/\s+/)
        .forEach((chord, idx, arr) => {
          segments.push({ type: "chord", chord });
          if (idx < arr.length - 1) segments.push({ type: "text", text: " " });
        });
      segments.push({ type: "text", text: `\n${line.lyricLine}` });
    } else if (line.kind === "section") {
      segments.push({ type: "text", text: line.label });
    } else {
      for (const cell of line.cells) {
        if (cell.section) {
          segments.push({ type: "text", text: cell.section });
        }
        if (cell.chord) segments.push({ type: "chord", chord: cell.chord });
        if (cell.text) segments.push({ type: "text", text: cell.text });
      }
    }
    if (i < parsed.length - 1) segments.push({ type: "linebreak" });
  }

  return segments;
}

function isChordOnlyLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  if (trimmed.includes("[")) {
    const bracketTokens = trimmed.match(/\[[^\]]+\]/g);
    if (!bracketTokens) return false;
    const withoutBrackets = trimmed.replace(/\[[^\]]+\]/g, "").trim();
    if (withoutBrackets) return false;
    return bracketTokens.every((token) =>
      isChordToken(token.slice(1, -1))
    );
  }

  const tokens = trimmed.split(/\s+/);
  return tokens.every((t) => isChordToken(t));
}

function parseChordProLineToCells(line: string): ChordCell[] {
  const cells: ChordCell[] = [];
  const regex = /\[([^\]]+)\]|([^\[]+)/g;
  let match: RegExpExecArray | null;
  let pendingChord: string | null = null;

  while ((match = regex.exec(line)) !== null) {
    if (match[1] !== undefined) {
      const content = match[1];
      if (isChordToken(content)) {
        const chord = normalizeChordToken(content);
        if (pendingChord !== null) {
          cells.push({ chord: pendingChord, text: "" });
        }
        pendingChord = chord;
      } else if (pendingChord !== null) {
        cells.push({ chord: pendingChord, text: content });
        pendingChord = null;
      } else if (isSectionMarker(content)) {
        cells.push({ chord: null, text: "", section: content.trim() });
      } else {
        cells.push({ chord: null, text: `[${content}]` });
      }
    } else if (match[2] !== undefined) {
      cells.push({ chord: pendingChord, text: match[2] });
      pendingChord = null;
    }
  }

  if (pendingChord !== null) {
    cells.push({ chord: pendingChord, text: "" });
  }

  return cells;
}

/** Transporta acordes en una línea alineada preservando espacios. */
export function transposeAlignedChordLine(
  line: string,
  semitones: number
): string {
  if (semitones === 0) return line;

  return line.replace(
    /([A-G][#b]?(?:m(?!aj)|maj|min|dim|aug|sus2|sus4|add\d+|M)?\d*(?:\/[A-G][#b]?)?)/gi,
    (match) =>
      isChordToken(match) ? transposeChord(match, semitones) : match
  );
}

/** Letra sin acordes para modo normal */
export function lyricsWithoutChords(raw: string): string {
  const lines = parseLyricsToLines(raw);

  const textLines: string[] = [];

  for (const line of lines) {
    if (line.kind === "section") {
      if (textLines.length > 0) textLines.push("");
      textLines.push(line.label);
      continue;
    }
    if (line.kind === "aligned") {
      textLines.push(line.lyricLine);
      continue;
    }
    textLines.push(
      line.cells.map((cell) => cell.section ?? cell.text).join("")
    );
  }

  return textLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
