import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { accessibilityAnnouncer } from '../accessibility';
import type {
  ActionExecutionResult,
  AsyncActionHandler,
} from '../contracts';
import {
  appHaptics,
  type HapticFeedback,
} from '../haptics';
import { interaction } from '../tokens';

interface SuccessFeedback<TResult> {
  haptic?: HapticFeedback;
  announcement?:
    | string
    | ((result: TResult) => string);
}

interface ErrorFeedback {
  haptic?: HapticFeedback;
  announcement?:
    | string
    | ((error: unknown) => string);
}

export interface UseActionHandlerOptions<
  TArgs extends unknown[],
  TResult,
> {
  onAction: AsyncActionHandler<
    TArgs,
    TResult
  >;

  disabled?: boolean;

  preventRapidPress?: boolean;
  rapidPressThresholdMs?: number;

  successFeedback?: SuccessFeedback<TResult>;
  errorFeedback?: ErrorFeedback;

  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
}

const resolveMessage = <T,>(
  value:
    | string
    | ((input: T) => string)
    | undefined,
  input: T,
): string | undefined =>
  typeof value === 'function'
    ? value(input)
    : value;

/**
 * UI action coordinator.
 *
 * It does not know CRM/business rules and does not display Toasts. It only
 * coordinates action guards, pending/error state and optional semantic
 * haptic/screen-reader feedback.
 */
export const useActionHandler = <
  TArgs extends unknown[] = [],
  TResult = void,
>(
  options: UseActionHandlerOptions<
    TArgs,
    TResult
  >,
) => {
  const [pending, setPending] =
    useState(false);
  const [error, setError] =
    useState<unknown>(null);

  const lastExecutionAt = useRef(0);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const execute = useCallback(
    async (
      ...args: TArgs
    ): Promise<
      ActionExecutionResult<TResult>
    > => {
      if (
        options.disabled ||
        pending
      ) {
        return {
          status: 'ignored',
        };
      }

      const now = Date.now();

      const preventRapidPress =
        options.preventRapidPress ?? true;

      const threshold =
        options.rapidPressThresholdMs ??
        interaction.actionGuard
          .rapidPressThreshold;

      if (
        preventRapidPress &&
        now - lastExecutionAt.current <
          threshold
      ) {
        return {
          status: 'ignored',
        };
      }

      lastExecutionAt.current = now;

      setError(null);
      setPending(true);

      try {
        const result =
          await options.onAction(...args);

        const successHaptic =
          options.successFeedback?.haptic;

        if (
          successHaptic &&
          successHaptic !== 'none'
        ) {
          void appHaptics.trigger(
            successHaptic,
          );
        }

        const successMessage =
          resolveMessage(
            options.successFeedback
              ?.announcement,
            result,
          );

        if (successMessage) {
          accessibilityAnnouncer.polite(
            successMessage,
          );
        }

        options.onSuccess?.(result);

        return {
          status: 'success',
          data: result,
        };
      } catch (caughtError) {
        setError(caughtError);

        const errorHaptic =
          options.errorFeedback?.haptic;

        if (
          errorHaptic &&
          errorHaptic !== 'none'
        ) {
          void appHaptics.trigger(
            errorHaptic,
          );
        }

        const errorMessage =
          resolveMessage(
            options.errorFeedback
              ?.announcement,
            caughtError,
          );

        if (errorMessage) {
          accessibilityAnnouncer.assertive(
            errorMessage,
          );
        }

        options.onError?.(caughtError);

        return {
          status: 'error',
          error: caughtError,
        };
      } finally {
        setPending(false);
      }
    },
    [
      options,
      pending,
    ],
  );

  return {
    execute,
    pending,
    error,
    resetError,
  } as const;
};
