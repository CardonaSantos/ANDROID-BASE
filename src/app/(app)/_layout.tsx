import { Redirect, Slot } from "expo-router";

import { useSessionRouteGuards } from "@/core/routing";

export default function AppLayout() {
  const session = useSessionRouteGuards();

  if (!session.isSettled) {
    return null;
  }

  if (!session.isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
