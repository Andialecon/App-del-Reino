import { BookOpen } from "lucide-react";
import type { ModuleConfig } from "../types";

export const bibleConfig: ModuleConfig = {
  id: "bible",
  name: "Biblia",
  description: "Lee la Biblia en RV60 o NVI.",
  href: "/bible",
  icon: BookOpen,
  showInHome: true,
  showInDrawer: true,
};
