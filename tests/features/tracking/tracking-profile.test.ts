import { describe, expect, test } from "@jest/globals";

import * as Location from "expo-location";

import {
  DEFAULT_TRACKING_PROFILE_ID,
  TRACKING_PROFILES,
  getTrackingProfile,
} from "@/features/tracking/background/tracking-profile";

describe("tracking profiles", () => {
  test("NORMAL usa la política acordada", () => {
    const profile = getTrackingProfile("NORMAL");

    expect(profile).toEqual({
      id: "NORMAL",
      label: "Normal",
      samplingIntervalMs: 60_000,
      maxSendIntervalMs: 300_000,
      movementThresholdMeters: 250,
      accuracy: Location.Accuracy.Balanced,
    });
  });

  test("BATTERY_SAVER usa la política acordada", () => {
    const profile = getTrackingProfile("BATTERY_SAVER");

    expect(profile).toEqual({
      id: "BATTERY_SAVER",
      label: "Ahorro de batería",
      samplingIntervalMs: 120_000,
      maxSendIntervalMs: 600_000,
      movementThresholdMeters: 250,
      accuracy: Location.Accuracy.Balanced,
    });
  });

  test("NORMAL es el perfil predeterminado", () => {
    expect(DEFAULT_TRACKING_PROFILE_ID).toBe("NORMAL");

    expect(TRACKING_PROFILES[DEFAULT_TRACKING_PROFILE_ID].id).toBe("NORMAL");
  });
});
