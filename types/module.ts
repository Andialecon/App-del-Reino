export type ModuleId =
  | "bible"
  | "hymns"
  | "confession"
  | "discipleship"
  | "games"
  | "community"
  | "events"
  | "settings"
  | "profile";

export interface AppModule {
  id: ModuleId;
  name: string;
  description: string;
  href: string;
  icon: string;
  showInHome: boolean;
  showInDrawer: boolean;
}
