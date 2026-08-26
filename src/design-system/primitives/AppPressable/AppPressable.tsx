import {
  forwardRef,
  useCallback,
  useState,
  type ComponentRef,
} from 'react';
import {
  Pressable,
  View,
  type PressableProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import {
  buildAccessibilityState,
} from '../../accessibility';
import type {
  SemanticColorToken,
} from '../../contracts';
import {
  appHaptics,
} from '../../haptics';
import {
  pressInteractionPresets,
} from '../../interaction';
import {
  interaction as interactionTokens,
  type RadiusToken,
} from '../../tokens';
import {
  usePressFeedback,
} from '../../hooks';

import type {
  AppPressableProps,
  AppPressableRenderState,
  HitSlopPreset,
  TouchTargetPreset,
} from './AppPressable.types';

const AnimatedPressable =
  Animated.createAnimatedComponent(
    Pressable,
  );

const resolveHitSlop = (
  preset: HitSlopPreset,
): number =>
  interactionTokens.hitSlop[preset];

const resolveTouchTarget = (
  preset: TouchTargetPreset,
): number | undefined => {
  switch (preset) {
    case 'compact':
      return interactionTokens
        .touchTarget.compact;

    case 'minimum':
      return interactionTokens
        .touchTarget.minimum;

    case 'none':
    default:
      return undefined;
  }
};

export const AppPressable = forwardRef<
  ComponentRef<typeof Pressable>,
  AppPressableProps
>(
  (
    {
      children,
      style,
      disabled = false,
      loading = false,
      interaction = 'standard',
      haptic,
      touchTarget = 'minimum',
      hitSlopPreset = 'none',
      radius = 'md',
      showStateLayer = true,
      stateLayerColorToken = 'text',
      showFocusRing = true,
      accessibilityState,
      hitSlop,
      pressRetentionOffset,
      delayLongPress,
      onPress,
      onLongPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const isDisabled =
      disabled || loading;

    const [pressed, setPressed] =
      useState(false);
    const [hovered, setHovered] =
      useState(false);
    const [focused, setFocused] =
      useState(false);

    const feedback =
      usePressFeedback(
        interaction,
        isDisabled,
      );

    const handlePressIn =
      useCallback<
        NonNullable<
          PressableProps['onPressIn']
        >
      >(
        (event) => {
          setPressed(true);
          feedback.pressIn();
          onPressIn?.(event);
        },
        [
          feedback,
          onPressIn,
        ],
      );

    const handlePressOut =
      useCallback<
        NonNullable<
          PressableProps['onPressOut']
        >
      >(
        (event) => {
          setPressed(false);
          feedback.pressOut();
          onPressOut?.(event);
        },
        [
          feedback,
          onPressOut,
        ],
      );

    const handleHoverIn =
      useCallback<
        NonNullable<
          PressableProps['onHoverIn']
        >
      >(
        (event) => {
          setHovered(true);
          feedback.hoverIn();
          onHoverIn?.(event);
        },
        [
          feedback,
          onHoverIn,
        ],
      );

    const handleHoverOut =
      useCallback<
        NonNullable<
          PressableProps['onHoverOut']
        >
      >(
        (event) => {
          setHovered(false);
          feedback.hoverOut();
          onHoverOut?.(event);
        },
        [
          feedback,
          onHoverOut,
        ],
      );

    const handleFocus =
      useCallback<
        NonNullable<
          PressableProps['onFocus']
        >
      >(
        (event) => {
          setFocused(true);
          onFocus?.(event);
        },
        [onFocus],
      );

    const handleBlur =
      useCallback<
        NonNullable<
          PressableProps['onBlur']
        >
      >(
        (event) => {
          setFocused(false);
          onBlur?.(event);
        },
        [onBlur],
      );

    const handlePress =
      useCallback<
        NonNullable<
          PressableProps['onPress']
        >
      >(
        (event) => {
          if (!onPress) {
            return;
          }

          const presetHaptic =
            pressInteractionPresets[
              interaction
            ].haptic;

          const resolvedHaptic =
            haptic === false
              ? 'none'
              : haptic ??
                presetHaptic;

          if (
            resolvedHaptic !== 'none'
          ) {
            void appHaptics.trigger(
              resolvedHaptic,
            );
          }

          onPress(event);
        },
        [
          haptic,
          interaction,
          onPress,
        ],
      );

    const handleLongPress =
      useCallback<
        NonNullable<
          PressableProps['onLongPress']
        >
      >(
        (event) => {
          if (!onLongPress) {
            return;
          }

          void appHaptics.longPress();
          onLongPress(event);
        },
        [onLongPress],
      );

    const renderState: AppPressableRenderState =
      {
        pressed,
        hovered,
        focused,
        disabled: isDisabled,
      };

    const targetSize =
      resolveTouchTarget(
        touchTarget,
      );

    return (
      <AnimatedPressable
        ref={ref}
        disabled={isDisabled}
        accessibilityState={
          buildAccessibilityState({
            ...accessibilityState,
            disabled:
              isDisabled ||
              accessibilityState
                ?.disabled,
            busy:
              loading ||
              accessibilityState?.busy,
          })
        }
        hitSlop={
          hitSlop ??
          resolveHitSlop(
            hitSlopPreset,
          )
        }
        pressRetentionOffset={
          pressRetentionOffset ??
          interactionTokens
            .pressRetentionOffset
        }
        delayLongPress={
          delayLongPress ??
          interactionTokens
            .longPressDelay
        }
        onPress={
          onPress
            ? handlePress
            : undefined
        }
        onLongPress={
          onLongPress
            ? handleLongPress
            : undefined
        }
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.base,
          targetSize
            ? styles.touchTarget(
                targetSize,
              )
            : undefined,
          feedback.animatedStyle,
          style,
        ]}
        {...rest}
      >
        {typeof children ===
        'function'
          ? children(renderState)
          : children}

        {showStateLayer ? (
          <Animated.View
            style={[
              styles.overlay(radius),
              styles.stateLayer(
                stateLayerColorToken,
              ),
              feedback
                .stateLayerAnimatedStyle,
            ]}
          />
        ) : null}

        {showFocusRing &&
        focused &&
        !isDisabled ? (
          <View
            style={[
              styles.overlay(radius),
              styles.focusRing,
            ]}
          />
        ) : null}
      </AnimatedPressable>
    );
  },
);

AppPressable.displayName =
  'AppPressable';

const styles = StyleSheet.create(
  (theme) => ({
    base: {
      position: 'relative',
      _web: {
        cursor: 'pointer',
      },
    },

    touchTarget: (
      size: number,
    ) => ({
      minWidth: size,
      minHeight: size,
    }),

    overlay: (
      radius: RadiusToken,
    ) => ({
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius:
        theme.radius[radius],
    }),

    stateLayer: (
      colorToken:
        SemanticColorToken,
    ) => ({
      backgroundColor:
        theme.colors[colorToken],
    }),

    focusRing: {
      borderWidth:
        theme.accessibility.focusRing
          .width,
      borderColor:
        theme.colors.focusRing,
    },
  }),
);
