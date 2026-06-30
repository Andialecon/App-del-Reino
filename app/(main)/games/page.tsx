import type { Metadata } from "next";
import { gamesConfig } from "@/features/games/config";
import { ModulePage, createModuleMetadata } from "@/components/layout/ModulePage";

export const metadata: Metadata = createModuleMetadata(gamesConfig);

export default function Page() {
  return <ModulePage module={gamesConfig} />;
}
