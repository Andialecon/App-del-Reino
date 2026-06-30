"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRequiresAuth } from "@/hooks/useIsHymnOwner";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { Loading } from "@/components/ui/Loading";
import { HymnForm } from "./HymnForm";

export function AddHymnForm() {
  const { loading, isConfigured } = useAuth();
  const needsAuth = useRequiresAuth();

  if (isConfigured && loading) {
    return <Loading label="Cargando..." className="py-16" />;
  }

  if (needsAuth) {
    return (
      <SignInPrompt
        title="Inicia sesión para crear canciones"
        description="Las canciones se guardan en la nube vinculadas a tu cuenta de Google, para que puedas editarlas desde cualquier navegador."
      />
    );
  }

  return <HymnForm mode="create" />;
}
