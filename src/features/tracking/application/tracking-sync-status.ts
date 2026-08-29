import { isNetworkUsable, networkManager } from "@/core/network";

import {
  countQueuedTrackingLocationsForSession,
  readTrackingRuntimeSnapshot,
} from "../storage";

export interface TrackingSyncStatus {
  online: boolean;

  pending: number;

  lastSuccessfulSyncAt: string | null;

  lastServerHeartbeatAt: string | null;
}

export async function getTrackingSyncStatus(
  sessionId: number,
): Promise<TrackingSyncStatus> {
  const [runtime, pending] = await Promise.all([
    readTrackingRuntimeSnapshot(),

    countQueuedTrackingLocationsForSession(sessionId),
  ]);

  const network = networkManager.getSnapshot();

  return {
    online: isNetworkUsable(network),

    pending,

    lastSuccessfulSyncAt: runtime.lastSuccessfulSyncAt,

    lastServerHeartbeatAt: runtime.lastServerHeartbeatAt,
  };
}
