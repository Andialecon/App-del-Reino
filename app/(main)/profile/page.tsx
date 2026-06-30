import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileView } from "@/features/profile/components/ProfileView";
import { profileConfig } from "@/features/profile/config";
import { createModuleMetadata } from "@/components/layout/ModulePage";
import { Loading } from "@/components/ui/Loading";

export const metadata: Metadata = createModuleMetadata(profileConfig);

export default function Page() {
  return (
    <PageContainer>
      <div className="py-4">
        <Suspense fallback={<Loading label="Cargando perfil..." className="py-16" />}>
          <ProfileView />
        </Suspense>
      </div>
    </PageContainer>
  );
}
