import type { AppError } from "@/core/errors";

import { io, type Socket } from "socket.io-client";

import { REALTIME_CONNECTION_TIMEOUT_MS } from "./realtime.constants";

import { createRealtimeError, normalizeRealtimeError } from "./realtime.error";

import {
  createRealtimeStore,
  toRealtimeSnapshot,
} from "./_internal/realtime.store";

import type {
  CreateRealtimeManagerOptions,
  RealtimeErrorListener,
  RealtimeEvent,
  RealtimeEventListener,
  RealtimeOutgoingEvent,
  RealtimeSnapshot,
  RealtimeSuspendReason,
} from "./realtime.types";

/*
 * =========================================================
 * SOCKET.IO TRANSPORT
 * =========================================================
 *
 * The server exposes:
 *
 *   namespace: /ws
 *   path:      /socket.io
 *
 * Environment configuration only contains the HTTP(S)
 * origin of the server.
 * =========================================================
 */

const SOCKET_IO_NAMESPACE = "/ws";

const SOCKET_IO_PATH = "/socket.io";

const SOCKET_IO_RECONNECTION_DELAY_MS = 500;

const SOCKET_IO_RECONNECTION_DELAY_MAX_MS = 5_000;

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function buildSocketIoUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/+$/, "");

  return `${normalized}${SOCKET_IO_NAMESPACE}`;
}

function normalizeBearerToken(token: string): string {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

/*
 * =========================================================
 * MANAGER
 * =========================================================
 */

export function createRealtimeManager(options: CreateRealtimeManagerOptions) {
  /*
   * codec and protocols are intentionally still part of
   * CreateRealtimeManagerOptions during this migration.
   *
   * Socket.IO no longer needs them.
   *
   * We remove those legacy properties in the next cleanup
   * batch after confirming this transport compiles.
   */
  const {
    url,
    authMode,
    tokenProvider,
    connectionTimeoutMs = REALTIME_CONNECTION_TIMEOUT_MS,
  } = options;

  const store = createRealtimeStore(Boolean(url));

  /*
   * Socket.IO owns its underlying Engine.IO/WebSocket
   * transport and reconnection lifecycle.
   *
   * We keep one Socket instance and explicitly connect /
   * disconnect it according to our application runtime.
   */
  let socket: Socket | null = null;

  let desiredConnection = false;

  const eventListeners = new Map<string, Set<RealtimeEventListener>>();

  const allEventListeners = new Set<RealtimeEventListener>();

  const errorListeners = new Set<RealtimeErrorListener>();

  /*
   * =======================================================
   * SNAPSHOT
   * =======================================================
   */

  function getSnapshot(): RealtimeSnapshot {
    return toRealtimeSnapshot(store.getState());
  }

  function subscribeState(
    listener: (snapshot: RealtimeSnapshot) => void,
  ): () => void {
    return store.subscribe((state) => {
      listener(toRealtimeSnapshot(state));
    });
  }

  /*
   * =======================================================
   * EVENT SUBSCRIPTIONS
   * =======================================================
   */

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

  /*
   * =======================================================
   * DISPATCH
   * =======================================================
   */

  function emitError(error: AppError): void {
    for (const listener of errorListeners) {
      try {
        listener(error);
      } catch {
        /*
         * One observer must never break
         * the realtime transport.
         */
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
          /*
           * One feature listener must not
           * break the remaining listeners.
           */
        }
      }
    }

    for (const listener of allEventListeners) {
      try {
        listener(event);
      } catch {
        /*
         * Same isolation policy for
         * global listeners.
         */
      }
    }
  }

  /*
   * =======================================================
   * AUTH
   * =======================================================
   */

  function buildAuth(): Record<string, string> {
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

    /*
     * CrmGateway.normalizeToken() accepts both:
     *
     * token
     * Bearer token
     *
     * We send Bearer consistently with HTTP.
     */
    return {
      token: normalizeBearerToken(accessToken),
    };
  }

  function refreshSocketAuth(current: Socket): void {
    current.auth = buildAuth();
  }

  /*
   * =======================================================
   * SOCKET CREATION
   * =======================================================
   */

  function createSocket(): Socket {
    if (!url) {
      throw createRealtimeError(
        "REALTIME_CONNECTION_FAILED",
        "Realtime server URL is not configured.",
      );
    }

    const current = io(buildSocketIoUrl(url), {
      /*
       * The Socket.IO client must NOT connect when
       * constructed.
       *
       * Our realtimeRuntime decides when the app may
       * hold a live socket:
       *
       * authenticated + online + foreground.
       */
      autoConnect: false,

      path: SOCKET_IO_PATH,

      /*
       * The CRM server already works over WebSocket
       * transport.
       *
       * We intentionally avoid long-polling here.
       */
      transports: ["websocket"],

      auth: {},

      reconnection: true,

      reconnectionAttempts: Infinity,

      reconnectionDelay: SOCKET_IO_RECONNECTION_DELAY_MS,

      reconnectionDelayMax: SOCKET_IO_RECONNECTION_DELAY_MAX_MS,

      randomizationFactor: 0.5,

      timeout: connectionTimeoutMs,
    });

    /*
     * =====================================================
     * BUSINESS EVENTS
     * =====================================================
     *
     * Socket.IO already supplies the event name separately
     * from the payload:
     *
     * socket.emit(
     *   "tracking:location-updated",
     *   payload,
     * )
     *
     * We adapt that into our existing transport-neutral
     * RealtimeEvent abstraction.
     */

    current.onAny((type, ...args) => {
      const payload = args.length <= 1 ? args[0] : args;

      dispatch({
        type,
        payload,
      });
    });

    /*
     * =====================================================
     * CONNECTED
     * =====================================================
     */

    current.on("connect", () => {
      if (socket !== current) {
        return;
      }

      store.setState({
        status: "connected",

        suspendReason: null,

        reconnectAttempt: 0,

        connectedAt: Date.now(),
      });
    });

    /*
     * =====================================================
     * INITIAL CONNECTION ERROR
     * =====================================================
     */

    current.on("connect_error", (cause) => {
      if (socket !== current) {
        return;
      }

      emitError(
        normalizeRealtimeError(
          cause,
          "REALTIME_CONNECTION_FAILED",
          "Unable to establish realtime connection.",
        ),
      );

      if (desiredConnection) {
        store.setState({
          status: "reconnecting",

          disconnectedAt: Date.now(),
        });
      }
    });

    /*
     * =====================================================
     * SERVER ERROR EVENT
     * =====================================================
     *
     * CrmGateway currently emits "error" for cases such as:
     *
     * NO_TOKEN
     * TOKEN_EXPIRED
     * INVALID_TOKEN
     */

    current.on("error", (cause) => {
      if (socket !== current) {
        return;
      }

      emitError(
        createRealtimeError(
          "REALTIME_SOCKET_ERROR",
          "Realtime server reported an error.",
          cause,
        ),
      );
    });

    /*
     * =====================================================
     * DISCONNECT
     * =====================================================
     */

    current.on("disconnect", (reason) => {
      if (socket !== current) {
        return;
      }

      store.setState({
        disconnectedAt: Date.now(),
      });

      /*
       * suspend() and stop() deliberately disconnected
       * the socket.
       *
       * Those methods are responsible for the final
       * application state.
       */
      if (!desiredConnection) {
        return;
      }

      /*
       * Socket.IO automatically reconnects after
       * transport failures.
       *
       * A server-initiated namespace disconnect does NOT
       * automatically reconnect.
       */
      if (reason === "io server disconnect") {
        store.setState({
          status: "idle",

          reconnectAttempt: 0,
        });

        return;
      }

      store.setState({
        status: "reconnecting",
      });
    });

    /*
     * =====================================================
     * SOCKET.IO MANAGER RECONNECTION
     * =====================================================
     */

    current.io.on("reconnect_attempt", (attempt) => {
      if (socket !== current || !desiredConnection) {
        return;
      }

      /*
       * Refresh auth before every reconnection.
       *
       * This protects us if the access token rotated
       * between attempts.
       */
      try {
        refreshSocketAuth(current);
      } catch (cause) {
        emitError(
          normalizeRealtimeError(
            cause,
            "REALTIME_CONNECTION_FAILED",
            "Unable to refresh realtime authentication.",
          ),
        );

        suspend("session_unavailable");

        return;
      }

      store.setState({
        status: "reconnecting",

        reconnectAttempt: attempt,

        disconnectedAt: Date.now(),
      });
    });

    current.io.on("reconnect_error", (cause) => {
      if (socket !== current || !desiredConnection) {
        return;
      }

      emitError(
        normalizeRealtimeError(
          cause,
          "REALTIME_CONNECTION_FAILED",
          "Realtime reconnection attempt failed.",
        ),
      );
    });

    current.io.on("reconnect_failed", () => {
      if (socket !== current) {
        return;
      }

      emitError(
        createRealtimeError(
          "REALTIME_CONNECTION_FAILED",
          "Realtime reconnection attempts were exhausted.",
        ),
      );

      store.setState({
        status: "idle",

        reconnectAttempt: 0,

        disconnectedAt: Date.now(),
      });
    });

    return current;
  }

  function ensureSocket(): Socket {
    if (socket) {
      return socket;
    }

    socket = createSocket();

    return socket;
  }

  /*
   * =======================================================
   * RESUME
   * =======================================================
   */

  function resume(): void {
    if (!url) {
      store.setState({
        status: "disabled",

        configured: false,

        suspendReason: null,
      });

      return;
    }

    desiredConnection = true;

    let current: Socket;

    try {
      current = ensureSocket();

      refreshSocketAuth(current);
    } catch (cause) {
      emitError(
        normalizeRealtimeError(
          cause,
          "REALTIME_CONNECTION_FAILED",
          "Unable to prepare realtime connection.",
        ),
      );

      suspend("session_unavailable");

      return;
    }

    if (current.connected) {
      return;
    }

    const currentStatus = store.getState().status;

    if (currentStatus === "connecting" || currentStatus === "reconnecting") {
      return;
    }

    store.setState({
      status: "connecting",

      suspendReason: null,
    });

    try {
      current.connect();
    } catch (cause) {
      emitError(
        normalizeRealtimeError(
          cause,
          "REALTIME_CONNECTION_FAILED",
          "Unable to start realtime connection.",
        ),
      );

      store.setState({
        status: "idle",

        disconnectedAt: Date.now(),
      });
    }
  }

  /*
   * =======================================================
   * SUSPEND
   * =======================================================
   */

  function suspend(reason: RealtimeSuspendReason): void {
    desiredConnection = false;

    const current = socket;

    if (current) {
      try {
        current.disconnect();
      } catch (cause) {
        emitError(
          normalizeRealtimeError(
            cause,
            "REALTIME_CONNECTION_FAILED",
            "Unable to suspend realtime connection.",
          ),
        );
      }
    }

    store.setState({
      status: url ? "suspended" : "disabled",

      suspendReason: url ? reason : null,

      reconnectAttempt: 0,

      disconnectedAt: current ? Date.now() : store.getState().disconnectedAt,
    });
  }

  /*
   * =======================================================
   * STOP
   * =======================================================
   */

  function stop(): void {
    desiredConnection = false;

    const current = socket;

    if (current) {
      try {
        current.disconnect();
      } catch (cause) {
        emitError(
          normalizeRealtimeError(
            cause,
            "REALTIME_CONNECTION_FAILED",
            "Unable to stop realtime connection.",
          ),
        );
      }
    }

    store.setState({
      status: url ? "idle" : "disabled",

      suspendReason: null,

      reconnectAttempt: 0,

      disconnectedAt: current ? Date.now() : store.getState().disconnectedAt,
    });
  }

  /*
   * =======================================================
   * RECONNECT
   * =======================================================
   *
   * realtimeRuntime invokes this when the authenticated
   * access token changes.
   * =======================================================
   */

  function reconnect(): void {
    if (!desiredConnection || !url) {
      return;
    }

    let current: Socket;

    try {
      current = ensureSocket();

      refreshSocketAuth(current);
    } catch (cause) {
      emitError(
        normalizeRealtimeError(
          cause,
          "REALTIME_CONNECTION_FAILED",
          "Unable to prepare realtime reconnection.",
        ),
      );

      suspend("session_unavailable");

      return;
    }

    store.setState({
      status: "reconnecting",

      reconnectAttempt: 0,
    });

    try {
      /*
       * A manual Socket.IO disconnect disables automatic
       * reconnection for that connection.
       *
       * Calling connect() explicitly starts a new connection
       * immediately with the refreshed auth payload.
       */
      current.disconnect();

      current.connect();
    } catch (cause) {
      emitError(
        normalizeRealtimeError(
          cause,
          "REALTIME_CONNECTION_FAILED",
          "Unable to reconnect realtime connection.",
        ),
      );

      store.setState({
        status: "idle",

        disconnectedAt: Date.now(),
      });
    }
  }

  /*
   * =======================================================
   * SEND
   * =======================================================
   *
   * Existing public API:
   *
   * realtimeClient.send({
   *   type: "test:ping",
   *   payload: {...},
   * })
   *
   * Becomes:
   *
   * socket.emit(
   *   "test:ping",
   *   payload,
   * )
   * =======================================================
   */

  function send(event: RealtimeOutgoingEvent): void {
    const current = socket;

    if (!current || !current.connected) {
      throw createRealtimeError(
        "REALTIME_NOT_CONNECTED",
        "Realtime connection is not available.",
      );
    }

    try {
      current.emit(event.type, event.payload);
    } catch (cause) {
      throw normalizeRealtimeError(
        cause,
        "REALTIME_SEND_FAILED",
        "Unable to send realtime event.",
      );
    }
  }

  /*
   * =======================================================
   * PUBLIC API
   * =======================================================
   */

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
