/**
 * NOVA motion tokens.
 *
 * These values describe the physical language of the product.
 * Reusable components must consume these tokens/presets instead of
 * hardcoding animation durations, scales or spring values.
 */
export const motion = {
  duration: {
    instant: 80,
    fast: 140,
    normal: 220,
    slow: 320,
    slower: 450,
  },

  /**
   * Cubic bezier control points.
   * `motion-presets.ts` converts these tuples to Reanimated Easing functions.
   */
  easing: {
    standard: [0.2, 0, 0, 1],
    enter: [0, 0, 0, 1],
    exit: [0.3, 0, 1, 1],
    emphasized: [0.2, 0, 0, 1],
  },

  spring: {
    /**
     * Fast, restrained feedback.
     * Buttons, icon buttons, chips, toggles.
     */
    snappy: {
      damping: 20,
      stiffness: 300,
      mass: 0.65,
      overshootClamping: false,
    },

    /**
     * General-purpose physical transition.
     * Cards, FABs, selectors, small panels.
     */
    standard: {
      damping: 22,
      stiffness: 230,
      mass: 0.8,
      overshootClamping: false,
    },

    /**
     * Larger/softer surfaces.
     * Panels, large content and expressive transitions.
     */
    soft: {
      damping: 24,
      stiffness: 170,
      mass: 1,
      overshootClamping: false,
    },
  },

  distance: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },

  scale: {
    normal: 1,
    pressedSubtle: 0.985,
    pressed: 0.97,
    pressedStrong: 0.95,
    enter: 0.96,
    overshoot: 1.02,
  },

  skeleton: {
    shimmerDuration: 1200,
    pulseDuration: 900,
  },
} as const;

export type MotionDurationToken = keyof typeof motion.duration;
export type MotionSpringToken = keyof typeof motion.spring;
export type MotionDistanceToken = keyof typeof motion.distance;
