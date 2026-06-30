"use client";

import { useHymn } from "@/hooks/useHymns";
import { useAuth } from "@/components/providers/AuthProvider";
import { useIsHymnOwner, useRequiresAuth } from "@/hooks/useIsHymnOwner";
import { HymnForm } from "./HymnForm";
import { HymnDeleteButton } from "./HymnDeleteButton";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { Music } from "lucide-react";
import Link from "next/link";

interface EditHymnViewProps {
  id: string;
}

export function EditHymnView({ id }: EditHymnViewProps) {
  const { hymn, loading, error } = useHymn(id);
  const { loading: authLoading, isConfigured } = useAuth();
  const canEdit = useIsHymnOwner(hymn?.creatorId);
  const needsAuth = useRequiresAuth();

  if (loading || (isConfigured && authLoading)) {
    return <Loading label="Cargando..." className="py-16" />;
  }

  if (!hymn) {
    return (
      <EmptyState
        icon={Music}
        title="Canción no encontrada"
        description="Esta letra no existe o fue eliminada."
      />
    );
  }

  if (needsAuth) {
    return (
      <SignInPrompt
        title="Inicia sesión para editar"
        description="Esta canción pertenece a una cuenta. Inicia sesión con Google para editarla desde cualquier navegador."
      />
    );
  }

  if (!canEdit) {
    return (
      <EmptyState
        icon={Music}
        title="Sin permiso"
        description="Solo quien creó esta canción puede editarla."
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-muted-foreground rounded-xl bg-muted p-3">
          {error}
        </p>
      )}
      <Link
        href={`/hymns/${id}`}
        className="text-sm text-primary hover:underline"
      >
        Cancelar y volver
      </Link>
      <HymnForm
        mode="edit"
        hymnId={id}
        initial={{
          title: hymn.title,
          lyrics: hymn.lyrics,
          originalKey: hymn.originalKey,
          author: hymn.author,
        }}
      />
      <HymnDeleteButton
        hymnId={id}
        hymnTitle={hymn.title}
        variant="button"
        className="mt-2"
      />
    </div>
  );
}
