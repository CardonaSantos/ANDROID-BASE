# NOVA Design System — Motion, Interaction & Haptics

This layer is intentionally defined **before** `AppPressable` and reusable UI
components.

## Dependencies already used

No additional packages are required.

- `react-native-reanimated` — timing/spring/reduced-motion semantics.
- `react-native-worklets` — Reanimated runtime dependency.
- `expo-haptics` — semantic physical feedback on Android/iOS and optional Web.
- `react-native-gesture-handler` will be consumed when gesture-driven
  components are implemented.

## Motion

Components must consume:

```ts
theme.motion.duration.fast
theme.motion.spring.snappy
theme.motion.scale.pressed
```

or reusable presets:

```ts
timingPresets.standard
springPresets.snappy
```

Do not hardcode:

```ts
duration: 237
scale: 0.963
```

inside feature components.

## Performance policy

Prefer animations based on:

- `transform`
- `opacity`

over repeatedly animating layout-heavy properties such as:

- `width`
- `height`
- `top`
- `left`
- `margin`
- `padding`

when the visual result can be achieved using transforms.

## Reduced motion

All timing/spring presets use:

```ts
ReduceMotion.System
```

by default.

NOVA additionally exposes:

```ts
type MotionPreference = 'system' | 'full' | 'reduced';
```

and:

```ts
resolveReduceMotionMode(preference)
```

for a future root-level `ReducedMotionConfig`.

Policy:

| Purpose | Reduced motion |
| --- | --- |
| functional | keep |
| feedback | simplify |
| navigation | simplify |
| decorative | disable |

Infinite decorative loops are not allowed.

Allowed loops include genuine progress/loading/tracking states and must respect
reduced motion.

## Press interaction

Standard press behavior:

```text
scale      -> 0.97
stateLayer -> 10%
spring     -> snappy
haptic     -> press
```

The component will later overlay a state layer rather than lowering the opacity
of all text/icons.

Available intensities:

```text
none
subtle
standard
expressive
```

## Touch target

Default:

```text
48 logical points
```

Compact exception:

```text
44 logical points
```

A small 20px icon may still have a 48x48 interaction target.

## Long press

NOVA preserves the React Native familiar default:

```text
500 ms
```

## Loading

To avoid flickering for very fast operations:

```text
indicatorDelay  -> 150ms
minimumVisible  -> 300ms
```

This policy will be implemented by reusable async controls rather than copied
into features.

## Haptics

Use semantic haptics:

```ts
appHaptics.press()
appHaptics.selection()
appHaptics.success()
appHaptics.warning()
appHaptics.error()
```

Never call `expo-haptics` directly from feature code.

Android uses `performAndroidHapticsAsync` for Android-native haptic semantics
where an appropriate Android haptic exists.

Haptic failure is deliberately swallowed: physical feedback is an enhancement
and must never make business logic fail.

### Important UX rule

Do not fire success feedback because a button was tapped.

Correct:

```text
tap
→ press feedback
→ async operation
→ server confirms
→ success feedback
```

## Web

Haptics are disabled by default on Web:

```ts
appHaptics.configure({
  webEnabled: false,
});
```

They can be enabled for a mobile-web product if needed.

## Feedback tones

```text
neutral
success
warning
danger
info
```

Global operation feedback has a default semantic policy, but actual Toast /
Snackbar / Alert components do not exist yet.

## Next layer

The next foundation should define accessibility:

- screen-reader semantics
- roles
- accessibility state
- announcements/live regions
- focus
- font scaling
- high contrast considerations
- reduced transparency
- accessible hit targets
- disabled/busy/selected/expanded conventions

After accessibility, implement:

```text
AppPressable
```

and only then the reusable visual components.
