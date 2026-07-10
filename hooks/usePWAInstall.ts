"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isIOS,
  isMobileDevice,
  isStandalone,
  type BeforeInstallPromptEvent,
} from "@/utils/pwa";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [ready, setReady] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [iosDevice, setIosDevice] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setReady(true);
    setStandalone(isStandalone());
    setIosDevice(isIOS());
    setMobile(isMobileDevice());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setStandalone(isStandalone());
        return true;
      }
      return false;
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt]);

  return {
    ready,
    isStandalone: standalone,
    isMobile: mobile,
    canInstall: deferredPrompt !== null,
    isIOS: iosDevice,
    installing,
    install,
  };
}
