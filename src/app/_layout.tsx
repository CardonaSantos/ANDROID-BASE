import "@/design-system/bootstrap";

import { useEffect, useMemo, useRef } from "react";

import { View } from "react-native";

import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { StatusBar } from "expo-status-bar";

import { useUnistyles } from "react-native-unistyles";

import { AppApplicationRuntime } from "@/application";

import {
  AppCoreProvider,
  useAppCoreStatus,
  type AppCoreErrorFallbackProps,
} from "@/core/app";

import { useIsOffline, useNetworkInitialized } from "@/core/network";

import {
  useAppPreferencesHydrationStatus,
  useThemePreference,
} from "@/core/preferences";

import {
  AppConnectivityBanner,
  AppDesignSystemProvider,
  AppErrorState,
  themeController,
  useAppFonts,
} from "@/design-system";

void SplashScreen.preventAutoHideAsync();

function renderAppCoreError({ error, retry }: AppCoreErrorFallbackProps) {
  return (
    <AppErrorState
      fill
      title="Unable to start the application"
      description={error.message}
      primaryAction={{
        label: "Retry",

        onPress: retry,
      }}
    />
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();

  const appCoreStatus = useAppCoreStatus();

  const preferencesHydrationStatus = useAppPreferencesHydrationStatus();

  const themePreference = useThemePreference();

  const splashHiddenRef = useRef(false);

  const fontsSettled = fontsLoaded || Boolean(fontError);

  const preferencesSettled = preferencesHydrationStatus !== "hydrating";

  const appCoreSettled = appCoreStatus === "ready" || appCoreStatus === "error";

  useEffect(() => {
    if (!preferencesSettled) {
      return;
    }

    themeController.setPreference(themePreference);
  }, [preferencesSettled, themePreference]);

  useEffect(() => {
    if (
      splashHiddenRef.current ||
      !fontsSettled ||
      !preferencesSettled ||
      !appCoreSettled
    ) {
      return;
    }

    splashHiddenRef.current = true;

    SplashScreen.hide();
  }, [appCoreSettled, fontsSettled, preferencesSettled]);

  if (!fontsSettled) {
    return null;
  }

  return (
    <AppDesignSystemProvider>
      <AppCoreProvider loadingFallback={null} renderError={renderAppCoreError}>
        <AppApplicationRuntime>
          <AppRoot />
        </AppApplicationRuntime>
      </AppCoreProvider>
    </AppDesignSystemProvider>
  );
}

function AppRoot() {
  const { theme } = useUnistyles();

  const networkInitialized = useNetworkInitialized();

  const isOffline = useIsOffline();

  /*
   * React Navigation tiene su propio theme.
   *
   * Expo Router administra internamente el
   * NavigationContainer, por lo que debemos
   * proporcionarle el tema mediante
   * ThemeProvider.
   *
   * No usamos simplemente DarkTheme o
   * DefaultTheme: conservamos su estructura
   * y sustituimos sus colores por nuestros
   * tokens semánticos NOVA.
   */
  const navigationTheme = useMemo(() => {
    const baseTheme = theme.isDark ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,

      dark: theme.isDark,

      colors: {
        ...baseTheme.colors,

        primary: theme.colors.primary,

        background: theme.colors.background,

        card: theme.colors.surface,

        text: theme.colors.text,

        border: theme.colors.border,

        notification: theme.colors.danger,
      },
    };
  }, [theme]);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <View
        style={{
          flex: 1,

          minHeight: 0,

          width: "100%",

          backgroundColor: theme.colors.background,
        }}
      >
        {networkInitialized ? (
          <AppConnectivityBanner
            status={isOffline ? "offline" : "online"}
            hiddenWhenOnline
          />
        ) : null}

        <View
          style={{
            flex: 1,

            minHeight: 0,

            width: "100%",
          }}
        >
          <Slot />
        </View>
      </View>
    </ThemeProvider>
  );
}
