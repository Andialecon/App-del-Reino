import { cn } from "@/utils/cn";
import { APP_NAME } from "@/lib/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: "h-8 w-8 text-sm", text: "text-sm" },
    md: { icon: "h-10 w-10 text-base", text: "text-base" },
    lg: { icon: "h-14 w-14 text-xl", text: "text-xl" },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground shadow-sm",
          sizes[size].icon
        )}
      >
        R
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-semibold leading-tight", sizes[size].text)}>
            {APP_NAME}
          </span>
        </div>
      )}
    </div>
  );
}
