import { useEffect, type PropsWithChildren } from "react";

import { AppNotificationNavigationRuntime } from "./notification/AppNotificationNavigationRuntime";

import { appPushRegistrationRuntime } from "./notification/app-push-registration.runtime";

import { appRealtimeFeatureRuntime } from "./realtime/app-realtime-feature.runtime";

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

  return (
    <>
      {/*
       * Navegación provocada por interacción con
       * notificaciones push.
       *
       * No renderiza UI.
       */}
      <AppNotificationNavigationRuntime />

      {children}
    </>
  );
}
