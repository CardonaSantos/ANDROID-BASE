import { ActivityIndicator, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type {
  ComponentSize,
  VisualVariant,
} from '../../contracts';
import {
  resolveAccessibilityLabel,
} from '../../accessibility';
import { useLoadingState } from '../../hooks';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';
import { resolveActionColorTokens } from '../action-colors';

import type {
  AppButtonProps,
} from './AppButton.types';

const iconSizeByControlSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

const textVariantBySize = {
  sm: 'labelMedium',
  md: 'labelLarge',
  lg: 'labelLarge',
} as const;

const touchTargetBySize = {
  sm: 'compact',
  md: 'minimum',
  lg: 'none',
} as const;

export const AppButton = ({
  children,
  variant = 'solid',
  tone = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  disabled = false,
  loading = false,
  loadingAccessibilityLabel,
  accessibilityLabel,
  interaction = 'standard',
  style,
  ...rest
}: AppButtonProps) => {
  const { theme } = useUnistyles();

  const showLoading =
    useLoadingState(loading);

  const isDisabled =
    disabled || loading;

  const colors =
    resolveActionColorTokens(
      variant,
      tone,
      isDisabled,
    );

  const derivedLabel =
    typeof children === 'string' ||
    typeof children === 'number'
      ? String(children)
      : undefined;

  const resolvedLabel =
    resolveAccessibilityLabel({
      explicit:
        loading &&
        loadingAccessibilityLabel
          ? loadingAccessibilityLabel
          : accessibilityLabel,
      fallback: derivedLabel,
    });

  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel={
        resolvedLabel
      }
      disabled={disabled}
      loading={loading}
      interaction={interaction}
      radius="md"
      stateLayerColorToken={
        colors.stateLayer
      }
      touchTarget={
        touchTargetBySize[size]
      }
      hitSlopPreset={
        size === 'sm'
          ? 'compact'
          : 'none'
      }
      style={[
        styles.button(
          variant,
          size,
          colors.container,
          colors.border,
          fullWidth,
        ),
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
        {leadingIcon ? (
          <AppIcon
            icon={leadingIcon}
            size={
              iconSizeByControlSize[
                size
              ]
            }
            colorToken={
              colors.content
            }
            decorative
          />
        ) : null}

        {typeof children ===
          'string' ||
        typeof children ===
          'number' ? (
          <AppText
            variant={
              textVariantBySize[size]
            }
            colorToken={
              colors.content
            }
            numberOfLines={1}
          >
            {children}
          </AppText>
        ) : (
          children
        )}

        {trailingIcon ? (
          <AppIcon
            icon={trailingIcon}
            size={
              iconSizeByControlSize[
                size
              ]
            }
            colorToken={
              colors.content
            }
            decorative
          />
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
    button: (
      variant: VisualVariant,
      size: ComponentSize,
      container:
        | keyof typeof theme.colors
        | undefined,
      border:
        | keyof typeof theme.colors
        | undefined,
      fullWidth: boolean,
    ) => ({
      minHeight:
        theme.sizes.control[size],
      alignSelf: fullWidth
        ? 'stretch'
        : 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal:
        size === 'sm'
          ? theme.spacing.md
          : size === 'lg'
            ? theme.spacing['2xl']
            : theme.spacing.lg,
      borderRadius:
        theme.radius.md,
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

    content: {
      minWidth: 0,
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
