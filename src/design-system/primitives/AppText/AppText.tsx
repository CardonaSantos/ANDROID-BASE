import {
  forwardRef,
  type ComponentRef,
} from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  useAccessibilityPreferences,
} from '../../accessibility';
import type {
  ContentTone,
  SemanticColorToken,
} from '../../contracts';
import {
  fontFamilies,
  typography,
  type TypographyVariant,
} from '../../tokens';
import {
  resolveContentColor,
} from '../../utils';

import type {
  AppFontWeight,
  AppTextProps,
} from './AppText.types';

const weightOrder: AppFontWeight[] = [
  'regular',
  'medium',
  'semibold',
  'bold',
];

const getVariantWeight = (
  variant: TypographyVariant,
): AppFontWeight => {
  const family =
    typography[variant].fontFamily;

  if (family === fontFamilies.bold) {
    return 'bold';
  }

  if (
    family === fontFamilies.semibold
  ) {
    return 'semibold';
  }

  return 'regular';
};

const promoteWeight = (
  weight: AppFontWeight,
): AppFontWeight => {
  const index =
    weightOrder.indexOf(weight);

  return weightOrder[
    Math.min(
      weightOrder.length - 1,
      index + 1,
    )
  ];
};

export const AppText = forwardRef<
  ComponentRef<typeof Text>,
  AppTextProps
>(
  (
    {
      children,
      variant = 'bodyMedium',
      tone = 'default',
      colorToken,
      weight,
      align,
      style,
      allowFontScaling = true,
      respectBoldText = true,
      ...rest
    },
    ref,
  ) => {
    const {
      boldTextEnabled,
    } =
      useAccessibilityPreferences();

    const baseWeight =
      weight ??
      getVariantWeight(variant);

    const resolvedWeight =
      respectBoldText &&
      boldTextEnabled
        ? promoteWeight(baseWeight)
        : baseWeight;

    return (
      <Text
        ref={ref}
        allowFontScaling={
          allowFontScaling
        }
        style={[
          styles.base,
          styles.variant(variant),
          styles.tone(
            tone,
            colorToken,
          ),
          styles.weight(
            resolvedWeight,
          ),
          align
            ? styles.align(align)
            : undefined,
          style,
        ]}
        {...rest}
      >
        {children}
      </Text>
    );
  },
);

AppText.displayName = 'AppText';

const styles = StyleSheet.create(
  (theme) => ({
    base: {
      color: theme.colors.text,
    },

    variant: (
      variant: TypographyVariant,
    ) => ({
      ...theme.typography[variant],
    }),

    tone: (
      tone: ContentTone,
      colorToken:
        | SemanticColorToken
        | undefined,
    ) => ({
      color: resolveContentColor(
        theme,
        tone,
        colorToken,
      ),
    }),

    weight: (
      weight: AppFontWeight,
    ) => {
      switch (weight) {
        case 'bold':
          return {
            fontFamily:
              fontFamilies.bold,
            fontWeight: '700',
          };

        case 'semibold':
          return {
            fontFamily:
              fontFamilies.semibold,
            fontWeight: '600',
          };

        case 'medium':
          return {
            fontFamily:
              fontFamilies.medium,
            fontWeight: '500',
          };

        case 'regular':
        default:
          return {
            fontFamily:
              fontFamilies.regular,
            fontWeight: '400',
          };
      }
    },

    align: (
      align:
        | 'auto'
        | 'left'
        | 'right'
        | 'center'
        | 'justify',
    ) => ({
      textAlign: align,
    }),
  }),
);
