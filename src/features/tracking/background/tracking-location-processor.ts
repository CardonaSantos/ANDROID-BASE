import * as Battery from "expo-battery";

import type * as Location from "expo-location";

import { evaluateTrackingLocationPolicy } from "../application/tracking-location.policy";

import { normalizeTrackingLocation } from "../application/tracking-location.normalizer";

import {
  flushTrackingQueueForSession,
  type TrackingQueueFlushResult,
} from "../application/tracking-sync";

import { getTrackingProfile } from "./tracking-profile";

import {
  enqueueTrackingLocation,
  loadTrackingProfileId,
  readTrackingRuntimeSnapshot,
  saveLastAcceptedTrackingLocation,
} from "../storage";

export interface ProcessTrackingLocationsResult {
  active: boolean;

  accepted: number;

  ignored: number;

  flush: TrackingQueueFlushResult | null;
}

async function readBatteryLevel(): Promise<number | null> {
  try {
    return await Battery.getBatteryLevelAsync();
  } catch {
    return null;
  }
}

function getSortableTimestamp(location: Location.LocationObject): number {
  if (Number.isFinite(location.timestamp) && location.timestamp > 0) {
    return location.timestamp;
  }

  return Number.MAX_SAFE_INTEGER;
}

export async function processTrackingLocations(
  locations: Location.LocationObject[],
): Promise<ProcessTrackingLocationsResult> {
  const runtime = await readTrackingRuntimeSnapshot();

  const sessionId = runtime.activeSessionId;

  if (!sessionId) {
    return {
      active: false,

      accepted: 0,

      ignored: locations.length,

      flush: null,
    };
  }

  const profileId = await loadTrackingProfileId();

  const profile = getTrackingProfile(profileId);

  const batteryLevel = await readBatteryLevel();

  /*
   * Nunca permitimos comparar contra
   * una ubicación perteneciente a una
   * jornada anterior.
   */
  let previousAccepted =
    runtime.lastAcceptedLocation?.sesionTrackingId === sessionId
      ? runtime.lastAcceptedLocation
      : null;

  let accepted = 0;

  let ignored = 0;

  const orderedLocations = [...locations].sort(
    (left, right) => getSortableTimestamp(left) - getSortableTimestamp(right),
  );

  for (const location of orderedLocations) {
    const candidate = normalizeTrackingLocation(
      sessionId,
      location,
      batteryLevel,
    );

    if (!candidate) {
      ignored += 1;

      continue;
    }

    const decision = evaluateTrackingLocationPolicy(
      candidate,
      previousAccepted,
      profile,
    );

    if (!decision.shouldSend) {
      ignored += 1;

      continue;
    }

    /*
     * Persistimos ANTES del HTTP.
     */
    await enqueueTrackingLocation(candidate);

    await saveLastAcceptedTrackingLocation(candidate);

    previousAccepted = candidate;

    accepted += 1;
  }

  /*
   * Incluso si este lote no produjo un
   * nuevo punto, aprovechamos la ejecución
   * para intentar vaciar pendientes.
   */
  const flush = await flushTrackingQueueForSession(sessionId);

  return {
    active: true,

    accepted,

    ignored,

    flush,
  };
}
