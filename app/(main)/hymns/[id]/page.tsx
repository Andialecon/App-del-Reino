import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { HymnDetailView } from "@/features/hymns/components/HymnDetailView";

export const metadata: Metadata = {
  title: "Canción",
};

export default async function HymnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer>
      <div className="py-4">
        <HymnDetailView id={id} />
      </div>
    </PageContainer>
  );
}
