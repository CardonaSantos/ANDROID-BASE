import { Redirect, useRouter } from "expo-router";

import { useSessionRouteGuards } from "@/core/routing";

import { AuthenticatedAppShell } from "@/application/shell/AuthenticatedAppShell";

export default function AppLayout() {
  const router = useRouter();

  const session = useSessionRouteGuards();

  /*
   * Esperamos a que Core determine si
   * existe una sesión válida antes de
   * montar navegación autenticada.
   */
  if (!session.isSettled) {
    return null;
  }

  /*
   * Todas las rutas bajo (app) requieren
   * autenticación.
   */
  if (!session.isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <AuthenticatedAppShell
      onProfile={() => {
        router.push("/perfil");
      }}
    />
  );
}
