# NOVA Design System — Pack 2 validation

Run in the actual Expo SDK 57 project before Pack 3:

```bash
npx tsc --noEmit
npm run lint
npx expo start --clear
```

## Web checks

- AppScreen responsive container and safe-area behavior.
- AppScrollScreen scroll/content sizing.
- AppKeyboardScreen renders its Web fallback.
- AppButton variants / tones / sizes / loading.
- AppIconButton keyboard focus and hover.
- AppLinkButton navigation and Web link behavior.
- AppBackButton fallback route.
- AppFab inline and floating placement.
- AppSegmentedControl controlled/uncontrolled state.
- AppActionGroup compact -> medium responsive orientation.
- Light / dark / system theme.

## Native checks

- KeyboardProvider initializes without root-layout flicker.
- KeyboardAwareScrollView keeps focused inputs visible.
- `assureFocusedInputVisible()` after validation/layout shifts.
- Back button uses Expo Router history correctly.
- Haptics on Button / Back / FAB / segmented selection.
- TalkBack / VoiceOver roles and busy/checked states.
- Reduce Motion on segmented selection.
- Safe areas under cutouts/status/navigation areas.

## Deprecated API guard

The Pack 2 source should contain none of:

```text
ElementRef
React Native SafeAreaView import
setAccessibilityFocus
TouchableOpacity
TouchableHighlight
headerBackImageSource
```

It also does not use Expo Router ExperimentalStack APIs.

## Pack 2.1 TypeScript regressions

Verify these contracts remain intact:

```ts
// AppImage
imageStyle?: ImageProps['style'];

// AppSegmentedControl
options: readonly [
  AppSegmentedOption<TValue>,
  ...AppSegmentedOption<TValue>[],
];
```

`AppSegmentedControl` must always pass a concrete `TValue` as
`defaultValue` to `useControllableState`.
