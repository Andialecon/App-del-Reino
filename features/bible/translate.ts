import type { Locale } from "@/lib/i18n";

export async function translateText(
  text: string,
  from: Locale,
  to: Locale,
  signal?: AbortSignal
): Promise<string> {
  const params = new URLSearchParams({ text, from, to });
  const res = await fetch(`/api/translate?${params}`, { signal });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Translation failed");
  }

  const data = (await res.json()) as { text: string };
  return data.text;
}
