import type { Metadata } from "next";
import { bibleConfig } from "@/features/bible/config";
import { ModulePage, createModuleMetadata } from "@/components/layout/ModulePage";

export const metadata: Metadata = createModuleMetadata(bibleConfig);

export default function Page() {
  return <ModulePage module={bibleConfig} />;
}
