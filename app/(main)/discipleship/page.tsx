import type { Metadata } from "next";
import { discipleshipConfig } from "@/features/discipleship/config";
import { ModulePage, createModuleMetadata } from "@/components/layout/ModulePage";

export const metadata: Metadata = createModuleMetadata(discipleshipConfig);

export default function Page() {
  return <ModulePage module={discipleshipConfig} />;
}
