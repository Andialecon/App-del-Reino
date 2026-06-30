"use client";

import { useCallback, useEffect, useState } from "react";
import type { CreateHymnInput, Hymn } from "@/features/hymns/types";
import { createHymn, getHymn, getHymns } from "@/features/hymns/storage";

export function useHymns() {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHymns();
      setHymns(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar himnos");
      setHymns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addHymn = useCallback(async (input: CreateHymnInput) => {
    const hymn = await createHymn(input);
    setHymns((prev) => [hymn, ...prev]);
    return hymn;
  }, []);

  return { hymns, loading, error, reload: load, addHymn };
}

export function useHymn(id: string) {
  const [hymn, setHymn] = useState<Hymn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getHymn(id);
        if (active) setHymn(data);
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Error al cargar");
          setHymn(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  return { hymn, loading, error };
}
