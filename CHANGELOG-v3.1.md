# NOVA Foundation v3.1 — React Native 0.86 TypeScript hotfix

v3.1 supersedes v3 and remains cumulative.

## Fixed

- Removed unsafe type extraction from overloaded
  `AccessibilityInfo.addEventListener`.
- Accessibility listeners now use literal event names.
- Subscription storage now uses the common structural `.remove()` contract,
  compatible with AccessibilityInfo and AppState subscriptions.
- Added direct React Native 0.86 listeners for:
  - `highTextContrastChanged` (Android)
  - `darkerSystemColorsChanged` (iOS)
- Kept foreground reconciliation for cross-fade preference and Settings changes.
- Rewrote `light-theme.ts`, `dark-theme.ts`, and `theme.types.ts` cleanly so
  `motion`, `interaction`, and `accessibility` occur exactly once.

No dependency changes.
