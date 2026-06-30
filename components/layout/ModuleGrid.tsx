import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { HOME_MODULES } from "@/lib/modules";

export function ModuleGrid() {
  return (
    <div className="stagger-children grid grid-cols-2 gap-3 sm:grid-cols-3">
      {HOME_MODULES.map((module) => {
        const Icon = module.icon;

        return (
          <Link key={module.id} href={module.href} className="group">
            <Card
              interactive
              className="flex flex-col items-center justify-center gap-3 py-6 text-center h-full min-h-[8.5rem]"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-transform duration-200 group-hover:scale-105"
              >
                <Icon size={28} strokeWidth={1.75} />
              </div>
              <span className="text-sm font-medium leading-tight">
                {module.name}
              </span>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
