import { PageContainer } from "@/components/layout/PageContainer";
import { ModuleGrid } from "@/components/layout/ModuleGrid";

export default function HomePage() {
  return (
    <PageContainer>
      <div className="py-4 animate-fade-in">
        <h2 className="mb-1 text-lg font-semibold">Explora</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Selecciona un módulo para comenzar
        </p>
        <ModuleGrid />
      </div>
    </PageContainer>
  );
}
