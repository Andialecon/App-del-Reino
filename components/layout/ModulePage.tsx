import type { Metadata } from "next";
import type { ModuleConfig } from "@/features/types";
import { PageContainer } from "@/components/layout/PageContainer";
import { ModulePlaceholder } from "@/components/ui/ModulePlaceholder";

interface ModulePageProps {
  module: ModuleConfig;
}

export function createModulePage(module: ModuleConfig) {
  const Page = () => (
    <PageContainer>
      <div className="py-4">
        <ModulePlaceholder module={module} />
      </div>
    </PageContainer>
  );

  return Page;
}

export function createModuleMetadata(module: ModuleConfig): Metadata {
  return {
    title: module.name,
  };
}

export function ModulePage({ module }: ModulePageProps) {
  return (
    <PageContainer>
      <div className="py-4">
        <ModulePlaceholder module={module} />
      </div>
    </PageContainer>
  );
}
