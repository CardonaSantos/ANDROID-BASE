import { useStore } from "zustand";

import { networkStore } from "./_internal/network.store";

export function useConnectionStatus() {
  return useStore(networkStore, (state) => state.connectionStatus);
}

export function useInternetStatus() {
  return useStore(networkStore, (state) => state.internetStatus);
}

export function useConnectionType() {
  return useStore(networkStore, (state) => state.connectionType);
}

export function useIsConnectionExpensive() {
  return useStore(networkStore, (state) => state.isConnectionExpensive);
}

export function useAppLifecycle() {
  return useStore(networkStore, (state) => state.appLifecycle);
}

export function useIsForeground(): boolean {
  return useStore(networkStore, (state) => state.appLifecycle === "active");
}

export function useIsOffline(): boolean {
  return useStore(
    networkStore,
    (state) =>
      state.connectionStatus === "disconnected" ||
      state.internetStatus === "unreachable",
  );
}

export function useIsNetworkUsable(): boolean {
  return useStore(
    networkStore,
    (state) =>
      state.connectionStatus === "connected" &&
      state.internetStatus !== "unreachable",
  );
}

export function useNetworkInitialized(): boolean {
  return useStore(
    networkStore,
    (state) => state.connectivityInitialized && state.lifecycleInitialized,
  );
}
