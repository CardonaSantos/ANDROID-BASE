import {
  useEffect,
} from 'react';
import Animated, {
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  useAccessibilityPreferences,
} from '../../accessibility';
import {
  motion,
  type RadiusToken,
} from '../../tokens';

import type {
  AppSkeletonProps,
  AppSkeletonVariant,
} from './AppSkeleton.types';

export const AppSkeleton = ({
  variant = 'rect',
  width = '100%',
  height,
  radius,
  animate = true,
  style,
  testID,
}: AppSkeletonProps) => {
  const {
    reduceMotionEnabled,
  } =
    useAccessibilityPreferences();

  const opacity =
    useSharedValue(1);

  useEffect(() => {
    if (
      !animate ||
      reduceMotionEnabled
    ) {
      cancelAnimation(opacity);
      opacity.value = 1;
      return;
    }

    opacity.value =
      withRepeat(
        withTiming(
          0.48,
          {
            duration:
              motion.skeleton
                .pulseDuration,
            reduceMotion:
              ReduceMotion.System,
          },
        ),
        -1,
        true,
        undefined,
        ReduceMotion.System,
      );

    return () => {
      cancelAnimation(opacity);
    };
  }, [
    animate,
    opacity,
    reduceMotionEnabled,
  ]);

  const animatedStyle =
    useAnimatedStyle(() => ({
      opacity:
        opacity.value,
    }));

  const resolvedHeight =
    height ??
    (variant === 'text'
      ? 14
      : variant === 'circle'
        ? 40
        : 80);

  const resolvedWidth =
    variant === 'circle'
      ? resolvedHeight
      : width;

  const resolvedRadius:
    RadiusToken =
      radius ??
      (variant === 'circle'
        ? 'full'
        : variant === 'text'
          ? 'sm'
          : 'md');

  return (
    <Animated.View
      accessible={false}
      aria-hidden
      testID={testID}
      style={[
        styles.skeleton(
          variant,
          resolvedRadius,
        ),
        {
          width:
            resolvedWidth,
          height:
            resolvedHeight,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    skeleton: (
      variant:
        AppSkeletonVariant,
      radius: RadiusToken,
    ) => ({
      overflow: 'hidden',
      borderRadius:
        theme.radius[radius],
      backgroundColor:
        variant === 'text'
          ? theme.colors.border
          : theme.colors
              .surfaceSecondary,
    }),
  }),
);
