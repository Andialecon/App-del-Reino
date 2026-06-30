"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { claimLocalHymns } from "@/features/hymns/storage/claim";
import { isSupabaseConfigured } from "@/features/hymns/storage/supabase";

interface AuthContextValue {
  user: User | null;
  userId: string | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();
  const claimedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Solo actualización síncrona: llamadas async a auth aquí causan deadlock con getSession.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  useEffect(() => {
    if (!user?.id || claimedForUser.current === user.id) return;
    claimedForUser.current = user.id;
    claimLocalHymns(user.id).catch(() => {});
  }, [user?.id]);

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    claimedForUser.current = null;
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      userId: user?.id ?? null,
      loading,
      isConfigured,
      signInWithGoogle,
      signOut,
    }),
    [user, loading, isConfigured, signInWithGoogle, signOut]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
