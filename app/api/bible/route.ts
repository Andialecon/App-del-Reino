import { NextRequest, NextResponse } from "next/server";

const BIBLE_API_BASE = "https://bible-api.deno.dev/api/read";
const ALLOWED_VERSIONS = new Set(["rv1960", "nvi"]);

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

  if (!ALLOWED_VERSIONS.has(version)) {
    return NextResponse.json(
      { error: "Versión no soportada. Usa rv1960 o nvi." },
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

  let path = `${BIBLE_API_BASE}/${version}/${book}/${chapterNum}`;
  if (verse) {
    const verseNum = Number(verse);
    if (!Number.isInteger(verseNum) || verseNum < 1) {
      return NextResponse.json(
        { error: "El versículo debe ser un número entero positivo." },
        { status: 400 }
      );
    }
    path += `/${verseNum}`;
  }

  try {
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
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Error al consultar la API de la Biblia." },
      { status: 502 }
    );
  }
}
