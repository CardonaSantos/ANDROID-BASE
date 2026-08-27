export interface CreateWebSocketInput {
  url: string;

  protocols: readonly string[];

  headers: Readonly<Record<string, string>>;
}

interface ReactNativeWebSocketOptions {
  headers?: Record<string, string>;
}

interface ReactNativeWebSocketConstructor {
  new (
    url: string,
    protocols?: string | string[],
    options?: ReactNativeWebSocketOptions,
  ): WebSocket;
}

const NativeWebSocket = WebSocket as unknown as ReactNativeWebSocketConstructor;

export function createWebSocket(input: CreateWebSocketInput): WebSocket {
  const protocols =
    input.protocols.length > 0 ? [...input.protocols] : undefined;

  const hasHeaders = Object.keys(input.headers).length > 0;

  return new NativeWebSocket(
    input.url,
    protocols,
    hasHeaders
      ? {
          headers: {
            ...input.headers,
          },
        }
      : undefined,
  );
}
