import type { Metadata } from "next";
import { confessionConfig } from "@/features/confession/config";
import { ModulePage, createModuleMetadata } from "@/components/layout/ModulePage";

export const metadata: Metadata = createModuleMetadata(confessionConfig);

export default function Page() {
  return <ModulePage module={confessionConfig} />;
}
