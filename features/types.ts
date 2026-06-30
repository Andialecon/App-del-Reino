import type { LucideIcon } from "lucide-react";
import type { ModuleId } from "@/types";

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  showInHome: boolean;
  showInDrawer: boolean;
}
