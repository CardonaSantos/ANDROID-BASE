import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { interaction } from '../tokens';

export interface UseLoadingStateOptions {
  delayMs?: number;
  minimumVisibleMs?: number;
}

/**
 * Stabilizes loading indicators:
 * - fast operations do not flash a spinner,
 * - once visible, the indicator stays long enough to be perceived.
 */
export const useLoadingState = (
  active: boolean,
  options: UseLoadingStateOptions = {},
): boolean => {
  const delayMs =
    options.delayMs ??
    interaction.loading.indicatorDelay;

  const minimumVisibleMs =
    options.minimumVisibleMs ??
    interaction.loading.minimumVisible;

  const [visible, setVisible] =
    useState(false);

  const visibleSince =
    useRef<number | null>(null);

  useEffect(() => {
    let timer:
      | ReturnType<typeof setTimeout>
      | undefined;

    if (active) {
      if (!visible) {
        timer = setTimeout(() => {
          visibleSince.current = Date.now();
          setVisible(true);
        }, delayMs);
      }
    } else if (visible) {
      const elapsed =
        visibleSince.current === null
          ? minimumVisibleMs
          : Date.now() -
            visibleSince.current;

      const remaining = Math.max(
        0,
        minimumVisibleMs - elapsed,
      );

      timer = setTimeout(() => {
        visibleSince.current = null;
        setVisible(false);
      }, remaining);
    } else {
      visibleSince.current = null;
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    active,
    delayMs,
    minimumVisibleMs,
    visible,
  ]);

  return visible;
};
