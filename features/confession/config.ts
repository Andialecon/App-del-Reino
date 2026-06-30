import { ScrollText } from "lucide-react";
import type { ModuleConfig } from "../types";

export const confessionConfig: ModuleConfig = {
  id: "confession",
  name: "Confesión de Fe",
  description: "Los fundamentos doctrinales de nuestra iglesia.",
  href: "/confession",
  icon: ScrollText,
  showInHome: true,
  showInDrawer: true,
};
