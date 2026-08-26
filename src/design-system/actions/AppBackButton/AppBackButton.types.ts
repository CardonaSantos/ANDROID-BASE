import type { RoutePath } from "expo-router";

import type { AppIconButtonProps } from "../AppIconButton";

/**
 * Internal route accepted as the fallback of a Back action.
 *
 * Expo Router SDK 57 publicly exposes `RoutePath`, which represents route
 * pathnames while excluding relative and external path strings. This is a
 * tighter contract than the full `Href` model and avoids exposing href-object
 * query/hash variants in a simple Back fallback prop.
 */
export type AppBackFallbackRoute = RoutePath;

export interface AppBackButtonProps extends Omit<
  AppIconButtonProps,
  "icon" | "accessibilityLabel" | "onPress"
> {
  accessibilityLabel?: string;

  /**
   * Internal route used when the current router has no previous route.
   */
  fallbackHref?: AppBackFallbackRoute;

  fallbackMode?: "replace" | "push";

  /**
   * Complete navigation override. If supplied, router.back/fallback are not
   * executed.
   */
  onBack?: () => void;
}
