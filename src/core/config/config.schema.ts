import { z } from "zod";

import { APP_ENVIRONMENTS } from "./config.constants";

const appEnvironmentNameSchema = z.enum(APP_ENVIRONMENTS);

const httpUrlSchema = z.url().refine(
  (value) => {
    const normalized = value.toLowerCase();

    return (
      normalized.startsWith("http://") || normalized.startsWith("https://")
    );
  },
  {
    error: "Must use http:// or https://",
  },
);

const websocketUrlSchema = z.url().refine(
  (value) => {
    const normalized = value.toLowerCase();

    return normalized.startsWith("ws://") || normalized.startsWith("wss://");
  },
  {
    error: "Must use ws:// or wss://",
  },
);

const optionalWebsocketUrlSchema = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}, websocketUrlSchema.optional());

export const appEnvironmentSchema = z
  .object({
    EXPO_PUBLIC_APP_ENV: appEnvironmentNameSchema,

    EXPO_PUBLIC_API_URL: httpUrlSchema,

    EXPO_PUBLIC_REALTIME_URL: optionalWebsocketUrlSchema,
  })
  .refine(
    (environment) => {
      if (environment.EXPO_PUBLIC_APP_ENV === "development") {
        return true;
      }

      return environment.EXPO_PUBLIC_API_URL.toLowerCase().startsWith(
        "https://",
      );
    },
    {
      error: "Preview and production environments must use HTTPS",

      path: ["EXPO_PUBLIC_API_URL"],
    },
  )
  .refine(
    (environment) => {
      if (environment.EXPO_PUBLIC_APP_ENV === "development") {
        return true;
      }

      const realtimeUrl = environment.EXPO_PUBLIC_REALTIME_URL;

      if (!realtimeUrl) {
        return true;
      }

      return realtimeUrl.toLowerCase().startsWith("wss://");
    },
    {
      error: "Preview and production environments must use WSS",

      path: ["EXPO_PUBLIC_REALTIME_URL"],
    },
  );

export type AppEnvironment = z.infer<typeof appEnvironmentNameSchema>;
