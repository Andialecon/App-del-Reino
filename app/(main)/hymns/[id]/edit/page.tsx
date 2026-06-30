import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { EditHymnView } from "@/features/hymns/components/EditHymnView";

export const metadata: Metadata = {
  title: "Editar canción",
};

export default async function EditHymnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer>
      <div className="py-4">
        <EditHymnView id={id} />
      </div>
    </PageContainer>
  );
}
