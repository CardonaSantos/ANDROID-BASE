import { appConfig } from "@/core/config";

import { sessionTokenProvider } from "@/core/session";

import { jsonRealtimeCodec } from "./realtime.codec";

import { createRealtimeManager } from "./realtime.manager";

export const realtimeClient = createRealtimeManager({
  url: appConfig.realtime.url,

  authMode: "bearer-header",

  tokenProvider: sessionTokenProvider,

  codec: jsonRealtimeCodec,
});
