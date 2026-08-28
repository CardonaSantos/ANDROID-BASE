import { Redirect, Slot } from "expo-router";

import { RouteAccessBoundary } from "@/core/routing";

export default function TrackingLayout() {
  return (
    <RouteAccessBoundary
      requirement={{
        roles: ["TECNICO"],
      }}
      checkingFallback={null}
      unauthenticatedFallback={<Redirect href="/login" />}
      forbiddenFallback={<Redirect href="/" />}
      errorFallback={<Redirect href="/" />}
    >
      <Slot />
    </RouteAccessBoundary>
  );
}
