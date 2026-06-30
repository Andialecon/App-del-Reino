import { createClient } from "@/lib/supabase/client";
import { getLocalUserId } from "@/lib/localUser";
import { isSupabaseConfigured } from "@/features/hymns/storage/supabase";

/** ID del usuario autenticado o local (modo sin Supabase). */
export async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return getLocalUserId() || null;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function requireCurrentUserId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Inicia sesión con Google para continuar.");
  }
  return userId;
}
