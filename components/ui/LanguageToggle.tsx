"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/utils/cn";

interface LanguageToggleProps {
  variant?: "compact" | "full";
  className?: string;
}

export function LanguageToggle({
  variant = "compact",
  className,
}: LanguageToggleProps) {
  const { locale, setLocale, t } = useLocale();

  if (variant === "full") {
    return (
      <div className={cn("grid grid-cols-2 gap-2", className)}>
        {(["es", "en"] as Locale[]).map((code) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:bg-accent"
              )}
              aria-pressed={active}
            >
              {t(`language.${code}`)}
            </button>
          );
        })}
      </div>
    );
  }

  const next: Locale = locale === "es" ? "en" : "es";

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-accent",
        className
      )}
      aria-label={t("language.switchTo")}
      title={t("language.switchTo")}
    >
      <Languages size={18} strokeWidth={2} className="text-muted-foreground" />
      <span>{locale}</span>
    </button>
  );
}
