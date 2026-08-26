import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppText,
} from '../../primitives';

import type {
  AppFieldProps,
} from './AppField.types';

export const AppField = ({
  children,
  label,
  description,
  error,
  required = false,
  disabled = false,
  size = 'md',
  counter,
  style,
  contentStyle,
  testID,
}: AppFieldProps) => (
  <AppStack
    gap="sm"
    style={style}
    testID={testID}
  >
    {label ? (
      <AppInline
        gap="xs"
        align="baseline"
      >
        <AppText
          variant={
            size === 'sm'
              ? 'labelMedium'
              : 'labelLarge'
          }
          tone={
            disabled
              ? 'disabled'
              : 'default'
          }
        >
          {label}
        </AppText>

        {required ? (
          <AppText
            variant="labelMedium"
            tone={
              disabled
                ? 'disabled'
                : 'danger'
            }
            accessible={false}
          >
            *
          </AppText>
        ) : null}
      </AppInline>
    ) : null}

    <View style={contentStyle}>
      {children}
    </View>

    {error ||
    description ||
    counter ? (
      <AppInline
        gap="sm"
        align="flex-start"
        justify="space-between"
        style={styles.supportingRow}
      >
        <View style={styles.supportingText}>
          {error ? (
            <AppText
              variant="caption"
              tone="danger"
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              {error}
            </AppText>
          ) : description ? (
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
        </View>

        {counter ? (
          <AppText
            variant="caption"
            tone={
              disabled
                ? 'disabled'
                : 'muted'
            }
          >
            {counter}
          </AppText>
        ) : null}
      </AppInline>
    ) : null}
  </AppStack>
);

const styles = StyleSheet.create(
  () => ({
    supportingRow: {
      minWidth: 0,
    },

    supportingText: {
      flex: 1,
      minWidth: 0,
    },
  }),
);
