export function getPlaylistShareUrl(playlistId: string): string {
  if (typeof window === "undefined") {
    return `/hymns/playlists/${playlistId}`;
  }
  return `${window.location.origin}/hymns/playlists/${playlistId}`;
}

export function getPlaylistShareText(title: string): string {
  return `Lista de canciones: ${title}`;
}

export interface SocialShareLinks {
  whatsapp: string;
  facebook: string;
  twitter: string;
  telegram: string;
  email: string;
}

export function buildSocialShareLinks(
  url: string,
  text: string
): SocialShareLinks {
  const message = `${text}\n${url}`;

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(message)}`,
  };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
