export { networkManager } from "./network.manager";

export { networkRuntime } from "./network.runtime";

export {
  isAppForeground,
  isNetworkOffline,
  isNetworkUsable,
} from "./network.utils";

export {
  useAppLifecycle,
  useConnectionStatus,
  useConnectionType,
  useInternetStatus,
  useIsConnectionExpensive,
  useIsForeground,
  useIsNetworkUsable,
  useIsOffline,
  useNetworkInitialized,
} from "./network.hooks";

export type {
  AppLifecycleStatus,
  InternetReachabilityStatus,
  NetworkConnectionStatus,
  NetworkConnectionType,
  NetworkSnapshot,
} from "./network.types";
