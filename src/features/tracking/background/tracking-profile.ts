import * as Location from "expo-location";

export type TrackingProfileId = "NORMAL" | "BATTERY_SAVER";

export interface TrackingProfile {
  id: TrackingProfileId;

  label: string;

  /**
   * Cada cuánto solicitamos al sistema
   * una muestra aproximadamente.
   *
   * NO significa que cada muestra
   * se enviará al servidor.
   */
  samplingIntervalMs: number;

  /**
   * Tiempo máximo objetivo entre
   * puntos enviados al backend.
   */
  maxSendIntervalMs: number;

  /**
   * Si recorrió esta distancia desde
   * el último punto enviado, podremos
   * enviar antes del maxSendInterval.
   */
  movementThresholdMeters: number;

  accuracy: Location.Accuracy;
}

const MINUTE_MS = 60 * 1000;

export const TRACKING_PROFILES: Record<TrackingProfileId, TrackingProfile> = {
  NORMAL: {
    id: "NORMAL",

    label: "Normal",

    samplingIntervalMs: 1 * MINUTE_MS,

    maxSendIntervalMs: 5 * MINUTE_MS,

    movementThresholdMeters: 250,

    accuracy: Location.Accuracy.Balanced,
  },

  BATTERY_SAVER: {
    id: "BATTERY_SAVER",

    label: "Ahorro de batería",

    samplingIntervalMs: 2 * MINUTE_MS,

    maxSendIntervalMs: 10 * MINUTE_MS,

    movementThresholdMeters: 250,

    accuracy: Location.Accuracy.Balanced,
  },
};

export const DEFAULT_TRACKING_PROFILE_ID: TrackingProfileId = "NORMAL";

export function getTrackingProfile(
  profileId: TrackingProfileId,
): TrackingProfile {
  return TRACKING_PROFILES[profileId];
}
