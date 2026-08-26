import { useUnistyles } from 'react-native-unistyles';

import type { AppBreakpoint } from '../tokens';

export type ResponsiveValues<T> = {
  compact: T;
  medium?: T;
  expanded?: T;
  wide?: T;
};

const order: AppBreakpoint[] = [
  'compact',
  'medium',
  'expanded',
  'wide',
];

/**
 * Use only when JavaScript behavior itself must change by breakpoint.
 *
 * Purely visual responsive styling should remain inside Unistyles
 * breakpoint styles so it can update without React re-renders.
 */
export const useResponsiveValue = <T>(
  values: ResponsiveValues<T>,
): T => {
  const { rt } = useUnistyles();

  const breakpoint =
    (rt.breakpoint ??
      'compact') as AppBreakpoint;

  const startIndex = Math.max(
    0,
    order.indexOf(breakpoint),
  );

  for (
    let index = startIndex;
    index >= 0;
    index -= 1
  ) {
    const candidate =
      values[order[index]];

    if (candidate !== undefined) {
      return candidate;
    }
  }

  return values.compact;
};
