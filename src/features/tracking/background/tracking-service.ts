import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import { Platform } from "react-native";

import { getTrackingProfile, type TrackingProfileId } from "./tracking-profile";

import { TRACKING_LOCATION_TASK_NAME } from "./tracking-task.constants";

export type TrackingServiceAvailability =
  | {
      available: true;
    }
  | {
      available: false;
      reason:
        | "web"
        | "task-manager-unavailable"
        | "background-location-unavailable";
    };

export type StartTrackingServiceResult =
  | {
      started: true;
      alreadyRunning: boolean;
    }
  | {
      started: false;
      reason:
        | "unsupported"
        | "location-services-disabled"
        | "foreground-permission-required"
        | "background-permission-required";
    };

export async function getTrackingServiceAvailability(): Promise<TrackingServiceAvailability> {
  if (Platform.OS === "web") {
    return {
      available: false,

      reason: "web",
    };
  }

  const taskManagerAvailable = await TaskManager.isAvailableAsync();

  if (!taskManagerAvailable) {
    return {
      available: false,

      reason: "task-manager-unavailable",
    };
  }

  const backgroundLocationAvailable =
    await Location.isBackgroundLocationAvailableAsync();

  if (!backgroundLocationAvailable) {
    return {
      available: false,

      reason: "background-location-unavailable",
    };
  }

  return {
    available: true,
  };
}

export async function requestTrackingForegroundPermission(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const result = await Location.requestForegroundPermissionsAsync();

  return result.status === Location.PermissionStatus.GRANTED;
}

export async function requestTrackingBackgroundPermission(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const foreground = await Location.getForegroundPermissionsAsync();

  if (foreground.status !== Location.PermissionStatus.GRANTED) {
    return false;
  }

  const result = await Location.requestBackgroundPermissionsAsync();

  return result.status === Location.PermissionStatus.GRANTED;
}

export async function isTrackingLocationServiceRunning(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const availability = await getTrackingServiceAvailability();

  if (!availability.available) {
    return false;
  }

  return Location.hasStartedLocationUpdatesAsync(TRACKING_LOCATION_TASK_NAME);
}

export async function startTrackingLocationService(
  profileId: TrackingProfileId,
): Promise<StartTrackingServiceResult> {
  const availability = await getTrackingServiceAvailability();

  if (!availability.available) {
    return {
      started: false,

      reason: "unsupported",
    };
  }

  const locationServicesEnabled = await Location.hasServicesEnabledAsync();

  if (!locationServicesEnabled) {
    return {
      started: false,

      reason: "location-services-disabled",
    };
  }

  const foregroundPermission = await Location.getForegroundPermissionsAsync();

  if (foregroundPermission.status !== Location.PermissionStatus.GRANTED) {
    return {
      started: false,

      reason: "foreground-permission-required",
    };
  }

  const backgroundPermission = await Location.getBackgroundPermissionsAsync();

  if (backgroundPermission.status !== Location.PermissionStatus.GRANTED) {
    return {
      started: false,

      reason: "background-permission-required",
    };
  }

  const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(
    TRACKING_LOCATION_TASK_NAME,
  );

  if (alreadyRunning) {
    return {
      started: true,

      alreadyRunning: true,
    };
  }

  const profile = getTrackingProfile(profileId);

  await Location.startLocationUpdatesAsync(TRACKING_LOCATION_TASK_NAME, {
    accuracy: profile.accuracy,

    /*
     * Android:
     * frecuencia mínima aproximada
     * con la que queremos muestras.
     *
     * La regla 5/10min O 250m
     * se implementará posteriormente
     * sobre estas muestras.
     */
    timeInterval: profile.samplingIntervalMs,

    /*
     * Permitimos al proveedor usar
     * Wi-Fi/red/GPS según corresponda
     * a Accuracy.Balanced.
     */
    mayShowUserSettingsDialog: true,

    foregroundService: {
      notificationTitle: "Seguimiento de jornada activo",

      notificationBody:
        profile.id === "BATTERY_SAVER"
          ? "Perfil ahorro · 10 min / 250 m"
          : "Perfil normal · 5 min / 250 m",

      killServiceOnDestroy: false,
    },
  });

  return {
    started: true,

    alreadyRunning: false,
  };
}

export async function stopTrackingLocationService(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  const availability = await getTrackingServiceAvailability();

  if (!availability.available) {
    return;
  }

  const running = await Location.hasStartedLocationUpdatesAsync(
    TRACKING_LOCATION_TASK_NAME,
  );

  if (!running) {
    return;
  }

  await Location.stopLocationUpdatesAsync(TRACKING_LOCATION_TASK_NAME);
}

export async function reconfigureTrackingLocationService(
  profileId: TrackingProfileId,
): Promise<StartTrackingServiceResult> {
  const running = await isTrackingLocationServiceRunning();

  if (running) {
    await stopTrackingLocationService();
  }

  return startTrackingLocationService(profileId);
}
