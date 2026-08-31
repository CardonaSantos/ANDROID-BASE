import {
  appNavigationRoutes,
  type AppNavigationRoute,
} from "./app-navigation.routes";

/*
 * =========================================================
 * PATH NORMALIZATION
 * =========================================================
 */

function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withoutTrailingSlashes = trimmed.replace(/\/+$/, "");

  return withoutTrailingSlashes || "/";
}

/*
 * =========================================================
 * ROLE ACCESS
 * =========================================================
 */

export function canAccessNavigationRoute(
  route: AppNavigationRoute,
  roles: readonly string[],
): boolean {
  /*
   * Una ruta sin roles explícitos puede
   * ser utilizada por cualquier usuario
   * autenticado.
   */
  if (!route.roles || route.roles.length === 0) {
    return true;
  }

  return route.roles.some((requiredRole) => roles.includes(requiredRole));
}

/*
 * =========================================================
 * ACCESSIBLE ROUTES
 * =========================================================
 *
 * Incluye tanto:
 *
 * - rutas del sidebar
 * - rutas hidden
 *
 * Esto es importante porque el Shell
 * necesita reconocer /perfil para poder
 * resolver correctamente el título del
 * toolbar.
 */

export function getAvailableNavigationRoutes(
  roles: readonly string[],
): readonly AppNavigationRoute[] {
  return appNavigationRoutes.filter((route) =>
    canAccessNavigationRoute(route, roles),
  );
}

/*
 * =========================================================
 * SIDEBAR ROUTES
 * =========================================================
 *
 * Aquí sí filtramos placement="sidebar".
 *
 * De esta forma /perfil puede existir y
 * ser reconocida por el Shell sin aparecer
 * duplicada en la navegación principal.
 */

export function getSidebarNavigationRoutes(
  roles: readonly string[],
): readonly AppNavigationRoute[] {
  return getAvailableNavigationRoutes(roles).filter(
    (route) => route.placement === "sidebar",
  );
}

/*
 * =========================================================
 * ACTIVE ROUTE
 * =========================================================
 */

export function isNavigationRouteActive(
  route: AppNavigationRoute,
  pathname: string,
): boolean {
  const normalizedPathname = normalizePathname(pathname);

  const normalizedHref = normalizePathname(route.href);

  /*
   * Dashboard necesita coincidencia exacta.
   *
   * De lo contrario "/" coincidiría con
   * cualquier ruta de la aplicación.
   */
  if (route.match === "exact") {
    return normalizedPathname === normalizedHref;
  }

  /*
   * Para rutas prefix exigimos una frontera
   * real de segmento:
   *
   * /tickets       ✓
   * /tickets/15    ✓
   * /tickets-old   ✗
   */
  return (
    normalizedPathname === normalizedHref ||
    normalizedPathname.startsWith(`${normalizedHref}/`)
  );
}
