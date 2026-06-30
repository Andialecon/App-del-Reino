import { cn } from "@/utils/cn";
import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps extends ComponentProps<"button"> {
  icon: LucideIcon;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "filled";
}

export function IconButton({
  icon: Icon,
  label,
  size = "md",
  variant = "ghost",
  className,
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 18,
    md: 20,
    lg: 24,
  };

  const variantClasses = {
    ghost: "hover:bg-accent text-foreground",
    filled: "bg-primary text-primary-foreground hover:opacity-90",
  };

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <Icon size={iconSizes[size]} strokeWidth={2} />
    </button>
  );
}
