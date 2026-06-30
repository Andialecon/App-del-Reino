"use client";

import { useState } from "react";
import { ListPlus, Plus } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useMyPlaylists } from "@/hooks/usePlaylists";
import { addToPlaylist, createPlaylist } from "@/features/hymns/playlists/storage";
import { transposeKey } from "@/features/hymns/utils/chords";
import { Modal } from "@/components/ui/Modal";
import { IconButton } from "@/components/ui/IconButton";
import { Loading } from "@/components/ui/Loading";
import { cn } from "@/utils/cn";

interface AddToPlaylistButtonProps {
  hymnId: string;
  hymnTitle: string;
  originalKey: string;
  transposeSteps: number;
}

export function AddToPlaylistButton({
  hymnId,
  hymnTitle,
  originalKey,
  transposeSteps,
}: AddToPlaylistButtonProps) {
  const { userId, signInWithGoogle, isConfigured } = useAuth();
  const [open, setOpen] = useState(false);
  const { playlists, loading, reload } = useMyPlaylists();
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const currentKey = transposeKey(originalKey, transposeSteps);
  const keyLabel =
    transposeSteps === 0
      ? originalKey
      : `${originalKey} → ${currentKey}`;

  const closeModal = () => {
    if (!adding && !creating) {
      setOpen(false);
      setCreating(false);
      setNewTitle("");
      setSuccess(null);
      setError(null);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (userId) reload();
  };

  const handleAdd = async (playlistId: string, playlistTitle: string) => {
    setAdding(playlistId);
    setError(null);
    setSuccess(null);
    try {
      await addToPlaylist({ playlistId, hymnId, transposeSteps });
      setSuccess(`Agregada a "${playlistTitle}" en tonalidad ${currentKey}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo agregar.");
    } finally {
      setAdding(null);
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    setError(null);
    try {
      const playlist = await createPlaylist({ title: newTitle.trim() });
      await addToPlaylist({
        playlistId: playlist.id,
        hymnId,
        transposeSteps,
      });
      setSuccess(
        `Lista "${playlist.title}" creada con "${hymnTitle}" en ${currentKey}`
      );
      setCreating(false);
      setNewTitle("");
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear la lista.");
      setCreating(false);
    }
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
      setSigningIn(false);
    }
  };

  return (
    <>
      <IconButton
        icon={ListPlus}
        label="Agregar a lista"
        onClick={handleOpen}
      />

      <Modal
        open={open}
        onClose={closeModal}
        title="Agregar a lista"
        className="max-w-md"
      >
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium text-foreground">{hymnTitle}</span>
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Tonalidad guardada: <span className="font-medium">{keyLabel}</span>
        </p>

        {!isConfigured || !userId ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Inicia sesión para crear listas y guardar canciones con su
              tonalidad transportada.
            </p>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <button
              type="button"
              onClick={handleSignIn}
              disabled={signingIn}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {signingIn ? "Redirigiendo..." : "Continuar con Google"}
            </button>
          </div>
        ) : loading ? (
          <Loading label="Cargando tus listas..." className="py-8" />
        ) : (
          <div className="space-y-3">
            {playlists.length > 0 && (
              <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                {playlists.map((playlist) => (
                  <li key={playlist.id}>
                    <button
                      type="button"
                      onClick={() => handleAdd(playlist.id, playlist.title)}
                      disabled={adding === playlist.id}
                      className={cn(
                        "w-full rounded-xl border border-border px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent disabled:opacity-50",
                        adding === playlist.id && "bg-accent"
                      )}
                    >
                      <span className="font-medium">{playlist.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {playlist.itemCount ?? 0} canciones
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleCreateAndAdd} className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nueva lista..."
                className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={creating || !newTitle.trim()}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                aria-label="Crear y agregar"
              >
                <Plus size={18} />
              </button>
            </form>

            {success && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
