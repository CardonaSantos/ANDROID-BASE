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

function attach(): void {
  releaseNetworkRuntime = networkRuntime.start();

  latestNetwork = networkManager.getSnapshot();

  latestSession = sessionManager.getSnapshot();

  unsubscribeNetwork = networkManager.subscribe((snapshot) => {
    latestNetwork = snapshot;

    evaluate();
  });

  unsubscribeSession = sessionManager.subscribe((snapshot) => {
    latestSession = snapshot;

    evaluate();
  });

  unsubscribeToken = sessionTokenProvider.subscribe(() => {
    if (latestSession?.status === "authenticated") {
      realtimeClient.reconnect();
    }
  });

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
