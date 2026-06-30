import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PlaylistDetailView } from "@/features/hymns/playlists/components/PlaylistDetailView";

export const metadata: Metadata = {
  title: "Lista de reproducción",
};

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <div className="py-4">
        <PlaylistDetailView id={id} />
      </div>
    </PageContainer>
  );
}
