# NOVA Design System — Pack 1 / Core

Pack 1 is the first reusable-component layer built on Foundation v3.2.

## Included

### Contracts

- `ComponentSize`
- `ComponentTone`
- `VisualVariant`
- semantic color-token types
- sync/async action handler types
- controlled-state contracts

### Hooks / handlers

- `useControllableState`
- `useDisclosure`
- `useLoadingState`
- `useActionHandler`
- `useSearchHandler`
- `usePressFeedback`
- `useResponsiveValue`

### Provider

- `AppDesignSystemProvider`

### Primitives

- `AppText`
- `AppIcon`
- `AppImage`
- `AppPressable`
- `AppSurface`
- `AppDivider`
- `AppSpacer`
- `AppPortal`

### Layout

- `AppContainer`
- `AppStack`
- `AppInline`
- `AppCenter`
- `AppGrid`
- `AppSection`

## Root provider

Wrap the Expo Router tree with:

```tsx
<AppDesignSystemProvider>
  <Slot />
</AppDesignSystemProvider>
```

PaperProvider is intentionally hidden behind the NOVA provider. Feature code
must not configure Paper directly.

## Styling policy

Use Unistyles for:
- theme-driven colors,
- typography,
- responsive breakpoints,
- reusable component styles.

Do not call `useUnistyles()` simply to style React Native views. Unistyles can
update bound React Native/Reanimated styles without forcing component
re-renders.

`useUnistyles()` is used only where a JavaScript value is genuinely required:
- Lucide color resolution,
- Paper provider theme selection,
- `useResponsiveValue()` behavior.

## AppIcon and bundle size

AppIcon accepts a Lucide component:

```tsx
<AppIcon icon={ShoppingCart} />
```

rather than:

```tsx
<AppIcon name="shopping-cart" />
```

This is deliberate. A dynamic all-icon registry can prevent efficient
tree-shaking and make the application bundle unnecessarily large.

## AppPressable

AppPressable is the interaction primitive for future:
- buttons,
- icon buttons,
- interactive cards,
- chips,
- list items,
- product cards.

It centralizes:
- Reanimated scale/state-layer feedback,
- haptics,
- disabled/loading semantics,
- touch target policy,
- hit slop presets,
- long-press timing,
- hover/focus tracking,
- accessibility busy/disabled state,
- focus ring.

It intentionally does not know CRM business rules.

## AppImage

AppImage wraps Expo Image and defaults to:
- `memory-disk` cache,
- semantic fallback surface,
- `placeholderContentFit` matching `contentFit`,
- short cross-dissolve transition,
- no transition when Reduced Motion is active,
- explicit decorative/informative image semantics.

## AppSurface

Surface variants:
- `flat`
- `outlined`
- `elevated`
- `tonal`

Tone only affects semantic tonal surfaces.

## Layout

`AppGrid` is a non-virtualized responsive Flexbox grid for ordinary page
sections. Large datasets must use the future `AppGridList` built on FlashList.

## Raw styling

`style` remains available as an escape hatch.

Do not use it to recreate a component variant that belongs in the Design
System. Feature code should not hardcode NOVA colors, motion timings, haptic
patterns, typography sizes or interaction physics.

## Next Pack

Pack 2:
- AppScreen
- AppScrollScreen
- AppKeyboardScreen
- AppButton
- AppIconButton
- AppBackButton
- AppLinkButton
- AppFab
- AppSegmentedControl
- AppActionGroup
