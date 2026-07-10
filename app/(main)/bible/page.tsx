import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { BibleReader } from "@/features/bible/components/BibleReader";
import { bibleConfig } from "@/features/bible/config";

export const metadata: Metadata = {
  title: bibleConfig.name,
  description: bibleConfig.description,
};

export default function BiblePage() {
  return (
    <PageContainer>
      <div className="py-4">
        <BibleReader />
      </div>
    </PageContainer>
  );
}
