import { HandCoins, MapPinned, TicketCheck, Wrench } from "lucide-react-native";

import type { DashboardModule } from "./dashboard.types";

export const dashboardModules = [
  {
    key: "tracking",

    title: "Seguimiento GPS",

    description: "Control de jornada y seguimiento de ubicación.",

    href: "/tracking",

    icon: MapPinned,

    roles: ["TECNICO"],
  },

  {
    key: "installations",

    title: "Instalaciones",

    description: "Consulta y gestión de trabajos asignados.",

    href: "/instalaciones",

    icon: Wrench,

    roles: ["TECNICO"],
  },

  {
    key: "tickets",

    title: "Tickets",

    description: "Soporte y tareas técnicas asignadas.",

    href: "/tickets",

    icon: TicketCheck,

    roles: ["TECNICO"],
  },

  {
    key: "collections",

    title: "Cobros",

    description: "Rutas y operaciones de cobranza.",

    href: "/cobros",

    icon: HandCoins,

    roles: ["COBRADOR"],
  },
] satisfies readonly DashboardModule[];
