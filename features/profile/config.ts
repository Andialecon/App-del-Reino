import { User } from "lucide-react";
import type { ModuleConfig } from "../types";

export const profileConfig: ModuleConfig = {
  id: "profile",
  name: "Mi perfil",
  description: "Tu información y preferencias personales.",
  href: "/profile",
  icon: User,
  showInHome: false,
  showInDrawer: true,
};
