"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_BIBLE_DISPLAY,
  type BibleDisplaySettings,
  type BibleFontFamily,
} from "@/features/bible/types";

const STORAGE_KEY = "el-reino-bible-display";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isValidFontFamily(value: unknown): value is BibleFontFamily {
  return value === "sans" || value === "serif";
}

function readSettings(): BibleDisplaySettings {
  if (typeof window === "undefined") return DEFAULT_BIBLE_DISPLAY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BIBLE_DISPLAY;
    const parsed = JSON.parse(raw) as Partial<BibleDisplaySettings>;
    return {
      fontSize: clamp(
        parsed.fontSize ?? DEFAULT_BIBLE_DISPLAY.fontSize,
        12,
        28
      ),
      lineHeight: clamp(
        parsed.lineHeight ?? DEFAULT_BIBLE_DISPLAY.lineHeight,
        1,
        2.5
      ),
      fontFamily: isValidFontFamily(parsed.fontFamily)
        ? parsed.fontFamily
        : DEFAULT_BIBLE_DISPLAY.fontFamily,
    };
  } catch {
    return DEFAULT_BIBLE_DISPLAY;
  }
}

function writeSettings(settings: BibleDisplaySettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignorar
  }
}

export function useBibleDisplaySettings() {
  const [settings, setSettings] =
    useState<BibleDisplaySettings>(DEFAULT_BIBLE_DISPLAY);

  useEffect(() => {
    setSettings(readSettings());
  }, []);

  const updateSettings = useCallback((patch: Partial<BibleDisplaySettings>) => {
    setSettings((current) => {
      const next: BibleDisplaySettings = {
        fontSize: clamp(patch.fontSize ?? current.fontSize, 12, 28),
        lineHeight: clamp(patch.lineHeight ?? current.lineHeight, 1, 2.5),
        fontFamily: patch.fontFamily ?? current.fontFamily,
      };
      writeSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    writeSettings(DEFAULT_BIBLE_DISPLAY);
    setSettings(DEFAULT_BIBLE_DISPLAY);
  }, []);

  return { settings, updateSettings, resetSettings };
}
