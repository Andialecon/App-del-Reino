import { cn } from "@/utils/cn";
import { BOTTOM_NAV_HEIGHT, HEADER_HEIGHT } from "@/lib/constants";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  withHeader?: boolean;
  withBottomNav?: boolean;
  fullHeight?: boolean;
}

export function PageContainer({
  children,
  className,
  withHeader = true,
  withBottomNav = true,
  fullHeight = false,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-lg px-4",
        withHeader && "pt-[calc(var(--header-height)+env(safe-area-inset-top))]",
        withBottomNav &&
          "pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+1rem)]",
        fullHeight && "min-h-dvh",
        className
      )}
      style={{
        "--header-height": `${HEADER_HEIGHT}px`,
        "--bottom-nav-height": `${BOTTOM_NAV_HEIGHT}px`,
      } as React.CSSProperties}
    >
      {children}
    </main>
  );
}
