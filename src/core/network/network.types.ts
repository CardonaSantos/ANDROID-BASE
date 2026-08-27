export type NetworkConnectionStatus = "unknown" | "connected" | "disconnected";

export type InternetReachabilityStatus =
  | "unknown"
  | "reachable"
  | "unreachable";

export type NetworkConnectionType =
  | "none"
  | "unknown"
  | "cellular"
  | "wifi"
  | "bluetooth"
  | "ethernet"
  | "wimax"
  | "vpn"
  | "other";

export type AppLifecycleStatus =
  | "unknown"
  | "active"
  | "inactive"
  | "background";

export interface NetworkSnapshot {
  connectivityInitialized: boolean;

  lifecycleInitialized: boolean;

  connectionStatus: NetworkConnectionStatus;

  internetStatus: InternetReachabilityStatus;

  connectionType: NetworkConnectionType;

  isConnectionExpensive: boolean | null;

  appLifecycle: AppLifecycleStatus;
}
