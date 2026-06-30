"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ListMusic,
  Music,
  Pencil,
  X,
} from "lucide-react";
import { usePlaylist } from "@/hooks/usePlaylists";
import { useIsHymnOwner } from "@/hooks/useIsHymnOwner";
import { useHymnDisplaySettings } from "@/hooks/useHymnDisplaySettings";
import { HymnLyricsViewer } from "@/features/hymns/components/HymnLyricsViewer";
import { KeyTransposer } from "@/features/hymns/components/KeyTransposer";
import { HymnDisplaySettingsPanel } from "@/features/hymns/components/HymnDisplaySettingsPanel";
import { PlaylistDeleteButton } from "./PlaylistDeleteButton";
import { RemovePlaylistItemButton } from "./RemovePlaylistItemButton";
import {
  removePlaylistItem,
  reorderPlaylistItems,
  updatePlaylistItemTranspose,
} from "@/features/hymns/playlists/storage";
import { transposeKey } from "@/features/hymns/utils/chords";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/utils/cn";
import type { HymnPlaylistItem } from "../types";

interface PlaylistDetailViewProps {
  id: string;
}

function reorderItems(
  items: HymnPlaylistItem[],
  fromIndex: number,
  toIndex: number
): HymnPlaylistItem[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next.map((item, index) => ({ ...item, position: index }));
}

export function PlaylistDetailView({ id }: PlaylistDetailViewProps) {
  const { playlist, loading, error, updateLocal } = usePlaylist(id);
  const { settings, updateSettings, resetSettings } = useHymnDisplaySettings();
  const canEdit = useIsHymnOwner(playlist?.creatorId);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);

  const activeItem = playlist?.items.find((item) => item.id === activeItemId);
  const musicianMode = settings.musicianMode;

  const handleSelectItem = (item: HymnPlaylistItem) => {
    setActiveItemId(item.id === activeItemId ? null : item.id);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removePlaylistItem(itemId);
    updateLocal((prev) => ({
      ...prev,
      items: prev.items
        .filter((i) => i.id !== itemId)
        .map((item, index) => ({ ...item, position: index })),
    }));
    if (activeItemId === itemId) setActiveItemId(null);
  };

  const handleMoveItem = async (index: number, direction: "up" | "down") => {
    if (!playlist || reordering) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= playlist.items.length) return;

    const reordered = reorderItems(playlist.items, index, targetIndex);
    const previousItems = playlist.items;

    setReorderError(null);
    updateLocal((prev) => ({ ...prev, items: reordered }));
    setReordering(true);

    try {
      await reorderPlaylistItems(
        id,
        reordered.map((item) => item.id)
      );
    } catch (e) {
      updateLocal((prev) => ({ ...prev, items: previousItems }));
      setReorderError(
        e instanceof Error ? e.message : "No se pudo reordenar la lista."
      );
    } finally {
      setReordering(false);
    }
  };

  const handleTransposeChange = async (itemId: string, steps: number) => {
    updateLocal((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.id === itemId ? { ...i, transposeSteps: steps } : i
      ),
    }));

    if (canEdit) {
      try {
        await updatePlaylistItemTranspose(itemId, steps);
      } catch {
        // UI already updated; reload on next visit
      }
    }
  };

  if (loading) {
    return <Loading label="Cargando lista..." className="py-16" />;
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

  return (
    <div className="space-y-4 animate-fade-in">
      <Link
        href="/hymns/playlists"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Todas las listas
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{playlist.title}</h1>
          {playlist.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {playlist.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {playlist.items.length} canción
            {playlist.items.length !== 1 ? "es" : ""}
            {canEdit && playlist.items.length > 1 && (
              <span> · Usa las flechas para reordenar</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {canEdit && (
            <>
              <Link
                href={`/hymns/playlists/${id}/edit`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-accent transition-colors"
                aria-label="Editar lista"
              >
                <Pencil size={20} />
              </Link>
              <PlaylistDeleteButton
                playlistId={id}
                playlistTitle={playlist.title}
              />
            </>
          )}
          <HymnDisplaySettingsPanel
            settings={settings}
            onUpdate={updateSettings}
            onReset={resetSettings}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-muted-foreground rounded-xl bg-muted p-3">
          {error}
        </p>
      )}

      {reorderError && (
        <p className="text-sm text-red-600 dark:text-red-400 rounded-xl bg-red-500/10 p-3">
          {reorderError}
        </p>
      )}

      {activeItem?.hymn && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="font-semibold">{activeItem.hymn.title}</h2>
              {activeItem.hymn.author && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeItem.hymn.author}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {canEdit && (
                <RemovePlaylistItemButton
                  hymnTitle={activeItem.hymn.title}
                  onConfirm={() => handleRemoveItem(activeItem.id)}
                />
              )}
              <button
                type="button"
                onClick={() => setActiveItemId(null)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors"
                aria-label="Cerrar reproductor"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {musicianMode && activeItem.hymn.originalKey && (
            <KeyTransposer
              originalKey={activeItem.hymn.originalKey}
              transposeSteps={activeItem.transposeSteps}
              onTransposeStepsChange={(steps) =>
                handleTransposeChange(activeItem.id, steps)
              }
            />
          )}

          <HymnLyricsViewer
            lyrics={activeItem.hymn.lyrics ?? ""}
            musicianMode={musicianMode}
            transposeSteps={activeItem.transposeSteps}
            display={settings}
          />

          <Link
            href={`/hymns/${activeItem.hymnId}`}
            className="inline-block text-sm text-primary hover:underline"
          >
            Ver canción completa
          </Link>
        </div>
      )}

      {playlist.items.length === 0 ? (
        <EmptyState
          icon={Music}
          title="Lista vacía"
          description="Agrega canciones desde el detalle de cualquier himno usando el botón de lista."
        />
      ) : (
        <ul className="space-y-1.5">
          {playlist.items.map((item, index) => {
            const hymn = item.hymn;
            if (!hymn) return null;

            const displayKey = transposeKey(hymn.originalKey, item.transposeSteps);
            const isActive = activeItemId === item.id;
            const isFirst = index === 0;
            const isLast = index === playlist.items.length - 1;

            return (
              <li key={item.id}>
                <Card
                  interactive={!canEdit}
                  className={cn(
                    "flex items-center gap-2 p-3",
                    isActive && "ring-2 ring-primary",
                    reordering && "opacity-80"
                  )}
                >
                  {canEdit && (
                    <div className="flex flex-col shrink-0">
                      <IconButton
                        icon={ChevronUp}
                        label="Subir canción"
                        size="sm"
                        disabled={isFirst || reordering}
                        onClick={() => handleMoveItem(index, "up")}
                        className="h-7 w-7"
                      />
                      <IconButton
                        icon={ChevronDown}
                        label="Bajar canción"
                        size="sm"
                        disabled={isLast || reordering}
                        onClick={() => handleMoveItem(index, "down")}
                        className="h-7 w-7"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="flex flex-1 items-center gap-3 min-w-0 text-left"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{hymn.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.transposeSteps === 0
                          ? hymn.originalKey
                          : `${hymn.originalKey} → ${displayKey}`}
                        {hymn.author ? ` · ${hymn.author}` : ""}
                      </p>
                    </div>
                  </button>

                  {canEdit && (
                    <RemovePlaylistItemButton
                      hymnTitle={hymn.title}
                      onConfirm={() => handleRemoveItem(item.id)}
                      disabled={reordering}
                    />
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
