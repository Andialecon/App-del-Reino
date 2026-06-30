"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <EmptyState
          icon={AlertCircle}
          title="Algo salió mal"
          description="Ocurrió un error al cargar esta pantalla. Intenta de nuevo."
        />
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
