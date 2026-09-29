import type { CollectionClientLocation } from "./api/collections.contracts.api";

export function formatCollectionMoney(
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

export function formatCollectionDate(value?: string | null): string {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Guatemala",
  }).format(date);
}

export function formatCollectionDateTime(
  value: string | Date | null | undefined,
): string {
  if (!value) {
    return "Sin fecha";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Guatemala",
  }).format(date);
}

export function formatCollectionLastPayment(value?: string | null): string {
  if (!value) {
    return "Sin pago previo";
  }

  return formatCollectionDate(value);
}

export function normalizeGuatemalaPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, "");

  if (cleaned.startsWith("+502")) {
    return cleaned;
  }

  if (cleaned.startsWith("502")) {
    return `+${cleaned}`;
  }

  return `+502${cleaned}`;
}

export function buildCollectionPhoneUrl(phone: string): string {
  return `tel:${normalizeGuatemalaPhone(phone)}`;
}

export function hasCollectionLocation(
  location: CollectionClientLocation,
): location is NonNullable<CollectionClientLocation> {
  return (
    location !== null &&
    Number.isFinite(location.latitud) &&
    Number.isFinite(location.longitud)
  );
}

export function buildCollectionRouteUrl(
  location: CollectionClientLocation,
): string | null {
  if (!hasCollectionLocation(location)) {
    return null;
  }

  const coordinates = `${location.latitud},${location.longitud}`;

  return (
    "https://www.google.com/maps/dir/" +
    `?api=1&destination=${encodeURIComponent(coordinates)}`
  );
}

export function formatCollectionCoordinates(
  location: CollectionClientLocation,
): string {
  if (!hasCollectionLocation(location)) {
    return "";
  }

  return `${location.latitud}, ${location.longitud}`;
}
