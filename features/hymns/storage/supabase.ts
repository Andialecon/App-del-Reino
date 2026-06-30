import { createClient } from "@/lib/supabase/client";
import { requireCurrentUserId } from "@/lib/auth";
import type { CreateHymnInput, Hymn, UpdateHymnInput } from "../types";

const TABLE = "hymns";

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

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return Boolean(url && key && !url.includes("your-project") && key !== "your-anon-key");
}

export async function getHymnsSupabase(): Promise<Hymn[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(rowToHymn);
}

export async function getHymnSupabase(id: string): Promise<Hymn | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToHymn(data) : null;
}

export async function createHymnSupabase(input: CreateHymnInput): Promise<Hymn> {
  const supabase = createClient();
  const creatorId = await requireCurrentUserId();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title: input.title.trim(),
      lyrics: input.lyrics.trim(),
      original_key: input.originalKey.trim(),
      author: input.author?.trim() || null,
      creator_id: creatorId,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToHymn(data);
}

export async function updateHymnSupabase(
  id: string,
  input: UpdateHymnInput
): Promise<Hymn> {
  const supabase = createClient();
  const creatorId = await requireCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      title: input.title.trim(),
      lyrics: input.lyrics.trim(),
      original_key: input.originalKey.trim(),
      author: input.author?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("creator_id", creatorId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Solo el creador puede editar esta canción.");
  return rowToHymn(data);
}

export async function deleteHymnSupabase(id: string): Promise<void> {
  const supabase = createClient();
  const creatorId = await requireCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .eq("creator_id", creatorId)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Solo el creador puede eliminar esta canción.");
}
