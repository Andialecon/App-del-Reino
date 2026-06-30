import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { CreatePlaylistForm } from "@/features/hymns/playlists/components/CreatePlaylistForm";

export const metadata: Metadata = {
  title: "Nueva lista",
};

export default function NewPlaylistPage() {
  return (
    <PageContainer>
      <div className="py-4">
        <CreatePlaylistForm />
      </div>
    </PageContainer>
  );
}
