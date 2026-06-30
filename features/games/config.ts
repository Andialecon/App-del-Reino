import { Gamepad2 } from "lucide-react";
import type { ModuleConfig } from "../types";

export const gamesConfig: ModuleConfig = {
  id: "games",
  name: "Juegos Bíblicos",
  description: "Aprende y diviértete con desafíos interactivos.",
  href: "/games",
  icon: Gamepad2,
  showInHome: true,
  showInDrawer: true,
};
