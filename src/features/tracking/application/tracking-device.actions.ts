import * as Location from "expo-location";

import {
  getTrackingServiceAvailability,
  isTrackingLocationServiceRunning,
  requestTrackingBackgroundPermission,
  requestTrackingForegroundPermission,
  startTrackingLocationService,
  type TrackingProfileId,
} from "../background";

export interface TrackingDeviceStatus {
  supported: boolean;

  locationServicesEnabled: boolean;

  foregroundPermission: "granted" | "denied" | "undetermined";

  backgroundPermission: "granted" | "denied" | "undetermined";

  canAskForegroundAgain: boolean;

  canAskBackgroundAgain: boolean;

  serviceRunning: boolean;
}

function normalizePermissionStatus(
  status: Location.PermissionStatus,
): "granted" | "denied" | "undetermined" {
  switch (status) {
    case Location.PermissionStatus.GRANTED:
      return "granted";

    case Location.PermissionStatus.DENIED:
      return "denied";

    default:
      return "undetermined";
  }
}

export async function getTrackingDeviceStatus(): Promise<TrackingDeviceStatus> {
  const availability = await getTrackingServiceAvailability();

  if (!availability.available) {
    return {
      supported: false,

      locationServicesEnabled: false,

      foregroundPermission: "undetermined",

      backgroundPermission: "undetermined",

      canAskForegroundAgain: false,

      canAskBackgroundAgain: false,

      serviceRunning: false,
    };
  }

  const [locationServicesEnabled, foreground, background, serviceRunning] =
    await Promise.all([
      Location.hasServicesEnabledAsync(),

      Location.getForegroundPermissionsAsync(),

      Location.getBackgroundPermissionsAsync(),

      isTrackingLocationServiceRunning(),
    ]);

  return {
    supported: true,

    locationServicesEnabled,

    foregroundPermission: normalizePermissionStatus(foreground.status),

    backgroundPermission: normalizePermissionStatus(background.status),

    canAskForegroundAgain: foreground.canAskAgain,

    canAskBackgroundAgain: background.canAskAgain,

    serviceRunning,
  };
}

export async function grantTrackingForegroundPermission(): Promise<boolean> {
  return requestTrackingForegroundPermission();
}

export async function grantTrackingBackgroundPermission(): Promise<boolean> {
  return requestTrackingBackgroundPermission();
}

export async function activateTrackingDevice(profileId: TrackingProfileId) {
  return startTrackingLocationService(profileId);
}
