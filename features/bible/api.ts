import type { BibleChapter, BibleVerse, BibleVersionCode } from "./types";
import { getDefaultBibleVersion } from "./types";
import { getBookById } from "./data/books";

interface ApiVerse {
  verse: string;
  number: number;
  study?: string;
  id?: number;
}

interface ApiChapterResponse {
  name?: string;
  chapter?: number;
  vers?: ApiVerse[];
  verses?: ApiVerse[];
}

function mapVerses(raw: ApiVerse[] | undefined): BibleVerse[] {
  if (!raw?.length) return [];
  return raw.map((v) => ({
    number: v.number,
    text: v.verse?.trim() ?? "",
    study: v.study,
  }));
}

/** Lee un capítulo completo vía proxy local → bible-api.deno.dev */
export async function fetchChapter(
  bookId: string,
  chapter: number,
  version: BibleVersionCode = getDefaultBibleVersion("es")
): Promise<BibleChapter> {
  const book = getBookById(bookId);
  if (!book) {
    throw new Error("Libro no encontrado.");
  }

  const params = new URLSearchParams({
    book: bookId,
    chapter: String(chapter),
    version,
  });

  const res = await fetch(`/api/bible?${params.toString()}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "No se pudo cargar el capítulo.");
  }

  const data = (await res.json()) as ApiChapterResponse;
  const verses = mapVerses(data.vers ?? data.verses);

  if (verses.length === 0) {
    throw new Error("Este capítulo no tiene versículos disponibles.");
  }

  return {
    book: bookId,
    bookName: book.name,
    chapter,
    verses,
    version,
  };
}
