"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, X } from "lucide-react";
import { DRAWER_MODULES } from "@/lib/modules";
import { Logo } from "@/components/ui/Logo";
import { IconButton } from "@/components/ui/IconButton";
import { useTranslation } from "@/components/providers/LocaleProvider";
import { useModuleLabels } from "@/hooks/useModuleLabels";
import { cn } from "@/utils/cn";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function DrawerModuleLink({
  module,
  isActive,
  onClose,
}: {
  module: (typeof DRAWER_MODULES)[number];
  isActive: boolean;
  onClose: () => void;
}) {
  const { name } = useModuleLabels(module);
  const Icon = module.icon;

  return (
    <Link
      href={module.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-foreground hover:bg-muted"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon size={20} strokeWidth={2} />
      {name}
    </Link>
  );
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(100%,20rem)] border-r border-border bg-nav-background shadow-xl transition-transform duration-300 ease-out safe-top safe-bottom",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label={t("nav.drawerNav")}
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <Logo size="sm" />
            <IconButton icon={X} label={t("nav.closeMenu")} onClick={onClose} />
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/home"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                    pathname === "/home"
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                  aria-current={pathname === "/home" ? "page" : undefined}
                >
                  <Home size={20} strokeWidth={2} />
                  {t("nav.home")}
                </Link>
              </li>
              {DRAWER_MODULES.map((module) => (
                <li key={module.id}>
                  <DrawerModuleLink
                    module={module}
                    isActive={pathname === module.href}
                    onClose={onClose}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-border p-4 text-center text-xs text-muted-foreground">
            {t("common.appName")}
          </div>
        </div>
      </aside>
    </>
  );
}
