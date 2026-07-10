"use client";

import Link from "next/link";
import { ListMusic, Music, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useHymns } from "@/hooks/useHymns";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslation } from "@/components/providers/LocaleProvider";

export function HymnList() {
  const { hymns, loading, error } = useHymns();
  const { t } = useTranslation();
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

  const songCountLabel = `${hymns.length} ${
    hymns.length === 1 ? t("hymns.songOne") : t("hymns.songMany")
  }`;

  if (loading) {
    return <Loading label={t("hymns.loading")} className="py-16" />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{t("hymns.title")}</h2>
          <p className="text-sm text-muted-foreground">{songCountLabel}</p>
        </div>
        <Link
          href="/hymns/new"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          aria-label={t("hymns.addSong")}
        >
          <Plus size={20} strokeWidth={2} />
        </Link>
      </div>

      <Link
        href="/hymns/playlists"
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-colors hover:bg-accent"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ListMusic size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm">{t("hymns.playlists")}</p>
          <p className="text-xs text-muted-foreground">{t("hymns.playlistsHint")}</p>
        </div>
      </Link>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          type="search"
          placeholder={t("hymns.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {error && (
        <p className="text-sm text-muted-foreground rounded-xl bg-muted p-3">
          {error} — {t("hymns.localFallback")}
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Music}
          title={t("hymns.emptyTitle")}
          description={t("hymns.emptyDescription")}
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
        {t("hymns.addLyrics")}
      </Link>
    </div>
  );
}
