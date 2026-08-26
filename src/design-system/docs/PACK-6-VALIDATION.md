# NOVA Design System — Pack 6 validation

Run:

```bash
npx tsc --noEmit
npm run lint
npx expo start --clear
```

## Source guards

Pack 6 must contain no:
- ElementRef
- as any
- explicit : any
- setAccessibilityFocus(...)
- TouchableOpacity / TouchableHighlight
- React Native deprecated Modal `animated` prop
- Paper Modal inside AppDialog
- internal `@/design-system/...` self imports
- raw Reanimated duration literals

## Web checks

- Toast top/bottom and auto-dismiss.
- Snackbar top/bottom/action.
- Dialog backdrop/close/actions/scroll.
- Confirm dialog async pending state.
- Paper Menu anchor/open/select.
- Bottom Sheet basic modal presentation on web.
- TopBar safe-area-disabled embedding.
- Tabs scroll/non-scroll.
- Bottom navigation.
- Rail navigation.
- Adaptive bottom -> rail breakpoint behavior.

## Native checks

### Android/iOS
- Dialog hardware/system back.
- TalkBack/VoiceOver modal isolation.
- dialog safe areas and large font.
- snackbar accessible timeout.
- bottom sheet present/dismiss/reopen cycles.
- bottom sheet backdrop close.
- bottom sheet keyboard interaction.
- nested interactive content inside bottom sheet.
- tabs/tablist semantics.
- bottom navigation and rail tab semantics.
- edge-to-edge layout.

### Bottom Sheet specifically

The project currently uses:
- @gorhom/bottom-sheet 5.2.14
- react-native-reanimated 4.5.1
- react-native-gesture-handler 2.32
- React Native 0.86

Gorhom 5.2.14 is current, but public docs still describe v5 as written for
Reanimated 3 and there are active Reanimated 4 issue reports.

Do not mark native Bottom Sheet validation complete based only on TypeScript or
Web preview.

## Pack 6.2 — Expo Router route type

Expected public type:

```ts
import type {
  RoutePath,
} from 'expo-router';
```

Do not use:

```ts
Route
```

because it is not exported by Expo Router `~57.0.16`.

`AppLinkButton` intentionally still uses the full `Href` type because a generic
link needs the complete Expo Router href contract.

`AppBackButton` and `AppTopBar` must use the narrower NOVA
`AppBackFallbackRoute`.
