import type { ComponentTone } from "@/design-system";

import type {
  TicketAssignedDetail,
  TicketAssignedListItem,
  TicketComment,
  TicketDetailAddress,
  TicketHistoryItem,
  TicketHistoryType,
  TicketPriority,
  TicketStatus,
} from "./api/tickets.contracts.api";

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

export type TicketActivityItem =
  | {
      kind: "comment";
      id: string;
      date: string;
      comment: TicketComment;
    }
  | {
      kind: "history";
      id: string;
      date: string;
      history: TicketHistoryItem;
    };

type SortableTicket = TicketAssignedListItem | TicketAssignedDetail;

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

export function getTicketStatusMeta(status: TicketStatus): TicketVisualMeta {
  switch (status) {
    case "EN_PROCESO":
      return { label: "En proceso", tone: "warning" };

    case "PENDIENTE_REVISION":
      return { label: "En revisión", tone: "info" };

    case "NUEVO":
    case "ABIERTA":
      return { label: "Nuevo", tone: "success" };

    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
    case "PENDIENTE_TECNICO":
      return { label: formatEnumLabel(status), tone: "primary" };

    case "RESUELTA":
    case "CERRADO":
      return { label: formatEnumLabel(status), tone: "neutral" };

    case "CANCELADA":
    case "ARCHIVADA":
      return { label: formatEnumLabel(status), tone: "danger" };
  }
}

export function getTicketPriorityMeta(
  priority: TicketPriority,
): TicketVisualMeta {
  switch (priority) {
    case "URGENTE":
      return { label: "Urgente", tone: "danger" };
    case "ALTA":
      return { label: "Alta", tone: "warning" };
    case "MEDIA":
      return { label: "Media", tone: "info" };
    case "BAJA":
      return { label: "Baja", tone: "neutral" };
  }
}

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

const TICKET_HISTORY_LABELS: Record<TicketHistoryType, string> = {
  CREADO: "Creó el ticket",
  ACTUALIZADO: "Editó el ticket",
  ESTADO_CAMBIADO: "Cambió el estado",
  PRIORIDAD_CAMBIADA: "Cambió la prioridad",
  ASIGNACION_CAMBIADA: "Cambió la asignación",
  CANCELADO: "Canceló el ticket",
  REABIERTO: "Reabrió el ticket",
  FIJADO: "Fijó el ticket",
  DESFIJADO: "Desfijó el ticket",
};

export function getTicketHistoryLabel(type: TicketHistoryType): string {
  return TICKET_HISTORY_LABELS[type];
}

export function buildTicketActivityItems(
  comments: readonly TicketComment[],
  history: readonly TicketHistoryItem[],
): TicketActivityItem[] {
  const commentItems: TicketActivityItem[] = comments.map((comment) => ({
    kind: "comment",
    id: `comment-${comment.id}`,
    date: comment.fechaRegistro,
    comment,
  }));

  const historyItems: TicketActivityItem[] = history.map((item) => ({
    kind: "history",
    id: `history-${item.id}`,
    date: item.creadoEn,
    history: item,
  }));

  return [...commentItems, ...historyItems].sort((first, second) => {
    const dateDifference =
      getSafeTimestamp(second.date) - getSafeTimestamp(first.date);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return second.id.localeCompare(first.id);
  });
}

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

export function getTicketAddressText(
  address: string | TicketDetailAddress | null | undefined,
): string {
  if (!address) {
    return "";
  }

  if (typeof address === "string") {
    return address.trim();
  }

  return [
    address.direccion,
    address.sector,
    address.municipio,
    address.departamento,
  ]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
}

function getSafeTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}
