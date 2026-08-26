# NOVA Design System — Pack 4 / Data Display

Pack 4 is cumulative over Foundation v3.2 + Pack 1.1 + Pack 2.1 + Pack 3.1.

## New public components

1. AppCard
2. AppListItem
3. AppAvatar
4. AppBadge
5. AppChip
6. AppAccordion
7. AppSectionHeader
8. AppStat

## Folder placement

```text
src/design-system/
└── data-display/
    ├── AppAccordion/
    ├── AppAvatar/
    ├── AppBadge/
    ├── AppCard/
    ├── AppChip/
    ├── AppListItem/
    ├── AppSectionHeader/
    ├── AppStat/
    ├── data-display.types.ts
    └── index.ts
```

## AppCard

AppCard is a composition surface, not a business model.

It supports:
- flat / outlined / elevated / tonal surface variants,
- semantic tone,
- selected and disabled state,
- static or interactive use.

Do not create TicketCard/CustomerCard/ProductCard inside the Design System.
Those components belong to features/shared UI and should compose AppCard.

## AppListItem

A reusable mobile row with:
- leading content,
- title,
- description,
- metadata,
- trailing content,
- optional disclosure chevron,
- selection,
- disabled state,
- static or interactive mode.

When the entire row is interactive, avoid placing another interactive control
inside its `trailing` slot. Use a dedicated feature composition when separate
row and trailing actions are required.

## AppAvatar

AppAvatar supports:
- Expo Image sources and placeholders,
- memory/disk caching through AppImage,
- initials fallback,
- generic icon fallback,
- semantic fallback tones,
- circle or rounded shape,
- decorative or informative accessibility behavior.

Images are decorative by default to avoid duplicate announcements when the
person/entity name is already rendered next to the avatar.

## AppBadge

Badges are non-interactive status/count/content indicators.

Variants:
- solid
- soft
- outlined

A dot-only badge must provide an accessibilityLabel because meaning must never
be conveyed by color alone.

## AppChip

AppChip supports:
- action chips,
- controlled/uncontrolled selectable chips,
- dismissible chips,
- leading icons,
- selected state,
- semantic tones.

Selectable chips expose React Native's current `togglebutton` role plus
checked/selected accessibility state.

The dismiss action is a sibling control rather than a nested pressable, which
avoids nested accessible/touch targets.

## AppAccordion

AppAccordion supports:
- controlled/uncontrolled expanded state,
- semantic expanded accessibility state,
- Reanimated chevron motion,
- layout/fade transitions,
- ReduceMotion.System for all expansion/collapse layout animations.

The content is unmounted while collapsed.

## AppSectionHeader

Section headers provide:
- title,
- description,
- leading content,
- action slot.

String/number titles receive the native `header` accessibility role.

## AppStat

AppStat displays generic metrics without knowing business meaning.

It supports:
- label,
- value,
- description,
- supporting custom content,
- semantic icon,
- plain / outlined / tonal presentation.

Trend interpretation is deliberately not automatic. "Up" is not universally
good, so a feature can supply its own semantic supporting badge/content.
