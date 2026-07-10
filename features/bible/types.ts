export type TestamentId = "AT" | "NT";

export type BibleVersionCode = "rv1960" | "nvi";

export interface BibleVersion {
  code: BibleVersionCode;
  shortName: string;
  name: string;
}

export interface BibleBook {
  /** Slug usado por la API (ej. "genesis", "1-samuel") */
  id: string;
  name: string;
  abbrev: string;
  chapters: number;
  testament: TestamentId;
}

export interface BibleVerse {
  number: number;
  text: string;
  study?: string;
}

export interface BibleChapter {
  book: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
  version: BibleVersionCode;
}

export const TESTAMENT_LABELS: Record<TestamentId, string> = {
  AT: "Antiguo Testamento",
  NT: "Nuevo Testamento",
};

export const BIBLE_VERSIONS: BibleVersion[] = [
  {
    code: "rv1960",
    shortName: "RV60",
    name: "Reina Valera 1960",
  },
  {
    code: "nvi",
    shortName: "NVI",
    name: "Nueva Versión Internacional",
  },
];

export const DEFAULT_BIBLE_VERSION: BibleVersionCode = "rv1960";

export function getBibleVersion(code: BibleVersionCode): BibleVersion {
  return BIBLE_VERSIONS.find((v) => v.code === code) ?? BIBLE_VERSIONS[0];
}
