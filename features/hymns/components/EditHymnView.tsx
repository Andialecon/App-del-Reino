"use client";

import { useHymn } from "@/hooks/useHymns";
import { isHymnOwner } from "@/lib/localUser";
import { HymnForm } from "./HymnForm";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Music } from "lucide-react";
import Link from "next/link";

interface EditHymnViewProps {
  id: string;
}

export function EditHymnView({ id }: EditHymnViewProps) {
  const { hymn, loading, error } = useHymn(id);

  if (loading) {
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

  if (!isHymnOwner(hymn.creatorId)) {
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
    </div>
  );
}
