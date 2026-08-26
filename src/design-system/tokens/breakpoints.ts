/**
 * Adaptive layout breakpoints in logical points.
 *
 * compact: phones
 * medium: large phones / small tablets
 * expanded: tablets
 * wide: desktop / wide web preview
 */
export const breakpoints = {
  compact: 0,
  medium: 600,
  expanded: 840,
  wide: 1200,
} as const;

export type AppBreakpoint = keyof typeof breakpoints;
