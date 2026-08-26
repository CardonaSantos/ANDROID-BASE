import {
  useEffect,
  useState,
} from 'react';
import {
  Snackbar,
} from 'react-native-paper';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  useUnistyles,
} from 'react-native-unistyles';

import {
  getAccessibleTimeout,
} from '../../accessibility';
import {
  feedbackPolicy,
} from '../../feedback';
import {
  resolveFeedbackToneTokens,
} from '../../feedback-components/feedback-colors';
import {
  useControllableState,
} from '../../hooks';
import {
  AppPortal,
} from '../../primitives';
import {
  interaction,
} from '../../tokens';

import type {
  AppSnackbarProps,
} from './AppSnackbar.types';

export const AppSnackbar = ({
  open,
  defaultOpen = false,
  onOpenChange,
  message,
  tone = 'neutral',
  position = 'bottom',
  duration,
  action,
  dismissOnAction = true,
  testID,
}: AppSnackbarProps) => {
  const { theme } =
    useUnistyles();

  const insets =
    useSafeAreaInsets();

  const controlled =
    open !== undefined;

  const [
    isOpen,
    setOpen,
  ] =
    useControllableState<boolean>(
      controlled
        ? {
            value:
              open ?? false,
            defaultValue:
              defaultOpen,
            onValueChange:
              onOpenChange,
          }
        : {
            defaultValue:
              defaultOpen,
            onValueChange:
              onOpenChange,
          },
    );

  const policy =
    feedbackPolicy[tone];

  const baseDuration =
    typeof duration === 'number'
      ? Math.max(
          0,
          duration,
        )
      : interaction
          .feedbackDuration[
            duration ??
              policy.duration
          ];

  const [
    accessibleDuration,
    setAccessibleDuration,
  ] =
    useState(
      baseDuration,
    );

  useEffect(() => {
    let active = true;

    void getAccessibleTimeout(
      baseDuration,
    ).then(
      (resolved) => {
        if (active) {
          setAccessibleDuration(
            resolved,
          );
        }
      },
    );

    return () => {
      active = false;
    };
  }, [baseDuration]);

  const tokens =
    resolveFeedbackToneTokens(
      tone,
    );

  return (
    <AppPortal>
      <Snackbar
        visible={isOpen}
        duration={
          accessibleDuration
        }
        onDismiss={() => {
          setOpen(false);
        }}
        action={
          action
            ? {
                label:
                  action.label,
                accessibilityLabel:
                  action
                    .accessibilityLabel ??
                  action.label,
                disabled:
                  action.disabled ||
                  action.loading,
                onPress: () => {
                  action.onPress();

                  if (
                    dismissOnAction
                  ) {
                    setOpen(false);
                  }
                },
              }
            : undefined
        }
        wrapperStyle={{
          position: 'absolute',
          left:
            theme.spacing.md,
          right:
            theme.spacing.md,
          ...(position === 'top'
            ? {
                top:
                  insets.top +
                  theme.spacing.md,
              }
            : {
                bottom:
                  insets.bottom +
                  theme.spacing.md,
              }),
          zIndex:
            theme.zIndex.toast,
        }}
        style={{
          backgroundColor:
            theme.colors[
              tokens.container
            ],
        }}
        theme={{
          colors: {
            inverseOnSurface:
              theme.colors[
                tokens.content
              ],
            inversePrimary:
              theme.colors[
                tokens.strong
              ],
          },
        }}
        testID={testID}
      >
        {message}
      </Snackbar>
    </AppPortal>
  );
};
