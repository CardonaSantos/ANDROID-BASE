import {
  authSessionCoordinator,
} from "@/core/auth";

import {
  isAppError,
  toAppError,
} from "@/core/errors";

import {
  queryRuntime,
} from "@/core/query";

import {
  realtimeRuntime,
} from "@/core/realtime";

import {
  sessionManager,
} from "@/core/session";

import {
  appCoreStore,
  toAppCoreSnapshot,
} from "./_internal/app-core.store";

import type {
  AppCoreSnapshot,
} from "./app-core.types";

let consumers =
  0;

let lifecycleVersion =
  0;

let releaseQueryRuntime:
  (() => void) | null =
  null;

let releaseRealtimeRuntime:
  (() => void) | null =
  null;

function getSnapshot():
  AppCoreSnapshot {
  return toAppCoreSnapshot(
    appCoreStore.getState(),
  );
}

function subscribe(
  listener: (
    snapshot:
      AppCoreSnapshot,
  ) => void,
): () => void {
  return appCoreStore.subscribe(
    (state) => {
      listener(
        toAppCoreSnapshot(
          state,
        ),
      );
    },
  );
}

function setBooting():
  void {
  appCoreStore.setState({
    status:
      "booting",

    error:
      null,
  });
}

function setReady():
  void {
  appCoreStore.setState({
    status:
      "ready",

    error:
      null,
  });
}

function setIdle():
  void {
  appCoreStore.setState({
    status:
      "idle",

    error:
      null,
  });
}

function setError(
  error:
    ReturnType<
      typeof toAppError
    >,
): void {
  appCoreStore.setState({
    status:
      "error",

    error,
  });
}

function teardownRuntimes():
  void {
  releaseRealtimeRuntime?.();

  releaseRealtimeRuntime =
    null;

  releaseQueryRuntime?.();

  releaseQueryRuntime =
    null;
}

function normalizeBootstrapError(
  cause: unknown,
) {
  if (isAppError(cause)) {
    return cause;
  }

  return toAppError(
    cause,
    {
      kind: "unknown",

      source:
        "application",

      code:
        "APP_CORE_BOOTSTRAP_FAILED",

      message:
        "Unable to initialize application core.",
    },
  );
}

function isCurrentLifecycle(
  version: number,
): boolean {
  return (
    version ===
      lifecycleVersion &&
    consumers > 0
  );
}

async function bootstrap(
  version: number,
): Promise<void> {
  setBooting();

  try {
    releaseQueryRuntime =
      queryRuntime.start();

    await sessionManager.hydrate();

    /*
     * The runtime may have been
     * released while Session was
     * hydrating.
     */
    if (
      !isCurrentLifecycle(
        version,
      )
    ) {
      return;
    }

    /*
     * A persisted refresh-token
     * session is restored before
     * Realtime starts, so transports
     * never boot with a stale or
     * missing access token.
     */
    await authSessionCoordinator.restore();

    if (
      !isCurrentLifecycle(
        version,
      )
    ) {
      return;
    }

    releaseRealtimeRuntime =
      realtimeRuntime.start();

    if (
      !isCurrentLifecycle(
        version,
      )
    ) {
      return;
    }

    setReady();
  } catch (cause) {
    /*
     * Ignore failures belonging
     * to an obsolete runtime cycle.
     */
    if (
      !isCurrentLifecycle(
        version,
      )
    ) {
      return;
    }

    teardownRuntimes();

    setError(
      normalizeBootstrapError(
        cause,
      ),
    );
  }
}

function start():
  () => void {
  consumers +=
    1;

  if (consumers === 1) {
    lifecycleVersion +=
      1;

    const version =
      lifecycleVersion;

    void bootstrap(
      version,
    );
  }

  let released =
    false;

  return () => {
    if (released) {
      return;
    }

    released =
      true;

    consumers =
      Math.max(
        0,
        consumers - 1,
      );

    if (consumers !== 0) {
      return;
    }

    /*
     * Invalidates any async
     * bootstrap still in progress.
     */
    lifecycleVersion +=
      1;

    teardownRuntimes();

    setIdle();
  };
}

function retry():
  void {
  if (consumers === 0) {
    return;
  }

  if (
    appCoreStore.getState()
      .status !== "error"
  ) {
    return;
  }

  lifecycleVersion +=
    1;

  teardownRuntimes();

  const version =
    lifecycleVersion;

  void bootstrap(
    version,
  );
}

export const appCoreRuntime =
  Object.freeze({
    start,

    retry,

    getSnapshot,

    subscribe,
  });
