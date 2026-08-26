import type { HapticFeedback } from '../haptics';

export type InteractionState =
  | 'default'
  | 'hovered'
  | 'pressed'
  | 'focused'
  | 'selected'
  | 'disabled'
  | 'loading';

export type InteractionIntensity =
  | 'none'
  | 'subtle'
  | 'standard'
  | 'expressive';

export interface PressInteractionPreset {
  scale: number;
  stateLayerOpacity: number;
  spring: 'snappy' | 'standard' | 'soft';
  haptic: HapticFeedback;
}
