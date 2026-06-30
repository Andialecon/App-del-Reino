import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PlaylistList } from "@/features/hymns/playlists/components/PlaylistList";

export const metadata: Metadata = {
  title: "Listas de reproducción",
};

export default function PlaylistsPage() {
  return (
    <PageContainer>
      <div className="py-4">
        <PlaylistList />
      </div>
    </PageContainer>
  );
}
