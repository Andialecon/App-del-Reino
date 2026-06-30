"use client";

import Link from "next/link";
import { Music, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useHymns } from "@/hooks/useHymns";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";

export function HymnList() {
  const { hymns, loading, error } = useHymns();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hymns;
    return hymns.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.author?.toLowerCase().includes(q)
    );
  }, [hymns, query]);

  if (loading) {
    return <Loading label="Cargando himnos..." className="py-16" />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Himnario</h2>
          <p className="text-sm text-muted-foreground">
            {hymns.length} canción{hymns.length !== 1 ? "es" : ""}
          </p>
        </div>
        <Link
          href="/hymns/new"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          aria-label="Agregar canción"
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
          placeholder="Buscar canción..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {error && (
        <p className="text-sm text-muted-foreground rounded-xl bg-muted p-3">
          {error} — mostrando datos locales.
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Music}
          title="Sin canciones"
          description="Agrega la primera letra con acordes al himnario."
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((hymn) => (
            <li key={hymn.id}>
              <Link href={`/hymns/${hymn.id}`}>
                <Card interactive className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Music size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{hymn.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {hymn.originalKey}
                      {hymn.author ? ` · ${hymn.author}` : ""}
                    </p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/hymns/new"
        className="flex items-center justify-center gap-2 w-full rounded-2xl border border-dashed border-border py-3 text-sm font-medium text-primary hover:bg-accent transition-colors"
      >
        <Plus size={18} />
        Agregar nueva letra
      </Link>
    </div>
  );
}
