"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { IconButton } from "@/components/ui/IconButton";
import {
  buildSocialShareLinks,
  canUseNativeShare,
  copyToClipboard,
  getPlaylistShareText,
  getPlaylistShareUrl,
} from "@/utils/share";
import { cn } from "@/utils/cn";

interface SharePlaylistButtonProps {
  playlistId: string;
  playlistTitle: string;
  className?: string;
}

const SOCIAL_OPTIONS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    className: "bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20",
  },
  {
    id: "facebook",
    label: "Facebook",
    className: "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20",
  },
  {
    id: "twitter",
    label: "X",
    className: "bg-foreground/5 text-foreground hover:bg-foreground/10",
  },
  {
    id: "telegram",
    label: "Telegram",
    className: "bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20",
  },
  {
    id: "email",
    label: "Correo",
    className: "bg-accent text-accent-foreground hover:bg-accent/80",
  },
] as const;

export function SharePlaylistButton({
  playlistId,
  playlistTitle,
  className,
}: SharePlaylistButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharingNative, setSharingNative] = useState(false);

  const shareUrl = useMemo(
    () => getPlaylistShareUrl(playlistId),
    [playlistId]
  );
  const shareText = useMemo(
    () => getPlaylistShareText(playlistTitle),
    [playlistTitle]
  );
  const socialLinks = useMemo(
    () => buildSocialShareLinks(shareUrl, shareText),
    [shareUrl, shareText]
  );

  const closeModal = () => {
    setOpen(false);
    setCopied(false);
    setError(null);
  };

  const handleOpen = () => {
    setCopied(false);
    setError(null);
    setOpen(true);
  };

  const handleCopyLink = async () => {
    setError(null);
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
      return;
    }
    setError("No se pudo copiar el enlace.");
  };

  const handleNativeShare = async () => {
    if (!canUseNativeShare()) return;

    setSharingNative(true);
    setError(null);

    try {
      await navigator.share({
        title: playlistTitle,
        text: shareText,
        url: shareUrl,
      });
      closeModal();
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError("No se pudo abrir el menú de compartir.");
    } finally {
      setSharingNative(false);
    }
  };

  return (
    <>
      <IconButton
        icon={Share2}
        label="Compartir lista"
        onClick={handleOpen}
        className={className}
      />

      <Modal
        open={open}
        onClose={closeModal}
        title="Compartir lista"
        className="max-w-md"
      >
        <p className="text-sm text-muted-foreground mb-4">
          Comparte{" "}
          <span className="font-medium text-foreground">{playlistTitle}</span>{" "}
          con tu congregación o grupo de alabanza.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-accent",
              copied && "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400"
            )}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Enlace copiado" : "Copiar enlace"}
          </button>

          {canUseNativeShare() && (
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={sharingNative}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Share2 size={18} />
              {sharingNative ? "Abriendo..." : "Compartir con otras apps"}
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            {SOCIAL_OPTIONS.map((option) => (
              <a
                key={option.id}
                href={socialLinks[option.id]}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  option.className
                )}
              >
                {option.label}
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground break-all rounded-xl bg-muted px-3 py-2">
            {shareUrl}
          </p>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </Modal>
    </>
  );
}
