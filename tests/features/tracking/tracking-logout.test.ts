import { beforeEach, describe, expect, jest, test } from "@jest/globals";

jest.mock("@/features/tracking/api/tracking.api", () => ({
  getMyTrackingState: jest.fn(),
}));

jest.mock("@/features/tracking/background/tracking-service", () => ({
  stopTrackingLocationService: jest.fn(),
}));

jest.mock("@/features/tracking/storage/tracking-queue", () => ({
  clearQueuedTrackingLocationsForSession: jest.fn(),
}));

jest.mock("@/features/tracking/storage/tracking-runtime.storage", () => ({
  clearActiveTrackingRuntime: jest.fn(),

  readActiveTrackingSessionId: jest.fn(),
}));

jest.mock("@/features/tracking/application/finish-tracking.action", () => ({
  finishTrackingJourney: jest.fn(),
}));

import { getMyTrackingState } from "@/features/tracking/api/tracking.api";

import { stopTrackingLocationService } from "@/features/tracking/background/tracking-service";

import { clearQueuedTrackingLocationsForSession } from "@/features/tracking/storage/tracking-queue";

import {
  clearActiveTrackingRuntime,
  readActiveTrackingSessionId,
} from "@/features/tracking/storage/tracking-runtime.storage";

import { finishTrackingJourney } from "@/features/tracking/application/finish-tracking.action";

import { prepareTrackingForLogout } from "@/features/tracking/application/tracking-logout.action";

const getMyTrackingStateMock = jest.mocked(getMyTrackingState);

const stopTrackingLocationServiceMock = jest.mocked(
  stopTrackingLocationService,
);

const clearQueuedTrackingLocationsForSessionMock = jest.mocked(
  clearQueuedTrackingLocationsForSession,
);

const clearActiveTrackingRuntimeMock = jest.mocked(clearActiveTrackingRuntime);

const readActiveTrackingSessionIdMock = jest.mocked(
  readActiveTrackingSessionId,
);

const finishTrackingJourneyMock = jest.mocked(finishTrackingJourney);

describe("tracking logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("finaliza la jornada antes del logout cuando el servidor indica que está activa", async () => {
    getMyTrackingStateMock.mockResolvedValue({
      activo: true,

      sesionTrackingId: 18,

      asistenciaId: 91,

      estado: "ACTIVA",

      iniciadoEn: "2026-08-29T14:00:00.000Z",

      ultimoHeartbeatEn: "2026-08-29T16:00:00.000Z",
    });

    finishTrackingJourneyMock.mockResolvedValue(undefined as never);

    await prepareTrackingForLogout();

    expect(finishTrackingJourneyMock).toHaveBeenCalledTimes(1);

    expect(finishTrackingJourneyMock).toHaveBeenCalledWith(18);

    /*
     * finishTrackingJourney se ocupa
     * internamente del stop/cleanup.
     */
    expect(stopTrackingLocationServiceMock).not.toHaveBeenCalled();
  });

  test("limpia runtime local cuando el servidor no tiene jornada", async () => {
    getMyTrackingStateMock.mockResolvedValue({
      activo: false,

      sesionTrackingId: null,

      asistenciaId: null,

      estado: null,

      iniciadoEn: null,

      ultimoHeartbeatEn: null,
    });

    readActiveTrackingSessionIdMock.mockResolvedValue(17);

    await prepareTrackingForLogout();

    expect(stopTrackingLocationServiceMock).toHaveBeenCalledTimes(1);

    expect(clearQueuedTrackingLocationsForSessionMock).toHaveBeenCalledWith(17);

    expect(clearActiveTrackingRuntimeMock).toHaveBeenCalledTimes(1);

    expect(finishTrackingJourneyMock).not.toHaveBeenCalled();
  });

  test("no continúa silenciosamente si no puede conocer el estado del servidor", async () => {
    getMyTrackingStateMock.mockRejectedValue(new Error("network failure"));

    await expect(prepareTrackingForLogout()).rejects.toThrow("network failure");

    expect(finishTrackingJourneyMock).not.toHaveBeenCalled();

    expect(clearActiveTrackingRuntimeMock).not.toHaveBeenCalled();
  });
});
