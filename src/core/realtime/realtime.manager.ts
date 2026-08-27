import {
  REALTIME_CONNECTION_TIMEOUT_MS,
  REALTIME_NORMAL_CLOSE_CODE,
} from "./realtime.constants";

import { createRealtimeError } from "./realtime.error";

import { getRealtimeReconnectDelay } from "./_internal/realtime.backoff";

import { createWebSocket } from "./_internal/websocket.factory";

import { realtimeStore, toRealtimeSnapshot } from "./_internal/realtime.store";

import type {
  CreateRealtimeManagerOptions,
  RealtimeErrorListener,
  RealtimeEvent,
  RealtimeEventListener,
  RealtimeOutgoingEvent,
  RealtimeSnapshot,
  RealtimeSuspendReason,
} from "./realtime.types";

const NON_RETRYABLE_CLOSE_CODES = new Set<number>([1000, 1008]);

export function createRealtimeManager(options: CreateRealtimeManagerOptions) {
  const {
    url,
    authMode,
    tokenProvider,
    codec,
    protocols = [],
    connectionTimeoutMs = REALTIME_CONNECTION_TIMEOUT_MS,
  } = options;

  let socket: WebSocket | null = null;

  let desiredConnection = false;

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  let connectionTimer: ReturnType<typeof setTimeout> | null = null;

  let reconnectAttempt = 0;

  let reconnectImmediately = false;

  const eventListeners = new Map<string, Set<RealtimeEventListener>>();

  const allEventListeners = new Set<RealtimeEventListener>();

  const errorListeners = new Set<RealtimeErrorListener>();

  realtimeStore.setState({
    status: url ? "idle" : "disabled",

    configured: Boolean(url),
  });

  function getSnapshot(): RealtimeSnapshot {
    return toRealtimeSnapshot(realtimeStore.getState());
  }

  function subscribeState(
    listener: (snapshot: RealtimeSnapshot) => void,
  ): () => void {
    return realtimeStore.subscribe((state) => {
      listener(toRealtimeSnapshot(state));
    });
  }

  function subscribe(
    type: string,
    listener: RealtimeEventListener,
  ): () => void {
    let listeners = eventListeners.get(type);

    if (!listeners) {
      listeners = new Set();

      eventListeners.set(type, listeners);
    }

    listeners.add(listener);

    return () => {
      const current = eventListeners.get(type);

      current?.delete(listener);

      if (current?.size === 0) {
        eventListeners.delete(type);
      }
    };
  }

  function subscribeAll(listener: RealtimeEventListener): () => void {
    allEventListeners.add(listener);

    return () => {
      allEventListeners.delete(listener);
    };
  }

  function subscribeErrors(listener: RealtimeErrorListener): () => void {
    errorListeners.add(listener);

    return () => {
      errorListeners.delete(listener);
    };
  }

  function emitError(error: Error): void {
    for (const listener of errorListeners) {
      try {
        listener(error);
      } catch {
        // A consumer error must
        // never break realtime.
      }
    }
  }

  function dispatch(event: RealtimeEvent): void {
    const listeners = eventListeners.get(event.type);

    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(event);
        } catch {
          // One subscriber must
          // not break the others.
        }
      }
    }

    for (const listener of allEventListeners) {
      try {
        listener(event);
      } catch {
        // Same isolation policy.
      }
    }
  }

  function clearReconnectTimer(): void {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);

      reconnectTimer = null;
    }
  }

  function clearConnectionTimer(): void {
    if (connectionTimer !== null) {
      clearTimeout(connectionTimer);

      connectionTimer = null;
    }
  }

  function buildHeaders(): Record<string, string> {
    if (authMode === "none") {
      return {};
    }

    const accessToken = tokenProvider?.getAccessToken() ?? null;

    if (!accessToken) {
      throw createRealtimeError(
        "REALTIME_ACCESS_TOKEN_MISSING",
        "Realtime authentication requires an access token.",
      );
    }

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  function scheduleReconnect(): void {
    if (!desiredConnection || reconnectTimer !== null) {
      return;
    }

    const attempt = reconnectAttempt;

    reconnectAttempt += 1;

    realtimeStore.setState({
      status: "reconnecting",

      reconnectAttempt,

      disconnectedAt: Date.now(),
    });

    const delay = getRealtimeReconnectDelay(attempt);

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;

      openSocket(true);
    }, delay);
  }

  function handleMessage(data: unknown): void {
    try {
      const event = codec.decode(data);

      dispatch(event);
    } catch (cause) {
      const error =
        cause instanceof Error
          ? cause
          : createRealtimeError(
              "REALTIME_INVALID_MESSAGE",
              "Unable to process realtime message.",
              cause,
            );

      emitError(error);
    }
  }

  function openSocket(reconnecting: boolean): void {
    if (!desiredConnection || !url) {
      return;
    }

    if (
      socket &&
      (socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    clearReconnectTimer();
    clearConnectionTimer();

    let headers: Record<string, string>;

    try {
      headers = buildHeaders();
    } catch (cause) {
      const error =
        cause instanceof Error
          ? cause
          : createRealtimeError(
              "REALTIME_CONNECTION_FAILED",
              "Unable to prepare realtime connection.",
              cause,
            );

      emitError(error);

      suspend("session_unavailable");

      return;
    }

    realtimeStore.setState({
      status: reconnecting ? "reconnecting" : "connecting",

      suspendReason: null,
    });

    let currentSocket: WebSocket;

    try {
      currentSocket = createWebSocket({
        url,

        protocols: [...protocols],

        headers,
      });
    } catch (cause) {
      const error =
        cause instanceof Error
          ? cause
          : createRealtimeError(
              "REALTIME_CONNECTION_FAILED",
              "Unable to create realtime connection.",
              cause,
            );

      emitError(error);

      scheduleReconnect();

      return;
    }

    socket = currentSocket;

    connectionTimer = setTimeout(() => {
      if (
        socket !== currentSocket ||
        currentSocket.readyState !== WebSocket.CONNECTING
      ) {
        return;
      }

      emitError(
        createRealtimeError(
          "REALTIME_CONNECTION_TIMEOUT",
          "Realtime connection timed out.",
        ),
      );

      currentSocket.close();
    }, connectionTimeoutMs);

    currentSocket.onopen = () => {
      if (socket !== currentSocket) {
        return;
      }

      clearConnectionTimer();

      reconnectAttempt = 0;

      realtimeStore.setState({
        status: "connected",

        suspendReason: null,

        reconnectAttempt: 0,

        connectedAt: Date.now(),
      });
    };

    currentSocket.onmessage = (event) => {
      if (socket !== currentSocket) {
        return;
      }

      handleMessage(event.data);
    };

    currentSocket.onerror = (event) => {
      if (socket !== currentSocket) {
        return;
      }

      emitError(
        createRealtimeError(
          "REALTIME_SOCKET_ERROR",
          "Realtime socket reported an error.",
          event,
        ),
      );
    };

    currentSocket.onclose = (event) => {
      if (socket !== currentSocket) {
        return;
      }

      clearConnectionTimer();

      socket = null;

      realtimeStore.setState({
        disconnectedAt: Date.now(),

        lastCloseCode: event.code,
      });

      if (!desiredConnection) {
        return;
      }

      if (reconnectImmediately) {
        reconnectImmediately = false;

        openSocket(true);

        return;
      }

      if (NON_RETRYABLE_CLOSE_CODES.has(event.code)) {
        realtimeStore.setState({
          status: "idle",

          reconnectAttempt: 0,
        });

        reconnectAttempt = 0;

        return;
      }

      scheduleReconnect();
    };
  }

  function resume(): void {
    if (!url) {
      realtimeStore.setState({
        status: "disabled",

        configured: false,

        suspendReason: null,
      });

      return;
    }

    desiredConnection = true;

    if (
      socket?.readyState === WebSocket.OPEN ||
      socket?.readyState === WebSocket.CONNECTING ||
      reconnectTimer !== null
    ) {
      return;
    }

    openSocket(false);
  }

  function suspend(reason: RealtimeSuspendReason): void {
    desiredConnection = false;

    reconnectImmediately = false;

    clearReconnectTimer();
    clearConnectionTimer();

    reconnectAttempt = 0;

    realtimeStore.setState({
      status: url ? "suspended" : "disabled",

      suspendReason: url ? reason : null,

      reconnectAttempt: 0,

      disconnectedAt: socket
        ? Date.now()
        : realtimeStore.getState().disconnectedAt,
    });

    const current = socket;

    socket = null;

    if (
      current &&
      (current.readyState === WebSocket.OPEN ||
        current.readyState === WebSocket.CONNECTING)
    ) {
      current.close(REALTIME_NORMAL_CLOSE_CODE, "client_suspend");
    }
  }

  function stop(): void {
    desiredConnection = false;

    reconnectImmediately = false;

    clearReconnectTimer();
    clearConnectionTimer();

    reconnectAttempt = 0;

    realtimeStore.setState({
      status: url ? "idle" : "disabled",

      suspendReason: null,

      reconnectAttempt: 0,
    });

    const current = socket;

    socket = null;

    current?.close(REALTIME_NORMAL_CLOSE_CODE, "client_stop");
  }

  function reconnect(): void {
    if (!desiredConnection || !url) {
      return;
    }

    clearReconnectTimer();

    if (!socket) {
      openSocket(true);

      return;
    }

    reconnectImmediately = true;

    socket.close(REALTIME_NORMAL_CLOSE_CODE, "client_reconnect");
  }

  function send(event: RealtimeOutgoingEvent): void {
    const current = socket;

    if (!current || current.readyState !== WebSocket.OPEN) {
      throw createRealtimeError(
        "REALTIME_NOT_CONNECTED",
        "Realtime connection is not available.",
      );
    }

    const serialized = codec.encode(event);

    current.send(serialized);
  }

  return Object.freeze({
    getSnapshot,

    subscribeState,

    subscribe,

    subscribeAll,

    subscribeErrors,

    resume,

    suspend,

    reconnect,

    stop,

    send,
  });
}
