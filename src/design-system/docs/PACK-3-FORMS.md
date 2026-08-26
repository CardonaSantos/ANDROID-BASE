# NOVA Design System — Pack 3 / Forms

Pack 3 is cumulative over Foundation v3.2 + Pack 1.1 + Pack 2.1.

## New reusable components

1. AppField
2. AppInput
3. AppPasswordInput
4. AppTextArea
5. AppSearchInput
6. AppCheckbox
7. AppRadio
8. AppRadioGroup
9. AppSwitch
10. AppSelect
11. AppSlider
12. AppDatePicker
13. AppTimePicker
14. AppFormField

Internal foundation:

```text
forms/_internal/AppInputBase
```

`AppInputBase` is deliberately not exported from the root Design System barrel.
Feature code should consume the public field components.

## Folder placement

```text
src/design-system/forms/
├── _internal/
│   └── AppInputBase/
├── AppCheckbox/
├── AppDatePicker/
├── AppField/
├── AppFormField/
├── AppInput/
├── AppPasswordInput/
├── AppRadio/
├── AppRadioGroup/
├── AppSearchInput/
├── AppSelect/
├── AppSlider/
├── AppSwitch/
├── AppTextArea/
├── AppTimePicker/
├── date-time.utils.ts
├── form.types.ts
└── index.ts
```

## Text inputs

NOVA text inputs deliberately wrap React Native `TextInput` instead of the new
Expo UI TextInput.

Reason:

- React Native 0.86 already exposes the full input contract we need.
- Expo UI TextInput currently uses an observable-state controlled-value model,
  which would leak implementation details into our generic RHF-compatible
  controls.
- our own wrapper keeps Android/iOS/Web visual styling identical.

Input focus uses a Reanimated overlay ring rather than animating layout/border
dimensions.

## AppPasswordInput

Uses AppInput and a semantic AppIconButton to toggle visibility.

Visibility can be controlled or uncontrolled.

## AppTextArea

Keeps native text handling and only tracks character length internally. It does
not force an uncontrolled TextInput into controlled mode solely to show a
counter.

## AppSearchInput

Uses the Pack 1 `useSearchHandler` contract:

- controlled/uncontrolled value,
- debounce,
- minimum query length,
- submit,
- clear,
- optional search-on-mount.

## Checkbox / Radio / Switch

These controls are NOVA-owned visuals rather than native platform widgets so
their visual language remains consistent across Android and iOS.

They provide native accessibility roles/states and semantic haptics.

## Select

Uses React Native Paper `Menu` only as overlay/anchor infrastructure.

The trigger, option rows, state styling, semantics and haptics remain NOVA
components. Features do not import Paper Menu directly.

## Slider

Uses the current Expo SDK 57 universal `Slider` from `@expo/ui`.

It is already backed by platform-native modern UI and works on
Android/iOS/Web.

NOVA wraps it with:

- field labeling/supporting text,
- controlled/uncontrolled state,
- clamping/step normalization,
- accessibility adjustable semantics,
- increment/decrement accessibility actions.

## Date / Time

Native builds use:

```ts
@expo/ui/community/datetime-picker
```

This is Expo SDK 57's current drop-in replacement powered by Jetpack Compose on
Android and SwiftUI on iOS.

The implementation uses:

```text
onValueChange
onDismiss
presentation
```

and deliberately avoids deprecated `onChange` / legacy Android imperative
picker APIs.

Web uses a lightweight text fallback:
- date: `YYYY-MM-DD`
- time: `HH:mm`

This keeps Web development functional without adding another dependency.

## React Hook Form

`AppFormField` is intentionally thin.

It wraps `useController()` and exposes the official RHF:

```text
field
fieldState
formState
errorMessage
```

Visual components remain usable completely independently of React Hook Form.

Zod remains configured at the feature/form boundary through the existing
`@hookform/resolvers` package rather than being embedded in UI components.
