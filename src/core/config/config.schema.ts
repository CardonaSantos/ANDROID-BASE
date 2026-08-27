import { z } from "zod";

import { APP_ENVIRONMENTS } from "./config.constants";

const appEnvironmentNameSchema = z.enum(APP_ENVIRONMENTS);

const httpUrlSchema = z
  .string()
  .trim()
  .url()
  .refine(
    (value) => {
      const normalized = value.toLowerCase();

      return (
        normalized.startsWith("http://") || normalized.startsWith("https://")
      );
    },
    {
      message: "Must use http:// or https://",
    },
  );

const websocketUrlSchema = z
  .string()
  .trim()
  .url()
  .refine(
    (value) => {
      const normalized = value.toLowerCase();

      return normalized.startsWith("ws://") || normalized.startsWith("wss://");
    },
    {
      message: "Must use ws:// or wss://",
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
  .superRefine((environment, context) => {
    const requiresSecureTransport =
      environment.EXPO_PUBLIC_APP_ENV !== "development";

    if (
      requiresSecureTransport &&
      !environment.EXPO_PUBLIC_API_URL.toLowerCase().startsWith("https://")
    ) {
      context.addIssue({
        code: "custom",
        path: ["EXPO_PUBLIC_API_URL"],
        message: "Preview and production environments must use HTTPS",
      });
    }

    const realtimeUrl = environment.EXPO_PUBLIC_REALTIME_URL;

    if (
      requiresSecureTransport &&
      realtimeUrl &&
      !realtimeUrl.toLowerCase().startsWith("wss://")
    ) {
      context.addIssue({
        code: "custom",
        path: ["EXPO_PUBLIC_REALTIME_URL"],
        message: "Preview and production environments must use WSS",
      });
    }
  });

export type AppEnvironment = z.infer<typeof appEnvironmentNameSchema>;
