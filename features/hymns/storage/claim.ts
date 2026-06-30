import { createClient } from "@/lib/supabase/client";
import { getLocalUserId } from "@/lib/localUser";
import { isSupabaseConfigured } from "./supabase";

/**
 * Vincula canciones creadas con el ID local del dispositivo
 * al usuario autenticado tras el primer inicio de sesión.
 */
export async function claimLocalHymns(userId: string): Promise<number> {
  if (!isSupabaseConfigured() || !userId) return 0;

  const localId = getLocalUserId();
  if (!localId || localId === userId) return 0;

  const supabase = createClient();
  const { data, error } = await supabase.rpc("claim_local_hymns", {
    local_id: localId,
  });

  if (error) return 0;
  return typeof data === "number" ? data : 0;
}
