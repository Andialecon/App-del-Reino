"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  getDefaultBibleVersion,
  isValidBibleVersion,
  type BibleVersionCode,
} from "@/features/bible/types";

const STORAGE_KEY = "el-reino-bible-version";

function readStoredVersion(): BibleVersionCode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidBibleVersion(stored)) return stored;
  } catch {
    // ignore
  }
  return null;
}

function writeStoredVersion(version: BibleVersionCode) {
  try {
    localStorage.setItem(STORAGE_KEY, version);
  } catch {
    // ignore
  }
}

export function useBibleVersion() {
  const { locale } = useLocale();
  const [version, setVersionState] = useState<BibleVersionCode>(() =>
    getDefaultBibleVersion(locale)
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredVersion();
    setVersionState(stored ?? getDefaultBibleVersion(locale));
    setHydrated(true);
  }, [locale]);

  const setVersion = useCallback((next: BibleVersionCode) => {
    writeStoredVersion(next);
    setVersionState(next);
  }, []);

  return { version, setVersion, hydrated };
}
