import Image from "next/image";
import { cn } from "@/utils/cn";
import { APP_ICON, APP_NAME } from "@/lib/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showIcon?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  showIcon = true,
  className,
}: LogoProps) {
  const sizes = {
    sm: { px: 32, text: "text-sm" },
    md: { px: 40, text: "text-base" },
    lg: { px: 56, text: "text-xl" },
  };

  const { px, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showIcon && (
        <Image
          src={APP_ICON}
          alt={APP_NAME}
          width={px}
          height={px}
          className="rounded-2xl object-cover shadow-sm"
        />
      )}
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-semibold leading-tight", text)}>
            {APP_NAME}
          </span>
        </div>
      )}
    </div>
  );
}
