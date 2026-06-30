import { BookOpen } from "lucide-react";
import type { ModuleConfig } from "../types";

export const bibleConfig: ModuleConfig = {
  id: "bible",
  name: "Biblia",
  description: "Lee y estudia la Palabra de Dios.",
  href: "/bible",
  icon: BookOpen,
  showInHome: true,
  showInDrawer: true,
};
