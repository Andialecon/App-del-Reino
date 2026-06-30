import type { ModuleConfig } from "@/features/types";
import { Clock } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface ModulePlaceholderProps {
  module: ModuleConfig;
}

export function ModulePlaceholder({ module }: ModulePlaceholderProps) {
  const Icon = module.icon;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
          <Icon size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{module.name}</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          {module.description}
        </p>
      </div>

      <EmptyState
        icon={Clock}
        title="Próximamente"
        description="Estamos trabajando en este módulo. Muy pronto estará disponible."
      />
    </div>
  );
}
