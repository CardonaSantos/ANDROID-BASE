import { Redirect, Slot } from "expo-router";

import { useSessionRouteGuards } from "@/core/routing";

export default function AuthLayout() {
  const session = useSessionRouteGuards();

  if (!session.isSettled) {
    return null;
  }

  if (session.isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
