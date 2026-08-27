import {
  REALTIME_RECONNECT_BASE_DELAY_MS,
  REALTIME_RECONNECT_MAX_DELAY_MS,
} from "../realtime.constants";

export function getRealtimeReconnectDelay(attempt: number): number {
  const exponential = Math.min(
    REALTIME_RECONNECT_BASE_DELAY_MS * 2 ** attempt,

    REALTIME_RECONNECT_MAX_DELAY_MS,
  );

  /*
   * Equal jitter.
   *
   * Avoids many devices reconnecting
   * at exactly the same instant.
   */
  const minimum = exponential / 2;

  return Math.floor(minimum + Math.random() * minimum);
}
