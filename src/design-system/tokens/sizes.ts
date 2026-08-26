/**
 * Shared physical sizes.
 * Accessibility-specific policies will be added in the accessibility layer.
 */
export const sizes = {
  icon: {
    xs: 14,
    sm: 18,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
  },

  control: {
    /**
     * Interactive control heights intentionally align with NOVA's
     * accessibility touch-target policy.
     */
    sm: 44,
    md: 48,
    lg: 52,
    xl: 56,
  },

  avatar: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 96,
  },

  fab: {
    md: 56,
    lg: 64,
  },

  content: {
    compactMaxWidth: 600,
    readableMaxWidth: 720,
    pageMaxWidth: 1200,
  },
} as const;
