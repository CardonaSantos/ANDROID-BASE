import type { LucideIcon } from "lucide-react-native";

import {
  HandCoins,
  House,
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
  | "/perfil";

export type AppNavigationMatchMode = "exact" | "prefix";

export type AppNavigationPlacement = "sidebar" | "hidden";

export interface AppNavigationRoute {
  /*
   * Identificador estable de aplicación.
   */
  key: string;

  /*
   * Nombre usado por navegación y toolbar.
   */
  label: string;

  href: AppNavigationHref;

  icon: LucideIcon;

  match: AppNavigationMatchMode;

  /*
   * sidebar:
   *   aparece como opción principal.
   *
   * hidden:
   *   el Shell conoce la ruta para resolver
   *   título/estado, pero no la lista en el
   *   menú lateral.
   */
  placement: AppNavigationPlacement;

  /*
   * Si no existen roles explícitos,
   * cualquier usuario autenticado puede
   * acceder a la entrada desde el punto de
   * vista de navegación.
   */
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

    roles: ["TECNICO"],
  },

  {
    key: "tickets",

    label: "Tickets",

    href: "/tickets",

    icon: TicketCheck,

    match: "prefix",

    placement: "sidebar",

    roles: ["TECNICO"],
  },

  {
    key: "installations",

    label: "Instalaciones",

    href: "/instalaciones",

    icon: Wrench,

    match: "prefix",

    placement: "sidebar",

    roles: ["TECNICO"],
  },

  {
    key: "collections",

    label: "Cobros",

    href: "/cobros",

    icon: HandCoins,

    match: "prefix",

    placement: "sidebar",

    roles: ["COBRADOR"],
  },

  /*
   * Perfil pertenece al Shell autenticado,
   * pero su acceso principal está en el
   * avatar/menu del usuario.
   *
   * No debe duplicarse en el sidebar.
   */
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
