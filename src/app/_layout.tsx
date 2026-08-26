import '@/design-system/bootstrap';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useUnistyles } from 'react-native-unistyles';

import {
  AppDesignSystemProvider,
  useAppFonts,
} from '@/design-system';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] =
    useAppFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppDesignSystemProvider>
      <AppRootNavigation />
    </AppDesignSystemProvider>
  );
}

function AppRootNavigation() {
  const { theme } = useUnistyles();

  return (
    <>
      <StatusBar
        style={
          theme.isDark
            ? 'light'
            : 'dark'
        }
      />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
