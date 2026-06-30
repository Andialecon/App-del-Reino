/** Notas en orden cromático (sostenidos). */
const CHROMATIC = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
  Cb: "B",
  Fb: "E",
};

export const KEYS_MAJOR = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

/** Raíz + accidental + sufijo reconocido + extensiones numéricas + bajo opcional */
const CHORD_BODY_PATTERN =
  /^([A-G])([#b]?)(m(?!aj)|maj|min|dim|aug|sus2|sus4|add\d+|M)?(\d*)(?:\/([A-G][#b]?)?)?$/i;

export function normalizeChordToken(token: string): string {
  const t = token.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function normalizeNote(note: string): string {
  const trimmed = note.trim();
  if (!trimmed) return "C";
  const upper = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (upper.length === 1) return upper;
  const two = upper.slice(0, 2);
  if (two in FLAT_TO_SHARP) return FLAT_TO_SHARP[two];
  return two;
}

export function noteToIndex(note: string): number {
  const normalized = normalizeNote(note);
  const idx = CHROMATIC.indexOf(normalized as typeof CHROMATIC[number]);
  return idx >= 0 ? idx : 0;
}

export function indexToNote(index: number, preferFlat = false): string {
  const i = ((index % 12) + 12) % 12;
  const note = CHROMATIC[i];
  if (!preferFlat) return note;
  const flatMap: Record<string, string> = {
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab",
    "A#": "Bb",
  };
  return flatMap[note] ?? note;
}

export function transposeNote(note: string, semitones: number): string {
  const idx = noteToIndex(note);
  return indexToNote(idx + semitones);
}

export function transposeChord(chord: string, semitones: number): string {
  const trimmed = normalizeChordToken(chord);
  if (!trimmed || semitones === 0) return trimmed;

  const match = trimmed.match(CHORD_BODY_PATTERN);
  if (!match) return trimmed;

  const [, root, accidental, suffix = "", extension = "", bass] = match;
  const rootNote = root + (accidental ?? "");
  const newRoot = transposeNote(rootNote, semitones);
  const newBass = bass ? transposeNote(bass, semitones) : undefined;
  const body = `${suffix}${extension}`;

  return newBass
    ? `${newRoot}${body}/${newBass}`
    : `${newRoot}${body}`;
}

/** Detecta si un token parece un acorde (no una palabra común). */
export function isChordToken(token: string): boolean {
  const t = normalizeChordToken(token);
  if (!t || t.length > 12) return false;
  return CHORD_BODY_PATTERN.test(t);
}

/** Tonalidad raíz de un acorde o tonalidad, ej. Am → A, C# → C# */
export function getKeyRoot(key: string): string {
  const match = key.trim().match(/^([A-G][#b]?)/);
  return match ? normalizeNote(match[1]) : normalizeNote(key);
}

export function transposeKey(key: string, semitones: number): string {
  if (!key?.trim()) return "C";
  const root = getKeyRoot(key);
  const isMinor = /m(?!aj|in)/i.test(key) && !/^maj/i.test(key.slice(1));
  const transposed = transposeNote(root, semitones);
  return isMinor ? `${transposed}m` : transposed;
}

/** Sustituye acordes en texto ChordPro [Acorde] */
export function transposeChordProText(text: string, semitones: number): string {
  if (semitones === 0) return text;
  return text.replace(/\[([^\]]+)\]/g, (_, chord: string) => {
    if (isChordToken(chord)) {
      return `[${transposeChord(chord, semitones)}]`;
    }
    return `[${chord}]`;
  });
}
