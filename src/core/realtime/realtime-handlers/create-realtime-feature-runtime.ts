import type {
  CreateRealtimeFeatureRuntimeOptions,
  RealtimeFeatureRuntime,
} from "./realtime-handlers.types";

export function createRealtimeFeatureRuntime(
  options:
    CreateRealtimeFeatureRuntimeOptions,
): RealtimeFeatureRuntime {
  const bindings = [
    ...options.bindings,
  ];

  let consumers =
    0;

  let releases:
    Array<() => void> = [];

  function attach(): void {
    const attached:
      Array<() => void> = [];

    try {
      for (
        const binding of
        bindings
      ) {
        attached.push(
          binding.start(),
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

  function detach(): void {
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

      if (consumers === 0) {
        detach();
      }
    };
  }

  return Object.freeze({
    start,
  });
}
