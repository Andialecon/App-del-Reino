"use client";

import type { ModuleConfig } from "@/features/types";
import { Clock } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslation } from "@/components/providers/LocaleProvider";
import { useModuleLabels } from "@/hooks/useModuleLabels";

interface ModulePlaceholderProps {
  module: ModuleConfig;
}

export function ModulePlaceholder({ module }: ModulePlaceholderProps) {
  const { t } = useTranslation();
  const { name, description } = useModuleLabels(module);
  const Icon = module.icon;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
          <Icon size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
      </div>

      <EmptyState
        icon={Clock}
        title={t("placeholder.title")}
        description={t("placeholder.description")}
      />
    </div>
  );
}
