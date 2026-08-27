import {
  isAppForeground,
  isNetworkOffline,
  networkManager,
  networkRuntime,
  type NetworkSnapshot,
} from "@/core/network";

import {
  sessionManager,
  sessionTokenProvider,
  type SessionSnapshot,
} from "@/core/session";

import { realtimeClient } from "./realtime-client";

let consumers = 0;

let releaseNetworkRuntime: (() => void) | null = null;

let unsubscribeNetwork: (() => void) | null = null;

let unsubscribeSession: (() => void) | null = null;

let unsubscribeToken: (() => void) | null = null;

let latestNetwork: NetworkSnapshot | null = null;

let latestSession: SessionSnapshot | null = null;

let latestAccessToken: string | null = null;

function evaluate(): void {
  if (!realtimeClient.getSnapshot().configured) {
    realtimeClient.stop();

    return;
  }

  if (!latestSession || latestSession.status !== "authenticated") {
    realtimeClient.suspend("session_unavailable");

    return;
  }

  if (latestNetwork && isNetworkOffline(latestNetwork)) {
    realtimeClient.suspend("offline");

    return;
  }

  if (latestNetwork?.lifecycleInitialized && !isAppForeground(latestNetwork)) {
    realtimeClient.suspend("background");

    return;
  }

  realtimeClient.resume();
}

function handleAccessTokenChange(nextAccessToken: string | null): void {
  const previousAccessToken = latestAccessToken;

  latestAccessToken = nextAccessToken;

  /*
   * null -> token
   *
   * Initial login or session
   * restoration.
   *
   * The session listener is
   * responsible for evaluate()
   * and therefore opening the
   * connection. Reconnecting here
   * would immediately close the
   * socket that was just created.
   */
  if (previousAccessToken === null || nextAccessToken === null) {
    return;
  }

  /*
   * token A -> token B
   *
   * An authenticated credential
   * was rotated, normally by a
   * refresh operation.
   *
   * A live realtime connection may
   * still have been authenticated
   * with the previous token, so it
   * must reconnect.
   */
  if (previousAccessToken === nextAccessToken) {
    return;
  }

  if (latestSession?.status !== "authenticated") {
    return;
  }

  realtimeClient.reconnect();
}

function attach(): void {
  releaseNetworkRuntime = networkRuntime.start();

  latestNetwork = networkManager.getSnapshot();

  latestSession = sessionManager.getSnapshot();

  latestAccessToken = sessionTokenProvider.getAccessToken();

  unsubscribeNetwork = networkManager.subscribe((snapshot) => {
    latestNetwork = snapshot;

    evaluate();
  });

  unsubscribeSession = sessionManager.subscribe((snapshot) => {
    latestSession = snapshot;

    evaluate();
  });

  unsubscribeToken = sessionTokenProvider.subscribe(handleAccessTokenChange);

  evaluate();
}

function detach(): void {
  unsubscribeToken?.();

  unsubscribeToken = null;

  unsubscribeSession?.();

  unsubscribeSession = null;

  unsubscribeNetwork?.();

  unsubscribeNetwork = null;

  releaseNetworkRuntime?.();

  releaseNetworkRuntime = null;

  latestNetwork = null;

  latestSession = null;

  latestAccessToken = null;

  realtimeClient.stop();
}

function start(): () => void {
  consumers += 1;

  if (consumers === 1) {
    try {
      attach();
    } catch (error) {
      consumers = 0;

      detach();

      throw error;
    }
  }

  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;

    consumers = Math.max(0, consumers - 1);

    if (consumers === 0) {
      detach();
    }
  };
}

export const realtimeRuntime = Object.freeze({
  start,
});
