import type { Href } from 'expo-router';

import type {
  AppIconButtonProps,
} from '../AppIconButton';

export interface AppBackButtonProps
  extends Omit<
    AppIconButtonProps,
    | 'icon'
    | 'accessibilityLabel'
    | 'onPress'
  > {
  accessibilityLabel?: string;

  /**
   * Used when the current router has no previous route.
   */
  fallbackHref?: Href;

  fallbackMode?: 'replace' | 'push';

  /**
   * Complete navigation override. If supplied, router.back/fallback are not
   * executed.
   */
  onBack?: () => void;
}
