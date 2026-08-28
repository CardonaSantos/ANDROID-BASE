import {
  AppError,
} from "@/core/errors";

import {
  realtimeClient,
} from "@/core/realtime";

import type {
  CreateRealtimeFeatureBindingOptions,
  RealtimeFeatureBinding,
  RealtimeFeatureHandlerDefinition,
} from "./realtime-handlers.types";

function assertHandlerDefinition(
  definition:
    RealtimeFeatureHandlerDefinition,
): void {
  if (
    definition.type.trim().length ===
    0
  ) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code:
        "REALTIME_FEATURE_EVENT_TYPE_EMPTY",

      message:
        "Realtime feature event type cannot be empty.",
    });
  }
}

export function createRealtimeFeatureBinding(
  options:
    CreateRealtimeFeatureBindingOptions,
): RealtimeFeatureBinding {
  const handlers = [
    ...options.handlers,
  ];

  for (
    const definition of
    handlers
  ) {
    assertHandlerDefinition(
      definition,
    );
  }

  let consumers =
    0;

  let releases:
    (() => void)[] =
    [];

  function reportError(
    error: unknown,
    event: Parameters<
      RealtimeFeatureHandlerDefinition["handle"]
    >[0],
  ): void {
    if (!options.onError) {
      return;
    }

    try {
      options.onError(
        error,
        event,
      );
    } catch {
      /*
       * Error reporting must never
       * break Realtime dispatch.
       */
    }
  }

  function attach():
    void {
    const attached:
      (() => void)[] =
      [];

    try {
      for (
        const definition of
        handlers
      ) {
        const release =
          realtimeClient.subscribe(
            definition.type,
            (event) => {
              void Promise.resolve()
                .then(() =>
                  definition.handle(
                    event,
                  ),
                )
                .catch(
                  (
                    error:
                      unknown,
                  ) => {
                    reportError(
                      error,
                      event,
                    );
                  },
                );
            },
          );

        attached.push(
          release,
        );
      }

      releases =
        attached;
    } catch (error) {
      for (
        const release of
        attached.reverse()
      ) {
        release();
      }

      throw error;
    }
  }

  function detach():
    void {
    for (
      const release of
      releases.reverse()
    ) {
      release();
    }

    releases =
      [];
  }

  function start():
    () => void {
    consumers +=
      1;

    if (consumers === 1) {
      try {
        attach();
      } catch (error) {
        consumers =
          0;

        detach();

        throw error;
      }
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

      if (
        consumers === 0
      ) {
        detach();
      }
    };
  }

  return Object.freeze({
    start,
  });
}
