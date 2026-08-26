# NOVA Design System — Pack 2 / Screens + Actions

Pack 2 is cumulative over Pack 1.1 and Foundation v3.2.

## New components

### Screen/layout

- `AppScreen`
- `AppScrollScreen`
- `AppKeyboardScreen`

### Actions

- `AppButton`
- `AppIconButton`
- `AppBackButton`
- `AppLinkButton`
- `AppFab`
- `AppSegmentedControl`
- `AppActionGroup`

## Folder placement

```text
src/design-system/
├── actions/
│   ├── AppActionGroup/
│   ├── AppBackButton/
│   ├── AppButton/
│   ├── AppFab/
│   ├── AppIconButton/
│   ├── AppLinkButton/
│   ├── AppSegmentedControl/
│   ├── action-colors.ts
│   └── index.ts
│
├── layout/
│   ├── AppScreen/
│   ├── AppScrollScreen/
│   ├── AppKeyboardScreen/
│   ├── screen.constants.ts
│   ├── screen.types.ts
│   └── ...
│
└── providers/
    ├── AppDesignSystemProvider/
    ├── AppKeyboardProvider/
    └── index.ts
```

## Safe areas

Screens use `SafeAreaView` from:

```text
react-native-safe-area-context
```

not React Native's legacy SafeAreaView.

Default edges:

```text
top
right
bottom
left
```

If Expo Router's native Stack header is visible and already owns the top
inset, a screen can deliberately remove `top` from `safeAreaEdges`.

## Keyboard screens

Native `AppKeyboardScreen` uses:

```text
react-native-keyboard-controller
```

and its current `KeyboardAwareScrollView`.

The component exposes a stable NOVA ref handle:

```ts
interface AppKeyboardScreenHandle {
  assureFocusedInputVisible(): void;
}
```

This intentionally avoids exposing third-party implementation types as the
public Design System contract.

Web uses a normal `ScrollView` fallback.

`AppDesignSystemProvider` now initializes `KeyboardProvider` only on native
through a platform-specific wrapper.

## Buttons

Action variants:

```text
solid
soft
outlined
ghost
```

Semantic tones:

```text
neutral
primary
success
warning
danger
info
```

Sizes:

```text
sm
md
lg
```

Feature code should choose semantic variants; it should not provide raw HEX,
animation duration, press scale or haptic patterns.

### Async actions

Buttons do not absorb business logic.

Compose:

```text
useActionHandler()
        ↓
AppButton
```

The handler can own pending/success/error feedback while AppButton owns
presentation/accessibility/interaction.

## AppBackButton

Uses stable Expo Router imperative APIs:

```ts
router.canGoBack()
router.back()
router.push()
router.replace()
```

It intentionally does not depend on ExperimentalStack APIs.

## AppLinkButton

Uses Expo Router `Link` with `asChild`, preserving navigation semantics on Web
instead of turning every link into an imperative button navigation.

## FAB

`AppFab` can be:
- inline,
- bottomEnd,
- bottomStart.

Floating placement respects native safe-area bottom/side insets.

## Segmented control

Single-selection semantics use:
- `radiogroup` container,
- `radio` options,
- `checked/selected` accessibility state,
- selection haptic only when the value actually changes,
- Reanimated selected-layer transition respecting Reduce Motion through the
  global timing presets.

## AppActionGroup

`orientation="auto"` resolves:
- compact -> vertical,
- medium+ -> horizontal.

Use it for grouped form/dialog actions instead of repeating per-feature
responsive button-row logic.

## Ref policy

Pack 2 contains no `ElementRef`.

Current React refs use `ComponentRef` where a native/component ref is exposed.
Third-party implementation refs are wrapped behind NOVA-owned handles when
possible.
