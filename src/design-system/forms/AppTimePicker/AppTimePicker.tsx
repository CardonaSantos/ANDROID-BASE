import {
  useEffect,
  useState,
} from 'react';

import {
  useControllableState,
} from '../../hooks';
import {
  AppInput,
} from '../AppInput';
import {
  formatTimeForInput,
  parseTimeInput,
} from '../date-time.utils';
import { formCopy } from '../form.copy';

import type {
  AppTimePickerProps,
} from './AppTimePicker.types';

export const AppTimePicker = ({
  value,
  defaultValue = new Date(),
  onValueChange,
  locale: _locale,
  timeZoneName: _timeZoneName,
  is24Hour: _is24Hour,
  style,
  testID,
  placeholder =
    formCopy.time.placeholder,
  invalidWebValueMessage =
    formCopy.time.invalid,
  error,
  ...rest
}: AppTimePickerProps) => {
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

  const [draft, setDraft] =
    useState(
      formatTimeForInput(
        selectedTime,
      ),
    );

  const [
    localError,
    setLocalError,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    setDraft(
      formatTimeForInput(
        selectedTime,
      ),
    );
  }, [selectedTime]);

  const commit = () => {
    const parsed =
      parseTimeInput(
        draft,
        selectedTime,
      );

    if (!parsed) {
      setLocalError(
        invalidWebValueMessage,
      );
      return;
    }

    setLocalError(null);
    setSelectedTime(parsed);
  };

  return (
    <AppInput
      value={draft}
      onChangeText={setDraft}
      onBlur={commit}
      placeholder={placeholder}
      error={
        error ??
        localError ??
        undefined
      }
      autoCapitalize="none"
      autoCorrect={false}
      fieldStyle={style}
      testID={testID}
      {...rest}
    />
  );
};
