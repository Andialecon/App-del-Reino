"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { useTranslation } from "@/components/providers/LocaleProvider";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { APP_NAME } from "@/lib/constants";
import {
  CheckCircle2,
  Download,
  PlusSquare,
  Share,
  Smartphone,
  Zap,
  WifiOff,
} from "lucide-react";

export function InstallAppSection() {
  const { t } = useTranslation();
  const {
    ready,
    isStandalone,
    isMobile,
    canInstall,
    isIOS,
    installing,
    install,
  } = usePWAInstall();

  if (!ready) {
    return (
      <div className="h-52 rounded-3xl bg-muted animate-pulse" aria-hidden />
    );
  }

  if (isStandalone) {
    return (
      <section
        aria-label={t("settings.install.sectionTitle")}
        className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-4"
      >
        <CheckCircle2
          size={22}
          className="shrink-0 text-primary"
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("settings.install.alreadyInstalled")}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("settings.install.alreadyInstalledHint")}
          </p>
        </div>
      </section>
    );
  }

  if (!isMobile && !canInstall) return null;

  return (
    <section
      aria-label={t("settings.install.sectionTitle")}
      className="overflow-hidden rounded-3xl border border-primary/20 shadow-lg"
    >
      <div
        className="px-5 pb-5 pt-6 text-white"
        style={{
          background: `linear-gradient(145deg, rgb(var(--splash-gradient-start)), rgb(var(--splash-gradient-end)))`,
        }}
      >
        <div className="flex items-start gap-4">
          <AppIcon size="lg" priority className="shrink-0 shadow-xl" />

          <div className="min-w-0 flex-1 pt-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
              <Smartphone size={12} aria-hidden />
              {t("settings.install.badge")}
            </div>

            <h2 className="mt-2 text-lg font-bold leading-tight">
              {t("settings.install.title", { appName: APP_NAME })}
            </h2>
            <p className="mt-1.5 text-sm text-white/85">
              {t("settings.install.description")}
            </p>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/90">
          <li className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <Zap size={14} className="shrink-0" aria-hidden />
            {t("settings.install.benefitFast")}
          </li>
          <li className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <WifiOff size={14} className="shrink-0" aria-hidden />
            {t("settings.install.benefitOffline")}
          </li>
        </ul>
      </div>

      <div className="bg-card px-5 py-4">
        {canInstall ? (
          <button
            type="button"
            onClick={install}
            disabled={installing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Download size={20} aria-hidden />
            {installing
              ? t("settings.install.installing")
              : t("settings.install.installNow")}
          </button>
        ) : isIOS ? (
          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-foreground">
              {t("settings.install.iosHint")}
            </p>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
                <Share size={18} className="shrink-0 text-primary" aria-hidden />
                <span>{t("settings.install.iosStepShare")}</span>
              </li>
              <li className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
                <PlusSquare
                  size={18}
                  className="shrink-0 text-primary"
                  aria-hidden
                />
                <span>{t("settings.install.iosStepAdd")}</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-foreground">
              {t("settings.install.androidHint")}
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              <li>{t("settings.install.androidStep1")}</li>
              <li>{t("settings.install.androidStep2")}</li>
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
