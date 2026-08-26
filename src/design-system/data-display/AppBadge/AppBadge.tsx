import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  requireAccessibilityLabel,
} from '../../accessibility';
import {
  resolveActionColorTokens,
} from '../../actions/action-colors';
import {
  AppIcon,
  AppText,
} from '../../primitives';

import type {
  AppBadgeProps,
  AppBadgeSize,
  AppBadgeVariant,
} from './AppBadge.types';

export const AppBadge = ({
  children,
  icon,
  tone = 'neutral',
  variant = 'soft',
  size = 'sm',
  dot = false,
  accessibilityLabel,
  style,
  testID,
}: AppBadgeProps) => {
  const colors =
    resolveActionColorTokens(
      variant,
      tone,
      false,
    );

  const textLabel =
    typeof children === 'string' ||
    typeof children === 'number'
      ? String(children)
      : undefined;

  const resolvedLabel =
    dot && !textLabel
      ? requireAccessibilityLabel(
          accessibilityLabel,
          'AppBadge(dot)',
        )
      : accessibilityLabel ??
        textLabel;

  return (
    <View
      accessible={
        Boolean(resolvedLabel)
      }
      accessibilityRole={
        resolvedLabel
          ? 'text'
          : undefined
      }
      accessibilityLabel={
        resolvedLabel
      }
      testID={testID}
      style={[
        styles.badge(
          variant,
          size,
          colors.container,
          colors.border,
        ),
        style,
      ]}
    >
      {dot ? (
        <View
          accessible={false}
          style={styles.dot(
            colors.content,
          )}
        />
      ) : null}

      {!dot && icon ? (
        <AppIcon
          icon={icon}
          size={
            size === 'sm'
              ? 'xs'
              : 'sm'
          }
          colorToken={
            colors.content
          }
          decorative
        />
      ) : null}

      {!dot && children ? (
        typeof children ===
          'string' ||
        typeof children ===
          'number' ? (
          <AppText
            variant={
              size === 'sm'
                ? 'labelSmall'
                : 'labelMedium'
            }
            colorToken={
              colors.content
            }
            numberOfLines={1}
            accessible={
              !resolvedLabel
            }
          >
            {children}
          </AppText>
        ) : (
          children
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    badge: (
      variant: AppBadgeVariant,
      size: AppBadgeSize,
      container:
        | keyof typeof theme.colors
        | undefined,
      border:
        | keyof typeof theme.colors
        | undefined,
    ) => ({
      minHeight:
        size === 'sm'
          ? 20
          : 24,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal:
        size === 'sm'
          ? theme.spacing.sm
          : theme.spacing.md,
      borderRadius:
        theme.radius.full,
      backgroundColor:
        container
          ? theme.colors[container]
          : 'transparent',
      borderWidth:
        variant === 'outlined'
          ? 1
          : 0,
      borderColor:
        border
          ? theme.colors[border]
          : 'transparent',
    }),

    dot: (
      color:
        keyof typeof theme.colors,
    ) => ({
      width: 8,
      height: 8,
      borderRadius:
        theme.radius.full,
      backgroundColor:
        theme.colors[color],
    }),
  }),
);
