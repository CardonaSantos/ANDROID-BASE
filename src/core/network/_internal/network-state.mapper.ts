import {
  NetInfoStateType,
  type NetInfoState,
} from "@react-native-community/netinfo";

import type {
  AppLifecycleStatus,
  InternetReachabilityStatus,
  NetworkConnectionStatus,
  NetworkConnectionType,
} from "../network.types";

import type { AppStateStatus } from "react-native";

export interface MappedNetworkState {
  connectionStatus: NetworkConnectionStatus;

  internetStatus: InternetReachabilityStatus;

  connectionType: NetworkConnectionType;

  isConnectionExpensive: boolean | null;
}

export function mapNetInfoState(state: NetInfoState): MappedNetworkState {
  const connectionType = mapConnectionType(state.type);

  const connectionStatus = mapConnectionStatus(state);

  const internetStatus = mapInternetStatus(state, connectionStatus);

  return {
    connectionStatus,
    internetStatus,
    connectionType,
    isConnectionExpensive: getIsConnectionExpensive(state),
  };
}

export function mapAppState(
  state: AppStateStatus | null | undefined,
): AppLifecycleStatus {
  switch (state) {
    case "active":
      return "active";

    case "inactive":
      return "inactive";

    case "background":
      return "background";

    default:
      return "unknown";
  }
}

function mapConnectionStatus(state: NetInfoState): NetworkConnectionStatus {
  /*
   * `unknown` means the library
   * has not determined the network
   * state yet.
   *
   * Do not interpret transient
   * false/null values as offline
   * while type is unknown.
   */
  if (state.type === NetInfoStateType.unknown) {
    return "unknown";
  }

  if (state.type === NetInfoStateType.none || state.isConnected === false) {
    return "disconnected";
  }

  if (state.isConnected === true) {
    return "connected";
  }

  return "unknown";
}

function mapInternetStatus(
  state: NetInfoState,
  connectionStatus: NetworkConnectionStatus,
): InternetReachabilityStatus {
  if (connectionStatus === "disconnected") {
    return "unreachable";
  }

  if (connectionStatus === "unknown") {
    return "unknown";
  }

  if (state.isInternetReachable === true) {
    return "reachable";
  }

  if (state.isInternetReachable === false) {
    return "unreachable";
  }

  return "unknown";
}

function mapConnectionType(type: NetInfoStateType): NetworkConnectionType {
  switch (type) {
    case NetInfoStateType.none:
      return "none";

    case NetInfoStateType.cellular:
      return "cellular";

    case NetInfoStateType.wifi:
      return "wifi";

    case NetInfoStateType.bluetooth:
      return "bluetooth";

    case NetInfoStateType.ethernet:
      return "ethernet";

    case NetInfoStateType.wimax:
      return "wimax";

    case NetInfoStateType.vpn:
      return "vpn";

    case NetInfoStateType.other:
      return "other";

    case NetInfoStateType.unknown:
    default:
      return "unknown";
  }
}

function getIsConnectionExpensive(state: NetInfoState): boolean | null {
  const { details } = state;

  if (!details || !("isConnectionExpensive" in details)) {
    return null;
  }

  return typeof details.isConnectionExpensive === "boolean"
    ? details.isConnectionExpensive
    : null;
}
