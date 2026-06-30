import type { ModuleId } from "@/types";

interface ModuleCardTheme {
  card: string;
  icon: string;
  hoverCard: string;
  hoverIcon: string;
  hoverLabel: string;
}

const MODULE_CARD_THEMES: Partial<Record<ModuleId, ModuleCardTheme>> = {
  bible: {
    card: "bg-gradient-to-br from-amber-50/90 via-card to-orange-50/50 dark:from-amber-950/30 dark:via-card dark:to-orange-950/20",
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    hoverCard:
      "hover:border-amber-300 hover:shadow-lg hover:shadow-amber-200/60 dark:hover:border-amber-600 dark:hover:shadow-amber-950/40",
    hoverIcon:
      "group-hover:bg-amber-500 group-hover:text-white dark:group-hover:bg-amber-500 dark:group-hover:text-white",
    hoverLabel: "group-hover:text-amber-700 dark:group-hover:text-amber-300",
  },
  hymns: {
    card: "bg-gradient-to-br from-violet-50/90 via-card to-purple-50/50 dark:from-violet-950/30 dark:via-card dark:to-purple-950/20",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300",
    hoverCard:
      "hover:border-violet-300 hover:shadow-lg hover:shadow-violet-200/60 dark:hover:border-violet-600 dark:hover:shadow-violet-950/40",
    hoverIcon:
      "group-hover:bg-violet-500 group-hover:text-white dark:group-hover:bg-violet-500 dark:group-hover:text-white",
    hoverLabel: "group-hover:text-violet-700 dark:group-hover:text-violet-300",
  },
  confession: {
    card: "bg-gradient-to-br from-rose-50/90 via-card to-orange-50/40 dark:from-rose-950/30 dark:via-card dark:to-orange-950/20",
    icon: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
    hoverCard:
      "hover:border-rose-300 hover:shadow-lg hover:shadow-rose-200/60 dark:hover:border-rose-600 dark:hover:shadow-rose-950/40",
    hoverIcon:
      "group-hover:bg-rose-500 group-hover:text-white dark:group-hover:bg-rose-500 dark:group-hover:text-white",
    hoverLabel: "group-hover:text-rose-700 dark:group-hover:text-rose-300",
  },
  discipleship: {
    card: "bg-gradient-to-br from-indigo-50/90 via-card to-blue-50/50 dark:from-indigo-950/30 dark:via-card dark:to-blue-950/20",
    icon: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    hoverCard:
      "hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-200/60 dark:hover:border-indigo-600 dark:hover:shadow-indigo-950/40",
    hoverIcon:
      "group-hover:bg-indigo-500 group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-white",
    hoverLabel: "group-hover:text-indigo-700 dark:group-hover:text-indigo-300",
  },
  games: {
    card: "bg-gradient-to-br from-emerald-50/90 via-card to-teal-50/50 dark:from-emerald-950/30 dark:via-card dark:to-teal-950/20",
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    hoverCard:
      "hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-200/60 dark:hover:border-emerald-600 dark:hover:shadow-emerald-950/40",
    hoverIcon:
      "group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-white",
    hoverLabel: "group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
  },
  community: {
    card: "bg-gradient-to-br from-sky-50/90 via-card to-cyan-50/50 dark:from-sky-950/30 dark:via-card dark:to-cyan-950/20",
    icon: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300",
    hoverCard:
      "hover:border-sky-300 hover:shadow-lg hover:shadow-sky-200/60 dark:hover:border-sky-600 dark:hover:shadow-sky-950/40",
    hoverIcon:
      "group-hover:bg-sky-500 group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-white",
    hoverLabel: "group-hover:text-sky-700 dark:group-hover:text-sky-300",
  },
};

const DEFAULT_THEME: ModuleCardTheme = {
  card: "bg-gradient-to-br from-accent/40 via-card to-accent/20",
  icon: "bg-accent text-accent-foreground",
  hoverCard:
    "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20",
  hoverIcon:
    "group-hover:bg-primary group-hover:text-primary-foreground",
  hoverLabel: "group-hover:text-primary",
};

export function getModuleCardTheme(id: ModuleId): ModuleCardTheme {
  return MODULE_CARD_THEMES[id] ?? DEFAULT_THEME;
}
