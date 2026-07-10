import type { Locale } from "@/lib/i18n";

export type TestamentId = "AT" | "NT";

export type BibleVersionCode = "rv1960" | "nvi" | "kjv" | "niv";

export type BibleApiSource = "deno" | "bolls";

export interface BibleVersionDef {
  code: BibleVersionCode;
  language: Locale;
  /** Equivalente en el otro idioma (RV60↔KJV, NVI↔NIV) */
  pair: BibleVersionCode;
  api: BibleApiSource;
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

export const BIBLE_VERSION_DEFINITIONS: BibleVersionDef[] = [
  { code: "rv1960", language: "es", pair: "kjv", api: "deno" },
  { code: "nvi", language: "es", pair: "niv", api: "deno" },
  { code: "kjv", language: "en", pair: "rv1960", api: "deno" },
  { code: "niv", language: "en", pair: "nvi", api: "bolls" },
];

export const BIBLE_VERSION_CODES = BIBLE_VERSION_DEFINITIONS.map((v) => v.code);

export function getBibleVersionDef(code: BibleVersionCode): BibleVersionDef {
  return (
    BIBLE_VERSION_DEFINITIONS.find((v) => v.code === code) ??
    BIBLE_VERSION_DEFINITIONS[0]
  );
}

export function getDefaultBibleVersion(locale: Locale): BibleVersionCode {
  return locale === "en" ? "niv" : "rv1960";
}

export function isValidBibleVersion(code: string): code is BibleVersionCode {
  return BIBLE_VERSION_CODES.includes(code as BibleVersionCode);
}

/** @deprecated Usar getBibleVersionDef + traducciones i18n */
export const TESTAMENT_LABELS: Record<TestamentId, string> = {
  AT: "Antiguo Testamento",
  NT: "Nuevo Testamento",
};
