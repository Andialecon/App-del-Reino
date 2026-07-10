import { en } from "@/messages/en";
import { es } from "@/messages/es";
import type { Messages } from "@/messages/es";

export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_STORAGE_KEY = "el-reino-locale";

const messages: Record<Locale, Messages> = { es, en };

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

type InterpolationValues = Record<string, string | number>;

function getNestedValue(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(locale: Locale) {
  const dict = getMessages(locale);

  return function t(
    key: string,
    values?: InterpolationValues
  ): string {
    const value = getNestedValue(dict, key);
    if (!value) return key;

    if (!values) return value;

    return Object.entries(values).reduce(
      (result, [k, v]) => result.replaceAll(`{${k}}`, String(v)),
      value
    );
  };
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("en")) return "en";
  return "es";
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    // ignore
  }
  return null;
}

export function writeStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}
