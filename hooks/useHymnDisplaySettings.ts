"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_HYMN_DISPLAY,
  type HymnDisplaySettings,
} from "@/features/hymns/types";

const STORAGE_KEY = "el-reino-hymn-display";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readSettings(): HymnDisplaySettings {
  if (typeof window === "undefined") return DEFAULT_HYMN_DISPLAY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HYMN_DISPLAY;
    const parsed = JSON.parse(raw) as Partial<HymnDisplaySettings>;
    return {
      fontSize: clamp(parsed.fontSize ?? DEFAULT_HYMN_DISPLAY.fontSize, 12, 28),
      lineHeight: clamp(
        parsed.lineHeight ?? DEFAULT_HYMN_DISPLAY.lineHeight,
        1,
        2.5
      ),
      textAlign: parsed.textAlign ?? DEFAULT_HYMN_DISPLAY.textAlign,
      musicianMode: parsed.musicianMode ?? DEFAULT_HYMN_DISPLAY.musicianMode,
    };
  } catch {
    return DEFAULT_HYMN_DISPLAY;
  }
}

function writeSettings(settings: HymnDisplaySettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignorar
  }
}

export function useHymnDisplaySettings() {
  const [settings, setSettings] =
    useState<HymnDisplaySettings>(DEFAULT_HYMN_DISPLAY);

  useEffect(() => {
    setSettings(readSettings());
  }, []);

  const updateSettings = useCallback((patch: Partial<HymnDisplaySettings>) => {
    setSettings((current) => {
      const next: HymnDisplaySettings = {
        fontSize: clamp(patch.fontSize ?? current.fontSize, 12, 28),
        lineHeight: clamp(patch.lineHeight ?? current.lineHeight, 1, 2.5),
        textAlign: patch.textAlign ?? current.textAlign,
        musicianMode: patch.musicianMode ?? current.musicianMode,
      };
      writeSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    writeSettings(DEFAULT_HYMN_DISPLAY);
    setSettings(DEFAULT_HYMN_DISPLAY);
  }, []);

  return { settings, updateSettings, resetSettings };
}
