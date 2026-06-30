import type { Metadata } from "next";
import { communityConfig } from "@/features/community/config";
import { ModulePage, createModuleMetadata } from "@/components/layout/ModulePage";

export const metadata: Metadata = createModuleMetadata(communityConfig);

export default function Page() {
  return <ModulePage module={communityConfig} />;
}
