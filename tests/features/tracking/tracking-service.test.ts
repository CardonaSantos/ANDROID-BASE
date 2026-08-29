import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import { Platform } from "react-native";

import { TRACKING_LOCATION_TASK_NAME } from "@/features/tracking/background/tracking-task.constants";

import {
  getTrackingServiceAvailability,
  requestTrackingBackgroundPermission,
  requestTrackingForegroundPermission,
  startTrackingLocationService,
  stopTrackingLocationService,
} from "@/features/tracking/background/tracking-service";

jest.mock("expo-location", () => ({
  Accuracy: {
    Balanced: "balanced",
  },

  PermissionStatus: {
    GRANTED: "granted",

    DENIED: "denied",

    UNDETERMINED: "undetermined",
  },

  isBackgroundLocationAvailableAsync: jest.fn(),

  requestForegroundPermissionsAsync: jest.fn(),

  requestBackgroundPermissionsAsync: jest.fn(),

  getForegroundPermissionsAsync: jest.fn(),

  getBackgroundPermissionsAsync: jest.fn(),

  hasServicesEnabledAsync: jest.fn(),

  hasStartedLocationUpdatesAsync: jest.fn(),

  startLocationUpdatesAsync: jest.fn(),

  stopLocationUpdatesAsync: jest.fn(),
}));

jest.mock("expo-task-manager", () => ({
  isAvailableAsync: jest.fn(),
}));

const locationMock = jest.mocked(Location);

const taskManagerMock = jest.mocked(TaskManager);

type LocationPermissionResponse = Awaited<
  ReturnType<typeof Location.getForegroundPermissionsAsync>
>;

const grantedPermission: LocationPermissionResponse = {
  status: Location.PermissionStatus.GRANTED,

  granted: true,

  canAskAgain: true,

  expires: "never",
};

const deniedPermission: LocationPermissionResponse = {
  status: Location.PermissionStatus.DENIED,

  granted: false,

  canAskAgain: true,

  expires: "never",
};

function setPlatform(value: "android" | "web") {
  Object.defineProperty(Platform, "OS", {
    configurable: true,

    value,
  });
}

describe("tracking location service", () => {
  beforeEach(() => {
    setPlatform("android");

    taskManagerMock.isAvailableAsync.mockResolvedValue(true);

    locationMock.isBackgroundLocationAvailableAsync.mockResolvedValue(true);

    locationMock.hasServicesEnabledAsync.mockResolvedValue(true);

    locationMock.getForegroundPermissionsAsync.mockResolvedValue(
      grantedPermission,
    );

    locationMock.getBackgroundPermissionsAsync.mockResolvedValue(
      grantedPermission,
    );

    locationMock.requestForegroundPermissionsAsync.mockResolvedValue(
      grantedPermission,
    );

    locationMock.requestBackgroundPermissionsAsync.mockResolvedValue(
      grantedPermission,
    );

    locationMock.hasStartedLocationUpdatesAsync.mockResolvedValue(false);

    locationMock.startLocationUpdatesAsync.mockResolvedValue(undefined);

    locationMock.stopLocationUpdatesAsync.mockResolvedValue(undefined);
  });

  test("rechaza Web sin consultar APIs Android", async () => {
    setPlatform("web");

    const result = await getTrackingServiceAvailability();

    expect(result).toEqual({
      available: false,

      reason: "web",
    });

    expect(taskManagerMock.isAvailableAsync).not.toHaveBeenCalled();
  });

  test("detecta TaskManager no disponible", async () => {
    taskManagerMock.isAvailableAsync.mockResolvedValue(false);

    const result = await getTrackingServiceAvailability();

    expect(result).toEqual({
      available: false,

      reason: "task-manager-unavailable",
    });
  });

  test("detecta background location no disponible", async () => {
    locationMock.isBackgroundLocationAvailableAsync.mockResolvedValue(false);

    const result = await getTrackingServiceAvailability();

    expect(result).toEqual({
      available: false,

      reason: "background-location-unavailable",
    });
  });

  test("acepta permiso foreground concedido", async () => {
    await expect(requestTrackingForegroundPermission()).resolves.toBe(true);
  });

  test("no solicita background si falta foreground", async () => {
    locationMock.getForegroundPermissionsAsync.mockResolvedValue(
      deniedPermission,
    );

    const result = await requestTrackingBackgroundPermission();

    expect(result).toBe(false);

    expect(
      locationMock.requestBackgroundPermissionsAsync,
    ).not.toHaveBeenCalled();
  });

  test("acepta permiso background concedido", async () => {
    await expect(requestTrackingBackgroundPermission()).resolves.toBe(true);

    expect(
      locationMock.requestBackgroundPermissionsAsync,
    ).toHaveBeenCalledTimes(1);
  });

  test("no inicia si el GPS del sistema está apagado", async () => {
    locationMock.hasServicesEnabledAsync.mockResolvedValue(false);

    const result = await startTrackingLocationService("NORMAL");

    expect(result).toEqual({
      started: false,

      reason: "location-services-disabled",
    });

    expect(locationMock.startLocationUpdatesAsync).not.toHaveBeenCalled();
  });

  test("no inicia sin permiso foreground", async () => {
    locationMock.getForegroundPermissionsAsync.mockResolvedValue(
      deniedPermission,
    );

    const result = await startTrackingLocationService("NORMAL");

    expect(result).toEqual({
      started: false,

      reason: "foreground-permission-required",
    });
  });

  test("no inicia sin permiso background", async () => {
    locationMock.getBackgroundPermissionsAsync.mockResolvedValue(
      deniedPermission,
    );

    const result = await startTrackingLocationService("NORMAL");

    expect(result).toEqual({
      started: false,

      reason: "background-permission-required",
    });
  });

  test("es idempotente cuando el servicio ya está corriendo", async () => {
    locationMock.hasStartedLocationUpdatesAsync.mockResolvedValue(true);

    const result = await startTrackingLocationService("NORMAL");

    expect(result).toEqual({
      started: true,

      alreadyRunning: true,
    });

    expect(locationMock.startLocationUpdatesAsync).not.toHaveBeenCalled();
  });

  test("inicia NORMAL con foreground service persistente", async () => {
    const result = await startTrackingLocationService("NORMAL");

    expect(result).toEqual({
      started: true,

      alreadyRunning: false,
    });

    expect(locationMock.startLocationUpdatesAsync).toHaveBeenCalledWith(
      TRACKING_LOCATION_TASK_NAME,
      {
        accuracy: Location.Accuracy.Balanced,

        timeInterval: 60_000,

        mayShowUserSettingsDialog: true,

        foregroundService: {
          notificationTitle: "Seguimiento de jornada activo",

          notificationBody: "Perfil normal · 5 min / 250 m",

          killServiceOnDestroy: false,
        },
      },
    );
  });

  test("inicia BATTERY_SAVER con sus parámetros", async () => {
    await startTrackingLocationService("BATTERY_SAVER");

    expect(locationMock.startLocationUpdatesAsync).toHaveBeenCalledWith(
      TRACKING_LOCATION_TASK_NAME,
      expect.objectContaining({
        timeInterval: 120_000,

        foregroundService: {
          notificationTitle: "Seguimiento de jornada activo",

          notificationBody: "Perfil ahorro · 10 min / 250 m",

          killServiceOnDestroy: false,
        },
      }),
    );
  });

  test("detiene una task que está corriendo", async () => {
    locationMock.hasStartedLocationUpdatesAsync.mockResolvedValue(true);

    await stopTrackingLocationService();

    expect(locationMock.stopLocationUpdatesAsync).toHaveBeenCalledWith(
      TRACKING_LOCATION_TASK_NAME,
    );
  });

  test("no intenta detener una task inexistente", async () => {
    locationMock.hasStartedLocationUpdatesAsync.mockResolvedValue(false);

    await stopTrackingLocationService();

    expect(locationMock.stopLocationUpdatesAsync).not.toHaveBeenCalled();
  });
});
