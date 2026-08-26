import {
  Platform,
} from 'react-native';
import {
  Clock3,
} from 'lucide-react-native';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import {
  useUnistyles,
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
} from '../../layout';
import {
  AppIcon,
  AppPressable,
  AppText,
} from '../../primitives';
import {
  AppField,
} from '../AppField';

import type {
  AppTimePickerProps,
} from './AppTimePicker.types';

export const AppTimePicker = ({
  value,
  defaultValue = new Date(),
  onValueChange,
  locale,
  timeZoneName,
  is24Hour,
  label,
  description,
  error,
  required = false,
  size = 'md',
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: AppTimePickerProps) => {
  const { theme } =
    useUnistyles();

  const controlled =
    value !== undefined;

  const [
    selectedTime,
    setSelectedTime,
  ] =
    useControllableState<Date>(
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

  const disclosure =
    useDisclosure();

  const resolvedLabel =
    accessibilityLabel ??
    (typeof label === 'string'
      ? label
      : undefined);

  const formatted =
    new Intl.DateTimeFormat(
      locale,
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12:
          is24Hour === undefined
            ? undefined
            : !is24Hour,
        timeZone:
          timeZoneName,
      },
    ).format(selectedTime);

  const picker = (
    <ExpoDateTimePicker
      value={selectedTime}
      mode="time"
      presentation={
        Platform.OS ===
        'android'
          ? 'dialog'
          : 'inline'
      }
      display={
        Platform.OS === 'ios'
          ? 'compact'
          : 'default'
      }
      is24Hour={
        Platform.OS ===
        'android'
          ? is24Hour
          : undefined
      }
      locale={
        Platform.OS === 'ios'
          ? locale
          : undefined
      }
      timeZoneName={
        Platform.OS === 'ios'
          ? timeZoneName
          : undefined
      }
      accentColor={
        theme.colors
          .primaryStrong
      }
      themeVariant={
        Platform.OS === 'ios'
          ? theme.isDark
            ? 'dark'
            : 'light'
          : undefined
      }
      disabled={
        Platform.OS === 'ios'
          ? disabled
          : undefined
      }
      testID={testID}
      onValueChange={(
        _event,
        nextDate,
      ) => {
        setSelectedTime(
          nextDate,
        );

        if (
          Platform.OS ===
          'android'
        ) {
          disclosure.close();
        }

        void appHaptics.selection();
      }}
      onDismiss={() => {
        disclosure.close();
      }}
    />
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
      {Platform.OS === 'ios' ? (
        picker
      ) : (
        <>
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel={
              resolvedLabel
            }
            accessibilityHint={
              formatted
            }
            accessibilityState={{
              expanded:
                disclosure.isOpen,
              disabled,
            }}
            disabled={disabled}
            interaction="subtle"
            radius="md"
            touchTarget="minimum"
            stateLayerColorToken="primaryStrong"
            onPress={
              disclosure.open
            }
            style={{
              minHeight:
                theme.sizes
                  .control[size],
              justifyContent:
                'center',
              paddingHorizontal:
                theme.spacing.lg,
              borderWidth: 1,
              borderColor:
                error
                  ? theme.colors
                      .danger
                  : theme.colors
                      .border,
              borderRadius:
                theme.radius.md,
              backgroundColor:
                disabled
                  ? theme.colors
                      .surfaceSecondary
                  : theme.colors
                      .surface,
            }}
          >
            <AppInline
              gap="md"
              align="center"
              justify="space-between"
            >
              <AppText
                variant="bodyMedium"
                tone={
                  disabled
                    ? 'disabled'
                    : 'default'
                }
              >
                {formatted}
              </AppText>

              <AppIcon
                icon={Clock3}
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

          {disclosure.isOpen
            ? picker
            : null}
        </>
      )}
    </AppField>
  );
};
