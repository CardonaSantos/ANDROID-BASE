import type { ZodType } from "zod";

import { AppError } from "@/core/errors";

import { httpClient } from "@/core/http";

import {
  startTrackingResponseSchema,
  trackingStateSchema,
  type StartTrackingResponse,
  type TrackingState,
} from "./tracking.contracts";

function parseTrackingResponse<T>(
  schema: ZodType<T>,
  payload: unknown,
  code: string,
): T {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new AppError({
      kind: "server",

      source: "application",

      code,

      message: "El servidor devolvió una respuesta de tracking inválida.",

      details: result.error.issues,
    });
  }

  return result.data;
}

export async function getMyTrackingState(
  signal?: AbortSignal,
): Promise<TrackingState> {
  const payload = await httpClient.request<unknown>({
    method: "GET",

    path: "real-time-location/tracking/me",

    auth: "auto",

    signal,
  });

  return parseTrackingResponse(
    trackingStateSchema,
    payload,
    "TRACKING_STATE_INVALID_RESPONSE",
  );
}

export async function startTracking(
  signal?: AbortSignal,
): Promise<StartTrackingResponse> {
  const payload = await httpClient.request<unknown>({
    method: "POST",

    path: "real-time-location/tracking/start",

    auth: "auto",

    signal,
  });

  return parseTrackingResponse(
    startTrackingResponseSchema,
    payload,
    "TRACKING_START_INVALID_RESPONSE",
  );
}
