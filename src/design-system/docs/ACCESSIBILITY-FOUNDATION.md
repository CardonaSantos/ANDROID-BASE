# NOVA Design System — Accessibility Foundation

Target: **WCAG 2.2 AA** plus native VoiceOver/TalkBack semantics.

This layer is intentionally built before `AppPressable` and reusable UI
components so accessibility is inherited rather than added later.

## Runtime dependencies

No new dependency is required.

This layer uses React Native 0.86 APIs:

- `AccessibilityInfo`
- `AccessibilityState`
- `AccessibilityValue`
- `accessibilityLiveRegion`
- `sendAccessibilityEvent`
- native font scaling / Dynamic Type

## Non-negotiable rules

### 1. Do not disable font scaling globally

`AppText` and text-based controls must preserve Dynamic Type/font scaling.

There is deliberately no global `maxFontSizeMultiplier`.

### 2. Never communicate meaning by color alone

Status should combine semantic color with one or more of:

- visible text,
- iconography,
- accessibility state,
- assistive text.

### 3. Touch targets

NOVA default:

```text
48 logical points
```

Compact exception:

```text
44 logical points
```

A visual icon may be 20px while its actual touch target remains 48x48.

### 4. Labels do not include roles

Correct:

```text
Comprar
```

Incorrect:

```text
Botón comprar
```

The component provides the `button` role.

### 5. Decorative content is hidden by default

A decorative icon/image should not be announced simply because it is visible.

### 6. Icon-only controls require accessible names

`AppIconButton` will require a meaningful label such as:

```text
Agregar a favoritos
```

instead of relying on the icon name `heart`.

### 7. Gestures need alternatives

If a card supports "swipe to delete", there must be an ordinary accessible
Delete action unless dragging/swiping is intrinsic to the feature.

### 8. Do not use experimental focus-order APIs in production

NOVA does not use `experimental_accessibilityOrder`.

Logical JSX order should match visual/interaction reading order.

## Accessibility preferences

`accessibilityPreferences` exposes a stable snapshot:

```ts
screenReaderEnabled
accessibilityServiceEnabled

reduceMotionEnabled
reduceTransparencyEnabled

highTextContrastEnabled
darkerSystemColorsEnabled
prefersIncreasedContrast

boldTextEnabled
invertColorsEnabled
grayscaleEnabled

prefersCrossFadeTransitions
```

Use:

```ts
const preferences = useAccessibilityPreferences();
```

This state belongs to UI infrastructure, not Zustand business state.

### Why AppState refresh exists

React Native exposes change events for screen reader, reduce motion,
reduce-transparency and several iOS settings.

High text contrast / darker system colors do not expose corresponding change
events through `AccessibilityInfo`, so the store refreshes when the application
returns to the active state. This avoids polling.

## Reduced transparency

Future blur/glass components must resolve:

```text
reduceTransparency=false
→ Blur/Glass allowed

reduceTransparency=true
→ opaque semantic surface fallback
```

Features should never contain this logic.

## Increased contrast

The foundation derives:

```ts
prefersIncreasedContrast =
  highTextContrastEnabled ||
  darkerSystemColorsEnabled;
```

Future components may react by strengthening:

- borders,
- focus rings,
- muted text,
- surface separation.

Do not alter brand identity unnecessarily.

## Focus

NOVA uses:

```ts
AccessibilityInfo.sendAccessibilityEvent(
  target,
  'focus',
);
```

through:

```ts
accessibilityFocus.focus(target);
```

The deprecated `setAccessibilityFocus()` API is not used.

Imperative focus should be rare and meaningful:

- newly opened modal/dialog,
- important validation summary,
- intentional screen transition target.

Do not steal accessibility focus after ordinary state updates.

## State semantics

Reusable controls should consume:

```ts
buildAccessibilityState({
  disabled,
  busy,
  selected,
  checked,
  expanded,
});
```

Examples:

```text
AppButton.loading
→ busy=true

AppCheckbox
→ checked=true | false | "mixed"

AppAccordion
→ expanded=true | false
```

## Range/value semantics

Use:

```ts
buildAccessibilityValue({
  min: 0,
  max: 100,
  now: 75,
  text: '75 por ciento',
});
```

for progress, sliders and numeric controls.

## Announcements

Use the centralized announcer:

```ts
accessibilityAnnouncer.polite(
  'Producto agregado al carrito',
);

accessibilityAnnouncer.assertive(
  'No se pudo procesar el pago',
);
```

Repeated identical announcements are deduplicated briefly to prevent noisy
rapid-fire updates.

Do not announce:

- hover,
- every render,
- purely decorative state,
- changes already clearly spoken through focus/live-region semantics.

## Live regions

For continuously changing Android content, prefer a live region on the actual
component rather than repeatedly firing imperative announcements.

NOVA semantic values:

```text
off
polite
assertive
```

## Timeouts

Android users can configure "Time to take action".

Future transient UI should resolve timeout using:

```ts
await getAccessibleTimeout(4000);
```

This will preserve or extend the requested duration based on user preferences.

## Contrast utilities

Foundation exposes:

```ts
getContrastRatio(foreground, background)
meetsContrast(foreground, background, usage)
formatContrastRatio(foreground, background)
```

Expected AA thresholds:

```text
normal text    4.5:1
large text     3:1
non-text UI    3:1
```

These utilities intentionally support solid HEX colors. Alpha compositing
should be tested after resolving the final rendered color.

## Images / invert colors

Future `AppImage` should distinguish:

```text
decorative
informative
photographic / brand asset
```

Photographs and brand assets may opt into iOS
`accessibilityIgnoresInvertColors` where appropriate.

Do not apply this indiscriminately.

## Modal accessibility

Future `AppDialog` / `AppBottomSheet` wrappers must:

- expose modal semantics,
- manage initial accessible focus,
- keep background siblings out of the active accessibility context when
  appropriate,
- restore sensible focus on close.

## Testing policy

Accessibility is not "done" by types.

Every meaningful component should eventually be tested with:

- Android TalkBack,
- iOS VoiceOver,
- large text / Dynamic Type,
- reduced motion,
- reduced transparency where supported,
- increased contrast,
- keyboard/focus on Web/tablet where applicable.

Automated tests supplement but do not replace these checks.

## Next step

With colors/theme, motion, haptics, interaction and accessibility defined,
the next primitive layer can begin:

```text
AppText
AppIcon
AppPressable
```

`AppPressable` will be the first interactive primitive to combine:

- Reanimated motion,
- state layers,
- haptics,
- touch target policy,
- accessibility states,
- labels/roles,
- disabled/loading semantics.


## React Native 0.86.2 note — Android accessibility service

The shipped React Native 0.86.2 TypeScript declaration exposes:

```ts
AccessibilityInfo.isAccessibilityServiceEnabled()
```

but its public `AccessibilityChangeEventName` does not include:

```ts
'accessibilityServiceChanged'
```

NOVA therefore does **not** cast or force-register that event.

`accessibilityServiceEnabled` is refreshed:
- when the accessibility store starts,
- whenever the application returns to `active`.

Other supported 0.86.2 events such as `highTextContrastChanged`,
`screenReaderChanged`, and `reduceMotionChanged` remain event-driven.
