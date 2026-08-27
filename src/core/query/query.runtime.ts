import { focusManager, onlineManager } from "@tanstack/react-query";

import {
  isAppForeground,
  isNetworkOffline,
  networkManager,
  networkRuntime,
  type NetworkSnapshot,
} from "@/core/network";

import { sessionManager, type SessionStatus } from "@/core/session";

import { queryClient } from "./query-client";

let consumers = 0;

let releaseNetworkRuntime: (() => void) | null = null;

let unsubscribeNetwork: (() => void) | null = null;

let unsubscribeSession: (() => void) | null = null;

let previousSessionStatus: SessionStatus | null = null;

function applyNetworkState(snapshot: NetworkSnapshot): void {
  if (snapshot.connectivityInitialized) {
    /*
     * Unknown is NOT offline.
     *
     * Only a confirmed offline
     * signal pauses TanStack.
     */
    onlineManager.setOnline(!isNetworkOffline(snapshot));
  }

  if (snapshot.lifecycleInitialized) {
    focusManager.setFocused(isAppForeground(snapshot));
  }
}

function attach(): void {
  releaseNetworkRuntime = networkRuntime.start();

  const initialNetwork = networkManager.getSnapshot();

  applyNetworkState(initialNetwork);

  unsubscribeNetwork = networkManager.subscribe(applyNetworkState);

  const session = sessionManager.getSnapshot();

  previousSessionStatus = session.status;

  /*
   * A runtime may be started after
   * an earlier lifecycle already
   * populated the QueryClient.
   *
   * If the current session is
   * anonymous, cached authenticated
   * data must not survive merely
   * because the transition to
   * anonymous happened while this
   * runtime was detached.
   */
  if (session.status === "anonymous") {
    queryClient.clear();
  }

  unsubscribeSession = sessionManager.subscribe((nextSession) => {
    const previous = previousSessionStatus;

    previousSessionStatus = nextSession.status;

    if (
      previous !== null &&
      previous !== "anonymous" &&
      nextSession.status === "anonymous"
    ) {
      /*
       * Prevent cached private
       * data surviving logout
       * or a failed session
       * restore.
       */
      queryClient.clear();
    }
  });
}

function detach(): void {
  unsubscribeSession?.();

  unsubscribeSession = null;

  unsubscribeNetwork?.();

  unsubscribeNetwork = null;

  releaseNetworkRuntime?.();

  releaseNetworkRuntime = null;

  previousSessionStatus = null;

  /*
   * Restore neutral defaults.
   *
   * The runtime normally lives for
   * the complete application
   * lifecycle, but restoring these
   * values makes teardown safe for
   * development, tests and strict
   * lifecycle cycles.
   */
  onlineManager.setOnline(true);

  focusManager.setFocused(true);
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

export const queryRuntime = Object.freeze({
  start,
});
