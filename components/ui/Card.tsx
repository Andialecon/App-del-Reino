import { cn } from "@/utils/cn";
import type { ComponentProps } from "react";

interface CardProps extends ComponentProps<"div"> {
  interactive?: boolean;
}

export function Card({
  className,
  interactive = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm",
        interactive &&
          "transition-all duration-200 active:scale-[0.98] hover:shadow-md hover:border-primary/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
