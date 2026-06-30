import { cn } from "@/utils/cn";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function Loading({ size = "md", label, className }: LoadingProps) {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-label={label ?? "Cargando"}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizes[size]
        )}
      />
      {label && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}
