import {
  ActivityIndicator,
  I18nManager,
  Platform,
  View,
} from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  StyleSheet,
  useUnistyles,
} from 'react-native-unistyles';

import {
  requireAccessibilityLabel,
} from '../../accessibility';
import { useLoadingState } from '../../hooks';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';
import { spacing } from '../../tokens';
import { resolveActionColorTokens } from '../action-colors';

import type {
  AppFabProps,
} from './AppFab.types';

export const AppFab = ({
  icon,
  accessibilityLabel,
  label,
  tone = 'primary',
  size = 'md',
  placement = 'inline',
  disabled = false,
  loading = false,
  interaction = 'expressive',
  style,
  ...rest
}: AppFabProps) => {
  const { theme } = useUnistyles();
  const insets =
    useSafeAreaInsets();

  const showLoading =
    useLoadingState(loading);

  const colors =
    resolveActionColorTokens(
      'solid',
      tone,
      disabled || loading,
    );

  const resolvedLabel =
    requireAccessibilityLabel(
      accessibilityLabel,
      'AppFab',
    );

  const physicalSize =
    theme.sizes.fab[size];

  const placeAtStart =
    placement === 'bottomStart';

  const placeOnLeft =
    I18nManager.isRTL
      ? !placeAtStart
      : placeAtStart;

  const floatingStyle =
    placement === 'inline'
      ? undefined
      : {
          position:
            'absolute' as const,
          bottom:
            insets.bottom +
            spacing.lg,
          ...(placeOnLeft
            ? {
                left:
                  insets.left +
                  spacing.lg,
              }
            : {
                right:
                  insets.right +
                  spacing.lg,
              }),
          zIndex:
            theme.zIndex.sticky,
        };

  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel={
        resolvedLabel
      }
      disabled={disabled}
      loading={loading}
      interaction={interaction}
      radius="full"
      stateLayerColorToken={
        colors.stateLayer
      }
      touchTarget="none"
      style={[
        styles.fab(
          physicalSize,
          Boolean(label),
          colors.container,
        ),
        floatingStyle,
        style,
      ]}
      {...rest}
    >
      <View
        style={[
          styles.content,
          showLoading
            ? styles.hiddenContent
            : undefined,
        ]}
      >
        <AppIcon
          icon={icon}
          size={
            size === 'lg'
              ? 'lg'
              : 'md'
          }
          colorToken={
            colors.content
          }
          decorative
        />

        {label ? (
          <AppText
            variant="labelLarge"
            colorToken={
              colors.content
            }
            numberOfLines={1}
          >
            {label}
          </AppText>
        ) : null}
      </View>

      {showLoading ? (
        <View
          style={styles.loader}
        >
          <ActivityIndicator
            size="small"
            color={
              theme.colors[
                colors.content
              ]
            }
          />
        </View>
      ) : null}
    </AppPressable>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    fab: (
      size: number,
      extended: boolean,
      container:
        | keyof typeof theme.colors
        | undefined,
    ) => ({
      minWidth: size,
      height: size,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal:
        extended
          ? theme.spacing.xl
          : 0,
      borderRadius:
        theme.radius.full,
      backgroundColor:
        container
          ? theme.colors[container]
          : theme.colors.primary,
      ...(Platform.OS === 'web'
        ? {
            boxShadow:
              `0px 3px 8px 0px ${theme.colors.shadow}`,
          }
        : Platform.OS ===
            'android'
          ? {
              elevation:
                theme.elevation
                  .high,
            }
          : {
              shadowColor:
                theme.colors
                  .shadow,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 1,
              shadowRadius: 8,
            }),
    }),

    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },

    hiddenContent: {
      opacity: 0,
    },

    loader: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
