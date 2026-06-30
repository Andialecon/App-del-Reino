import { Music } from "lucide-react";
import type { ModuleConfig } from "../types";

export const hymnsConfig: ModuleConfig = {
  id: "hymns",
  name: "Himnario",
  description: "Letras con acordes, listas de reproducción y transportador de tonalidad.",
  href: "/hymns",
  icon: Music,
  showInHome: true,
  showInDrawer: true,
};
