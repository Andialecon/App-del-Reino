import { Settings } from "lucide-react";
import type { ModuleConfig } from "../types";

export const settingsConfig: ModuleConfig = {
  id: "settings",
  name: "Configuración",
  description: "Personaliza tu experiencia en la aplicación.",
  href: "/settings",
  icon: Settings,
  showInHome: false,
  showInDrawer: false,
};
