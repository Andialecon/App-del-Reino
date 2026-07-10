"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { useTranslation } from "@/components/providers/LocaleProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" aria-hidden />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <IconButton
      icon={isDark ? Sun : Moon}
      label={isDark ? t("theme.light") : t("theme.dark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    />
  );
}
