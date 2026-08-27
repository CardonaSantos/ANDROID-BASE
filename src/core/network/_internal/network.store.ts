import type { AppStateStatus } from "react-native";

import type { NetInfoState } from "@react-native-community/netinfo";

import { createStore } from "zustand/vanilla";

import { mapAppState, mapNetInfoState } from "./network-state.mapper";

import type {
  AppLifecycleStatus,
  InternetReachabilityStatus,
  NetworkConnectionStatus,
  NetworkConnectionType,
  NetworkSnapshot,
} from "../network.types";

export interface NetworkInternalState {
  connectivityInitialized: boolean;

  lifecycleInitialized: boolean;

  connectionStatus: NetworkConnectionStatus;

  internetStatus: InternetReachabilityStatus;

  connectionType: NetworkConnectionType;

  isConnectionExpensive: boolean | null;

  appLifecycle: AppLifecycleStatus;
}

export const networkStore = createStore<NetworkInternalState>()(() => ({
  connectivityInitialized: false,

  lifecycleInitialized: false,

  connectionStatus: "unknown",

  internetStatus: "unknown",

  connectionType: "unknown",

  isConnectionExpensive: null,

  appLifecycle: "unknown",
}));

export function applyNetInfoState(state: NetInfoState): void {
  const mapped = mapNetInfoState(state);

  const current = networkStore.getState();

  if (
    current.connectivityInitialized &&
    current.connectionStatus === mapped.connectionStatus &&
    current.internetStatus === mapped.internetStatus &&
    current.connectionType === mapped.connectionType &&
    current.isConnectionExpensive === mapped.isConnectionExpensive
  ) {
    return;
  }

  networkStore.setState({
    connectivityInitialized: true,

    ...mapped,
  });
}

export function applyAppState(state: AppStateStatus | null | undefined): void {
  const appLifecycle = mapAppState(state);

  const initialized = appLifecycle !== "unknown";

  const current = networkStore.getState();

  if (
    current.appLifecycle === appLifecycle &&
    current.lifecycleInitialized === initialized
  ) {
    return;
  }

  networkStore.setState({
    appLifecycle,

    lifecycleInitialized: initialized,
  });
}

export function toNetworkSnapshot(
  state: NetworkInternalState,
): NetworkSnapshot {
  return {
    connectivityInitialized: state.connectivityInitialized,

    lifecycleInitialized: state.lifecycleInitialized,

    connectionStatus: state.connectionStatus,

    internetStatus: state.internetStatus,

    connectionType: state.connectionType,

    isConnectionExpensive: state.isConnectionExpensive,

    appLifecycle: state.appLifecycle,
  };
}
