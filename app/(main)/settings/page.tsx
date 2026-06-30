import type { Metadata } from "next";
import { settingsConfig } from "@/features/settings/config";
import { ModulePage, createModuleMetadata } from "@/components/layout/ModulePage";

export const metadata: Metadata = createModuleMetadata(settingsConfig);

export default function Page() {
  return <ModulePage module={settingsConfig} />;
}
