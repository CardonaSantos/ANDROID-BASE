import { usePathname, useRouter } from "expo-router";

import { Drawer } from "expo-router/drawer";

import { useUnistyles } from "react-native-unistyles";

import { useCurrentUserQuery } from "@/core/access";

import { useResponsiveValue } from "@/design-system";

import { AppShellTopBar } from "./AppShellTopBar";

import { AppSidebarContent } from "./AppSidebarContent";

import {
  appNavigationRoutes,
  type AppNavigationHref,
} from "./app-navigation.routes";

import {
  getAvailableNavigationRoutes,
  isNavigationRouteActive,
} from "./app-navigation.utils";

type AppShellDrawerMode = "front" | "permanent";

export interface AuthenticatedAppShellProps {
  /*
   * Todavía no hemos creado /perfil.
   *
   * Dejamos la navegación a perfil
   * inyectada hasta que exista esa ruta.
   */
  onProfile: () => void;
}

const SIDEBAR_WIDTH = 280;

export function AuthenticatedAppShell({
  onProfile,
}: AuthenticatedAppShellProps) {
  const router = useRouter();

  const pathname = usePathname();

  const { theme } = useUnistyles();

  const currentUserQuery = useCurrentUserQuery();

  const roles = currentUserQuery.data?.roles ?? [];

  /*
   * =======================================================
   * RESPONSIVE MODE
   * =======================================================
   *
   * compact  < 600   → Drawer
   * medium   < 840   → Drawer
   * expanded >= 840  → Sidebar permanente
   * wide     >= 1200 → Sidebar permanente
   *
   * Reutilizamos los breakpoints oficiales
   * del Design System.
   */
  const drawerMode = useResponsiveValue<AppShellDrawerMode>({
    compact: "front",

    medium: "front",

    expanded: "permanent",

    wide: "permanent",
  });

  const hasPermanentSidebar = drawerMode === "permanent";

  /*
   * =======================================================
   * ACTIVE ROUTE
   * =======================================================
   */

  const availableRoutes = getAvailableNavigationRoutes(roles);

  const activeRoute = availableRoutes.find((route) =>
    isNavigationRouteActive(route, pathname),
  );

  const currentTitle = activeRoute?.label ?? "NOVA";

  /*
   * =======================================================
   * NAVIGATION
   * =======================================================
   */

  const navigateTo = (href: AppNavigationHref) => {
    const targetRoute = appNavigationRoutes.find(
      (route) => route.href === href,
    );

    /*
     * Si el usuario toca la sección
     * donde ya se encuentra, no creamos
     * otra entrada innecesaria en el
     * historial.
     */
    if (targetRoute && isNavigationRouteActive(targetRoute, pathname)) {
      return;
    }

    router.push(href);
  };

  return (
    <Drawer
      /*
       * El contenido del Drawer es
       * completamente nuestro.
       *
       * No utilizamos DrawerItemList
       * porque las reglas por rol y el
       * estado activo pertenecen al Shell.
       */
      drawerContent={(props) => (
        <AppSidebarContent
          roles={roles}
          pathname={pathname}
          onRoutePress={(href) => {
            navigateTo(href);

            /*
             * En móvil cerramos el Drawer
             * después de navegar.
             *
             * En modo permanent no hace
             * falta cerrar nada.
             */
            if (!hasPermanentSidebar) {
              props.navigation.closeDrawer();
            }
          }}
        />
      )}
      screenOptions={{
        /*
         * =================================
         * DRAWER
         * =================================
         */

        drawerPosition: "left",

        drawerType: drawerMode,

        swipeEnabled: !hasPermanentSidebar,

        drawerStyle: {
          width: SIDEBAR_WIDTH,

          backgroundColor: theme.colors.surface,
        },

        overlayColor: theme.colors.scrim,

        /*
         * =================================
         * TOOLBAR
         * =================================
         */

        headerShown: true,

        header: ({ navigation }) => (
          <AppShellTopBar
            title={currentTitle}
            showMenuButton={!hasPermanentSidebar}
            onMenuPress={
              hasPermanentSidebar
                ? undefined
                : () => {
                    navigation.openDrawer();
                  }
            }
            onProfile={onProfile}
          />
        ),
      }}
    />
  );
}
