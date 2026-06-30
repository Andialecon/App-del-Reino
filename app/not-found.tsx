import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <EmptyState
          icon={FileQuestion}
          title="Página no encontrada"
          description="La pantalla que buscas no existe o fue movida."
        />
        <Link
          href="/home"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
