"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { getLocalUserId } from "@/lib/localUser";
import { isSupabaseConfigured } from "@/features/hymns/storage/supabase";

export function useIsHymnOwner(creatorId?: string): boolean {
  const { userId, loading } = useAuth();

  if (!creatorId) return false;
  if (loading) return false;

  if (isSupabaseConfigured()) {
    return Boolean(userId && creatorId === userId);
  }

  return creatorId === getLocalUserId();
}

export function useRequiresAuth(): boolean {
  const { userId, loading, isConfigured } = useAuth();
  if (!isConfigured) return false;
  if (loading) return true;
  return !userId;
}
