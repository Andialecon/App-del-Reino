"use client";

import { useTranslation } from "@/components/providers/LocaleProvider";
import { ModuleGrid } from "@/components/layout/ModuleGrid";

export function HomeContent() {
  const { t } = useTranslation();

  return (
    <div className="py-4 animate-fade-in">
      <h2 className="mb-1 text-lg font-semibold">{t("home.title")}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t("home.subtitle")}</p>
      <ModuleGrid />
    </div>
  );
}
