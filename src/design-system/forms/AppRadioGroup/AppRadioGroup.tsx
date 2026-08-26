import {
  useCallback,
} from 'react';
import { View } from 'react-native';

import {
  useControllableState,
} from '../../hooks';
import {
  AppStack,
} from '../../layout';
import {
  AppText,
} from '../../primitives';

import {
  AppRadioGroupContext,
} from './AppRadioGroup.context';
import type {
  AppRadioGroupProps,
} from './AppRadioGroup.types';

export const AppRadioGroup = ({
  value,
  defaultValue = null,
  onValueChange,
  children,
  disabled = false,
  label,
  description,
  gap = 'sm',
  accessibilityLabel,
  style,
  testID,
}: AppRadioGroupProps) => {
  const controlled =
    value !== undefined;

  const [
    selectedValue,
    setSelectedValue,
  ] =
    useControllableState<
      string | null
    >(
      controlled
        ? {
            value,
            defaultValue,
            onValueChange: (
              next,
            ) => {
              if (next !== null) {
                onValueChange?.(
                  next,
                );
              }
            },
          }
        : {
            defaultValue,
            onValueChange: (
              next,
            ) => {
              if (next !== null) {
                onValueChange?.(
                  next,
                );
              }
            },
          },
    );

  const select = useCallback(
    (next: string) => {
      if (disabled) {
        return;
      }

      setSelectedValue(next);
    },
    [
      disabled,
      setSelectedValue,
    ],
  );

  const resolvedLabel =
    accessibilityLabel ??
    (typeof label === 'string'
      ? label
      : undefined);

  return (
    <AppRadioGroupContext.Provider
      value={{
        value:
          selectedValue,
        disabled,
        select,
      }}
    >
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={
          resolvedLabel
        }
        accessibilityState={{
          disabled,
        }}
        testID={testID}
        style={style}
      >
        <AppStack gap={gap}>
          {label ? (
            <AppText
              variant="labelLarge"
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

          {children}
        </AppStack>
      </View>
    </AppRadioGroupContext.Provider>
  );
};
