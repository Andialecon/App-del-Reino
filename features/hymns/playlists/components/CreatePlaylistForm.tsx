"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRequiresAuth } from "@/hooks/useIsHymnOwner";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { Loading } from "@/components/ui/Loading";
import { createPlaylist } from "@/features/hymns/playlists/storage";

export function CreatePlaylistForm() {
  const router = useRouter();
  const { loading, isConfigured } = useAuth();
  const needsAuth = useRequiresAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isConfigured && loading) {
    return <Loading label="Cargando..." className="py-16" />;
  }

  if (needsAuth) {
    return (
      <SignInPrompt
        title="Inicia sesión para crear listas"
        description="Las listas de reproducción se guardan en la nube y pueden ser vistas por cualquier usuario."
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
      const playlist = await createPlaylist({
        title,
        description: description || undefined,
      });
      router.push(`/hymns/playlists/${playlist.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear la lista."
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold">Nueva lista</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Crea una lista pública de canciones con tonalidades personalizadas.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Título</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Alabanza dominical"
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Descripción (opcional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el propósito de esta lista..."
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
        {submitting ? "Creando..." : "Crear lista"}
      </button>
    </form>
  );
}
