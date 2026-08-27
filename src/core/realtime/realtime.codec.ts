import { createRealtimeError } from "./realtime.error";

import type {
  RealtimeCodec,
  RealtimeEvent,
  RealtimeOutgoingEvent,
} from "./realtime.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const jsonRealtimeCodec: RealtimeCodec = Object.freeze({
  decode(data: unknown): RealtimeEvent {
    if (typeof data !== "string") {
      throw createRealtimeError(
        "REALTIME_INVALID_MESSAGE",
        "Realtime message must be text.",
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(data);
    } catch (cause) {
      throw createRealtimeError(
        "REALTIME_INVALID_MESSAGE",
        "Realtime message contains invalid JSON.",
        cause,
      );
    }

    if (
      !isRecord(parsed) ||
      typeof parsed.type !== "string" ||
      parsed.type.trim().length === 0
    ) {
      throw createRealtimeError(
        "REALTIME_INVALID_MESSAGE",
        "Realtime message does not contain a valid event type.",
      );
    }

    return {
      type: parsed.type,

      payload: parsed.payload,

      id: typeof parsed.id === "string" ? parsed.id : undefined,
    };
  },

  encode(event: RealtimeOutgoingEvent): string {
    try {
      return JSON.stringify(event);
    } catch (cause) {
      throw createRealtimeError(
        "REALTIME_SERIALIZATION_FAILED",
        "Unable to serialize realtime message.",
        cause,
      );
    }
  },
});
