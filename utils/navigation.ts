import { Home, Users, CalendarDays, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BottomNavItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
}

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { id: "home", name: "Inicio", href: "/home", icon: Home },
  { id: "community", name: "Comunidad", href: "/community", icon: Users },
  { id: "events", name: "Eventos", href: "/events", icon: CalendarDays },
  { id: "profile", name: "Perfil", href: "/profile", icon: User },
];

export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/home") {
    return pathname === "/home";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
