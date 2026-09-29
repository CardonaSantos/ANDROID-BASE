import type { LucideIcon } from "lucide-react-native";

import {
  HandCoins,
  House,
  Map,
  MapPinned,
  TicketCheck,
  UserRound,
  Wrench,
} from "lucide-react-native";

export type AppNavigationHref =
  | "/"
  | "/tracking"
  | "/tickets"
  | "/instalaciones"
  | "/cobros"
  | "/clientes"
  | "/mapa"
  | "/perfil";

export type AppNavigationMatchMode = "exact" | "prefix";

export type AppNavigationPlacement = "sidebar" | "hidden";

export interface AppNavigationRoute {
  key: string;
  label: string;
  href: AppNavigationHref;
  icon: LucideIcon;
  match: AppNavigationMatchMode;
  placement: AppNavigationPlacement;
  roles?: readonly string[];
}

export const appNavigationRoutes = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: House,
    match: "exact",
    placement: "sidebar",
  },
  {
    key: "tracking",
    label: "Jornada",
    href: "/tracking",
    icon: MapPinned,
    match: "prefix",
    placement: "sidebar",
    roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],
  },
  {
    key: "realtime-map",
    label: "Mapa",
    href: "/mapa",
    icon: Map,
    match: "prefix",
    placement: "sidebar",
    roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],
  },
  {
    key: "tickets",
    label: "Tickets",
    href: "/tickets",
    icon: TicketCheck,
    match: "prefix",
    placement: "sidebar",
    roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],
  },
  {
    key: "installations",
    label: "Instalaciones",
    href: "/instalaciones",
    icon: Wrench,
    match: "prefix",
    placement: "sidebar",
    roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],
  },
  {
    key: "collections",
    label: "Cobros",
    href: "/cobros",
    icon: HandCoins,
    match: "prefix",
    placement: "sidebar",
    roles: ["COBRADOR", "TECNICO", "ADMIN", "SUPER_ADMIN"],
  },
  {
    key: "customers",
    label: "Cliente",
    href: "/clientes",
    icon: UserRound,
    match: "prefix",
    placement: "hidden",
    roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],
  },
  {
    key: "profile",
    label: "Perfil",
    href: "/perfil",
    icon: UserRound,
    match: "prefix",
    placement: "hidden",
  },
] as const satisfies readonly AppNavigationRoute[];

export type AppNavigationRouteKey = (typeof appNavigationRoutes)[number]["key"];
