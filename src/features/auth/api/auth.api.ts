import type { ZodType } from "zod";

import { AppError } from "@/core/errors";

import { httpClient } from "@/core/http";

import {
  authUserSchema,
  loginResponseSchema,
  type AuthSessionPayload,
  type AuthUser,
  type LoginCredentials,
} from "./auth.contracts.api";

function parseAuthResponse<T>(
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

      message: "El servidor devolvió una respuesta de autenticación inválida.",

      details: result.error.issues,
    });
  }

  return result.data;
}

export async function loginUser(
  credentials: LoginCredentials,
  signal?: AbortSignal,
): Promise<AuthSessionPayload> {
  const payload = await httpClient.request<unknown, LoginCredentials>({
    method: "POST",

    path: "auth/login-user",

    body: credentials,

    auth: "none",

    signal,
  });

  const response = parseAuthResponse(
    loginResponseSchema,
    payload,
    "AUTH_LOGIN_INVALID_RESPONSE",
  );

  return {
    user: response.user,

    accessToken: response.access_token,
  };
}

export async function loadAuthProfile(signal?: AbortSignal): Promise<AuthUser> {
  const payload = await httpClient.request<unknown>({
    method: "GET",

    path: "auth/profile",

    auth: "auto",

    signal,
  });

  return parseAuthResponse(
    authUserSchema,
    payload,
    "AUTH_PROFILE_INVALID_RESPONSE",
  );
}
