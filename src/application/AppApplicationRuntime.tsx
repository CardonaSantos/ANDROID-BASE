import { useEffect, type PropsWithChildren } from "react";

import { appRealtimeFeatureRuntime } from "./realtime/app-realtime-feature.runtime";

import { appPushRegistrationRuntime } from "./notification/app-push-registration.runtime";
import { appTrackingFeatureRuntime } from "./tracking/app-tracking-feature.runtime";

export function AppApplicationRuntime({ children }: PropsWithChildren) {
  useEffect(() => {
    const releasePushRegistration = appPushRegistrationRuntime.start();

    const releaseRealtime = appRealtimeFeatureRuntime.start();

    const releaseTracking = appTrackingFeatureRuntime.start();

    return () => {
      releaseTracking();

      releaseRealtime();

      releasePushRegistration();
    };
  }, []);

  return <>{children}</>;
}
