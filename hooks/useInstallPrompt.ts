"use client";

import { useCallback, useEffect, useState } from "react";
import { canShowInstallPrompt, dismissInstallPrompt } from "@/utils/pwa";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function useInstallPrompt() {
  const { canInstall, isIOS, installing, install } = usePWAInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!canShowInstallPrompt()) return;

    const timer = window.setTimeout(() => setVisible(true), 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setVisible(false);
  }, []);

  const handleInstall = useCallback(async () => {
    const accepted = await install();
    if (accepted) {
      dismissInstallPrompt();
      setVisible(false);
    }
  }, [install]);

  return {
    visible,
    canInstall,
    isIOS,
    installing,
    install: handleInstall,
    dismiss,
  };
}
