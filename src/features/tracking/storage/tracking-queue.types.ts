import type { RegisterTrackingLocationInput } from "../api/tracking.contracts";

export interface QueuedTrackingLocation {
  id: number;

  payload: RegisterTrackingLocationInput;

  attempts: number;

  createdAt: string;
}
