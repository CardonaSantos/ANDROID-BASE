import { describe, expect, test } from "@jest/globals";

import type { RegisterTrackingLocationInput } from "@/features/tracking/api/tracking.contracts";

import {
  calculateDistanceMeters,
  evaluateTrackingLocationPolicy,
} from "@/features/tracking/application/tracking-location.policy";

import { getTrackingProfile } from "@/features/tracking/background/tracking-profile";

function createLocation(
  overrides: Partial<RegisterTrackingLocationInput> = {},
): RegisterTrackingLocationInput {
  return {
    sesionTrackingId: 10,

    latitud: 15.3198,

    longitud: -91.4708,

    precision: 10,

    velocidad: null,

    bateria: 80,

    capturadoEn: "2026-08-29T15:00:00.000Z",

    ...overrides,
  };
}

describe("tracking location policy", () => {
  test("la primera ubicación siempre se acepta", () => {
    const candidate = createLocation();

    const result = evaluateTrackingLocationPolicy(
      candidate,
      null,
      getTrackingProfile("NORMAL"),
    );

    expect(result.shouldSend).toBe(true);

    expect(result.reason).toBe("first-location");
  });

  test("NORMAL acepta al alcanzar 5 minutos aunque no exista movimiento", () => {
    const previous = createLocation();

    const candidate = createLocation({
      capturadoEn: "2026-08-29T15:05:00.000Z",
    });

    const result = evaluateTrackingLocationPolicy(
      candidate,
      previous,
      getTrackingProfile("NORMAL"),
    );

    expect(result.shouldSend).toBe(true);

    expect(result.reason).toBe("time-threshold");
  });

  test("NORMAL no acepta antes de 5 minutos sin desplazamiento suficiente", () => {
    const previous = createLocation();

    const candidate = createLocation({
      capturadoEn: "2026-08-29T15:04:59.000Z",
    });

    const result = evaluateTrackingLocationPolicy(
      candidate,
      previous,
      getTrackingProfile("NORMAL"),
    );

    expect(result.shouldSend).toBe(false);

    expect(result.reason).toBe("not-required");
  });

  test("acepta antes del tiempo cuando supera 250 metros", () => {
    const previous = createLocation();

    /*
     * ~0.0024 grados de latitud
     * representan aproximadamente
     * 267 metros.
     */
    const candidate = createLocation({
      latitud: previous.latitud + 0.0024,

      capturadoEn: "2026-08-29T15:01:00.000Z",
    });

    const result = evaluateTrackingLocationPolicy(
      candidate,
      previous,
      getTrackingProfile("NORMAL"),
    );

    expect(result.distanceMeters).toBeGreaterThanOrEqual(250);

    expect(result.shouldSend).toBe(true);

    expect(result.reason).toBe("movement-threshold");
  });

  test("BATTERY_SAVER espera 10 minutos sin movimiento", () => {
    const previous = createLocation();

    const atNineMinutes = createLocation({
      capturadoEn: "2026-08-29T15:09:00.000Z",
    });

    const atTenMinutes = createLocation({
      capturadoEn: "2026-08-29T15:10:00.000Z",
    });

    const profile = getTrackingProfile("BATTERY_SAVER");

    expect(
      evaluateTrackingLocationPolicy(atNineMinutes, previous, profile)
        .shouldSend,
    ).toBe(false);

    const accepted = evaluateTrackingLocationPolicy(
      atTenMinutes,
      previous,
      profile,
    );

    expect(accepted.shouldSend).toBe(true);

    expect(accepted.reason).toBe("time-threshold");
  });

  test("Haversine retorna cero para el mismo punto", () => {
    const point = createLocation();

    expect(calculateDistanceMeters(point, point)).toBeCloseTo(0, 5);
  });
});
