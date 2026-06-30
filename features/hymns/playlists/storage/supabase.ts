import { createClient } from "@/lib/supabase/client";
import { getCurrentUserId, requireCurrentUserId } from "@/lib/auth";
import type { Hymn } from "../../types";
import type {
  AddToPlaylistInput,
  CreatePlaylistInput,
  HymnPlaylist,
  HymnPlaylistItem,
  HymnPlaylistWithItems,
  UpdatePlaylistInput,
} from "../types";

const PLAYLISTS = "hymn_playlists";
const ITEMS = "hymn_playlist_items";

function rowToPlaylist(row: Record<string, unknown>): HymnPlaylist {
  const items = row.hymn_playlist_items as { count: number }[] | undefined;
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description ? String(row.description) : undefined,
    creatorId: String(row.creator_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    itemCount: items?.[0]?.count ?? 0,
  };
}

function rowToHymn(row: Record<string, unknown>): Hymn {
  return {
    id: String(row.id),
    title: String(row.title),
    lyrics: String(row.lyrics),
    originalKey: String(row.original_key),
    author: row.author ? String(row.author) : undefined,
    creatorId: row.creator_id ? String(row.creator_id) : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function rowToItem(row: Record<string, unknown>): HymnPlaylistItem {
  const hymnRow = row.hymns as Record<string, unknown> | null;
  return {
    id: String(row.id),
    playlistId: String(row.playlist_id),
    hymnId: String(row.hymn_id),
    position: Number(row.position),
    transposeSteps: Number(row.transpose_steps),
    createdAt: String(row.created_at),
    hymn: hymnRow ? rowToHymn(hymnRow) : undefined,
  };
}

export async function getPlaylistsSupabase(): Promise<HymnPlaylist[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(PLAYLISTS)
    .select("*, hymn_playlist_items(count)")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(rowToPlaylist);
}

export async function getMyPlaylistsSupabase(): Promise<HymnPlaylist[]> {
  const creatorId = await getCurrentUserId();
  if (!creatorId) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from(PLAYLISTS)
    .select("*, hymn_playlist_items(count)")
    .eq("creator_id", creatorId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(rowToPlaylist);
}

export async function getPlaylistSupabase(
  id: string
): Promise<HymnPlaylistWithItems | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(PLAYLISTS)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { data: items, error: itemsError } = await supabase
    .from(ITEMS)
    .select("*, hymns(*)")
    .eq("playlist_id", id)
    .order("position", { ascending: true });

  if (itemsError) throw itemsError;

  const playlist = rowToPlaylist(data);
  return {
    ...playlist,
    items: (items ?? []).map(rowToItem),
  };
}

export async function createPlaylistSupabase(
  input: CreatePlaylistInput
): Promise<HymnPlaylist> {
  const supabase = createClient();
  const creatorId = await requireCurrentUserId();
  const { data, error } = await supabase
    .from(PLAYLISTS)
    .insert({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      creator_id: creatorId,
    })
    .select()
    .single();

  if (error) throw error;
  return { ...rowToPlaylist(data), itemCount: 0 };
}

export async function updatePlaylistSupabase(
  id: string,
  input: UpdatePlaylistInput
): Promise<HymnPlaylist> {
  const supabase = createClient();
  const creatorId = await requireCurrentUserId();
  const { data, error } = await supabase
    .from(PLAYLISTS)
    .update({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("creator_id", creatorId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Solo el creador puede editar esta lista.");
  return rowToPlaylist(data);
}

export async function deletePlaylistSupabase(id: string): Promise<void> {
  const supabase = createClient();
  const creatorId = await requireCurrentUserId();
  const { data, error } = await supabase
    .from(PLAYLISTS)
    .delete()
    .eq("id", id)
    .eq("creator_id", creatorId)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Solo el creador puede eliminar esta lista.");
}

export async function addToPlaylistSupabase(
  input: AddToPlaylistInput
): Promise<HymnPlaylistItem> {
  const supabase = createClient();
  await requireCurrentUserId();

  const { data: existing, error: existingError } = await supabase
    .from(ITEMS)
    .select("id, position")
    .eq("playlist_id", input.playlistId)
    .eq("hymn_id", input.hymnId)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    const { data, error } = await supabase
      .from(ITEMS)
      .update({ transpose_steps: input.transposeSteps })
      .eq("id", existing.id)
      .select("*, hymns(*)")
      .single();

    if (error) throw error;

    await supabase
      .from(PLAYLISTS)
      .update({ updated_at: new Date().toISOString() })
      .eq("id", input.playlistId);

    return rowToItem(data);
  }

  const { data: maxRow, error: maxError } = await supabase
    .from(ITEMS)
    .select("position")
    .eq("playlist_id", input.playlistId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError) throw maxError;
  const nextPosition = maxRow ? Number(maxRow.position) + 1 : 0;

  const { data, error } = await supabase
    .from(ITEMS)
    .insert({
      playlist_id: input.playlistId,
      hymn_id: input.hymnId,
      position: nextPosition,
      transpose_steps: input.transposeSteps,
    })
    .select("*, hymns(*)")
    .single();

  if (error) throw error;

  await supabase
    .from(PLAYLISTS)
    .update({ updated_at: new Date().toISOString() })
    .eq("id", input.playlistId);

  return rowToItem(data);
}

export async function removePlaylistItemSupabase(itemId: string): Promise<void> {
  const supabase = createClient();
  await requireCurrentUserId();

  const { data: item, error: fetchError } = await supabase
    .from(ITEMS)
    .select("playlist_id")
    .eq("id", itemId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!item) throw new Error("Elemento no encontrado.");

  const { error } = await supabase.from(ITEMS).delete().eq("id", itemId);
  if (error) throw error;

  await supabase
    .from(PLAYLISTS)
    .update({ updated_at: new Date().toISOString() })
    .eq("id", item.playlist_id);
}

export async function updatePlaylistItemTransposeSupabase(
  itemId: string,
  transposeSteps: number
): Promise<HymnPlaylistItem> {
  const supabase = createClient();
  await requireCurrentUserId();

  const { data, error } = await supabase
    .from(ITEMS)
    .update({ transpose_steps: transposeSteps })
    .eq("id", itemId)
    .select("*, hymns(*)")
    .single();

  if (error) throw error;
  if (!data) throw new Error("No se pudo actualizar la tonalidad.");
  return rowToItem(data);
}

export async function reorderPlaylistItemsSupabase(
  playlistId: string,
  orderedItemIds: string[]
): Promise<void> {
  const supabase = createClient();
  await requireCurrentUserId();

  if (orderedItemIds.length === 0) return;

  const TEMP_OFFSET = 100_000;

  for (let i = 0; i < orderedItemIds.length; i++) {
    const { error } = await supabase
      .from(ITEMS)
      .update({ position: TEMP_OFFSET + i })
      .eq("id", orderedItemIds[i])
      .eq("playlist_id", playlistId);

    if (error) throw error;
  }

  for (let i = 0; i < orderedItemIds.length; i++) {
    const { error } = await supabase
      .from(ITEMS)
      .update({ position: i })
      .eq("id", orderedItemIds[i])
      .eq("playlist_id", playlistId);

    if (error) throw error;
  }

  await supabase
    .from(PLAYLISTS)
    .update({ updated_at: new Date().toISOString() })
    .eq("id", playlistId);
}
