import {
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import {
  createRealtimeFeatureRuntime,
} from "@/core/realtime/realtime-handlers/create-realtime-feature-runtime";

import type {
  RealtimeFeatureBinding,
} from "@/core/realtime/realtime-handlers/realtime-handlers.types";

function createBinding(
  onStart:
    () => () => void,
): RealtimeFeatureBinding {
  return {
    start:
      onStart,
  };
}

describe("createRealtimeFeatureRuntime", () => {
  test("starts every binding once for the first consumer", () => {
    const releaseA =
      jest.fn();

    const releaseB =
      jest.fn();

    const startA =
      jest.fn(
        () => releaseA,
      );

    const startB =
      jest.fn(
        () => releaseB,
      );

    const runtime =
      createRealtimeFeatureRuntime({
        bindings: [
          createBinding(
            startA,
          ),

          createBinding(
            startB,
          ),
        ],
      });

    const releaseRuntime =
      runtime.start();

    expect(
      startA,
    ).toHaveBeenCalledTimes(1);

    expect(
      startB,
    ).toHaveBeenCalledTimes(1);

    releaseRuntime();

    expect(
      releaseA,
    ).toHaveBeenCalledTimes(1);

    expect(
      releaseB,
    ).toHaveBeenCalledTimes(1);
  });

  test("multiple consumers share the same binding lifecycle", () => {
    const releaseBinding =
      jest.fn();

    const startBinding =
      jest.fn(
        () =>
          releaseBinding,
      );

    const runtime =
      createRealtimeFeatureRuntime({
        bindings: [
          createBinding(
            startBinding,
          ),
        ],
      });

    const releaseA =
      runtime.start();

    const releaseB =
      runtime.start();

    expect(
      startBinding,
    ).toHaveBeenCalledTimes(1);

    releaseA();

    expect(
      releaseBinding,
    ).not.toHaveBeenCalled();

    releaseB();

    expect(
      releaseBinding,
    ).toHaveBeenCalledTimes(1);
  });

  test("a consumer release is idempotent", () => {
    const releaseBinding =
      jest.fn();

    const runtime =
      createRealtimeFeatureRuntime({
        bindings: [
          createBinding(
            () =>
              releaseBinding,
          ),
        ],
      });

    const release =
      runtime.start();

    release();
    release();

    expect(
      releaseBinding,
    ).toHaveBeenCalledTimes(1);
  });

  test("releases bindings in reverse attachment order", () => {
    const releaseOrder:
      string[] = [];

    const runtime =
      createRealtimeFeatureRuntime({
        bindings: [
          createBinding(
            () => () => {
              releaseOrder.push(
                "A",
              );
            },
          ),

          createBinding(
            () => () => {
              releaseOrder.push(
                "B",
              );
            },
          ),

          createBinding(
            () => () => {
              releaseOrder.push(
                "C",
              );
            },
          ),
        ],
      });

    const release =
      runtime.start();

    release();

    expect(
      releaseOrder,
    ).toEqual([
      "C",
      "B",
      "A",
    ]);
  });

  test("rolls back already attached bindings when startup fails", () => {
    const releaseA =
      jest.fn();

    const startA =
      jest.fn(
        () => releaseA,
      );

    const startupError =
      new Error(
        "binding failed",
      );

    const startB =
      jest.fn(() => {
        throw startupError;
      });

    const runtime =
      createRealtimeFeatureRuntime({
        bindings: [
          createBinding(
            startA,
          ),

          createBinding(
            startB,
          ),
        ],
      });

    expect(
      () =>
        runtime.start(),
    ).toThrow(
      startupError,
    );

    expect(
      releaseA,
    ).toHaveBeenCalledTimes(1);
  });
});
