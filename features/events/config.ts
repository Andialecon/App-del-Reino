import { CalendarDays } from "lucide-react";
import type { ModuleConfig } from "../types";

export const eventsConfig: ModuleConfig = {
  id: "events",
  name: "Eventos",
  description: "Calendario de actividades y reuniones.",
  href: "/events",
  icon: CalendarDays,
  showInHome: false,
  showInDrawer: false,
};
