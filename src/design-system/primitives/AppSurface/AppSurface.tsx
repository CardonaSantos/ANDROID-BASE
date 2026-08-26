import {
  forwardRef,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type {
  ComponentTone,
} from '../../contracts';
import type {
  ElevationToken,
  RadiusToken,
  SpacingToken,
} from '../../tokens';
import {
  resolveToneContainerColor,
} from '../../utils';

import type {
  AppSurfaceProps,
  AppSurfaceVariant,
} from './AppSurface.types';

export const AppSurface = forwardRef<
  ComponentRef<typeof View>,
  AppSurfaceProps
>(
  (
    {
      children,
      variant = 'flat',
      tone = 'neutral',
      radius = 'lg',
      padding = 'none',
      elevation,
      style,
      ...rest
    },
    ref,
  ) => {
    const resolvedElevation =
      elevation ??
      (variant === 'elevated'
        ? 'low'
        : 'none');

    return (
      <View
        ref={ref}
        style={[
          styles.surface(
            variant,
            tone,
            radius,
            padding,
            resolvedElevation,
          ),
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  },
);

AppSurface.displayName = 'AppSurface';

const styles = StyleSheet.create(
  (theme) => ({
    surface: (
      variant: AppSurfaceVariant,
      tone: ComponentTone,
      radius: RadiusToken,
      padding: SpacingToken,
      elevation:
        ElevationToken,
    ) => {
      const base = {
        borderRadius:
          theme.radius[radius],
        padding:
          theme.spacing[padding],
      };

      if (variant === 'tonal') {
        return {
          ...base,
          backgroundColor:
            resolveToneContainerColor(
              theme,
              tone,
            ),
        };
      }

      if (variant === 'outlined') {
        return {
          ...base,
          backgroundColor:
            theme.colors.surface,
          borderWidth:
            StyleSheet.hairlineWidth,
          borderColor:
            theme.colors.border,
        };
      }

      if (variant === 'elevated') {
        const level =
          theme.elevation[elevation];

        return {
          ...base,
          backgroundColor:
            theme.colors
              .surfaceElevated,
          elevation: level,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: Math.max(
              1,
              level,
            ),
          },
          shadowOpacity:
            theme.isDark
              ? 0.28
              : 0.10,
          shadowRadius:
            Math.max(
              2,
              level * 2,
            ),
        };
      }

      return {
        ...base,
        backgroundColor:
          theme.colors.surface,
      };
    },
  }),
);
