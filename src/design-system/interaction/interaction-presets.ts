import { interaction, motion } from '../tokens';
import type {
  InteractionIntensity,
  PressInteractionPreset,
} from './interaction.types';

/**
 * Shared press behavior.
 *
 * Prefer scale + state layer instead of globally lowering the opacity of the
 * entire component, which can make text/icons unnecessarily harder to read.
 */
export const pressInteractionPresets = {
  none: {
    scale: motion.scale.normal,
    stateLayerOpacity: 0,
    spring: 'snappy',
    haptic: 'none',
  },

  subtle: {
    scale: motion.scale.pressedSubtle,
    stateLayerOpacity: interaction.stateLayer.hover,
    spring: 'snappy',
    haptic: 'none',
  },

  standard: {
    scale: motion.scale.pressed,
    stateLayerOpacity: interaction.stateLayer.pressed,
    spring: 'snappy',
    haptic: 'press',
  },

  expressive: {
    scale: motion.scale.pressedStrong,
    stateLayerOpacity: interaction.stateLayer.selected,
    spring: 'standard',
    haptic: 'pressStrong',
  },
} as const satisfies Record<
  InteractionIntensity,
  PressInteractionPreset
>;
