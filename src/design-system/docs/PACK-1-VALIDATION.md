# NOVA Design System — Pack 1 validation notes

Before starting Pack 2, validate Pack 1 in the actual Expo project with:

```bash
npx tsc --noEmit
npm run lint
npx expo start --clear
```

Then exercise on Web:

- theme light/dark switching,
- Inter font loading,
- AppText scaling,
- AppIcon semantic colors,
- AppImage success/error/placeholder,
- AppPressable mouse hover / keyboard focus / press,
- AppContainer responsive breakpoints,
- AppGrid resizing.

Native validation later:

- haptics,
- TalkBack / VoiceOver,
- Reduce Motion,
- Dynamic Type,
- Android/iOS touch target behavior.

## Design decisions validated in Pack 1

- No dynamic global Lucide icon registry.
- No direct feature access to HEX colors.
- No raw animation durations/haptic patterns in components.
- No `any` casts.
- No deprecated accessibility-focus API.
- No unsupported React Native 0.86.2 accessibility-service listener.
- Expo Image transition is disabled when Reduced Motion is active.
- AppPressable keeps press animation on transform/opacity rather than layout.
- Responsive visual styles remain in Unistyles whenever possible.

## React 19 ref typing

Pack 1.1 must contain no deprecated `ElementRef` references.

Expected pattern:

```ts
import {
  forwardRef,
  type ComponentRef,
} from 'react';

forwardRef<
  ComponentRef<typeof View>,
  Props
>(...)
```
