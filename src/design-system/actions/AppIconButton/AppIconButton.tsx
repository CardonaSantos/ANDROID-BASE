import {
  ActivityIndicator,
} from 'react-native';
import {
  StyleSheet,
  useUnistyles,
} from 'react-native-unistyles';

import {
  requireAccessibilityLabel,
} from '../../accessibility';
import type {
  ComponentSize,
  VisualVariant,
} from '../../contracts';
import { useLoadingState } from '../../hooks';
import {
  AppIcon,
  AppPressable,
} from '../../primitives';
import { resolveActionColorTokens } from '../action-colors';

import type {
  AppIconButtonProps,
} from './AppIconButton.types';

const iconSizeByControlSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

const touchTargetBySize = {
  sm: 'compact',
  md: 'minimum',
  lg: 'none',
} as const;

export const AppIconButton = ({
  icon,
  accessibilityLabel,
  variant = 'ghost',
  tone = 'neutral',
  size = 'md',
  disabled = false,
  loading = false,
  loadingAccessibilityLabel,
  interaction = 'standard',
  style,
  ...rest
}: AppIconButtonProps) => {
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

  const label =
    requireAccessibilityLabel(
      loading &&
        loadingAccessibilityLabel
        ? loadingAccessibilityLabel
        : accessibilityLabel,
      'AppIconButton',
    );

  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      loading={loading}
      interaction={interaction}
      radius="full"
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
        ),
        style,
      ]}
      {...rest}
    >
      {showLoading ? (
        <ActivityIndicator
          size="small"
          color={
            theme.colors[
              colors.content
            ]
          }
        />
      ) : (
        <AppIcon
          icon={icon}
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
      )}
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
    ) => ({
      width:
        theme.sizes.control[size],
      height:
        theme.sizes.control[size],
      alignItems: 'center',
      justifyContent: 'center',
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
  }),
);
