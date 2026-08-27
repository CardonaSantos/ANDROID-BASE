import NetInfo from "@react-native-community/netinfo";

import { toAppError } from "@/core/errors";

import {
  applyNetInfoState,
  networkStore,
  toNetworkSnapshot,
} from "./_internal/network.store";

import type { NetworkSnapshot } from "./network.types";

function getSnapshot(): NetworkSnapshot {
  return toNetworkSnapshot(networkStore.getState());
}

function subscribe(listener: (snapshot: NetworkSnapshot) => void): () => void {
  return networkStore.subscribe((state) => {
    listener(toNetworkSnapshot(state));
  });
}

async function refreshConnectivity(): Promise<NetworkSnapshot> {
  try {
    const state = await NetInfo.refresh();

    /*
     * refresh() also notifies
     * NetInfo subscribers.
     *
     * Applying it here guarantees
     * the store is updated even if
     * the runtime is not active.
     */
    applyNetInfoState(state);

    return getSnapshot();
  } catch (cause) {
    throw toAppError(cause, {
      kind: "network",
      source: "network",

      code: "NETWORK_REFRESH_FAILED",

      message: "Unable to refresh network status.",
    });
  }
}

export const networkManager = Object.freeze({
  getSnapshot,

  subscribe,

  refreshConnectivity,
});
