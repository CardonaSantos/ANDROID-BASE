import {
  ScrollView,
  View,
} from 'react-native';
import {
  Check,
  ChevronDown,
} from 'lucide-react-native';
import {
  Menu,
} from 'react-native-paper';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  appHaptics,
} from '../../haptics';
import {
  useControllableState,
  useDisclosure,
} from '../../hooks';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';
import {
  AppField,
} from '../AppField';
import { formCopy } from '../form.copy';
import type {
  SelectValue,
} from '../form.types';

import type {
  AppSelectProps,
} from './AppSelect.types';

export const AppSelect = <
  TValue extends SelectValue,
>({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder =
    formCopy.select.placeholder,
  label,
  description,
  error,
  required = false,
  size = 'md',
  disabled = false,
  accessibilityLabel,
  maxMenuHeight = 320,
  style,
  testID,
}: AppSelectProps<TValue>) => {
  const controlled =
    value !== undefined;

  const [
    selectedValue,
    setSelectedValue,
  ] =
    useControllableState<
      TValue | null
    >(
      controlled
        ? {
            value:
              value ?? null,
            defaultValue,
            onValueChange,
          }
        : {
            defaultValue,
            onValueChange,
          },
    );

  const disclosure =
    useDisclosure();

  const selectedOption =
    options.find(
      (option) =>
        option.value ===
        selectedValue,
    );

  const resolvedLabel =
    accessibilityLabel ??
    (typeof label === 'string'
      ? label
      : undefined);

  const anchor = (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel={
        resolvedLabel
      }
      accessibilityHint={
        selectedOption
          ? formCopy.select.selected(
              selectedOption.label,
            )
          : undefined
      }
      accessibilityState={{
        expanded:
          disclosure.isOpen,
        disabled,
      }}
      disabled={disabled}
      interaction="subtle"
      radius="md"
      touchTarget={
        size === 'sm'
          ? 'compact'
          : 'minimum'
      }
      stateLayerColorToken="primaryStrong"
      testID={testID}
      style={styles.anchor(
        size,
        Boolean(error),
        disabled,
      )}
      onPress={
        disclosure.open
      }
    >
      <AppInline
        gap="md"
        align="center"
        justify="space-between"
        flex
      >
        <AppStack
          gap="xxs"
          flex
        >
          <AppText
            variant={
              size === 'sm'
                ? 'bodySmall'
                : 'bodyMedium'
            }
            tone={
              disabled
                ? 'disabled'
                : selectedOption
                  ? 'default'
                  : 'muted'
            }
            numberOfLines={1}
          >
            {selectedOption
              ?.label ??
              placeholder}
          </AppText>

          {selectedOption
            ?.description ? (
            <AppText
              variant="caption"
              tone={
                disabled
                  ? 'disabled'
                  : 'secondary'
              }
              numberOfLines={1}
            >
              {
                selectedOption.description
              }
            </AppText>
          ) : null}
        </AppStack>

        <AppIcon
          icon={ChevronDown}
          size="md"
          tone={
            disabled
              ? 'disabled'
              : 'secondary'
          }
          decorative
        />
      </AppInline>
    </AppPressable>
  );

  return (
    <AppField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      size={size}
      style={style}
    >
      <Menu
        visible={
          disclosure.isOpen
        }
        onDismiss={
          disclosure.close
        }
        anchor={anchor}
        contentStyle={
          styles.menu
        }
      >
        <ScrollView
          style={{
            maxHeight:
              maxMenuHeight,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {options.map(
            (option) => {
              const selected =
                option.value ===
                selectedValue;

              return (
                <AppPressable
                  key={String(
                    option.value,
                  )}
                  accessibilityRole="menuitem"
                  accessibilityLabel={
                    option.label
                  }
                  accessibilityState={{
                    selected,
                    disabled:
                      option.disabled,
                  }}
                  disabled={
                    option.disabled
                  }
                  interaction="subtle"
                  haptic={false}
                  radius="sm"
                  touchTarget="minimum"
                  stateLayerColorToken="primaryStrong"
                  style={styles.option}
                  onPress={() => {
                    setSelectedValue(
                      option.value,
                    );
                    disclosure.close();
                    void appHaptics.selection();
                  }}
                >
                  <AppInline
                    gap="md"
                    align="center"
                  >
                    <View
                      style={
                        styles.checkSlot
                      }
                    >
                      {selected ? (
                        <AppIcon
                          icon={Check}
                          size="sm"
                          tone="primary"
                          decorative
                        />
                      ) : null}
                    </View>

                    <AppStack
                      gap="xxs"
                      flex
                    >
                      <AppText
                        variant="bodyMedium"
                        tone={
                          option.disabled
                            ? 'disabled'
                            : 'default'
                        }
                      >
                        {
                          option.label
                        }
                      </AppText>

                      {option.description ? (
                        <AppText
                          variant="caption"
                          tone={
                            option.disabled
                              ? 'disabled'
                              : 'secondary'
                          }
                        >
                          {
                            option.description
                          }
                        </AppText>
                      ) : null}
                    </AppStack>
                  </AppInline>
                </AppPressable>
              );
            },
          )}
        </ScrollView>
      </Menu>
    </AppField>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    anchor: (
      size:
        | 'sm'
        | 'md'
        | 'lg',
      invalid: boolean,
      disabled: boolean,
    ) => ({
      minHeight:
        theme.sizes.control[size],
      justifyContent: 'center',
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
          : theme.colors.surface,
      /**
       * Disabled presentation is expressed through semantic surface/content
       * colors instead of dimming the entire control, preserving legibility.
       */
      opacity: 1,
    }),

    menu: {
      maxWidth: 420,
      backgroundColor:
        theme.colors
          .surfaceElevated,
      borderRadius:
        theme.radius.md,
    },

    option: {
      minWidth: 220,
      paddingVertical:
        theme.spacing.sm,
      paddingHorizontal:
        theme.spacing.md,
    },

    checkSlot: {
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
