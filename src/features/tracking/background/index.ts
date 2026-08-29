export {
  DEFAULT_TRACKING_PROFILE_ID,
  getTrackingProfile,
  TRACKING_PROFILES,
} from "./tracking-profile";

export type { TrackingProfile, TrackingProfileId } from "./tracking-profile";

export { TRACKING_LOCATION_TASK_NAME } from "./tracking-task.constants";

export {
  getTrackingServiceAvailability,
  isTrackingLocationServiceRunning,
  reconfigureTrackingLocationService,
  requestTrackingBackgroundPermission,
  requestTrackingForegroundPermission,
  startTrackingLocationService,
  stopTrackingLocationService,
} from "./tracking-service";

export type {
  StartTrackingServiceResult,
  TrackingServiceAvailability,
} from "./tracking-service";
