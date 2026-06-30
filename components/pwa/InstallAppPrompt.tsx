"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { Download, PlusSquare, Share, Smartphone, X } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { APP_NAME } from "@/lib/constants";

export function InstallAppPrompt() {
  const { visible, canInstall, isIOS, installing, install, dismiss } =
    useInstallPrompt();

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-end safe-top safe-bottom sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-prompt-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={dismiss}
      />

      <div className="relative mx-4 mb-6 w-full max-w-sm animate-fade-in-up overflow-hidden rounded-3xl shadow-2xl sm:mb-0">
        <div
          className="px-6 pb-6 pt-8 text-center text-white"
          style={{
            background: `linear-gradient(145deg, rgb(var(--splash-gradient-start)), rgb(var(--splash-gradient-end)))`,
          }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>

          <AppIcon size="xl" priority className="mx-auto mb-4" />

          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Smartphone size={14} />
            Instala en tu teléfono
          </div>

          <h2 id="install-prompt-title" className="mt-3 text-xl font-bold">
            Lleva {APP_NAME} contigo
          </h2>
          <p className="mt-2 text-sm text-white/85">
            Acceso rápido desde tu pantalla de inicio, en pantalla completa y sin
            barra del navegador.
          </p>
        </div>

        <div className="bg-card px-6 py-5">
          {canInstall ? (
            <button
              type="button"
              onClick={install}
              disabled={installing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Download size={20} />
              {installing ? "Instalando..." : "Instalar ahora"}
            </button>
          ) : isIOS ? (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-foreground">
                En Safari, toca el botón Compartir y luego:
              </p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
                  <Share size={18} className="shrink-0 text-primary" />
                  <span>Compartir</span>
                </li>
                <li className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
                  <PlusSquare size={18} className="shrink-0 text-primary" />
                  <span>Agregar a pantalla de inicio</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-foreground">
                Para instalar la app en Android:
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Abre el menú del navegador (⋮)</li>
                <li>Elige &quot;Instalar aplicación&quot; o &quot;Agregar a inicio&quot;</li>
              </ol>
            </div>
          )}

          <button
            type="button"
            onClick={dismiss}
            className="mt-4 w-full py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Continuar en el navegador
          </button>
        </div>
      </div>
    </div>
  );
}
