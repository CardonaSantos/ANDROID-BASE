/**
 * Physical interaction policy shared by all reusable controls.
 *
 * Keep visual styling out of this file. This describes interaction behavior:
 * touch sizes, state layers, loading timings, press retention and feedback.
 */
export const interaction = {
  touchTarget: {
    /**
     * NOVA default. Satisfies the common 48dp Android target while also
     * exceeding the typical 44pt iOS minimum.
     */
    minimum: 48,

    /**
     * Escape hatch for layouts where 48 is genuinely impossible.
     * Do not use as the default.
     */
    compact: 44,
  },

  hitSlop: {
    none: 0,
    compact: 4,
    normal: 8,
    generous: 12,
  },

  pressRetentionOffset: {
    top: 20,
    right: 20,
    bottom: 24,
    left: 20,
  },

  /**
   * React Native Pressable defaults to 500ms for long press.
   * We preserve that familiar platform behavior.
   */
  longPressDelay: 500,

  stateLayer: {
    hover: 0.06,
    focus: 0.10,
    pressed: 0.10,
    selected: 0.12,
    dragged: 0.16,
  },

  disabled: {
    contentOpacity: 0.38,
    containerOpacity: 0.12,
  },

  /**
   * Prevent visual flashing for extremely fast async operations.
   */
  loading: {
    indicatorDelay: 150,
    minimumVisible: 300,
  },

  /**
   * Not a global double-tap blocker.
   * Future network/destructive controls may opt into this guard.
   */
  actionGuard: {
    rapidPressThreshold: 300,
  },

  feedbackDuration: {
    short: 2500,
    normal: 4000,
    long: 6000,
  },
} as const;

export type InteractionHitSlopToken = keyof typeof interaction.hitSlop;
export type FeedbackDurationToken = keyof typeof interaction.feedbackDuration;
