import { HandCoins, MapPinned, TicketCheck, Wrench } from "lucide-react-native";

import type { DashboardModule } from "./dashboard.types";

export const dashboardModules = [
  {
    key: "tracking",

    title: "Seguimiento GPS",

    description: "Control de jornada y seguimiento de ubicación.",

    href: "/tracking",

    icon: MapPinned,

    roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],
  },

  {
    key: "installations",

    title: "Instalaciones",

    description: "Consulta y gestión de trabajos asignados.",

    href: "/instalaciones",

    icon: Wrench,

    roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],
  },

  {
    key: "tickets",

    title: "Tickets",

    description: "Soporte y tareas técnicas asignadas.",

    href: "/tickets",

    icon: TicketCheck,

    roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],
  },

  {
    key: "collections",

    title: "Cobros",

    description: "Rutas y operaciones de cobranza.",

    href: "/cobros",

    icon: HandCoins,

    roles: ["COBRADOR", "TECNICO", "ADMIN", "SUPER_ADMIN"],
  },
] satisfies readonly DashboardModule[];
