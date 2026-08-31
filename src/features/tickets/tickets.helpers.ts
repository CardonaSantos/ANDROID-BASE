import type { ComponentTone } from "@/design-system";

import type {
  TicketAssignedDetail,
  TicketAssignedListItem,
  TicketDetailAddress,
  TicketPriority,
  TicketStatus,
} from "./api/tickets.contracts.api";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type TicketLifecycleAction = "start" | "review";

export interface TicketVisualMeta {
  label: string;
  tone: ComponentTone;
}

export interface TicketStats {
  total: number;
  urgentes: number;
  nuevos: number;
  enProceso: number;
  conUbicacion: number;
}

type SortableTicket = TicketAssignedListItem | TicketAssignedDetail;

/*
 * =========================================================
 * STATS
 * =========================================================
 */

export function getTicketStats(
  tickets: readonly TicketAssignedListItem[],
): TicketStats {
  return tickets.reduce<TicketStats>(
    (stats, ticket) => {
      stats.total += 1;

      if (ticket.prioridad === "URGENTE") {
        stats.urgentes += 1;
      }

      if (ticket.estado === "NUEVO" || ticket.estado === "ABIERTA") {
        stats.nuevos += 1;
      }

      if (ticket.estado === "EN_PROCESO") {
        stats.enProceso += 1;
      }

      if (ticket.ubicacionMaps) {
        stats.conUbicacion += 1;
      }

      return stats;
    },
    {
      total: 0,
      urgentes: 0,
      nuevos: 0,
      enProceso: 0,
      conUbicacion: 0,
    },
  );
}

/*
 * =========================================================
 * SORTING
 * =========================================================
 *
 * Conserva el criterio del CRM:
 *
 * 1. Prioridad
 * 2. Estado operativo
 * 3. Ticket más reciente
 */

export function getTicketPriorityScore(priority: TicketPriority): number {
  switch (priority) {
    case "URGENTE":
      return 4;

    case "ALTA":
      return 3;

    case "MEDIA":
      return 2;

    case "BAJA":
      return 1;
  }
}

export function getTicketStateScore(status: TicketStatus): number {
  switch (status) {
    case "EN_PROCESO":
      return 5;

    case "NUEVO":
    case "ABIERTA":
      return 4;

    case "PENDIENTE_TECNICO":
      return 3;

    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
      return 2;

    case "PENDIENTE_REVISION":
      return 1;

    default:
      return 0;
  }
}

export function sortTicketsForTechnician(
  first: SortableTicket,
  second: SortableTicket,
): number {
  const priorityDifference =
    getTicketPriorityScore(second.prioridad) -
    getTicketPriorityScore(first.prioridad);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const stateDifference =
    getTicketStateScore(second.estado) - getTicketStateScore(first.estado);

  if (stateDifference !== 0) {
    return stateDifference;
  }

  return getSafeTimestamp(second.abiertoEn) - getSafeTimestamp(first.abiertoEn);
}

/*
 * =========================================================
 * STATUS
 * =========================================================
 */

export function getTicketStatusMeta(status: TicketStatus): TicketVisualMeta {
  switch (status) {
    case "EN_PROCESO":
      return {
        label: "En proceso",
        tone: "warning",
      };

    case "PENDIENTE_REVISION":
      return {
        label: "En revisión",
        tone: "info",
      };

    case "NUEVO":
    case "ABIERTA":
      return {
        label: "Nuevo",
        tone: "success",
      };

    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
    case "PENDIENTE_TECNICO":
      return {
        label: formatEnumLabel(status),
        tone: "primary",
      };

    case "RESUELTA":
    case "CERRADO":
      return {
        label: formatEnumLabel(status),
        tone: "neutral",
      };

    case "CANCELADA":
    case "ARCHIVADA":
      return {
        label: formatEnumLabel(status),
        tone: "danger",
      };
  }
}

/*
 * =========================================================
 * PRIORITY
 * =========================================================
 */

export function getTicketPriorityMeta(
  priority: TicketPriority,
): TicketVisualMeta {
  switch (priority) {
    case "URGENTE":
      return {
        label: "Urgente",
        tone: "danger",
      };

    case "ALTA":
      return {
        label: "Alta",
        tone: "warning",
      };

    case "MEDIA":
      return {
        label: "Media",
        tone: "info",
      };

    case "BAJA":
      return {
        label: "Baja",
        tone: "neutral",
      };
  }
}

/*
 * =========================================================
 * LIFECYCLE
 * =========================================================
 */

export function getTicketLifecycleAction(
  status: TicketStatus,
): TicketLifecycleAction | null {
  if (status === "EN_PROCESO") {
    return "review";
  }

  if (
    status === "NUEVO" ||
    status === "ABIERTA" ||
    status === "PENDIENTE" ||
    status === "PENDIENTE_CLIENTE" ||
    status === "PENDIENTE_TECNICO"
  ) {
    return "start";
  }

  return null;
}

export function getTicketBlockedActionLabel(status: TicketStatus): string {
  switch (status) {
    case "PENDIENTE_REVISION":
      return "Pendiente de revisión";

    case "RESUELTA":
    case "CERRADO":
      return "Finalizado";

    case "CANCELADA":
      return "Cancelado";

    case "ARCHIVADA":
      return "Archivado";

    default:
      return "Sin acción disponible";
  }
}

/*
 * =========================================================
 * TEXT / DATE
 * =========================================================
 */

export function formatEnumLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w|\s\w/g, (match) => match.toUpperCase());
}

export function formatTicketDate(isoDate?: string | null): string {
  if (!isoDate) {
    return "Sin fecha";
  }

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Guatemala",
  }).format(date);
}

/*
 * =========================================================
 * ADDRESS
 * =========================================================
 */

export function getTicketAddressText(
  address: string | TicketDetailAddress | null | undefined,
): string {
  if (!address) {
    return "";
  }

  if (typeof address === "string") {
    return address.trim();
  }

  return [address.direccion, address.sector, address.municipio]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
}

/*
 * =========================================================
 * INTERNAL
 * =========================================================
 */

function getSafeTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}
