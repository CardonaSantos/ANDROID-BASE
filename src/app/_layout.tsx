import "@/design-system/bootstrap";

import { useEffect, useRef } from "react";

import { View } from "react-native";

import { Slot } from "expo-router";

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

  return (
    <>
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
    </>
  );
}
