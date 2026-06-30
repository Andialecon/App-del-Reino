"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/utils/cn";

interface RemovePlaylistItemButtonProps {
  hymnTitle: string;
  onConfirm: () => Promise<void>;
  variant?: "icon" | "button";
  className?: string;
  disabled?: boolean;
}

export function RemovePlaylistItemButton({
  hymnTitle,
  onConfirm,
  variant = "icon",
  className,
  disabled,
}: RemovePlaylistItemButtonProps) {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    if (!removing) {
      setOpen(false);
      setError(null);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    setError(null);
    try {
      await onConfirm();
      setOpen(false);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo quitar la canción."
      );
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <IconButton
          icon={Trash2}
          label="Quitar de la lista"
          onClick={() => setOpen(true)}
          disabled={disabled}
          className={cn(
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            className
          )}
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50",
            className
          )}
        >
          <Trash2 size={16} />
          Quitar de la lista
        </button>
      )}

      <Modal open={open} onClose={closeModal} title="Quitar canción">
        <p className="text-sm text-muted-foreground">
          ¿Quitar{" "}
          <span className="font-medium text-foreground">{hymnTitle}</span> de
          esta lista?
        </p>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={closeModal}
            disabled={removing}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {removing ? "Quitando..." : "Quitar"}
          </button>
        </div>
      </Modal>
    </>
  );
}
