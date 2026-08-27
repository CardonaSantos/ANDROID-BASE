import { QueryClient } from "@tanstack/react-query";

import {
  DEFAULT_QUERY_GC_TIME_MS,
  DEFAULT_QUERY_STALE_TIME_MS,
} from "./query.constants";

import { getQueryRetryDelay, shouldRetryQuery } from "./query.retry";

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_QUERY_STALE_TIME_MS,

        gcTime: DEFAULT_QUERY_GC_TIME_MS,

        retry: shouldRetryQuery,

        retryDelay: getQueryRetryDelay,

        networkMode: "online",

        refetchOnReconnect: true,

        refetchOnWindowFocus: true,

        throwOnError: false,
      },

      mutations: {
        retry: false,

        networkMode: "always",

        throwOnError: false,
      },
    },
  });
}

export const queryClient = createAppQueryClient();
