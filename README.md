# NOVA Design Foundation

Base de tokens + themes para Expo SDK 57 / React Native 0.86 / Unistyles 3 / React Native Paper 5.

Esta entrega **no incluye todavía**:
- motion / animaciones,
- pressables,
- haptics,
- accesibilidad,
- componentes App*.

La intención es que esas capas consuman esta foundation sin hardcodear colores, tamaños, tipografía, radios o breakpoints.

## 1. Dependencia adicional para Inter

El proyecto ya incluye `expo-font`, pero para usar la tipografía definida aquí instala:

```bash
npx expo install @expo-google-fonts/inter@0.4.2
```

No se incluyen ni distribuyen archivos de fuente en este paquete.

## 2. Estructura

```text
src/design-system/
├── fonts/
├── theme/
└── tokens/
```

## 3. Unistyles

Unistyles 3 requiere su plugin Babel. En `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-unistyles/plugin',
        {
          root: 'src',
        },
      ],
    ],
  };
};
```

Expo SDK 57 configura automáticamente el plugin de Reanimated mediante `babel-preset-expo`.

## 4. Entry point

Cambia en `package.json`:

```json
"main": "index.ts"
```

Usa el `index.ts` incluido en este paquete como referencia.

Después reinicia Metro:

```bash
npx expo start --clear
```

## 5. Theme

Hay tres preferencias soportadas por contrato:

```ts
type ThemePreference = 'system' | 'light' | 'dark';
```

El controlador incluido arranca en `system`, sigue `Appearance` y permite forzar `light` o `dark`.
La persistencia de la preferencia se conectará después (SQLite/Zustand).

## 6. Reglas del Design System

- Las features no consumen HEX.
- Las features no consumen `palette.nova500`.
- Los componentes consumen tokens semánticos: `theme.colors.primary`, `theme.colors.danger`, etc.
- Los componentes usan la escala de spacing/radius/typography.
- `variant` define presentación; `tone` define significado.
- Motion, haptics y accesibilidad se añadirán en la siguiente fase.

## 7. Colores corporativos

El color NOVA se aproxima a `#2AC29A` a partir del logo proporcionado.
Negro y blanco forman parte de la identidad.

La paleta semántica separa:
- `primary`: identidad NOVA,
- `success`: éxito,
- `warning`: advertencia,
- `danger`: error/destructivo,
- `info`: información.

Esto evita utilizar el mismo verde corporativo para “acción primaria” y “éxito”.

## Foundation v2 — Interaction

This package now also includes:

- motion tokens and Reanimated presets,
- reduced-motion policy,
- interaction state/touch policies,
- semantic Expo Haptics service,
- feedback semantics.

See:

```text
CHANGELOG-v2.md
src/design-system/docs/INTERACTION-FOUNDATION.md
```

No new runtime dependency is needed for v2.

## Foundation v3 — Accessibility

The cumulative v3 adds the accessibility layer before reusable components.

Includes:

- WCAG 2.2 AA policy/tokens,
- OS accessibility preference store,
- `useAccessibilityPreferences`,
- reduced-transparency / increased-contrast signals,
- current accessibility focus API,
- accessible timeout handling,
- screen-reader announcement service,
- accessibility state/value helpers,
- contrast validation utilities,
- live-region and accessible-label conventions.

See:

```text
CHANGELOG-v3.md
src/design-system/docs/ACCESSIBILITY-FOUNDATION.md
```

No new dependency is required.

## Foundation v3.2 — RN 0.86.2 AccessibilityInfo compatibility

v3.2 is the current cumulative source of truth.

It removes the unsupported `accessibilityServiceChanged` listener from the
React Native 0.86.2 implementation while keeping
`isAccessibilityServiceEnabled()` query-based reconciliation.
