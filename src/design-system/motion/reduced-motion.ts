import { ReduceMotion } from 'react-native-reanimated';

import type {
  MotionPreference,
  MotionPurpose,
} from './motion.types';

/**
 * Maps a NOVA preference to Reanimated's global reduced-motion semantics.
 *
 * - system  -> respect OS preference
 * - reduced -> always reduce
 * - full    -> never reduce
 */
export const resolveReduceMotionMode = (
  preference: MotionPreference,
): ReduceMotion => {
  switch (preference) {
    case 'reduced':
      return ReduceMotion.Always;

    case 'full':
      return ReduceMotion.Never;

    case 'system':
    default:
      return ReduceMotion.System;
  }
};

/**
 * Policy used when a component needs to decide what to do instead of merely
 * relying on Reanimated to skip an animation.
 *
 * Example: a decorative looping animation should disappear entirely in
 * reduced-motion mode, while functional feedback may degrade to a short fade.
 */
export const reducedMotionPolicy: Record<
  MotionPurpose,
  'keep' | 'simplify' | 'disable'
> = {
  functional: 'keep',
  feedback: 'simplify',
  navigation: 'simplify',
  decorative: 'disable',
};
