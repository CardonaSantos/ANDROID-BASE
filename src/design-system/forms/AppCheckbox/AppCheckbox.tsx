import {
  useEffect,
} from 'react';
import {
  Check,
  Minus,
} from 'lucide-react-native';
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
  springPresets,
} from '../../motion';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';

import type {
  AppCheckboxProps,
} from './AppCheckbox.types';

export const AppCheckbox = ({
  value,
  defaultValue = false,
  onValueChange,
  indeterminate = false,
  label,
  description,
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: AppCheckboxProps) => {
  const controlled =
    value !== undefined;

  const [
    checked,
    setChecked,
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

  const iconScale =
    useSharedValue(
      checked ||
      indeterminate
        ? 1
        : 0.75,
    );

  const iconOpacity =
    useSharedValue(
      checked ||
      indeterminate
        ? 1
        : 0,
    );

  useEffect(() => {
    const active =
      checked ||
      indeterminate;

    iconScale.value =
      withSpring(
        active ? 1 : 0.75,
        springPresets.snappy,
      );

    iconOpacity.value =
      withSpring(
        active ? 1 : 0,
        springPresets.snappy,
      );
  }, [
    checked,
    iconOpacity,
    iconScale,
    indeterminate,
  ]);

  const iconStyle =
    useAnimatedStyle(() => ({
      opacity:
        iconOpacity.value,
      transform: [
        {
          scale:
            iconScale.value,
        },
      ],
    }));

  const active =
    checked ||
    indeterminate;

  const resolvedLabel =
    accessibilityLabel ??
    (typeof label === 'string'
      ? label
      : undefined);

  return (
    <AppPressable
      accessibilityRole="checkbox"
      accessibilityLabel={
        resolvedLabel
      }
      accessibilityState={{
        checked: indeterminate
          ? 'mixed'
          : checked,
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
          indeterminate
            ? true
            : !checked;

        setChecked(next);

        void appHaptics.toggle(
          next,
        );
      }}
    >
      <AppInline
        gap="md"
        align="center"
        flex
      >
        <Animated.View
          style={[
            styles.box(
              active,
              disabled,
            ),
          ]}
        >
          <Animated.View
            style={iconStyle}
          >
            <AppIcon
              icon={
                indeterminate
                  ? Minus
                  : Check
              }
              size="sm"
              colorToken={
                active
                  ? 'onPrimary'
                  : 'textDisabled'
              }
              strokeWidth={3}
              decorative
            />
          </Animated.View>
        </Animated.View>

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

    box: (
      active: boolean,
      disabled: boolean,
    ) => ({
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:
        theme.radius.xs,
      borderWidth: 2,
      borderColor:
        disabled
          ? theme.colors
              .border
          : active
            ? theme.colors
                .primaryStrong
            : theme.colors
                .borderStrong,
      backgroundColor:
        active
          ? disabled
            ? theme.colors
                .surfaceSecondary
            : theme.colors
                .primary
          : 'transparent',
    }),
  }),
);
