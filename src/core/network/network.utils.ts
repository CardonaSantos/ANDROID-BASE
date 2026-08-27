import type { NetworkSnapshot } from "./network.types";

export function isNetworkOffline(network: NetworkSnapshot): boolean {
  return (
    network.connectionStatus === "disconnected" ||
    network.internetStatus === "unreachable"
  );
}

export function isNetworkUsable(network: NetworkSnapshot): boolean {
  return (
    network.connectionStatus === "connected" &&
    network.internetStatus !== "unreachable"
  );
}

export function isAppForeground(network: NetworkSnapshot): boolean {
  return network.appLifecycle === "active";
}
