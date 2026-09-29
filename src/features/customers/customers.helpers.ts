import type {
  CustomerInvoice,
  CustomerTicket,
} from "./api/customers.contracts.api";

export type CustomerSemanticTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export function getCustomerFullName(
  customer: Pick<{ nombre: string; apellidos: string }, "nombre" | "apellidos">,
) {
  return `${customer.nombre ?? ""} ${customer.apellidos ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
}

export function formatCustomerMoney(value?: number | null) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  return `Q${safeValue.toFixed(2)}`;
}

export function formatCustomerDate(value?: string | Date | null) {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getCustomerStatusTone(status?: string | null): CustomerSemanticTone {
  const normalized = status?.trim().toUpperCase() ?? "";

  if (["ACTIVO", "AL_DIA", "PAGADA", "RESUELTO", "CERRADO"].includes(normalized)) {
    return "success";
  }

  if (
    [
      "PENDIENTE_ACTIVO",
      "PAGO_PENDIENTE",
      "ATRASADO",
      "PENDIENTE",
      "PARCIAL",
      "PENDIENTE_REVISION",
      "EN_PROCESO",
    ].includes(normalized)
  ) {
    return "warning";
  }

  if (["MOROSO", "SUSPENDIDO", "DESINSTALADO", "VENCIDA", "ANULADA"].includes(normalized)) {
    return "danger";
  }

  return "neutral";
}

export function formatCustomerStatus(status?: string | null) {
  if (!status?.trim()) {
    return "Sin estado";
  }

  return status.replace(/_/g, " ");
}

function safeTimestamp(value?: string | null) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function sortCustomerInvoicesNewestFirst(
  invoices: readonly CustomerInvoice[],
) {
  return [...invoices].sort(
    (first, second) =>
      safeTimestamp(second.fechaEmision) - safeTimestamp(first.fechaEmision),
  );
}

export function sortCustomerTicketsNewestFirst(
  tickets: readonly CustomerTicket[],
) {
  return [...tickets].sort(
    (first, second) =>
      safeTimestamp(second.fechaApertura) - safeTimestamp(first.fechaApertura),
  );
}

export function paginateCustomerItems<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
) {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  const safePage = Math.min(totalPages, Math.max(1, Math.floor(page)));
  const start = (safePage - 1) * safePageSize;

  return {
    page: safePage,
    totalPages,
    totalItems: items.length,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + safePageSize, items.length),
    items: items.slice(start, start + safePageSize),
  };
}

export function buildCustomerMapsSearchUrl(latitude: number, longitude: number) {
  const query = encodeURIComponent(`${latitude},${longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function buildCustomerMapsDirectionsUrl(
  latitude: number,
  longitude: number,
) {
  const destination = encodeURIComponent(`${latitude},${longitude}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}
