import { appConfig } from "@/core/config";

import { sessionTokenProvider } from "@/core/session";

import { createHttpClient } from "./create-http-client";

export const httpClient = createHttpClient({
  baseUrl: appConfig.api.baseUrl,

  timeoutMs: appConfig.api.timeoutMs,

  tokenProvider: sessionTokenProvider,
});
