# NOVA Design System — Pack 5 validation

Run:

```bash
npx tsc --noEmit
npm run lint
npx expo start --clear
```

## Source guards

Pack 5 must contain no:
- ElementRef
- as any
- explicit : any
- setAccessibilityFocus(...)
- TouchableOpacity / TouchableHighlight
- experimental_accessibilityOrder
- raw animation durations in feedback-components/states

## Web checks

- AppLoading inline/block.
- AppProgress linear/circular at 0%, partial and 100%.
- AppSkeleton rect/text/circle and Reduced Motion emulation.
- AppAlert all tones, compact/default, action/dismiss.
- AppStateView alignment/density/fill/actions.
- Empty/Error/Offline/NoResults/Permission wrappers.
- ConnectivityBanner each status.
- light/dark/system themes.

## Native checks

- TalkBack/VoiceOver progressbar semantics.
- progress accessibilityValue.
- loading busy state.
- alert polite/assertive announcement behavior.
- skeleton hidden from accessibility.
- Reduce Motion skeleton behavior.
- state action touch targets.
- connectivity announcement behavior.
- large font scaling.

## Architectural validation

Do not put NetInfo subscriptions inside AppConnectivityBanner.

Expected future ownership:

```text
core/network
   ↓
connectivity state
   ↓
feature/layout shell
   ↓
AppConnectivityBanner
```
