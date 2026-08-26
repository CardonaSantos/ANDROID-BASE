import { interaction } from './interaction';

/**
 * NOVA accessibility design tokens.
 *
 * These are product-level policy values, not component implementations.
 * Reusable components must consume these instead of inventing local
 * accessibility dimensions or limits.
 */
export const accessibility = {
  touchTarget: {
    minimum: interaction.touchTarget.minimum,
    compact: interaction.touchTarget.compact,
  },

  focusRing: {
    width: 2,
    offset: 2,
    radiusOffset: 2,
  },

  contrast: {
    /**
     * WCAG 2.2 AA baseline.
     */
    normalText: 4.5,
    largeText: 3,
    nonTextUi: 3,
  },

  fontScaling: {
    /**
     * Global policy: never disable Dynamic Type/font scaling.
     *
     * Components may define a max multiplier only when there is a documented,
     * tested accessibility reason. There is intentionally no global max.
     */
    allowFontScaling: true,
  },

  liveRegion: {
    default: 'polite',
    urgent: 'assertive',
    off: 'none',
  },

  /**
   * Accessibility announcements should not duplicate rapid-fire UI updates.
   * Future feedback components can use this value when coalescing messages.
   */
  announcement: {
    dedupeWindowMs: 500,
  },
} as const;
