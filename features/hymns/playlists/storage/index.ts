import { isSupabaseConfigured } from "../../storage/supabase";
import type {
  AddToPlaylistInput,
  CreatePlaylistInput,
  HymnPlaylist,
  HymnPlaylistItem,
  HymnPlaylistWithItems,
  UpdatePlaylistInput,
} from "../types";
import {
  addToPlaylistSupabase,
  createPlaylistSupabase,
  deletePlaylistSupabase,
  getMyPlaylistsSupabase,
  getPlaylistSupabase,
  getPlaylistsSupabase,
  removePlaylistItemSupabase,
  reorderPlaylistItemsSupabase,
  updatePlaylistItemTransposeSupabase,
  updatePlaylistSupabase,
} from "./supabase";

function requireSupabase(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Las listas de reproducción requieren Supabase. Configura las variables de entorno."
    );
  }
}

export async function getPlaylists(): Promise<HymnPlaylist[]> {
  requireSupabase();
  return getPlaylistsSupabase();
}

export async function getMyPlaylists(): Promise<HymnPlaylist[]> {
  requireSupabase();
  return getMyPlaylistsSupabase();
}

export async function getPlaylist(
  id: string
): Promise<HymnPlaylistWithItems | null> {
  requireSupabase();
  return getPlaylistSupabase(id);
}

export async function createPlaylist(
  input: CreatePlaylistInput
): Promise<HymnPlaylist> {
  requireSupabase();
  return createPlaylistSupabase(input);
}

export async function updatePlaylist(
  id: string,
  input: UpdatePlaylistInput
): Promise<HymnPlaylist> {
  requireSupabase();
  return updatePlaylistSupabase(id, input);
}

export async function deletePlaylist(id: string): Promise<void> {
  requireSupabase();
  return deletePlaylistSupabase(id);
}

export async function addToPlaylist(
  input: AddToPlaylistInput
): Promise<HymnPlaylistItem> {
  requireSupabase();
  return addToPlaylistSupabase(input);
}

export async function removePlaylistItem(itemId: string): Promise<void> {
  requireSupabase();
  return removePlaylistItemSupabase(itemId);
}

export async function updatePlaylistItemTranspose(
  itemId: string,
  transposeSteps: number
): Promise<HymnPlaylistItem> {
  requireSupabase();
  return updatePlaylistItemTransposeSupabase(itemId, transposeSteps);
}

export async function reorderPlaylistItems(
  playlistId: string,
  orderedItemIds: string[]
): Promise<void> {
  requireSupabase();
  return reorderPlaylistItemsSupabase(playlistId, orderedItemIds);
}

export { isSupabaseConfigured };
