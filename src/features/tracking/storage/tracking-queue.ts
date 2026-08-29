import type { RegisterTrackingLocationInput } from "../api/tracking.contracts";

import type { QueuedTrackingLocation } from "./tracking-queue.types";

let nextId = 1;

const queue: QueuedTrackingLocation[] = [];

function createDedupeKey(payload: RegisterTrackingLocationInput): string {
  return [
    payload.sesionTrackingId,
    payload.capturadoEn,
    payload.latitud,
    payload.longitud,
  ].join("|");
}

const dedupeKeys = new Set<string>();

export async function enqueueTrackingLocation(
  payload: RegisterTrackingLocationInput,
): Promise<void> {
  const dedupeKey = createDedupeKey(payload);

  if (dedupeKeys.has(dedupeKey)) {
    return;
  }

  dedupeKeys.add(dedupeKey);

  queue.push({
    id: nextId++,

    payload,

    attempts: 0,

    createdAt: new Date().toISOString(),
  });
}

export async function listQueuedTrackingLocationsForSession(
  sessionId: number,
  limit = 25,
): Promise<QueuedTrackingLocation[]> {
  return queue
    .filter((item) => item.payload.sesionTrackingId === sessionId)
    .slice(0, limit);
}

export async function markQueuedTrackingLocationAttempt(
  id: number,
): Promise<void> {
  const item = queue.find((entry) => entry.id === id);

  if (item) {
    item.attempts += 1;
  }
}

export async function deleteQueuedTrackingLocation(id: number): Promise<void> {
  const index = queue.findIndex((item) => item.id === id);

  if (index < 0) {
    return;
  }

  const [removed] = queue.splice(index, 1);

  dedupeKeys.delete(createDedupeKey(removed.payload));
}

export async function countQueuedTrackingLocationsForSession(
  sessionId: number,
): Promise<number> {
  return queue.filter((item) => item.payload.sesionTrackingId === sessionId)
    .length;
}

export async function clearQueuedTrackingLocationsForSession(
  sessionId: number,
): Promise<void> {
  for (let index = queue.length - 1; index >= 0; index -= 1) {
    const item = queue[index];

    if (item.payload.sesionTrackingId !== sessionId) {
      continue;
    }

    dedupeKeys.delete(createDedupeKey(item.payload));

    queue.splice(index, 1);
  }
}
