# NOVA Design System — Pack 5 / Feedback + States

Pack 5 is cumulative over Foundation v3.2 + Packs 1.1, 2.1, 3.1 and 4.1.

## New public components

### Feedback components
1. AppLoading
2. AppProgress
3. AppSkeleton
4. AppAlert
5. AppConnectivityBanner

### States
6. AppStateView
7. AppEmptyState
8. AppErrorState
9. AppOfflineState
10. AppNoResultsState
11. AppPermissionState

## Folder placement

```text
src/design-system/
├── feedback/
│   └── existing semantic policies
│
├── feedback-components/
│   ├── AppAlert/
│   ├── AppConnectivityBanner/
│   ├── AppLoading/
│   ├── AppProgress/
│   ├── AppSkeleton/
│   ├── feedback-colors.ts
│   ├── feedback.copy.ts
│   └── index.ts
│
└── states/
    ├── AppEmptyState/
    ├── AppErrorState/
    ├── AppNoResultsState/
    ├── AppOfflineState/
    ├── AppPermissionState/
    ├── AppStateView/
    ├── state.types.ts
    └── index.ts
```

`feedback/` remains infrastructure/policy. Visual feedback is deliberately
separated into `feedback-components/`.

## AppLoading

Indeterminate loading indicator with:
- inline or block layout,
- semantic tone,
- native ActivityIndicator,
- progressbar accessibility role,
- busy state and polite live region.

## AppProgress

Determinate progress:
- linear or circular,
- min/max/value,
- accessible range semantics,
- optional formatted visible value,
- semantic tone.

Linear progress uses flex ratios instead of animated width calculations.

Circular progress uses the already-installed react-native-svg package.

## AppSkeleton

Skeletons are decorative and hidden from assistive technologies.

The pulse:
- uses NOVA skeleton duration tokens,
- uses Reanimated 4,
- explicitly stops when Reduce Motion is enabled,
- uses ReduceMotion.System as an additional native animation guard.

## AppAlert

Persistent in-layout feedback.

Supports:
- neutral/success/warning/danger/info,
- default or compact density,
- title/content/custom action,
- dismiss action,
- semantic default icon,
- Android live regions,
- optional cross-platform announcement on mount through the existing NOVA
  accessibility announcer.

Danger defaults to assertive live-region semantics; informational states use
polite semantics.

## AppStateView

Base reusable full/partial state layout.

Supports:
- icon or custom illustration,
- title/description,
- semantic tone,
- centered or start alignment,
- compact/default density,
- optional fill behavior,
- primary/secondary semantic actions,
- custom actions,
- optional screen-reader announcement.

Named state wrappers provide semantic defaults without duplicating layout.

## Named state components

- AppEmptyState
- AppErrorState
- AppOfflineState
- AppNoResultsState
- AppPermissionState

These components do not fetch data, retry requests or ask OS permissions
themselves. They remain presentational and accept actions from feature/core
logic.

## AppConnectivityBanner

Presentational connectivity/synchronization feedback for:
- online,
- offline,
- syncing,
- pending local changes,
- reconnected.

It intentionally does not subscribe to NetInfo itself.

Connectivity truth belongs to `core/network`; the Design System only renders
the resolved state. This prevents network lifecycle logic from being coupled
to visual components.

The project already contains @react-native-community/netinfo 12.0.1 for that
future core integration.

## Accessibility

React Native 0.86 supports `progressbar` as an accessibility role and
`accessibilityValue` range semantics.

Android live-region values remain:
- none
- polite
- assertive

Cross-platform one-time announcements use the NOVA AccessibilityInfo wrapper
already introduced in Foundation v3.
