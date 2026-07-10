import { NextRequest, NextResponse } from "next/server";
import {
  BIBLE_VERSION_DEFINITIONS,
  isValidBibleVersion,
} from "@/features/bible/types";

const DENO_API_BASE = "https://bible-api.deno.dev/api/read";
const BOLLS_API_BASE = "https://bolls.life/get-text";

const DENO_VERSIONS = new Set(
  BIBLE_VERSION_DEFINITIONS.filter((v) => v.api === "deno").map((v) => v.code)
);

interface BollsVerse {
  pk?: number;
  verse: number;
  text: string;
}

function stripHtml(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const book = searchParams.get("book")?.trim().toLowerCase();
  const chapter = searchParams.get("chapter")?.trim();
  const verse = searchParams.get("verse")?.trim();
  const version = (searchParams.get("version") ?? "rv1960").toLowerCase();

  if (!book || !chapter) {
    return NextResponse.json(
      { error: "Se requieren los parámetros book y chapter." },
      { status: 400 }
    );
  }

  if (!isValidBibleVersion(version)) {
    return NextResponse.json(
      { error: "Versión no soportada." },
      { status: 400 }
    );
  }

  if (verse) {
    return NextResponse.json(
      { error: "Solo se admite lectura por capítulo completo." },
      { status: 400 }
    );
  }

  const chapterNum = Number(chapter);
  if (!Number.isInteger(chapterNum) || chapterNum < 1) {
    return NextResponse.json(
      { error: "El capítulo debe ser un número entero positivo." },
      { status: 400 }
    );
  }

  if (!/^[a-z0-9-]+$/.test(book)) {
    return NextResponse.json({ error: "Libro inválido." }, { status: 400 });
  }

  try {
    if (version === "niv") {
      const upstream = await fetch(
        `${BOLLS_API_BASE}/NIV/${book}/${chapterNum}/`,
        {
          headers: { Accept: "application/json" },
          next: { revalidate: 86400 },
        }
      );

      if (!upstream.ok) {
        return NextResponse.json(
          { error: "No se encontró el pasaje solicitado." },
          { status: upstream.status === 404 ? 404 : 502 }
        );
      }

      const verses = (await upstream.json()) as BollsVerse[];

      if (!Array.isArray(verses) || verses.length === 0) {
        return NextResponse.json(
          { error: "Este capítulo no tiene versículos disponibles." },
          { status: 404 }
        );
      }

      const data = {
        chapter: chapterNum,
        vers: verses.map((item) => ({
          verse: stripHtml(item.text),
          number: item.verse,
          id: item.pk ?? item.verse,
        })),
      };

      return NextResponse.json(data, {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    if (!DENO_VERSIONS.has(version)) {
      return NextResponse.json(
        { error: "Versión no soportada." },
        { status: 400 }
      );
    }

    const path = `${DENO_API_BASE}/${version}/${book}/${chapterNum}`;
    const upstream = await fetch(path, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "No se encontró el pasaje solicitado." },
        { status: upstream.status === 404 ? 404 : 502 }
      );
    }

    const data: unknown = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Error al consultar la API de la Biblia." },
      { status: 502 }
    );
  }
}
