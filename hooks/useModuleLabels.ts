"use client";

import type { ModuleConfig } from "@/features/types";
import type { ModuleId } from "@/types";
import { useTranslation } from "@/components/providers/LocaleProvider";

export function useModuleLabels(module: ModuleConfig) {
  const { t } = useTranslation();

  return {
    name: t(`modules.${module.id}.name`),
    description: t(`modules.${module.id}.description`),
  };
}

export function useModuleLabel(id: ModuleId) {
  const { t } = useTranslation();
  return t(`modules.${id}.name`);
}
