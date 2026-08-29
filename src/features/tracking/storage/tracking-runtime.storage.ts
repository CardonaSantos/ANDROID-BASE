import { preferencesStorage } from "@/core/storage";

import {
  registerTrackingLocationInputSchema,
  type RegisterTrackingLocationInput,
} from "../api/tracking.contracts";

const ACTIVE_SESSION_KEY = "tracking.runtime.active-session.v1";

const LAST_ACCEPTED_LOCATION_KEY = "tracking.runtime.last-accepted-location.v1";

const LAST_SUCCESSFUL_SYNC_KEY = "tracking.runtime.last-successful-sync.v1";

const LAST_SERVER_HEARTBEAT_KEY = "tracking.runtime.last-server-heartbeat.v1";

export interface TrackingRuntimeSnapshot {
  activeSessionId: number | null;

  lastAcceptedLocation: RegisterTrackingLocationInput | null;

  lastSuccessfulSyncAt: string | null;

  lastServerHeartbeatAt: string | null;
}

export async function readActiveTrackingSessionId(): Promise<number | null> {
  const raw = await preferencesStorage.getItem(ACTIVE_SESSION_KEY);

  if (!raw) {
    return null;
  }

  const value = Number(raw);

  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

export async function setActiveTrackingSession(
  sessionId: number,
): Promise<void> {
  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    throw new Error("sessionId debe ser un entero positivo.");
  }

  const previousSessionId = await readActiveTrackingSessionId();

  await preferencesStorage.setItem(ACTIVE_SESSION_KEY, String(sessionId));

  /*
   * Una nueva sesión comienza con
   * estado GPS independiente.
   */
  if (previousSessionId !== sessionId) {
    await Promise.all([
      preferencesStorage.removeItem(LAST_ACCEPTED_LOCATION_KEY),

      preferencesStorage.removeItem(LAST_SUCCESSFUL_SYNC_KEY),

      preferencesStorage.removeItem(LAST_SERVER_HEARTBEAT_KEY),
    ]);
  }
}

export async function readLastAcceptedTrackingLocation(): Promise<RegisterTrackingLocationInput | null> {
  const raw = await preferencesStorage.getItem(LAST_ACCEPTED_LOCATION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const json = JSON.parse(raw);

    const parsed = registerTrackingLocationInputSchema.safeParse(json);

    if (!parsed.success) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

export async function saveLastAcceptedTrackingLocation(
  location: RegisterTrackingLocationInput,
): Promise<void> {
  const parsed = registerTrackingLocationInputSchema.parse(location);

  await preferencesStorage.setItem(
    LAST_ACCEPTED_LOCATION_KEY,
    JSON.stringify(parsed),
  );
}

export async function saveTrackingSyncSuccess(input: {
  receivedAt: string;

  heartbeatAt: string;
}): Promise<void> {
  await Promise.all([
    preferencesStorage.setItem(LAST_SUCCESSFUL_SYNC_KEY, input.receivedAt),

    preferencesStorage.setItem(LAST_SERVER_HEARTBEAT_KEY, input.heartbeatAt),
  ]);
}

export async function readTrackingRuntimeSnapshot(): Promise<TrackingRuntimeSnapshot> {
  const [
    activeSessionId,
    lastAcceptedLocation,
    lastSuccessfulSyncAt,
    lastServerHeartbeatAt,
  ] = await Promise.all([
    readActiveTrackingSessionId(),

    readLastAcceptedTrackingLocation(),

    preferencesStorage.getItem(LAST_SUCCESSFUL_SYNC_KEY),

    preferencesStorage.getItem(LAST_SERVER_HEARTBEAT_KEY),
  ]);

  return {
    activeSessionId,

    lastAcceptedLocation,

    lastSuccessfulSyncAt,

    lastServerHeartbeatAt,
  };
}

export async function clearActiveTrackingRuntime(): Promise<void> {
  await Promise.all([
    preferencesStorage.removeItem(ACTIVE_SESSION_KEY),

    preferencesStorage.removeItem(LAST_ACCEPTED_LOCATION_KEY),

    preferencesStorage.removeItem(LAST_SUCCESSFUL_SYNC_KEY),

    preferencesStorage.removeItem(LAST_SERVER_HEARTBEAT_KEY),
  ]);
}
