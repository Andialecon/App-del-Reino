"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/components/providers/LocaleProvider";
import { cn } from "@/utils/cn";

export function SettingsView() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeOptions = [
    { value: "system", label: t("theme.system"), icon: Monitor },
    { value: "light", label: t("theme.lightMode"), icon: Sun },
    { value: "dark", label: t("theme.darkMode"), icon: Moon },
  ] as const;

  return (
    <div className="animate-fade-in space-y-8 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold">{t("settings.languageSection")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("settings.languageHint")}</p>
        </div>
        <LanguageToggle variant="full" />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold">{t("settings.appearance")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("settings.appearanceHint")}</p>
        </div>
        {mounted ? (
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition-all",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  )}
                  aria-pressed={active}
                >
                  <Icon size={20} strokeWidth={2} />
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="h-20 rounded-xl bg-muted animate-pulse" aria-hidden />
        )}
      </section>
    </div>
  );
}
