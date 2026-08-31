import { ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StyleSheet } from "react-native-unistyles";

import {
  AppDivider,
  AppIcon,
  AppInline,
  AppPressable,
  AppStack,
  AppText,
} from "@/design-system";

import type { AppNavigationHref } from "./app-navigation.routes";

import {
  getSidebarNavigationRoutes,
  isNavigationRouteActive,
} from "./app-navigation.utils";

export interface AppSidebarContentProps {
  roles: readonly string[];

  pathname: string;

  onRoutePress: (href: AppNavigationHref) => void;
}

export function AppSidebarContent({
  roles,
  pathname,
  onRoutePress,
}: AppSidebarContentProps) {
  /*
   * Importante:
   *
   * El Shell conoce más rutas que el Sidebar.
   *
   * Ejemplo:
   *
   * /perfil
   *
   * existe dentro de appNavigationRoutes para
   * resolver títulos y navegación, pero tiene
   * placement="hidden", por lo que NO debe
   * aparecer aquí.
   */
  const routes = getSidebarNavigationRoutes(roles);

  return (
    <SafeAreaView edges={["top", "bottom", "left"]} style={styles.safeArea}>
      <View style={styles.root}>
        {/* ===================================== */}
        {/* BRAND */}
        {/* ===================================== */}

        <View style={styles.header}>
          <AppStack gap="xxs">
            <AppText variant="titleMedium" weight="bold" colorToken="primary">
              NOVA
            </AppText>

            <AppText variant="caption" tone="secondary">
              Operaciones
            </AppText>
          </AppStack>
        </View>

        <AppDivider />

        {/* ===================================== */}
        {/* NAVIGATION */}
        {/* ===================================== */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AppStack gap="sm">
            <AppText
              variant="labelSmall"
              tone="muted"
              style={styles.sectionLabel}
            >
              SECCIONES
            </AppText>

            <AppStack gap="xs">
              {routes.map((route) => {
                const active = isNavigationRouteActive(route, pathname);

                return (
                  <AppPressable
                    key={route.key}
                    accessibilityRole="link"
                    accessibilityLabel={route.label}
                    accessibilityState={{
                      selected: active,
                    }}
                    interaction="subtle"
                    haptic="selection"
                    touchTarget="minimum"
                    radius="md"
                    stateLayerColorToken={active ? "primaryStrong" : "text"}
                    style={styles.navigationItem(active)}
                    onPress={() => {
                      onRoutePress(route.href);
                    }}
                  >
                    <AppInline gap="md" align="center">
                      <View style={styles.iconSlot(active)}>
                        <AppIcon
                          icon={route.icon}
                          size="md"
                          colorToken={
                            active ? "onPrimaryContainer" : "textSecondary"
                          }
                          decorative
                        />
                      </View>

                      <AppText
                        variant="bodyMedium"
                        weight={active ? "semibold" : "medium"}
                        colorToken={active ? "onPrimaryContainer" : "text"}
                        numberOfLines={1}
                        style={styles.navigationLabel}
                      >
                        {route.label}
                      </AppText>
                    </AppInline>
                  </AppPressable>
                );
              })}
            </AppStack>
          </AppStack>
        </ScrollView>

        {/* ===================================== */}
        {/* FOOTER */}
        {/* ===================================== */}

        <AppDivider />

        <View style={styles.footer}>
          <AppText variant="caption" tone="muted">
            NOVA CRM
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,

    backgroundColor: theme.colors.surface,
  },

  root: {
    flex: 1,

    minHeight: 0,

    backgroundColor: theme.colors.surface,

    borderRightWidth: 1,

    borderRightColor: theme.colors.divider,
  },

  header: {
    minHeight: 72,

    justifyContent: "center",

    paddingHorizontal: theme.spacing.lg,

    paddingVertical: theme.spacing.md,
  },

  scroll: {
    flex: 1,

    minHeight: 0,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.sm,

    paddingTop: theme.spacing.md,

    paddingBottom: theme.spacing.lg,
  },

  sectionLabel: {
    paddingHorizontal: theme.spacing.sm,
  },

  navigationItem: (active: boolean) => ({
    width: "100%",

    justifyContent: "center",

    paddingHorizontal: theme.spacing.sm,

    paddingVertical: theme.spacing.xs,

    borderRadius: theme.radius.md,

    backgroundColor: active ? theme.colors.primaryContainer : "transparent",
  }),

  iconSlot: (active: boolean) => ({
    width: 32,

    height: 32,

    flexShrink: 0,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: theme.radius.sm,

    backgroundColor: active
      ? theme.colors.primaryContainer
      : theme.colors.surfaceSecondary,
  }),

  navigationLabel: {
    minWidth: 0,

    flex: 1,
  },

  footer: {
    minHeight: 48,

    justifyContent: "center",

    paddingHorizontal: theme.spacing.lg,
  },
}));
