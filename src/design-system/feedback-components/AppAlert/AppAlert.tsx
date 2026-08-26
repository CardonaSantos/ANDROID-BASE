import {
  useEffect,
} from 'react';
import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleX,
  Info,
  X,
} from 'lucide-react-native';
import {
  View,
} from 'react-native';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  accessibilityAnnouncer,
  toAccessibilityLiveRegion,
} from '../../accessibility';
import {
  AppIconButton,
} from '../../actions';
import type {
  FeedbackTone,
} from '../../feedback';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppIcon,
  AppText,
} from '../../primitives';

import {
  feedbackCopy,
} from '../feedback.copy';
import {
  resolveFeedbackToneTokens,
} from '../feedback-colors';

import type {
  AppAlertProps,
  AppAlertDensity,
} from './AppAlert.types';

const defaultIcon = {
  neutral: CircleHelp,
  success: CircleCheck,
  warning: CircleAlert,
  danger: CircleX,
  info: Info,
} as const;

const defaultLiveRegion = (
  tone: FeedbackTone,
):
  | 'off'
  | 'polite'
  | 'assertive' => {
  if (tone === 'danger') {
    return 'assertive';
  }

  if (
    tone === 'success' ||
    tone === 'warning' ||
    tone === 'info'
  ) {
    return 'polite';
  }

  return 'off';
};

export const AppAlert = ({
  title,
  children,
  icon,
  tone = 'info',
  density = 'default',
  action,
  onDismiss,
  dismissAccessibilityLabel =
    feedbackCopy.alert.dismiss,
  liveRegion,
  announceOnMount = false,
  announcement,
  style,
  testID,
}: AppAlertProps) => {
  const tokens =
    resolveFeedbackToneTokens(
      tone,
    );

  const Icon =
    icon === null
      ? null
      : icon ??
        defaultIcon[tone];

  const resolvedLiveRegion =
    liveRegion ??
    defaultLiveRegion(tone);

  useEffect(() => {
    if (
      !announceOnMount
    ) {
      return;
    }

    const message =
      announcement ??
      (typeof title === 'string'
        ? title
        : undefined);

    if (!message) {
      return;
    }

    if (
      resolvedLiveRegion ===
      'assertive'
    ) {
      accessibilityAnnouncer
        .assertive(message);
    } else if (
      resolvedLiveRegion ===
      'polite'
    ) {
      accessibilityAnnouncer
        .polite(message);
    }
  }, [
    announceOnMount,
    announcement,
    resolvedLiveRegion,
    title,
  ]);

  return (
    <View
      accessibilityLiveRegion={
        toAccessibilityLiveRegion(
          resolvedLiveRegion,
        )
      }
      testID={testID}
      style={[
        styles.alert(
          density,
          tokens.container,
        ),
        style,
      ]}
    >
      <AppInline
        gap={
          density === 'compact'
            ? 'sm'
            : 'md'
        }
        align="flex-start"
      >
        {Icon ? (
          <View
            style={
              styles.iconSlot(
                density,
              )
            }
          >
            <AppIcon
              icon={Icon}
              size={
                density ===
                'compact'
                  ? 'sm'
                  : 'md'
              }
              colorToken={
                tokens.strong
              }
              decorative
            />
          </View>
        ) : null}

        <AppStack
          gap={
            density === 'compact'
              ? 'xxs'
              : 'xs'
          }
          flex
          style={styles.content}
        >
          {title ? (
            typeof title ===
              'string' ||
            typeof title ===
              'number' ? (
              <AppText
                variant={
                  density ===
                    'compact'
                    ? 'labelLarge'
                    : 'titleSmall'
                }
                colorToken={
                  tokens.content
                }
                weight="semibold"
              >
                {title}
              </AppText>
            ) : (
              title
            )
          ) : null}

          {children ? (
            typeof children ===
              'string' ||
            typeof children ===
              'number' ? (
              <AppText
                variant={
                  density ===
                    'compact'
                    ? 'bodySmall'
                    : 'bodyMedium'
                }
                colorToken={
                  tokens.content
                }
              >
                {children}
              </AppText>
            ) : (
              children
            )
          ) : null}

          {action ? (
            <View
              style={
                styles.action
              }
            >
              {action}
            </View>
          ) : null}
        </AppStack>

        {onDismiss ? (
          <AppIconButton
            icon={X}
            size="sm"
            variant="ghost"
            tone="neutral"
            interaction="subtle"
            accessibilityLabel={
              dismissAccessibilityLabel
            }
            onPress={onDismiss}
          />
        ) : null}
      </AppInline>
    </View>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    alert: (
      density:
        AppAlertDensity,
      container:
        keyof typeof theme.colors,
    ) => ({
      width: '100%',
      borderRadius:
        theme.radius.lg,
      padding:
        density === 'compact'
          ? theme.spacing.md
          : theme.spacing.lg,
      backgroundColor:
        theme.colors[container],
    }),

    iconSlot: (
      density:
        AppAlertDensity,
    ) => ({
      minHeight:
        density === 'compact'
          ? 24
          : 28,
      justifyContent: 'center',
    }),

    content: {
      minWidth: 0,
    },

    action: {
      alignSelf: 'flex-start',
      marginTop:
        theme.spacing.xs,
    },
  }),
);
