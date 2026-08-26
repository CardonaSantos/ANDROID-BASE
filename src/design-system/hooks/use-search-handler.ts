import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  MaybePromise,
  ValueChangeHandler,
} from '../contracts';

import { useControllableState } from './use-controllable-state';

export interface UseSearchHandlerOptions {
  value?: string;
  defaultValue?: string;
  onValueChange?: ValueChangeHandler<string>;

  onSearch?: (
    query: string,
  ) => MaybePromise<void>;

  debounceMs?: number;
  minimumLength?: number;
  trim?: boolean;
  searchOnMount?: boolean;
}

export const useSearchHandler = (
  options: UseSearchHandlerOptions = {},
) => {
  const isControlled =
    Object.prototype.hasOwnProperty.call(
      options,
      'value',
    );

  const [value, setValue] =
    useControllableState<string>(
      isControlled
        ? {
            value:
              options.value ?? '',
            defaultValue:
              options.defaultValue ??
              '',
            onValueChange:
              options.onValueChange,
          }
        : {
            defaultValue:
              options.defaultValue ??
              '',
            onValueChange:
              options.onValueChange,
          },
    );

  const [isDebouncing, setIsDebouncing] =
    useState(false);

  const {
    onSearch,
    debounceMs = 300,
    minimumLength = 0,
    trim = true,
    searchOnMount = false,
  } = options;

  const didMount =
    useRef(false);

  const normalize = useCallback(
    (query: string): string =>
      trim
        ? query.trim()
        : query,
    [trim],
  );

  const runSearch = useCallback(
    async (query: string) => {
      const normalized =
        normalize(query);

      if (
        normalized.length > 0 &&
        normalized.length <
          minimumLength
      ) {
        return;
      }

      await onSearch?.(
        normalized,
      );
    },
    [
      minimumLength,
      normalize,
      onSearch,
    ],
  );

  useEffect(() => {
    const shouldSkipMount =
      !didMount.current &&
      !searchOnMount;

    didMount.current = true;

    if (shouldSkipMount) {
      return;
    }

    setIsDebouncing(true);

    const timer = setTimeout(() => {
      void runSearch(value).finally(
        () => {
          setIsDebouncing(false);
        },
      );
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [
    debounceMs,
    runSearch,
    searchOnMount,
    value,
  ]);

  const clear = useCallback(() => {
    setValue('');
  }, [setValue]);

  const submit = useCallback(
    () => runSearch(value),
    [runSearch, value],
  );

  return {
    value,
    setValue,
    clear,
    submit,
    isDebouncing,
  } as const;
};
