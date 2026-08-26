import {
  useEffect,
} from 'react';
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
import {
  useAppRadioGroup,
} from '../AppRadioGroup';

import type {
  AppRadioProps,
} from './AppRadio.types';

export const AppRadio = ({
  value,
  label,
  description,
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: AppRadioProps) => {
  const group =
    useAppRadioGroup();

  if (__DEV__ && !group) {
    console.warn(
      '[NOVA design-system] AppRadio must be rendered inside AppRadioGroup.',
    );
  }

  const groupDisabled =
    group?.disabled ?? true;

  const isDisabled =
    disabled ||
    groupDisabled;

  const selected =
    group?.value === value;

  const scale =
    useSharedValue(
      selected ? 1 : 0,
    );

  useEffect(() => {
    scale.value =
      withSpring(
        selected ? 1 : 0,
        springPresets.snappy,
      );
  }, [
    scale,
    selected,
  ]);

  const dotStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale:
            scale.value,
        },
      ],
      opacity:
        scale.value,
    }));

  const resolvedLabel =
    accessibilityLabel ??
    (typeof label === 'string'
      ? label
      : undefined);

  return (
    <AppPressable
      accessibilityRole="radio"
      accessibilityLabel={
        resolvedLabel
      }
      accessibilityState={{
        checked: selected,
        selected,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
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
        if (
          !group ||
          selected
        ) {
          return;
        }

        group.select(value);
        void appHaptics.selection();
      }}
    >
      <AppInline
        gap="md"
        align="center"
        flex
      >
        <Animated.View
          style={styles.circle(
            selected,
            isDisabled,
          )}
        >
          <Animated.View
            style={[
              styles.dot(
                isDisabled,
              ),
              dotStyle,
            ]}
          />
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
                  isDisabled
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
                  isDisabled
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

    circle: (
      selected: boolean,
      disabled: boolean,
    ) => ({
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:
        theme.radius.full,
      borderWidth: 2,
      borderColor:
        disabled
          ? theme.colors.border
          : selected
            ? theme.colors
                .primaryStrong
            : theme.colors
                .borderStrong,
    }),

    dot: (
      disabled: boolean,
    ) => ({
      width: 10,
      height: 10,
      borderRadius:
        theme.radius.full,
      backgroundColor:
        disabled
          ? theme.colors
              .textDisabled
          : theme.colors
              .primaryStrong,
    }),
  }),
);
