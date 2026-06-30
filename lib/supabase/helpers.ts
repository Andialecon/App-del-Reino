import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Verifica que el cliente de Supabase esté correctamente configurado.
 * Útil para health checks futuros sin ejecutar consultas de negocio.
 */
export async function checkSupabaseConnection(
  client: SupabaseClient
): Promise<boolean> {
  try {
    const { error } = await client.auth.getSession();
    return !error;
  } catch {
    return false;
  }
}

/**
 * Helper genérico para manejar errores de Supabase en fases futuras.
 */
export function getSupabaseErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Ha ocurrido un error inesperado.";
}
