"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useHymn } from "@/hooks/useHymns";
import { useHymnDisplaySettings } from "@/hooks/useHymnDisplaySettings";
import { isHymnOwner } from "@/lib/localUser";
import { HymnLyricsViewer } from "./HymnLyricsViewer";
import { KeyTransposer } from "./KeyTransposer";
import { HymnDisplaySettingsPanel } from "./HymnDisplaySettingsPanel";
import { HymnDeleteButton } from "./HymnDeleteButton";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Music } from "lucide-react";

interface HymnDetailViewProps {
  id: string;
}

export function HymnDetailView({ id }: HymnDetailViewProps) {
  const { hymn, loading, error } = useHymn(id);
  const { settings, updateSettings, resetSettings } = useHymnDisplaySettings();
  const [transposeSteps, setTransposeSteps] = useState(0);

  const musicianMode = settings.musicianMode;

  useEffect(() => {
    if (!musicianMode) setTransposeSteps(0);
  }, [musicianMode]);

  if (loading) {
    return <Loading label="Cargando canción..." className="py-16" />;
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

  const canEdit = isHymnOwner(hymn.creatorId);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{hymn.title}</h1>
          {hymn.author && (
            <p className="text-sm text-muted-foreground mt-1">{hymn.author}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {canEdit && (
            <>
              <Link
                href={`/hymns/${id}/edit`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-accent transition-colors"
                aria-label="Editar canción"
              >
                <Pencil size={20} />
              </Link>
              <HymnDeleteButton hymnId={id} hymnTitle={hymn.title} />
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

      {musicianMode && hymn.originalKey && (
        <KeyTransposer
          originalKey={hymn.originalKey}
          transposeSteps={transposeSteps}
          onTransposeStepsChange={setTransposeSteps}
        />
      )}

      <HymnLyricsViewer
        lyrics={hymn.lyrics ?? ""}
        musicianMode={musicianMode}
        transposeSteps={transposeSteps}
        display={settings}
      />
    </div>
  );
}
