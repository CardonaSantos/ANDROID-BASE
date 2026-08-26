# NOVA Foundation v3 — Accessibility

## Added

### Accessibility tokens
- WCAG 2.2 AA contrast baselines
- focus-ring dimensions
- Dynamic Type/font-scaling policy
- announcement dedupe timing
- touch-target reuse from interaction policy

### Runtime accessibility preferences
- screen reader
- accessibility service (Android)
- reduced motion
- reduced transparency (iOS)
- high text contrast (Android)
- darker system colors (iOS)
- combined increased-contrast signal
- bold text (iOS)
- invert colors (iOS)
- grayscale (iOS)
- cross-fade preference (iOS)
- AppState refresh for settings without change events

### Semantics
- centralized accessibility state builder
- range/value builder
- role policy
- label normalization
- required-label developer warning for future icon-only controls

### Focus
- current `sendAccessibilityEvent(target, 'focus')` API
- intentionally avoids deprecated `setAccessibilityFocus`

### Announcements
- polite/assertive semantic API
- iOS queue handling
- duplicate-message suppression

### Timeouts
- Android `getRecommendedTimeoutMillis`
- safe fallback on other platforms

### Contrast
- WCAG relative luminance utility
- contrast ratio calculation
- AA threshold validation helper

### Live regions
- NOVA `off / polite / assertive` semantic mapper

## Updated
- themes expose `theme.accessibility`
- semantic colors now include `focusRing`
- design-system root exports accessibility foundation
- token barrel exports accessibility tokens

## Dependencies

No dependency added.

Uses React Native 0.86 built-in accessibility APIs.
