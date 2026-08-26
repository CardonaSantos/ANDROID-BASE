import { motion } from '../tokens';
import type { TransitionName } from './motion.types';

/**
 * Semantic transition metadata.
 *
 * These values do not animate by themselves. Future reusable components use
 * them when building Reanimated entering/exiting/animated-style behavior.
 */
export const transitionPresets = {
  fade: {
    opacityFrom: 0,
    opacityTo: 1,
    scaleFrom: 1,
    translateXFrom: 0,
    translateYFrom: 0,
    enterDuration: 'normal',
    exitDuration: 'fast',
  },

  fadeScale: {
    opacityFrom: 0,
    opacityTo: 1,
    scaleFrom: motion.scale.enter,
    translateXFrom: 0,
    translateYFrom: 0,
    enterDuration: 'normal',
    exitDuration: 'fast',
  },

  slideUp: {
    opacityFrom: 0,
    opacityTo: 1,
    scaleFrom: 1,
    translateXFrom: 0,
    translateYFrom: motion.distance.md,
    enterDuration: 'normal',
    exitDuration: 'fast',
  },

  slideDown: {
    opacityFrom: 0,
    opacityTo: 1,
    scaleFrom: 1,
    translateXFrom: 0,
    translateYFrom: -motion.distance.md,
    enterDuration: 'normal',
    exitDuration: 'fast',
  },

  slideLeft: {
    opacityFrom: 0,
    opacityTo: 1,
    scaleFrom: 1,
    translateXFrom: motion.distance.md,
    translateYFrom: 0,
    enterDuration: 'normal',
    exitDuration: 'fast',
  },

  slideRight: {
    opacityFrom: 0,
    opacityTo: 1,
    scaleFrom: 1,
    translateXFrom: -motion.distance.md,
    translateYFrom: 0,
    enterDuration: 'normal',
    exitDuration: 'fast',
  },
} as const satisfies Record<TransitionName, object>;
