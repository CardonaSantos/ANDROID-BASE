import { z } from "zod";

import { SESSION_STORAGE_VERSION } from "./session.constants";

const tokenSchema = z.string().refine((value) => value.trim().length > 0, {
  error: "Token cannot be empty.",
});

export const persistedSessionSchema = z.discriminatedUnion("strategy", [
  z.object({
    version: z.literal(SESSION_STORAGE_VERSION),

    strategy: z.literal("none"),
  }),

  z.object({
    version: z.literal(SESSION_STORAGE_VERSION),

    strategy: z.literal("refresh-token"),

    refreshToken: tokenSchema,
  }),

  z.object({
    version: z.literal(SESSION_STORAGE_VERSION),

    strategy: z.literal("access-token"),

    accessToken: tokenSchema,
  }),
]);

export type PersistedSession = z.infer<typeof persistedSessionSchema>;
