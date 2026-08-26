# NOVA Foundation v3.2 — React Native 0.86.2 AccessibilityInfo compatibility

v3.2 supersedes v3.1.

## Fixed

React Native 0.86.2 exposes:

```ts
AccessibilityInfo.isAccessibilityServiceEnabled()
```

but the shipped TypeScript union for `AccessibilityChangeEventName` does not
include:

```ts
'accessibilityServiceChanged'
```

The foundation no longer attempts to subscribe to that event.

Instead, `accessibilityServiceEnabled` is reconciled through the existing
`refresh()` flow:
- on store startup,
- when the app returns to the foreground.

Supported 0.86.2 listeners remain event-driven, including:
- `screenReaderChanged`
- `reduceMotionChanged`
- `highTextContrastChanged`
- `darkerSystemColorsChanged`
- `reduceTransparencyChanged`
- `boldTextChanged`
- `invertColorsChanged`
- `grayscaleChanged`

No `any`, unsafe cast, module augmentation, or dependency change is used.
