import { NextRequest, NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n";

const MAX_TEXT_LENGTH = 500;
const VALID_LOCALES = new Set<Locale>(["es", "en"]);

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
  responseStatus?: number;
  responseDetails?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const text = searchParams.get("text")?.trim();
  const from = searchParams.get("from") as Locale | null;
  const to = searchParams.get("to") as Locale | null;

  if (!text) {
    return NextResponse.json(
      { error: "Se requiere el parámetro text." },
      { status: 400 }
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `El texto no puede superar ${MAX_TEXT_LENGTH} caracteres.` },
      { status: 400 }
    );
  }

  if (!from || !to || !VALID_LOCALES.has(from) || !VALID_LOCALES.has(to)) {
    return NextResponse.json(
      { error: "Los parámetros from y to deben ser es o en." },
      { status: 400 }
    );
  }

  if (from === to) {
    return NextResponse.json(
      { error: "Los idiomas de origen y destino deben ser distintos." },
      { status: 400 }
    );
  }

  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text);
    url.searchParams.set("langpair", `${from}|${to}`);

    const upstream = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Error al consultar el servicio de traducción." },
        { status: 502 }
      );
    }

    const payload = (await upstream.json()) as MyMemoryResponse;
    const translated = payload.responseData?.translatedText?.trim();

    if (!translated || payload.responseStatus === 403) {
      return NextResponse.json(
        { error: "No se pudo traducir el texto seleccionado." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { text: translated, from, to },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Error al consultar el servicio de traducción." },
      { status: 502 }
    );
  }
}
