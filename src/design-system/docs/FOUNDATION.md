# NOVA Design System — Foundation

## Semantic color model

Features and reusable components should use semantic tokens:

```ts
theme.colors.primary
theme.colors.success
theme.colors.warning
theme.colors.danger
theme.colors.info
theme.colors.text
theme.colors.surface
```

Avoid:

```ts
'#2AC29A'
palette.nova[500]
```

outside the design-system internals.

## Variant vocabulary

For future components:

### Presentation

```ts
type Variant = 'solid' | 'soft' | 'outlined' | 'ghost';
```

### Semantic tone

```ts
type Tone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
```

Example target API:

```tsx
<AppBadge tone="success" variant="soft">
  Pagado
</AppBadge>
```

`variant` answers **how it looks**.
`tone` answers **what it means**.

## Typography

Inter is the single cross-platform family.

Loaded weights:
- 400 Regular
- 500 Medium
- 600 SemiBold
- 700 Bold

Do not use arbitrary `fontSize`/`fontWeight` in feature code.

## Responsive

Breakpoints:

- compact: 0
- medium: 600
- expanded: 840
- wide: 1200

Unistyles is configured in logical `points`, avoiding raw device-pixel differences between platforms.

## Theme preference

Contract:

```ts
type ThemePreference = 'system' | 'light' | 'dark';
```

The controller follows `Appearance` in `system` mode and uses
`UnistylesRuntime.setTheme()` for manual overrides.

Persistence is intentionally not part of this layer.
It can later be connected to SQLite/Zustand without changing the themes.

## Next phases

1. Motion tokens and Reanimated presets.
2. Haptics policy.
3. Accessibility policy.
4. AppPressable foundation.
5. Primitive components.
6. Layout components.
7. Actions/forms/feedback.
