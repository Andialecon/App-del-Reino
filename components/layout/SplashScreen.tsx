"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-3xl font-bold text-white shadow-lg backdrop-blur-sm">
          R
        </div>
        <Logo
          size="lg"
          showText
          className="text-white [&_div:first-child]:bg-white/20 [&_div:first-child]:text-white [&_span]:text-white"
        />
        <p className="mt-3 text-sm text-white/80 animate-pulse-soft">
          {APP_NAME}
        </p>
      </div>
    </div>
  );
}
