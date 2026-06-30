import Image from "next/image";
import { cn } from "@/utils/cn";
import { APP_ICON, APP_NAME } from "@/lib/constants";

interface AppIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
} as const;

export function AppIcon({
  size = "md",
  className,
  priority = false,
}: AppIconProps) {
  const px = SIZES[size];

  return (
    <Image
      src={APP_ICON}
      alt={APP_NAME}
      width={px}
      height={px}
      priority={priority}
      className={cn("rounded-3xl object-cover shadow-lg", className)}
    />
  );
}
