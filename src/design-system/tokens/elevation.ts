/**
 * Abstract elevation levels.
 * Individual components will decide how each level maps to native/web shadow.
 */
export const elevation = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  higher: 4,
  highest: 5,
} as const;

export type ElevationToken = keyof typeof elevation;
