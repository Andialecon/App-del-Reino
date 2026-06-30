"use client";

import { useRouter, usePathname } from "next/navigation";
import { useDrawer } from "@/hooks/useDrawer";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Drawer } from "@/components/layout/Drawer";
import { ALL_MODULES, getModuleByHref } from "@/lib/modules";

const MODULE_ROOTS = new Set(ALL_MODULES.map((m) => m.href));

export function MainShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, close, toggle } = useDrawer();

  const isHome = pathname === "/home";
  const isModuleRoot = MODULE_ROOTS.has(pathname);
  const showBack = !isHome && !isModuleRoot;

  const handleBack = () => {
    const currentModule = getModuleByHref(pathname);
    if (currentModule && pathname !== currentModule.href) {
      router.push(currentModule.href);
      return;
    }
    if (!isHome) {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <Header
        onMenuClick={toggle}
        showBack={showBack}
        onBack={handleBack}
      />
      <Drawer isOpen={isOpen} onClose={close} />
      {children}
      <BottomNavigation />
    </div>
  );
}
