import { createRealtimeError } from "../realtime.error";

import type { CreateWebSocketInput } from "./websocket.factory.native";

export type { CreateWebSocketInput } from "./websocket.factory.native";

export function createWebSocket(input: CreateWebSocketInput): WebSocket {
  if (Object.keys(input.headers).length > 0) {
    throw createRealtimeError(
      "REALTIME_WEB_HEADERS_UNSUPPORTED",
      "Authenticated realtime connections are not supported by the web development fallback.",
    );
  }

  const protocols =
    input.protocols.length > 0 ? [...input.protocols] : undefined;

  return new WebSocket(input.url, protocols);
}
