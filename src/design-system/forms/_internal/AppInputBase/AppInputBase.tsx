import {
  forwardRef,
  useCallback,
  useState,
  type ComponentRef,
} from 'react';
import {
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  timingPresets,
} from '../../../motion';

import type {
  AppInputBaseProps,
} from './AppInputBase.types';

export const AppInputBase =
  forwardRef<
    ComponentRef<typeof TextInput>,
    AppInputBaseProps
  >(
    (
      {
        size = 'md',
        invalid = false,
        readOnly = false,
        editable = true,
        leading,
        trailing,
        containerStyle,
        inputStyle,
        allowFontScaling = true,
        onFocus,
        onBlur,
        placeholderTextColor,
        selectionColor,
        cursorColor,
        ...rest
      },
      ref,
    ) => {
      const disabled =
        editable === false &&
        !readOnly;

      const [focused, setFocused] =
        useState(false);

      const focusOpacity =
        useSharedValue(0);

      const animateFocus = useCallback(
        (next: number) => {
          focusOpacity.value =
            withTiming(
              next,
              timingPresets.fast,
            );
        },
        [focusOpacity],
      );

      const handleFocus =
        useCallback<
          NonNullable<
            TextInputProps['onFocus']
          >
        >(
          (event) => {
            setFocused(true);
            animateFocus(1);
            onFocus?.(event);
          },
          [
            animateFocus,
            onFocus,
          ],
        );

      const handleBlur =
        useCallback<
          NonNullable<
            TextInputProps['onBlur']
          >
        >(
          (event) => {
            setFocused(false);
            animateFocus(0);
            onBlur?.(event);
          },
          [
            animateFocus,
            onBlur,
          ],
        );

      const focusAnimatedStyle =
        useAnimatedStyle(() => ({
          opacity:
            focusOpacity.value,
        }));

      return (
        <View
          style={[
            styles.container(
              size,
              invalid,
              disabled,
              readOnly,
            ),
            containerStyle,
          ]}
        >
          {leading ? (
            <View
              pointerEvents="box-none"
              style={styles.slot}
            >
              {leading}
            </View>
          ) : null}

          <TextInput
            ref={ref}
            editable={
              readOnly
                ? false
                : editable
            }
            readOnly={readOnly}
            allowFontScaling={
              allowFontScaling
            }
            placeholderTextColor={
              placeholderTextColor
            }
            selectionColor={
              selectionColor
            }
            cursorColor={
              cursorColor
            }
            accessibilityState={{
              disabled,
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              styles.input(
                size,
                disabled,
              ),
              inputStyle,
            ]}
            {...rest}
          />

          {trailing ? (
            <View
              pointerEvents="box-none"
              style={styles.slot}
            >
              {trailing}
            </View>
          ) : null}

          {!invalid &&
          focused ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.focusRing,
                focusAnimatedStyle,
              ]}
            />
          ) : null}
        </View>
      );
    },
  );

AppInputBase.displayName =
  'AppInputBase';

const styles = StyleSheet.create(
  (theme) => ({
    container: (
      size:
        | 'sm'
        | 'md'
        | 'lg',
      invalid: boolean,
      disabled: boolean,
      readOnly: boolean,
    ) => ({
      minHeight:
        theme.sizes.control[size],
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal:
        size === 'sm'
          ? theme.spacing.md
          : theme.spacing.lg,
      borderWidth: 1,
      borderColor:
        invalid
          ? theme.colors.danger
          : theme.colors.border,
      borderRadius:
        theme.radius.md,
      backgroundColor:
        disabled
          ? theme.colors
              .surfaceSecondary
          : readOnly
            ? theme.colors
                .surfaceSecondary
            : theme.colors.surface,
      /**
       * Disabled presentation is expressed through semantic surface/content
       * colors instead of dimming the entire control, preserving legibility.
       */
      opacity: 1,
    }),

    input: (
      size:
        | 'sm'
        | 'md'
        | 'lg',
      disabled: boolean,
    ) => ({
      minWidth: 0,
      flex: 1,
      paddingVertical:
        size === 'sm'
          ? theme.spacing.sm
          : theme.spacing.md,
      color:
        disabled
          ? theme.colors
              .textDisabled
          : theme.colors.text,
      fontFamily:
        theme.typography
          .bodyMedium.fontFamily,
      fontSize:
        size === 'lg'
          ? theme.typography
              .bodyLarge.fontSize
          : theme.typography
              .bodyMedium.fontSize,
      lineHeight:
        size === 'lg'
          ? theme.typography
              .bodyLarge.lineHeight
          : theme.typography
              .bodyMedium.lineHeight,
    }),

    slot: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    focusRing: {
      position: 'absolute',
      top: -1,
      right: -1,
      bottom: -1,
      left: -1,
      borderWidth:
        theme.accessibility
          .focusRing.width,
      borderColor:
        theme.colors.focusRing,
      borderRadius:
        theme.radius.md,
    },
  }),
);
