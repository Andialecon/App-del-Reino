import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { EditPlaylistForm } from "@/features/hymns/playlists/components/EditPlaylistForm";

export const metadata: Metadata = {
  title: "Editar lista",
};

interface EditPlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlaylistPage({ params }: EditPlaylistPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <div className="py-4">
        <EditPlaylistForm id={id} />
      </div>
    </PageContainer>
  );
}
