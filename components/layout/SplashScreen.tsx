"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import { Logo } from "@/components/ui/Logo";
import { APP_NAME } from "@/lib/constants";

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center safe-top safe-bottom"
      style={{
        background: `linear-gradient(135deg, rgb(var(--splash-gradient-start)), rgb(var(--splash-gradient-end)))`,
      }}
    >
      <div className="animate-scale-in flex flex-col items-center">
        <AppIcon size="xl" priority className="mb-6" />
        <Logo
          size="lg"
          showIcon={false}
          showText
          className="text-white [&_span]:text-white"
        />
        <p className="mt-3 text-sm text-white/80 animate-pulse-soft">
          {APP_NAME}
        </p>
      </div>
    </div>
  );
}
