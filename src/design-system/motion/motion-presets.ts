import {
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';

import { motion } from '../tokens';

/**
 * Reanimated timing configurations.
 *
 * `ReduceMotion.System` means every timing animation respects the operating
 * system's reduced-motion preference by default.
 */
export const timingPresets = {
  instant: {
    duration: motion.duration.instant,
    easing: Easing.linear,
    reduceMotion: ReduceMotion.System,
  },

  fast: {
    duration: motion.duration.fast,
    easing: Easing.bezier(...motion.easing.standard),
    reduceMotion: ReduceMotion.System,
  },

  standard: {
    duration: motion.duration.normal,
    easing: Easing.bezier(...motion.easing.standard),
    reduceMotion: ReduceMotion.System,
  },

  enter: {
    duration: motion.duration.normal,
    easing: Easing.bezier(...motion.easing.enter),
    reduceMotion: ReduceMotion.System,
  },

  exit: {
    duration: motion.duration.fast,
    easing: Easing.bezier(...motion.easing.exit),
    reduceMotion: ReduceMotion.System,
  },

  emphasized: {
    duration: motion.duration.slow,
    easing: Easing.bezier(...motion.easing.emphasized),
    reduceMotion: ReduceMotion.System,
  },
} as const;

/**
 * Physics-based spring configurations.
 *
 * Intended for transform-driven interaction/feedback rather than layout
 * properties such as width/height/top/left.
 */
export const springPresets = {
  snappy: {
    ...motion.spring.snappy,
    reduceMotion: ReduceMotion.System,
  },

  standard: {
    ...motion.spring.standard,
    reduceMotion: ReduceMotion.System,
  },

  soft: {
    ...motion.spring.soft,
    reduceMotion: ReduceMotion.System,
  },
} as const;
