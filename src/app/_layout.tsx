import '@/design-system/bootstrap';

import {
  useEffect,
} from 'react';
import {
  View,
} from 'react-native';
import {
  Slot,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  StatusBar,
} from 'expo-status-bar';
import {
  useUnistyles,
} from 'react-native-unistyles';

import {
  AppDesignSystemProvider,
  useAppFonts,
} from '@/design-system';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [
    fontsLoaded,
    fontError,
  ] = useAppFonts();

  useEffect(() => {
    if (
      fontsLoaded ||
      fontError
    ) {
      void SplashScreen.hideAsync();
    }
  }, [
    fontError,
    fontsLoaded,
  ]);

  if (
    !fontsLoaded &&
    !fontError
  ) {
    return null;
  }

  return (
    <AppDesignSystemProvider>
      <AppRoot />
    </AppDesignSystemProvider>
  );
}

function AppRoot() {
  const { theme } =
    useUnistyles();

  return (
    <>
      <StatusBar
        style={
          theme.isDark
            ? 'light'
            : 'dark'
        }
      />

      <View
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          backgroundColor:
            theme.colors
              .background,
        }}
      >
        <Slot />
      </View>
    </>
  );
}
