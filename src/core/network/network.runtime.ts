import NetInfo from "@react-native-community/netinfo";

import { AppState, type NativeEventSubscription } from "react-native";

import { toAppError } from "@/core/errors";

import { applyAppState, applyNetInfoState } from "./_internal/network.store";

let consumers = 0;

let unsubscribeNetInfo: (() => void) | null = null;

let appStateSubscription: NativeEventSubscription | null = null;

function attach(): void {
  applyAppState(AppState.currentState);

  appStateSubscription = AppState.addEventListener("change", applyAppState);

  unsubscribeNetInfo = NetInfo.addEventListener(applyNetInfoState);
}

function detach(): void {
  unsubscribeNetInfo?.();

  unsubscribeNetInfo = null;

  appStateSubscription?.remove();

  appStateSubscription = null;
}

function start(): () => void {
  consumers += 1;

  if (consumers === 1) {
    try {
      attach();
    } catch (cause) {
      consumers = 0;

      detach();

      throw toAppError(cause, {
        kind: "network",
        source: "network",

        code: "NETWORK_RUNTIME_START_FAILED",

        message: "Unable to initialize network monitoring.",
      });
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

export const networkRuntime = Object.freeze({
  start,
});
