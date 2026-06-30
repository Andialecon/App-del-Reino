import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { HOME_MODULES } from "@/lib/modules";
import { cn } from "@/utils/cn";
import { getModuleCardTheme } from "@/utils/moduleCardThemes";

export function ModuleGrid() {
  return (
    <div className="stagger-children grid grid-cols-2 gap-3 sm:grid-cols-3">
      {HOME_MODULES.map((module) => {
        const Icon = module.icon;
        const theme = getModuleCardTheme(module.id);

        return (
          <Link key={module.id} href={module.href} className="group">
            <Card
              interactive
              className={cn(
                "flex h-full min-h-[8.75rem] flex-col items-center justify-center gap-3 border-2 py-6 text-center",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1",
                theme.card,
                theme.hoverCard
              )}
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm",
                  "transition-all duration-300 ease-out",
                  "group-hover:scale-110 group-hover:shadow-md",
                  theme.icon,
                  theme.hoverIcon
                )}
              >
                <Icon size={28} strokeWidth={1.75} />
              </div>
              <span
                className={cn(
                  "text-sm font-semibold leading-tight transition-colors duration-300",
                  theme.hoverLabel
                )}
              >
                {module.name}
              </span>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
