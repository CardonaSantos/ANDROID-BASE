import type { Href } from "expo-router";

import type { LucideIcon } from "lucide-react-native";

export interface DashboardModule {
  key: string;

  title: string;

  description: string;

  href: Href;

  icon: LucideIcon;

  roles: readonly string[];
}
