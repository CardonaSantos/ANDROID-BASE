import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';

export const appFontAssets = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} as const;

/**
 * Call once near the application root.
 *
 * Keep the splash screen visible until `loaded` is true.
 */
export const useAppFonts = () => useFonts(appFontAssets);
