# NOVA Foundation v2

## Added

### Tokens
- `motion.ts`
- `interaction.ts`

### Motion
- Reanimated timing presets
- Reanimated spring presets
- semantic transition metadata
- reduced-motion preference contract and policy

### Interaction
- shared interaction states
- `none / subtle / standard / expressive` press presets
- 48pt default touch target
- standardized hit slop
- long-press timing
- loading indicator timing
- state-layer opacity policy
- optional rapid-action guard token

### Haptics
- semantic `appHaptics` service
- Android-native haptic mapping
- iOS/Web mapping
- Web disabled by default
- runtime enable/disable preference
- haptic failures never propagate to business logic

### Feedback
- semantic feedback tones
- visual/haptic mode contract
- default durations/policy

## Updated
- `theme.types.ts` exposes `theme.motion` and `theme.interaction`.
- `light-theme.ts` and `dark-theme.ts` share motion/interaction tokens.
- root design-system exports include new modules.

## No new dependencies

This update uses dependencies already present in the project:
- `react-native-reanimated`
- `react-native-worklets`
- `expo-haptics`

`react-native-gesture-handler` remains installed and will be used in the
gesture/component phase.
