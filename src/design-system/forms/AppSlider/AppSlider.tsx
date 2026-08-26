import {
  useCallback,
} from 'react';
import {
  View,
  type ViewProps,
} from 'react-native';
import {
  Host,
  Slider,
} from '@expo/ui';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  useControllableState,
} from '../../hooks';
import {
  AppField,
} from '../AppField';

import type {
  AppSliderProps,
} from './AppSlider.types';

const clamp = (
  value: number,
  min: number,
  max: number,
): number =>
  Math.min(
    max,
    Math.max(min, value),
  );

const snap = (
  value: number,
  min: number,
  step: number,
): number => {
  if (step <= 0) {
    return value;
  }

  const units =
    Math.round(
      (value - min) /
        step,
    );

  return min + units * step;
};

export const AppSlider = ({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  description,
  error,
  required = false,
  showValue = true,
  formatValue = (
    current,
  ) => String(current),
  accessibilityLabel,
  style,
  testID,
}: AppSliderProps) => {
  const safeMax =
    Math.max(min, max);

  const initial =
    clamp(
      defaultValue ?? min,
      min,
      safeMax,
    );

  const controlled =
    value !== undefined;

  const [
    currentValue,
    setCurrentValue,
  ] =
    useControllableState<number>(
      controlled
        ? {
            value: clamp(
              value,
              min,
              safeMax,
            ),
            defaultValue: initial,
            onValueChange,
          }
        : {
            defaultValue: initial,
            onValueChange,
          },
    );

  const setNormalized =
    useCallback(
      (next: number) => {
        setCurrentValue(
          clamp(
            snap(
              next,
              min,
              step,
            ),
            min,
            safeMax,
          ),
        );
      },
      [
        min,
        safeMax,
        setCurrentValue,
        step,
      ],
    );

  const accessibleStep =
    step > 0
      ? step
      : Math.max(
          1,
          (safeMax - min) /
            20,
        );

  const handleAccessibilityAction =
    useCallback<
      NonNullable<
        ViewProps[
          'onAccessibilityAction'
        ]
      >
    >(
      (event) => {
        switch (
          event.nativeEvent
            .actionName
        ) {
          case 'increment':
            setNormalized(
              currentValue +
                accessibleStep,
            );
            break;

          case 'decrement':
            setNormalized(
              currentValue -
                accessibleStep,
            );
            break;
        }
      },
      [
        accessibleStep,
        currentValue,
        setNormalized,
      ],
    );

  const resolvedLabel =
    accessibilityLabel ??
    (typeof label === 'string'
      ? label
      : undefined);

  return (
    <AppField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      counter={
        showValue
          ? formatValue(
              currentValue,
            )
          : undefined
      }
      style={style}
    >
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={
          resolvedLabel
        }
        accessibilityState={{
          disabled,
        }}
        accessibilityValue={{
          min,
          max: safeMax,
          now: currentValue,
          text: formatValue(
            currentValue,
          ),
        }}
        accessibilityActions={[
          {
            name: 'increment',
          },
          {
            name: 'decrement',
          },
        ]}
        onAccessibilityAction={
          handleAccessibilityAction
        }
      >
        <Host
          matchContents={{
            vertical: true,
          }}
          style={styles.host}
        >
          <Slider
            value={currentValue}
            min={min}
            max={safeMax}
            step={
              step > 0
                ? step
                : undefined
            }
            disabled={disabled}
            onValueChange={
              setNormalized
            }
            testID={testID}
          />
        </Host>
      </View>
    </AppField>
  );
};

const styles = StyleSheet.create(
  () => ({
    host: {
      width: '100%',
    },
  }),
);
