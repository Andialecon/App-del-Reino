"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslation } from "@/components/providers/LocaleProvider";

export function NotFoundContent() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-sm text-center">
      <EmptyState
        icon={FileQuestion}
        title={t("errors.notFoundTitle")}
        description={t("errors.notFoundDescription")}
      />
      <Link
        href="/home"
        className="mt-6 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {t("errors.goHome")}
      </Link>
    </div>
  );
}
