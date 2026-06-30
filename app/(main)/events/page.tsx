import type { Metadata } from "next";
import { eventsConfig } from "@/features/events/config";
import { ModulePage, createModuleMetadata } from "@/components/layout/ModulePage";

export const metadata: Metadata = createModuleMetadata(eventsConfig);

export default function Page() {
  return <ModulePage module={eventsConfig} />;
}
