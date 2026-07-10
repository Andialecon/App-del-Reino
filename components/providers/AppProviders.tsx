"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { ServiceWorkerRegister } from "@/components/providers/ServiceWorkerRegister";
import { AuthProvider } from "@/components/providers/AuthProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
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
    </LocaleProvider>
  );
}
