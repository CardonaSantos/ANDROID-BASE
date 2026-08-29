import type { RegisterTrackingLocationInput } from "../api";

import type { TrackingProfile } from "../background";

export interface TrackingLocationPolicyResult {
  shouldSend: boolean;

  reason:
    | "first-location"
    | "time-threshold"
    | "movement-threshold"
    | "not-required";

  distanceMeters: number;

  elapsedMs: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Distancia Haversine entre
 * dos coordenadas terrestres.
 */
export function calculateDistanceMeters(
  from: {
    latitud: number;

    longitud: number;
  },
  to: {
    latitud: number;

    longitud: number;
  },
): number {
  const earthRadiusMeters = 6_371_000;

  const latitudeDelta = toRadians(to.latitud - from.latitud);

  const longitudeDelta = toRadians(to.longitud - from.longitud);

  const fromLatitude = toRadians(from.latitud);

  const toLatitude = toRadians(to.latitud);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}

function elapsedBetweenLocations(
  previous: RegisterTrackingLocationInput,
  current: RegisterTrackingLocationInput,
): number {
  const previousMs = new Date(previous.capturadoEn).getTime();

  const currentMs = new Date(current.capturadoEn).getTime();

  if (Number.isNaN(previousMs) || Number.isNaN(currentMs)) {
    return 0;
  }

  return Math.max(0, currentMs - previousMs);
}

export function evaluateTrackingLocationPolicy(
  candidate: RegisterTrackingLocationInput,
  previousAccepted: RegisterTrackingLocationInput | null,
  profile: TrackingProfile,
): TrackingLocationPolicyResult {
  if (!previousAccepted) {
    return {
      shouldSend: true,

      reason: "first-location",

      distanceMeters: 0,

      elapsedMs: 0,
    };
  }

  const elapsedMs = elapsedBetweenLocations(previousAccepted, candidate);

  const distanceMeters = calculateDistanceMeters(previousAccepted, candidate);

  /*
   * Regla:
   *
   * TIEMPO O DISTANCIA.
   *
   * No deben cumplirse ambas.
   */
  if (elapsedMs >= profile.maxSendIntervalMs) {
    return {
      shouldSend: true,

      reason: "time-threshold",

      distanceMeters,

      elapsedMs,
    };
  }

  if (distanceMeters >= profile.movementThresholdMeters) {
    return {
      shouldSend: true,

      reason: "movement-threshold",

      distanceMeters,

      elapsedMs,
    };
  }

  return {
    shouldSend: false,

    reason: "not-required",

    distanceMeters,

    elapsedMs,
  };
}
