"use client";

import Link from "next/link";
import { ListMusic, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";

export function PlaylistList() {
  const { playlists, loading, error } = usePlaylists();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return playlists;
    return playlists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [playlists, query]);

  if (loading) {
    return <Loading label="Cargando listas..." className="py-16" />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Listas de reproducción</h2>
          <p className="text-sm text-muted-foreground">
            {playlists.length} lista{playlists.length !== 1 ? "s" : ""} pública
            {playlists.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/hymns/playlists/new"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          aria-label="Crear lista"
        >
          <Plus size={20} strokeWidth={2} />
        </Link>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          type="search"
          placeholder="Buscar lista..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {error && (
        <p className="text-sm text-muted-foreground rounded-xl bg-muted p-3">
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListMusic}
          title="Sin listas"
          description="Crea la primera lista de canciones con tonalidades personalizadas."
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((playlist) => (
            <li key={playlist.id}>
              <Link href={`/hymns/playlists/${playlist.id}`}>
                <Card interactive className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <ListMusic size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{playlist.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {playlist.itemCount ?? 0} canción
                      {(playlist.itemCount ?? 0) !== 1 ? "es" : ""}
                      {playlist.description
                        ? ` · ${playlist.description}`
                        : ""}
                    </p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/hymns/playlists/new"
        className="flex items-center justify-center gap-2 w-full rounded-2xl border border-dashed border-border py-3 text-sm font-medium text-primary hover:bg-accent transition-colors"
      >
        <Plus size={18} />
        Crear nueva lista
      </Link>
    </div>
  );
}
