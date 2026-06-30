import { Home } from "lucide-react";
import type { ModuleConfig } from "../types";

export const confessionConfig: ModuleConfig = {
  id: "confession",
  name: "Casas de Fe",
  description: "Grupos pequeños para crecer juntos en la fe.",
  href: "/confession",
  icon: Home,
  showInHome: true,
  showInDrawer: true,
};
