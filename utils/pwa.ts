const INSTALL_PROMPT_KEY = "el-reino-install-prompt-seen";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  const mobileUa =
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const touchMobile =
    navigator.maxTouchPoints > 1 &&
    window.matchMedia("(max-width: 768px)").matches;

  return mobileUa || touchMobile;
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export function hasSeenInstallPrompt(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(INSTALL_PROMPT_KEY) === "1";
}

export function canShowInstallPrompt(): boolean {
  if (typeof window === "undefined") return false;
  if (!isMobileDevice()) return false;
  if (isStandalone()) return false;
  if (hasSeenInstallPrompt()) return false;
  return true;
}

export function dismissInstallPrompt(): void {
  localStorage.setItem(INSTALL_PROMPT_KEY, "1");
}
