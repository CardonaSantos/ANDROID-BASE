import {
  useEffect,
} from 'react';
import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleX,
  Info,
} from 'lucide-react-native';
import {
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  ReduceMotion,
} from 'react-native-reanimated';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  accessibilityAnnouncer,
  getAccessibleTimeout,
} from '../../accessibility';
import {
  feedbackPolicy,
  type FeedbackTone,
} from '../../feedback';
import {
  resolveFeedbackToneTokens,
} from '../../feedback-components/feedback-colors';
import {
  appHaptics,
} from '../../haptics';
import {
  useControllableState,
} from '../../hooks';
import {
  AppInline,
} from '../../layout';
import {
  AppIcon,
  AppPortal,
  AppSurface,
  AppText,
} from '../../primitives';
import {
  interaction,
  motion,
} from '../../tokens';

import type {
  AppToastProps,
} from './AppToast.types';

const defaultIcon = {
  neutral: CircleHelp,
  success: CircleCheck,
  warning: CircleAlert,
  danger: CircleX,
  info: Info,
} as const;

const topEntering =
  FadeInUp
    .duration(
      motion.duration.normal,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

const topExiting =
  FadeOutUp
    .duration(
      motion.duration.fast,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

const bottomEntering =
  FadeInDown
    .duration(
      motion.duration.normal,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

const bottomExiting =
  FadeOutDown
    .duration(
      motion.duration.fast,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

export const AppToast = ({
  open,
  defaultOpen = false,
  onOpenChange,
  message,
  icon,
  tone = 'info',
  position = 'bottom',
  duration,
  announceOnOpen = true,
  hapticOnOpen = true,
  style,
  testID,
}: AppToastProps) => {
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let active = true;
    let timer:
      | ReturnType<
          typeof setTimeout
        >
      | undefined;

    if (announceOnOpen) {
      const announcement =
        typeof message === 'string' ||
        typeof message === 'number'
          ? String(message)
          : undefined;

      if (announcement) {
        if (
          tone === 'danger'
        ) {
          accessibilityAnnouncer
            .assertive(
              announcement,
            );
        } else {
          accessibilityAnnouncer
            .polite(
              announcement,
            );
        }
      }
    }

    if (
      hapticOnOpen &&
      policy.haptic !== 'none'
    ) {
      void appHaptics.trigger(
        policy.haptic,
      );
    }

    void getAccessibleTimeout(
      baseDuration,
    ).then(
      (
        accessibleDuration,
      ) => {
        if (!active) {
          return;
        }

        timer = setTimeout(
          () => {
            setOpen(false);
          },
          accessibleDuration,
        );
      },
    );

    return () => {
      active = false;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    announceOnOpen,
    baseDuration,
    hapticOnOpen,
    isOpen,
    message,
    policy.haptic,
    setOpen,
    tone,
  ]);

  if (!isOpen) {
    return null;
  }

  const tokens =
    resolveFeedbackToneTokens(
      tone,
    );

  const Icon =
    icon === null
      ? null
      : icon ??
        defaultIcon[tone];

  return (
    <AppPortal>
      <Animated.View
        entering={
          position === 'top'
            ? topEntering
            : bottomEntering
        }
        exiting={
          position === 'top'
            ? topExiting
            : bottomExiting
        }
        pointerEvents="none"
        testID={testID}
        style={[
          styles.position(
            position,
            insets.top,
            insets.bottom,
          ),
          style,
        ]}
      >
        <AppSurface
          variant="elevated"
          radius="lg"
          padding="none"
          elevation="medium"
          style={styles.toast}
        >
          <View
            style={
              styles.toneLayer(
                tokens.container,
              )
            }
          >
            <AppInline
              gap="sm"
              align="center"
            >
              {Icon ? (
                <AppIcon
                  icon={Icon}
                  size="md"
                  colorToken={
                    tokens.strong
                  }
                  decorative
                />
              ) : null}

              {typeof message ===
                'string' ||
              typeof message ===
                'number' ? (
                <AppText
                  variant="bodyMedium"
                  colorToken={
                    tokens.content
                  }
                  weight="medium"
                  accessible={false}
                >
                  {message}
                </AppText>
              ) : (
                message
              )}
            </AppInline>
          </View>
        </AppSurface>
      </Animated.View>
    </AppPortal>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    position: (
      position:
        | 'top'
        | 'bottom',
      insetTop: number,
      insetBottom: number,
    ) => ({
      position: 'absolute',
      left: theme.spacing.lg,
      right: theme.spacing.lg,
      zIndex:
        theme.zIndex.toast,
      ...(position === 'top'
        ? {
            top:
              insetTop +
              theme.spacing.lg,
          }
        : {
            bottom:
              insetBottom +
              theme.spacing.lg,
          }),
      alignItems: 'center',
    }),

    toast: {
      maxWidth: 560,
      width: '100%',
      overflow: 'hidden',
    },

    toneLayer: (
      container:
        keyof typeof theme.colors,
    ) => ({
      padding:
        theme.spacing.md,
      borderRadius:
        theme.radius.lg,
      backgroundColor:
        theme.colors[container],
    }),
  }),
);
