import { Users } from "lucide-react";
import type { ModuleConfig } from "../types";

export const communityConfig: ModuleConfig = {
  id: "community",
  name: "Comunidad",
  description: "Conecta con miembros y grupos de la iglesia.",
  href: "/community",
  icon: Users,
  showInHome: true,
  showInDrawer: true,
};
