import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { AddHymnForm } from "@/features/hymns/components/AddHymnForm";

export const metadata: Metadata = {
  title: "Nueva canción",
};

export default function NewHymnPage() {
  return (
    <PageContainer>
      <div className="py-4">
        <AddHymnForm />
      </div>
    </PageContainer>
  );
}
