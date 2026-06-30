"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getModuleByHref } from "@/lib/modules";
import { cn } from "@/utils/cn";
import { HEADER_HEIGHT } from "@/lib/constants";

interface HeaderProps {
  onMenuClick: () => void;
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export function Header({ onMenuClick, showBack, onBack, title }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/home";
  const currentModule = !isHome ? getModuleByHref(pathname) : undefined;
  const displayTitle = title ?? currentModule?.name ?? "Inicio";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-border bg-nav-background/95 backdrop-blur-md safe-top"
      )}
      style={{ height: `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top))` }}
    >
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Volver
            </button>
          ) : (
            <>
              <IconButton
                icon={Menu}
                label="Abrir menú"
                onClick={onMenuClick}
              />
              {isHome ? (
                <Logo size="sm" />
              ) : (
                <h1 className="truncate text-base font-semibold">{displayTitle}</h1>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
