import { AccessibilityInfo } from 'react-native';

export type AccessibilityFocusTarget =
  Parameters<
    typeof AccessibilityInfo.sendAccessibilityEvent
  >[0];

/**
 * Imperative accessibility focus.
 *
 * Uses the current React Native API. `setAccessibilityFocus` is intentionally
 * not used because it is deprecated.
 *
 * The target component must be accessible.
 */
export const accessibilityFocus = {
  focus(
    target: AccessibilityFocusTarget | null | undefined,
  ): void {
    if (!target) {
      return;
    }

    try {
      AccessibilityInfo.sendAccessibilityEvent(
        target,
        'focus',
      );
    } catch {
      // Focus movement is best-effort and must not crash product flows.
    }
  },
} as const;
