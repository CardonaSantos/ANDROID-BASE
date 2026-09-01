import type { ComponentTone } from "@/design-system";

import type {
  InstallationLocation,
  InstallationMyAssignment,
  InstallationStatus,
  InstallationType,
} from "./api/installations.contracts.api";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export interface InstallationVisualMeta {
  label: string;

  tone: ComponentTone;
}

/*
 * =========================================================
 * STATUS
 * =========================================================
 *
 * Conservamos la semántica visual que ya utiliza
 * el CRM administrativo:
 *
 * PROGRAMADA      -> info
 * REPROGRAMADA    -> warning
 * EN_PROCESO      -> primary
 * COMPLETADA      -> success
 * CANCELADA       -> danger
 * FALLIDA         -> danger
 *
 * Esto es solamente presentación.
 *
 * La autorización de acciones NO se determina aquí;
 * para eso utilizaremos detail.acciones del servidor.
 * =========================================================
 */

export function getInstallationStatusMeta(
  status: InstallationStatus,
): InstallationVisualMeta {
  switch (status) {
    case "PROGRAMADA":
      return {
        label: "Programada",

        tone: "info",
      };

    case "REPROGRAMADA":
      return {
        label: "Reprogramada",

        tone: "warning",
      };

    case "EN_PROCESO":
      return {
        label: "En proceso",

        tone: "primary",
      };

    case "COMPLETADA":
      return {
        label: "Completada",

        tone: "success",
      };

    case "CANCELADA":
      return {
        label: "Cancelada",

        tone: "danger",
      };

    case "FALLIDA":
      return {
        label: "Fallida",

        tone: "danger",
      };
  }
}

/*
 * =========================================================
 * TIPO DE INSTALACIÓN
 * =========================================================
 */

export function getInstallationTypeLabel(type: InstallationType): string {
  switch (type) {
    case "NUEVA":
      return "Nueva";

    case "REINSTALACION":
      return "Reinstalación";

    case "TRASLADO":
      return "Traslado";

    case "CAMBIO_EQUIPO":
      return "Cambio de equipo";

    case "MIGRACION_PLAN":
      return "Migración de plan";

    case "MIGRACION_TECNOLOGIA":
      return "Migración de tecnología";

    case "OTRO":
      return "Otro";
  }
}

/*
 * =========================================================
 * ASIGNACIÓN DEL TÉCNICO
 * =========================================================
 */

export function getInstallationAssignmentLabel(
  assignment: InstallationMyAssignment | null | undefined,
): string {
  if (!assignment) {
    return "Sin asignación";
  }

  if (assignment.esResponsable) {
    return "Responsable";
  }

  return formatEnumLabel(assignment.rol);
}

/*
 * =========================================================
 * ENUM LABEL
 * =========================================================
 */

export function formatEnumLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w|\s\w/g, (match) => match.toUpperCase());
}

/*
 * =========================================================
 * DATES
 * =========================================================
 */

export function formatInstallationDate(isoDate?: string | null): string {
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

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",

    timeZone: "America/Guatemala",
  }).format(date);
}

export function formatInstallationShortDate(isoDate?: string | null): string {
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
 * MONEY
 * =========================================================
 *
 * Los contratos API ya normalizan todos los importes a
 * number. Ningún componente visual necesita conocer
 * Money, Decimal ni la representación del servidor.
 * =========================================================
 */

export function formatInstallationMoney(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Q0.00";
  }

  return new Intl.NumberFormat("es-GT", {
    style: "currency",

    currency: "GTQ",

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,
  }).format(value);
}

/*
 * =========================================================
 * LOCATION
 * =========================================================
 */

export function hasInstallationCoordinates(
  location: InstallationLocation | null | undefined,
): boolean {
  if (!location) {
    return false;
  }

  return (
    typeof location.latitud === "number" &&
    Number.isFinite(location.latitud) &&
    typeof location.longitud === "number" &&
    Number.isFinite(location.longitud)
  );
}

export function getInstallationCoordinatesText(
  location: InstallationLocation | null | undefined,
): string {
  if (!hasInstallationCoordinates(location) || !location) {
    return "";
  }

  return `${location.latitud}, ${location.longitud}`;
}

export function buildInstallationMapsUrl(
  location: InstallationLocation | null | undefined,
): string | null {
  if (!hasInstallationCoordinates(location) || !location) {
    return null;
  }

  const coordinates = `${location.latitud},${location.longitud}`;

  return (
    "https://www.google.com/maps/search/" +
    `?api=1&query=${encodeURIComponent(coordinates)}`
  );
}

export function buildInstallationRouteUrl(
  location: InstallationLocation | null | undefined,
): string | null {
  if (!hasInstallationCoordinates(location) || !location) {
    return null;
  }

  const coordinates = `${location.latitud},${location.longitud}`;

  return (
    "https://www.google.com/maps/dir/" +
    `?api=1&destination=${encodeURIComponent(coordinates)}`
  );
}

/*
 * =========================================================
 * ADDRESS
 * =========================================================
 */

export function getInstallationAddressText(
  location: InstallationLocation | null | undefined,
): string {
  if (!location) {
    return "";
  }

  return location.direccion?.trim() ?? "";
}

export function getInstallationReferenceText(
  location: InstallationLocation | null | undefined,
): string {
  if (!location) {
    return "";
  }

  return location.referencia?.trim() ?? "";
}
