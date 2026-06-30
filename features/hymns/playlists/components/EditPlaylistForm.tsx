"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePlaylist } from "@/hooks/usePlaylists";
import { useIsHymnOwner } from "@/hooks/useIsHymnOwner";
import { updatePlaylist } from "@/features/hymns/playlists/storage";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListMusic } from "lucide-react";

interface EditPlaylistFormProps {
  id: string;
}

export function EditPlaylistForm({ id }: EditPlaylistFormProps) {
  const router = useRouter();
  const { playlist, loading } = usePlaylist(id);
  const canEdit = useIsHymnOwner(playlist?.creatorId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
      setDescription(playlist.description ?? "");
    }
  }, [playlist]);

  if (loading) {
    return <Loading label="Cargando..." className="py-16" />;
  }

  if (!playlist) {
    return (
      <EmptyState
        icon={ListMusic}
        title="Lista no encontrada"
        description="Esta lista no existe o fue eliminada."
      />
    );
  }

  if (!canEdit) {
    return (
      <EmptyState
        icon={ListMusic}
        title="Sin permiso"
        description="Solo el creador puede editar esta lista."
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    setSubmitting(true);
    try {
      await updatePlaylist(id, {
        title,
        description: description || undefined,
      });
      router.push(`/hymns/playlists/${id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la lista."
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Link
        href={`/hymns/playlists/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a la lista
      </Link>

      <div>
        <h2 className="text-lg font-semibold">Editar lista</h2>
      </div>

      <div className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Título</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Descripción (opcional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
