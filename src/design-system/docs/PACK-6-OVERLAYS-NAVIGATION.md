# NOVA Design System — Pack 6 / Overlays + Navigation

Pack 6 is cumulative over Foundation v3.2 + Packs 1.1, 2.1, 3.1, 4.1 and 5.1.

## New public components

### Overlays
1. AppToast
2. AppSnackbar
3. AppDialog
4. AppConfirmDialog
5. AppBottomSheet
6. AppMenu

### Navigation
7. AppTopBar
8. AppTabs
9. AppBottomNavigation
10. AppNavigationRail
11. AppAdaptiveNavigation

## Folder placement

```text
src/design-system/
├── overlays/
│   ├── AppToast/
│   ├── AppSnackbar/
│   ├── AppDialog/
│   ├── AppConfirmDialog/
│   ├── AppBottomSheet/
│   ├── AppMenu/
│   ├── overlay.copy.ts
│   ├── overlay.types.ts
│   └── index.ts
│
├── navigation/
│   ├── AppTopBar/
│   ├── AppTabs/
│   ├── AppBottomNavigation/
│   ├── AppNavigationRail/
│   ├── AppAdaptiveNavigation/
│   ├── navigation.types.ts
│   └── index.ts
│
└── providers/
    └── AppDesignSystemProvider/
        └── updated for Gesture Handler + BottomSheetModalProvider
```

## Provider tree

Pack 6 makes the root provider own the required overlay/gesture contexts:

```text
GestureHandlerRootView
└── AppKeyboardProvider
    └── PaperProvider
        └── BottomSheetModalProvider
            └── application
```

Do not repeat these providers inside features.

## AppDialog

AppDialog uses React Native's native Modal rather than Paper Modal.

Reason:
- Paper explicitly documents that its Modal is not accessible by default;
- RN Modal provides native modal presentation, hardware-back handling and
  accessibility modal semantics.

NOVA adds:
- semantic surface styling,
- title/description/icon,
- safe-area padding,
- optional backdrop dismissal,
- optional close action,
- scrollable content,
- action slot.

## AppConfirmDialog

Thin semantic wrapper over AppDialog.

It:
- supports sync/async confirmation,
- uses useActionHandler,
- prevents duplicate confirm/cancel while pending,
- closes only after successful confirmation,
- keeps the dialog open on action failure.

## AppBottomSheet

Uses @gorhom/bottom-sheet v5 BottomSheetModal.

The wrapper:
- is controlled/uncontrolled;
- supports dynamic sizing or explicit snap points;
- uses NOVA semantic colors;
- supports backdrop and pan-to-close;
- tracks whether the modal has actually been presented before calling
  `dismiss()`.

That guard is intentional because current 5.2.x reports include lifecycle
regressions around dismiss-before-present behavior.

Native runtime validation is mandatory because the project's Reanimated 4
stack is newer than the compatibility statement currently shown in Gorhom's
main v5 documentation.

## AppMenu

Uses Paper Menu only for overlay positioning/lifecycle.

Menu item visuals are NOVA-owned:
- semantic tone,
- description,
- selected state,
- disabled state,
- icon,
- separators,
- haptic selection.

## AppToast vs AppSnackbar

AppToast:
- lightweight,
- passive,
- no action,
- auto-dismisses using Android accessible timeout recommendations.

AppSnackbar:
- allows one action,
- stays visually anchored,
- uses Paper's stable Snackbar lifecycle/animation.

This avoids keeping two components with identical purpose.

## Navigation

All navigation components are visual/state primitives. They do not own routing.

Feature/application code decides what a selected value means:

```text
AppBottomNavigation onValueChange
              ↓
        Expo Router push/replace
```

### AppTopBar

Can compose:
- AppBackButton,
- custom leading content,
- title/subtitle,
- action slot,
- safe-area edges,
- optional divider.

### AppTabs

- tablist/tab accessibility roles;
- controlled/uncontrolled;
- non-empty options;
- underline or pill styles;
- optional badges/icons;
- horizontal scrolling.

### AppBottomNavigation

- compact/mobile navigation;
- tablist/tab semantics;
- selected icon support;
- custom badge slot;
- bottom safe-area support.

### AppNavigationRail

- expanded/tablet/desktop navigation;
- header/footer slots;
- optional labels;
- left safe-area support.

### AppAdaptiveNavigation

Behavioral breakpoint adaptation:

```text
compact        -> bottom
medium         -> bottom by default
expanded/wide -> rail
```

`railFrom` can promote the rail from `medium` or defer it until `wide`.

The component owns layout adaptation, not route transitions.
