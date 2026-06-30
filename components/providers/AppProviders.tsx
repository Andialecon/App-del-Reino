"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ServiceWorkerRegister } from "@/components/providers/ServiceWorkerRegister";
import { AuthProvider } from "@/components/providers/AuthProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ServiceWorkerRegister />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
