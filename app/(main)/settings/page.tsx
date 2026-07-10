import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SettingsView } from "@/features/settings/components/SettingsView";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function Page() {
  return (
    <PageContainer>
      <SettingsView />
    </PageContainer>
  );
}
