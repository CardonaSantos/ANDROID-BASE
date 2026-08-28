import {
  useEffect,
  type PropsWithChildren,
} from "react";

import {
  appRealtimeFeatureRuntime,
} from "./realtime/app-realtime-feature.runtime";

export function AppApplicationRuntime({
  children,
}: PropsWithChildren) {
  useEffect(() => {
    const release =
      appRealtimeFeatureRuntime.start();

    return release;
  }, []);

  return <>{children}</>;
}
