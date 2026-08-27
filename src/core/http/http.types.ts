import type { AccessTokenProvider } from "@/core/session";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpAuthMode = "auto" | "none";

export type HttpResponseType = "json" | "text" | "arraybuffer" | "blob";

export interface HttpRequest<TBody = unknown, TParams = unknown> {
  method: HttpMethod;

  path: string;

  body?: TBody;

  params?: TParams;

  headers?: Readonly<Record<string, string>>;

  signal?: AbortSignal;

  timeoutMs?: number;

  auth?: HttpAuthMode;

  responseType?: HttpResponseType;
}

export interface HttpClient {
  request<TData, TBody = unknown, TParams = unknown>(
    request: HttpRequest<TBody, TParams>,
  ): Promise<TData>;
}

export interface CreateHttpClientOptions {
  baseUrl: string;

  timeoutMs: number;

  tokenProvider?: AccessTokenProvider;
}
