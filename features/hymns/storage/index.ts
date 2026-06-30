import type { CreateHymnInput, Hymn, UpdateHymnInput } from "../types";
import {
  createHymnLocal,
  getHymnLocal,
  getHymnsLocal,
  updateHymnLocal,
} from "./local";
import {
  createHymnSupabase,
  getHymnSupabase,
  getHymnsSupabase,
  isSupabaseConfigured,
  updateHymnSupabase,
} from "./supabase";

export async function getHymns(): Promise<Hymn[]> {
  if (isSupabaseConfigured()) {
    try {
      return await getHymnsSupabase();
    } catch {
      return getHymnsLocal();
    }
  }
  return getHymnsLocal();
}

export async function getHymn(id: string): Promise<Hymn | null> {
  if (isSupabaseConfigured()) {
    try {
      const hymn = await getHymnSupabase(id);
      if (hymn) return hymn;
    } catch {
      // fallback local
    }
  }
  return getHymnLocal(id) ?? null;
}

export async function createHymn(input: CreateHymnInput): Promise<Hymn> {
  if (isSupabaseConfigured()) {
    try {
      return await createHymnSupabase(input);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al guardar en Supabase";
      throw new Error(message);
    }
  }
  return createHymnLocal(input);
}

export async function updateHymn(
  id: string,
  input: UpdateHymnInput
): Promise<Hymn> {
  if (isSupabaseConfigured()) {
    try {
      return await updateHymnSupabase(id, input);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar en Supabase";
      throw new Error(message);
    }
  }
  return updateHymnLocal(id, input);
}
