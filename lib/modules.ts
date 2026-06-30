import type { ModuleConfig } from "@/features/types";
import { bibleConfig } from "@/features/bible/config";
import { hymnsConfig } from "@/features/hymns/config";
import { confessionConfig } from "@/features/confession/config";
import { discipleshipConfig } from "@/features/discipleship/config";
import { gamesConfig } from "@/features/games/config";
import { communityConfig } from "@/features/community/config";
import { eventsConfig } from "@/features/events/config";
import { settingsConfig } from "@/features/settings/config";
import { profileConfig } from "@/features/profile/config";

export const ALL_MODULES: ModuleConfig[] = [
  bibleConfig,
  hymnsConfig,
  confessionConfig,
  discipleshipConfig,
  gamesConfig,
  communityConfig,
  eventsConfig,
  settingsConfig,
  profileConfig,
];

export const HOME_MODULES = ALL_MODULES.filter((m) => m.showInHome);
export const DRAWER_MODULES = ALL_MODULES.filter((m) => m.showInDrawer);

export function getModuleById(id: string): ModuleConfig | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}

export function getModuleByHref(href: string): ModuleConfig | undefined {
  const exact = ALL_MODULES.find((m) => m.href === href);
  if (exact) return exact;
  return ALL_MODULES.find(
    (m) => m.href !== "/home" && href.startsWith(`${m.href}/`)
  );
}
