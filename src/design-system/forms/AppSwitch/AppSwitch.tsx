import {
  useEffect,
} from 'react';
import {
  I18nManager,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  appHaptics,
} from '../../haptics';
import {
  useControllableState,
} from '../../hooks';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  springPresets,
} from '../../motion';
import {
  AppPressable,
  AppText,
} from '../../primitives';

import type {
  AppSwitchProps,
  AppSwitchSize,
} from './AppSwitch.types';

const metrics = {
  sm: {
    width: 40,
    height: 24,
    thumb: 18,
    padding: 3,
  },
  md: {
    width: 48,
    height: 28,
    thumb: 22,
    padding: 3,
  },
} as const;

export const AppSwitch = ({
  value,
  defaultValue = false,
  onValueChange,
  label,
  description,
  size = 'md',
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: AppSwitchProps) => {
  const controlled =
    value !== undefined;

  const [
    enabled,
    setEnabled,
  ] =
    useControllableState<boolean>(
      controlled
        ? {
            value,
            defaultValue,
            onValueChange,
          }
        : {
            defaultValue,
            onValueChange,
          },
    );

  const current =
    metrics[size];

  const distance =
    current.width -
    current.thumb -
    current.padding * 2;

  /**
   * Capture a primitive direction value before entering the Reanimated
   * worklet. Do not access the React Native I18nManager object from UI-thread
   * animated styles.
   */
  const direction =
    I18nManager.isRTL
      ? -1
      : 1;

  const progress =
    useSharedValue(
      enabled ? 1 : 0,
    );

  useEffect(() => {
    progress.value =
      withSpring(
        enabled ? 1 : 0,
        springPresets.snappy,
      );
  }, [
    enabled,
    progress,
  ]);

  const thumbStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX:
            progress.value *
            distance *
            direction,
        },
      ],
    }));

  const resolvedLabel =
    accessibilityLabel ??
    (typeof label === 'string'
      ? label
      : undefined);

  return (
    <AppPressable
      accessibilityRole="switch"
      accessibilityLabel={
        resolvedLabel
      }
      accessibilityState={{
        checked: enabled,
        disabled,
      }}
      disabled={disabled}
      interaction="subtle"
      haptic={false}
      radius="md"
      touchTarget="minimum"
      stateLayerColorToken="primaryStrong"
      testID={testID}
      style={[
        styles.pressable,
        style,
      ]}
      onPress={() => {
        const next =
          !enabled;

        setEnabled(next);
        void appHaptics.toggle(
          next,
        );
      }}
    >
      <AppInline
        gap="md"
        align="center"
        justify="space-between"
      >
        {label ||
        description ? (
          <AppStack
            gap="xxs"
            flex
          >
            {label ? (
              <AppText
                variant="bodyMedium"
                tone={
                  disabled
                    ? 'disabled'
                    : 'default'
                }
              >
                {label}
              </AppText>
            ) : null}

            {description ? (
              <AppText
                variant="caption"
                tone={
                  disabled
                    ? 'disabled'
                    : 'secondary'
                }
              >
                {description}
              </AppText>
            ) : null}
          </AppStack>
        ) : null}

        <Animated.View
          style={styles.track(
            size,
            enabled,
            disabled,
          )}
        >
          <Animated.View
            style={[
              styles.thumb(
                size,
                disabled,
              ),
              I18nManager.isRTL
                ? {
                    right:
                      current.padding,
                  }
                : {
                    left:
                      current.padding,
                  },
              thumbStyle,
            ]}
          />
        </Animated.View>
      </AppInline>
    </AppPressable>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    pressable: {
      alignSelf: 'stretch',
      paddingVertical:
        theme.spacing.xs,
      paddingHorizontal:
        theme.spacing.xs,
    },

    track: (
      size: AppSwitchSize,
      enabled: boolean,
      disabled: boolean,
    ) => ({
      width:
        metrics[size].width,
      height:
        metrics[size].height,
      justifyContent: 'center',
      borderRadius:
        theme.radius.full,
      backgroundColor:
        disabled
          ? theme.colors
              .surfaceSecondary
          : enabled
            ? theme.colors.primary
            : theme.colors
                .borderStrong,
    }),

    thumb: (
      size: AppSwitchSize,
      disabled: boolean,
    ) => ({
      position: 'absolute',
      width:
        metrics[size].thumb,
      height:
        metrics[size].thumb,
      borderRadius:
        theme.radius.full,
      backgroundColor:
        disabled
          ? theme.colors
              .textDisabled
          : theme.colors.surface,
      elevation:
        theme.elevation.low,
    }),
  }),
);
