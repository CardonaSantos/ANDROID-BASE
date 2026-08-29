import { isNetworkUsable, networkManager } from "@/core/network";

import { sessionManager } from "@/core/session";

import {
  flushTrackingQueueForSession,
  reconcileTrackingRuntime,
} from "@/features/tracking/application";

import { readActiveTrackingSessionId } from "@/features/tracking/storage";

let reconcilePromise: Promise<void> | null = null;

let flushPromise: Promise<void> | null = null;

function scheduleReconcile(): void {
  if (reconcilePromise) {
    return;
  }

  reconcilePromise = reconcileTrackingRuntime()
    .then(() => undefined)
    .catch((error) => {
      console.warn("[tracking-runtime] Reconciliación pendiente.", error);
    })
    .finally(() => {
      reconcilePromise = null;
    });
}

function scheduleFlush(): void {
  if (flushPromise) {
    return;
  }

  flushPromise = (async () => {
    const sessionId = await readActiveTrackingSessionId();

    if (!sessionId) {
      return;
    }

    await flushTrackingQueueForSession(sessionId);
  })()
    .catch((error) => {
      console.warn("[tracking-runtime] Flush pendiente.", error);
    })
    .finally(() => {
      flushPromise = null;
    });
}

export const appTrackingFeatureRuntime = Object.freeze({
  start(): () => void {
    let previousLifecycle = networkManager.getSnapshot().appLifecycle;

    const session = sessionManager.getSnapshot();

    if (session.hydrated && session.isAuthenticated) {
      scheduleReconcile();
    }

    const unsubscribeSession = sessionManager.subscribe((snapshot) => {
      if (snapshot.hydrated && snapshot.isAuthenticated) {
        scheduleReconcile();
      }
    });

    const unsubscribeNetwork = networkManager.subscribe((snapshot) => {
      if (isNetworkUsable(snapshot)) {
        scheduleFlush();
      }

      const becameForeground =
        snapshot.appLifecycle === "active" && previousLifecycle !== "active";

      previousLifecycle = snapshot.appLifecycle;

      if (becameForeground && sessionManager.getSnapshot().isAuthenticated) {
        scheduleReconcile();
      }
    });

    return () => {
      unsubscribeSession();
      unsubscribeNetwork();
    };
  },
});
