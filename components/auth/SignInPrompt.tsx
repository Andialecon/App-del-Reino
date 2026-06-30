"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

interface SignInPromptProps {
  title?: string;
  description?: string;
}

export function SignInPrompt({
  title = "Inicia sesión",
  description = "Inicia sesión con Google para crear y editar tus canciones desde cualquier navegador.",
}: SignInPromptProps) {
  const { signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="animate-fade-in space-y-4 rounded-xl border border-border bg-card p-6 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="button"
        onClick={handleSignIn}
        disabled={signingIn}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <LogIn size={18} />
        {signingIn ? "Redirigiendo..." : "Continuar con Google"}
      </button>
      <Link
        href="/profile"
        className="inline-block text-sm text-primary hover:underline"
      >
        Ir a mi perfil
      </Link>
    </div>
  );
}
