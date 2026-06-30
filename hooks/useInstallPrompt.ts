"use client";

import { useCallback, useEffect, useState } from "react";
import {
  canShowInstallPrompt,
  dismissInstallPrompt,
  isIOS,
  type BeforeInstallPromptEvent,
} from "@/utils/pwa";

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [iosDevice, setIosDevice] = useState(false);

  useEffect(() => {
    if (!canShowInstallPrompt()) return;

    setIosDevice(isIOS());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const timer = window.setTimeout(() => setVisible(true), 900);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      dismissInstallPrompt();
      setVisible(false);
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt]);

  return {
    visible,
    canInstall: deferredPrompt !== null,
    isIOS: iosDevice,
    installing,
    install,
    dismiss,
  };
}
