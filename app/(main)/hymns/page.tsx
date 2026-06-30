import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { HymnList } from "@/features/hymns/components/HymnList";
import { hymnsConfig } from "@/features/hymns/config";

export const metadata: Metadata = {
  title: hymnsConfig.name,
};

export default function HymnsPage() {
  return (
    <PageContainer>
      <div className="py-4">
        <HymnList />
      </div>
    </PageContainer>
  );
}
