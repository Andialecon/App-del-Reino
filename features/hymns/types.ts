export interface Hymn {
  id: string;
  title: string;
  /** Letra con acordes en formato ChordPro: [C]texto [Am]más texto */
  lyrics: string;
  /** Tonalidad original, ej: C, Am, G */
  originalKey: string;
  author?: string;
  /** ID del creador (local hasta auth) */
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHymnInput {
  title: string;
  lyrics: string;
  originalKey: string;
  author?: string;
}

export interface UpdateHymnInput {
  title: string;
  lyrics: string;
  originalKey: string;
  author?: string;
}

export interface HymnDisplaySettings {
  fontSize: number;
  lineHeight: number;
  textAlign: "left" | "center" | "right" | "justify";
  musicianMode: boolean;
}

export const DEFAULT_HYMN_DISPLAY: HymnDisplaySettings = {
  fontSize: 16,
  lineHeight: 1.25,
  textAlign: "left",
  musicianMode: false,
};

export type LyricSegment =
  | { type: "chord"; chord: string }
  | { type: "text"; text: string }
  | { type: "linebreak" };

/** Celda: acorde encima + texto debajo (formato ChordPro). */
export interface ChordCell {
  chord: string | null;
  text: string;
  /** Etiqueta de sección ChordPro, ej. Verso 2, Coro */
  section?: string;
}

/** Línea con celdas ChordPro, acordes alineados o encabezado de sección. */
export type LyricLine =
  | { kind: "chordpro"; cells: ChordCell[] }
  | { kind: "aligned"; chordLine: string; lyricLine: string }
  | { kind: "section"; label: string };
