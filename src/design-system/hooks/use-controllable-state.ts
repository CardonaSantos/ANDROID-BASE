import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from 'react';

import type { ValueChangeHandler } from '../contracts';

export interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onValueChange?: ValueChangeHandler<T>;
}

/**
 * Controlled/uncontrolled state helper used by switches, tabs, selects,
 * disclosure controls and future form primitives.
 *
 * Controlled mode is detected by property presence, not `value !== undefined`,
 * so `undefined` can itself be a legitimate controlled value when T allows it.
 */
export const useControllableState = <T>(
  options: UseControllableStateOptions<T>,
): readonly [
  T,
  (next: SetStateAction<T>) => void,
] => {
  const isControlled =
    Object.prototype.hasOwnProperty.call(
      options,
      'value',
    );

  const {
    value,
    defaultValue,
    onValueChange,
  } = options;

  const wasControlled =
    useRef(isControlled);

  useEffect(() => {
    if (
      __DEV__ &&
      wasControlled.current !==
        isControlled
    ) {
      console.warn(
        '[NOVA design-system] A component changed between controlled and uncontrolled mode. Keep the same state mode for the component lifetime.',
      );
    }

    wasControlled.current =
      isControlled;
  }, [isControlled]);

  const [
    uncontrolledValue,
    setUncontrolledValue,
  ] = useState<T>(
    defaultValue,
  );

  const currentValue =
    isControlled
      ? (value as T)
      : uncontrolledValue;

  const setValue = useCallback(
    (next: SetStateAction<T>): void => {
      const resolved =
        typeof next === 'function'
          ? (
              next as (
                previous: T,
              ) => T
            )(currentValue)
          : next;

      if (!isControlled) {
        setUncontrolledValue(resolved);
      }

      onValueChange?.(resolved);
    },
    [
      currentValue,
      isControlled,
      onValueChange,
    ],
  );

  return [currentValue, setValue] as const;
};
