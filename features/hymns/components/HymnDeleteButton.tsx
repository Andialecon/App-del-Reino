"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteHymn } from "@/features/hymns/storage";
import { Modal } from "@/components/ui/Modal";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/utils/cn";

interface HymnDeleteButtonProps {
  hymnId: string;
  hymnTitle: string;
  variant?: "icon" | "button";
  className?: string;
}

export function HymnDeleteButton({
  hymnId,
  hymnTitle,
  variant = "icon",
  className,
}: HymnDeleteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    if (!deleting) {
      setOpen(false);
      setError(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteHymn(hymnId);
      setOpen(false);
      router.push("/hymns");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la canción.");
      setDeleting(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <IconButton
          icon={Trash2}
          label="Eliminar canción"
          onClick={() => setOpen(true)}
          className={cn("text-destructive hover:bg-destructive/10", className)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "w-full rounded-xl border border-destructive/30 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10",
            className
          )}
        >
          Eliminar canción
        </button>
      )}

      <Modal open={open} onClose={closeModal} title="Eliminar canción">
        <p className="text-sm text-muted-foreground">
          ¿Eliminar{" "}
          <span className="font-medium text-foreground">{hymnTitle}</span>? Esta
          acción no se puede deshacer.
        </p>

        {error && (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={closeModal}
            disabled={deleting}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </Modal>
    </>
  );
}
