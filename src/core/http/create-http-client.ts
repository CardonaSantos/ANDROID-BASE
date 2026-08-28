import axios from "axios";

import { AppError, isAppErrorKind } from "@/core/errors";

import { normalizeHttpError } from "./normalize-http-error";

import type {
  CreateHttpClientOptions,
  HttpClient,
  HttpRequest,
} from "./http.types";

const SENSITIVE_CONFIG_KEYS = [
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "token",
  "accessToken",
  "refreshToken",
] as const;

function normalizeRelativePath(path: string): string {
  const normalized = path.trim();

  if (normalized.length === 0) {
    throw new AppError({
      kind: "bad_request",

      source: "http",

      code: "HTTP_EMPTY_PATH",

      message: "HTTP request path cannot be empty.",
    });
  }

  /*
   * Feature APIs must use paths
   * relative to the configured
   * backend base URL.
   *
   * Reject explicit absolute and
   * protocol-relative URLs.
   */
  if (
    /^[a-z][a-z\d+.-]*:\/\//i.test(normalized) ||
    normalized.startsWith("//")
  ) {
    throw new AppError({
      kind: "bad_request",

      source: "http",

      code: "HTTP_ABSOLUTE_URL_NOT_ALLOWED",

      message: "HTTP requests must use relative paths.",
    });
  }

  return normalized;
}

function buildHeaders(
  source: Readonly<Record<string, string>> | undefined,

  accessToken: string | null,

  includeAuthorization: boolean,
): Record<string, string> {
  const headers: Record<string, string> = {};

  for (const [key, value] of Object.entries(source ?? {})) {
    /*
     * Authentication is owned by
     * the Core token provider.
     *
     * Feature code cannot replace
     * Authorization manually.
     */
    if (key.toLowerCase() === "authorization") {
      continue;
    }

    headers[key] = value;
  }

  if (includeAuthorization && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

export function createHttpClient(options: CreateHttpClientOptions): HttpClient {
  const { baseUrl, timeoutMs, tokenProvider, onUnauthorized } = options;

  const axiosClient = axios.create({
    baseURL: baseUrl,

    timeout: timeoutMs,

    allowAbsoluteUrls: false,

    headers: {
      Accept: "application/json",
    },

    transitional: {
      clarifyTimeoutError: true,
    },

    redact: [...SENSITIVE_CONFIG_KEYS],
  });

  axiosClient.interceptors.response.use(
    (response) => response,

    (error: unknown) => Promise.reject(normalizeHttpError(error)),
  );

  return Object.freeze({
    async request<TData, TBody = unknown, TParams = unknown>(
      request: HttpRequest<TBody, TParams>,
    ): Promise<TData> {
      const path = normalizeRelativePath(request.path);

      const authMode = request.auth ?? "auto";

      async function execute(accessToken: string | null): Promise<TData> {
        const response = await axiosClient.request<TData>({
          url: path,

          method: request.method,

          data: request.body,

          params: request.params,

          headers: buildHeaders(
            request.headers,
            accessToken,
            authMode === "auto",
          ),

          signal: request.signal,

          timeout: request.timeoutMs,

          responseType: request.responseType,
        });

        return response.data;
      }

      const accessToken =
        authMode === "auto" ? (tokenProvider?.getAccessToken() ?? null) : null;

      try {
        return await execute(accessToken);
      } catch (cause) {
        /*
         * Public/auth-none requests
         * must never trigger session
         * recovery.
         */
        if (authMode !== "auto") {
          throw cause;
        }

        /*
         * Only an actual HTTP 401
         * can trigger access-token
         * recovery.
         */
        if (!isAppErrorKind(cause, "unauthorized")) {
          throw cause;
        }

        /*
         * Some applications may not
         * configure refresh-token
         * authentication.
         */
        if (!onUnauthorized) {
          throw cause;
        }

        /*
         * The supplied handler owns
         * refresh single-flight and
         * session token rotation.
         */
        const refreshedAccessToken = await onUnauthorized();

        /*
         * Exactly one retry.
         *
         * Any failure from this second
         * request propagates directly;
         * another 401 cannot recursively
         * trigger another refresh.
         */
        return execute(refreshedAccessToken);
      }
    },
  });
}
