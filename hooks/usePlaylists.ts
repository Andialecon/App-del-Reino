"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreatePlaylistInput,
  HymnPlaylist,
  HymnPlaylistWithItems,
  UpdatePlaylistInput,
} from "@/features/hymns/playlists/types";
import {
  createPlaylist,
  getPlaylist,
  getPlaylists,
  getMyPlaylists,
} from "@/features/hymns/playlists/storage";

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<HymnPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar listas");
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addPlaylist = useCallback(async (input: CreatePlaylistInput) => {
    const playlist = await createPlaylist(input);
    setPlaylists((prev) => [{ ...playlist, itemCount: 0 }, ...prev]);
    return playlist;
  }, []);

  return { playlists, loading, error, reload: load, addPlaylist };
}

export function useMyPlaylists() {
  const [playlists, setPlaylists] = useState<HymnPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyPlaylists();
      setPlaylists(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar tus listas");
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { playlists, loading, error, reload: load };
}

export function usePlaylist(id: string) {
  const [playlist, setPlaylist] = useState<HymnPlaylistWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPlaylist(id);
      setPlaylist(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar la lista");
      setPlaylist(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateLocal = useCallback(
    (updater: (prev: HymnPlaylistWithItems) => HymnPlaylistWithItems) => {
      setPlaylist((prev) => (prev ? updater(prev) : prev));
    },
    []
  );

  return { playlist, loading, error, reload: load, updateLocal };
}

export async function updatePlaylistById(
  id: string,
  input: UpdatePlaylistInput
) {
  const { updatePlaylist } = await import(
    "@/features/hymns/playlists/storage"
  );
  return updatePlaylist(id, input);
}
