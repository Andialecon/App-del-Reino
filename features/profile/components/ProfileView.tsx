"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loading } from "@/components/ui/Loading";
import { profileConfig } from "@/features/profile/config";

export function ProfileView() {
  const { user, loading, isConfigured, signInWithGoogle, signOut } = useAuth();
  const searchParams = useSearchParams();
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("No se pudo completar el inicio de sesión. Inténtalo de nuevo.");
    }
  }, [searchParams]);

  const Icon = profileConfig.icon;

  const handleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo iniciar sesión con Google."
      );
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cerrar sesión.");
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return <Loading label="Cargando perfil..." className="py-16" />;
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
          {user?.user_metadata?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <Icon size={40} strokeWidth={1.5} />
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {user ? displayName(user) : profileConfig.name}
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          {user
            ? user.email
            : "Inicia sesión con Google para editar tus canciones desde cualquier navegador."}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl p-3">
          {error}
        </p>
      )}

      {!isConfigured ? (
        <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          Supabase no está configurado. Las canciones se guardan solo en este
          dispositivo.
        </div>
      ) : user ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <p className="font-medium">Sesión activa</p>
            <p className="mt-1 text-muted-foreground">
              Puedes crear y editar tus canciones desde cualquier navegador
              donde inicies sesión con esta cuenta.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            <LogOut size={18} />
            {signingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={signingIn}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <LogIn size={18} />
            {signingIn ? "Redirigiendo..." : "Continuar con Google"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Al iniciar sesión, las canciones creadas en este dispositivo se
            vincularán a tu cuenta.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <UserIcon size={20} className="mt-0.5 shrink-0 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">Himnario</p>
            <p className="mt-1 text-muted-foreground">
              {user
                ? "Tus canciones están sincronizadas con tu cuenta."
                : "Sin sesión solo puedes ver canciones; para crear o editar las tuyas necesitas iniciar sesión."}
            </p>
            <Link
              href="/hymns"
              className="mt-2 inline-block text-primary hover:underline"
            >
              Ir al himnario
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function displayName(user: {
  user_metadata?: { full_name?: string; name?: string };
  email?: string;
}): string {
  return (
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email ??
    "Usuario"
  );
}
