import type { Metadata } from "next";
import { profileConfig } from "@/features/profile/config";
import { ModulePage, createModuleMetadata } from "@/components/layout/ModulePage";

export const metadata: Metadata = createModuleMetadata(profileConfig);

export default function Page() {
  return <ModulePage module={profileConfig} />;
}
