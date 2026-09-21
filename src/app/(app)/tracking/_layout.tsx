import { Redirect, Slot } from "expo-router";

import { RouteAccessBoundary } from "@/core/routing";

export default function TrackingLayout() {
  return (
    <RouteAccessBoundary
      requirement={{
        roles: ["TECNICO", "COBRADOR", "ADMIN", "SUPER_ADMIN"],

        roleMatch: "any",
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
