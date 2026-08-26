import {
  useEffect,
} from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import {
  appHaptics,
} from '../../haptics';
import {
  useControllableState,
} from '../../hooks';
import {
  timingPresets,
} from '../../motion';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';
import {
  resolveActionColorTokens,
} from '../action-colors';

import type {
  AppSegmentedControlProps,
  AppSegmentedOption,
} from './AppSegmentedControl.types';

interface SegmentItemProps<
  TValue extends string,
> {
  option:
    AppSegmentedOption<TValue>;
  selected: boolean;
  groupDisabled: boolean;
  tone:
    NonNullable<
      AppSegmentedControlProps<TValue>[
        'tone'
      ]
    >;
  size:
    NonNullable<
      AppSegmentedControlProps<TValue>[
        'size'
      ]
    >;
  fullWidth: boolean;
  onSelect: (
    value: TValue,
  ) => void;
}

const SegmentItem = <
  TValue extends string,
>({
  option,
  selected,
  groupDisabled,
  tone,
  size,
  fullWidth,
  onSelect,
}: SegmentItemProps<TValue>) => {
  const selectedOpacity =
    useSharedValue(
      selected ? 1 : 0,
    );

  useEffect(() => {
    selectedOpacity.value =
      withTiming(
        selected ? 1 : 0,
        timingPresets.fast,
      );
  }, [
    selected,
    selectedOpacity,
  ]);

  const selectedStyle =
    useAnimatedStyle(() => ({
      opacity:
        selectedOpacity.value,
    }));

  const disabled =
    groupDisabled ||
    option.disabled === true;

  const selectedColors =
    resolveActionColorTokens(
      'soft',
      tone,
      false,
    );

  return (
    <AppPressable
      accessibilityRole="radio"
      accessibilityLabel={
        option.accessibilityLabel ??
        option.label
      }
      accessibilityState={{
        checked: selected,
        selected,
        disabled,
      }}
      disabled={disabled}
      interaction="subtle"
      haptic={false}
      radius="sm"
      touchTarget={
        size === 'sm'
          ? 'compact'
          : 'minimum'
      }
      showStateLayer
      stateLayerColorToken={
        selected
          ? selectedColors.content
          : 'text'
      }
      onPress={() =>
        onSelect(option.value)
      }
      style={styles.segment(
        size,
        fullWidth,
      )}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.selectedLayer(
            selectedColors.container ??
              'surfaceSecondary',
          ),
          selectedStyle,
        ]}
      />

      <View
        pointerEvents="none"
        style={styles.segmentContent}
      >
        {option.icon ? (
          <AppIcon
            icon={option.icon}
            size={
              size === 'sm'
                ? 'sm'
                : 'md'
            }
            colorToken={
              disabled
                ? 'textDisabled'
                : selected
                  ? selectedColors.content
                  : 'textSecondary'
            }
            decorative
          />
        ) : null}

        <AppText
          variant={
            size === 'sm'
              ? 'labelMedium'
              : 'labelLarge'
          }
          colorToken={
            disabled
              ? 'textDisabled'
              : selected
                ? selectedColors.content
                : 'textSecondary'
          }
          numberOfLines={1}
        >
          {option.label}
        </AppText>
      </View>
    </AppPressable>
  );
};

export const AppSegmentedControl = <
  TValue extends string,
>(
  props:
    AppSegmentedControlProps<TValue>,
) => {
  const {
    options,
    tone = 'primary',
    size = 'md',
    variant = 'tonal',
    disabled = false,
    fullWidth = true,
    accessibilityLabel,
    style,
    testID,
    onValueChange,
  } = props;

  /**
   * `options` is non-empty by contract, therefore a concrete default always
   * exists. This also avoids asking TypeScript to narrow an intermediate union
   * where `defaultValue` could otherwise appear as `TValue | undefined`.
   */
  const resolvedDefaultValue: TValue =
    props.defaultValue ??
    props.value ??
    options[0].value;

  const [value, setValue] =
    useControllableState<TValue>(
      props.value !== undefined
        ? {
            value: props.value,
            defaultValue:
              resolvedDefaultValue,
            onValueChange,
          }
        : {
            defaultValue:
              resolvedDefaultValue,
            onValueChange,
          },
    );

  const handleSelect = (
    nextValue: TValue,
  ) => {
    if (
      nextValue === value
    ) {
      return;
    }

    setValue(nextValue);
    void appHaptics.selection();
  };

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={
        accessibilityLabel
      }
      accessibilityState={{
        disabled,
      }}
      testID={testID}
      style={[
        styles.group(
          variant,
          fullWidth,
        ),
        style,
      ]}
    >
      {options.map((option) => (
        <SegmentItem
          key={option.value}
          option={option}
          selected={
            option.value === value
          }
          groupDisabled={disabled}
          tone={tone}
          size={size}
          fullWidth={fullWidth}
          onSelect={handleSelect}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    group: (
      variant:
        | 'tonal'
        | 'outlined',
      fullWidth: boolean,
    ) => ({
      alignSelf: fullWidth
        ? 'stretch'
        : 'flex-start',
      flexDirection: 'row',
      padding: theme.spacing.xs,
      gap: theme.spacing.xs,
      borderRadius:
        theme.radius.md,
      backgroundColor:
        variant === 'tonal'
          ? theme.colors
              .surfaceSecondary
          : theme.colors.surface,
      borderWidth:
        variant === 'outlined'
          ? 1
          : 0,
      borderColor:
        theme.colors.border,
    }),

    segment: (
      size:
        | 'sm'
        | 'md'
        | 'lg',
      fullWidth: boolean,
    ) => ({
      flexGrow:
        fullWidth ? 1 : 0,
      flexShrink: 1,
      flexBasis:
        fullWidth ? 0 : 'auto',
      minWidth: 0,
      minHeight:
        theme.sizes.control[size],
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal:
        size === 'sm'
          ? theme.spacing.sm
          : theme.spacing.md,
      borderRadius:
        theme.radius.sm,
    }),

    selectedLayer: (
      container:
        keyof typeof theme.colors,
    ) => ({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius:
        theme.radius.sm,
      backgroundColor:
        theme.colors[container],
    }),

    segmentContent: {
      position: 'relative',
      zIndex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
  }),
);
