import { preferencesStorage } from "@/core/storage";

import {
  DEFAULT_TRACKING_PROFILE_ID,
  type TrackingProfileId,
} from "../background";

const TRACKING_PROFILE_KEY = "tracking.profile.v1";

function isTrackingProfileId(value: string): value is TrackingProfileId {
  return value === "NORMAL" || value === "BATTERY_SAVER";
}

export async function loadTrackingProfileId(): Promise<TrackingProfileId> {
  const stored = await preferencesStorage.getItem(TRACKING_PROFILE_KEY);

  if (!stored || !isTrackingProfileId(stored)) {
    return DEFAULT_TRACKING_PROFILE_ID;
  }

  return stored;
}

export async function saveTrackingProfileId(
  profileId: TrackingProfileId,
): Promise<void> {
  await preferencesStorage.setItem(TRACKING_PROFILE_KEY, profileId);
}
